import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base=(process.env.AUTH_AUDIT_BASE_URL||'http://127.0.0.1:4321').replace(/\/$/,'');
const browser=await chromium.launch({headless:true,channel:'chrome'});
const widths=[360,390,768,1280];
const failures=[];
const check=(ok,msg)=>{if(!ok)failures.push(msg);};
await mkdir('membership-flow-design-audit',{recursive:true});
async function advance(page){await page.locator('#wizard-next').click();}
async function choose(page,intent){await page.locator(`input[name="intent"][value="${intent}"]`).check();}
async function start(page,email){
  await page.locator('#prototype-email').fill(email);
  await page.locator('#prototype-login-form button[type="submit"]').click();
  await page.getByText('Periksa email Anda').waitFor({state:'visible'});
  await page.locator('#prototype-open-link').click();
}
try{
  for(const width of widths){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[],networkCalls=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route(/^https:\/\/[^/]+\.supabase\.co\//,async route=>{networkCalls.push(route.request().url().split('?')[0]);await route.abort();});
    try{
      const res=await page.goto(base+'/design-lab/membership-flow/',{waitUntil:'domcontentloaded'});
      check(res?.status()===200,`${width}: prototype HTTP 200`);
      check(await page.getByText('PROTOTIPE · TANPA DATABASE').isVisible(),`${width}: design preview warning`);
      check(await page.locator('#password-login-option').count()===0,`${width}: password option absent`);
      check(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=2,`${width}: horizontal overflow on initial screen`);
      await page.screenshot({path:`membership-flow-design-audit/login-${width}.jpg`,type:'jpeg',quality:62,fullPage:true});
      await start(page,'calon@example.invalid');
      await page.locator('#wizard-title').filter({hasText:'Apa tujuanmu'}).waitFor({state:'visible'});
      await advance(page);
      check((await page.locator('#wizard-error').textContent()||'').includes('Pilih tujuan'),`${width}: intent required`);
      await page.screenshot({path:`membership-flow-design-audit/intent-${width}.jpg`,type:'jpeg',quality:62,fullPage:true});

      // Public event participant: no campus/program/degree fields, never calls membership approval.
      await choose(page,'event');
      await advance(page);
      await page.locator('#wizard-title').filter({hasText:'Siapa nama lengkapmu?'}).waitFor();
      await advance(page);
      check((await page.locator('#wizard-error').textContent()||'').includes('Nama lengkap'),`${width}: name required`);
      await page.locator('#wizard-name').fill('Peserta Webinar Uji');
      await advance(page);
      await page.locator('#wizard-title').filter({hasText:'Setujui penggunaan data'}).waitFor();
      check(await page.locator('[data-wizard-step="campus"]').isHidden(),`${width}: public participant does not see campus`);
      await advance(page);
      check((await page.locator('#wizard-error').textContent()||'').includes('Persetujuan'),`${width}: event data consent required`);
      await page.locator('#wizard-consent').check();
      await advance(page);
      await page.locator('#wizard-title').filter({hasText:'Periksa jawabanmu'}).waitFor();
      check((await page.locator('#wizard-progress').getAttribute('aria-valuemax'))==='4',`${width}: event 4 steps`);
      const eventReview=await page.locator('#wizard-review').innerText();
      check(eventReview.includes('Peserta kegiatan')&&!eventReview.includes('Institusi')&&!eventReview.includes('Jenjang'),`${width}: only event fields reviewed`);
      await page.screenshot({path:`membership-flow-design-audit/event-review-${width}.jpg`,type:'jpeg',quality:62,fullPage:true});
      await page.locator('#wizard-back').click();
      await page.locator('#wizard-title').filter({hasText:'Setujui penggunaan data'}).waitFor();
      await advance(page);
      await advance(page);
      await page.locator('#prototype-finished').waitFor({state:'visible'});
      check((await page.locator('#finished-description').innerText()).includes('tidak otomatis menjadi anggota PPI'),`${width}: public participant not official member`);
      check(await page.locator('#prototype-upgrade').isVisible(),`${width}: event user can later apply for membership`);

      // Upgrade a participant using the SAME account. Name/email retained; separate academic and consent process.
      await page.locator('#prototype-upgrade').click();
      await page.locator('#wizard-title').filter({hasText:'Apa tujuanmu'}).waitFor();
      check(await page.locator('input[name="intent"][value="membership"]').isChecked(),`${width}: upgrade selects membership`);
      check(await page.locator('#prototype-email').inputValue()==='calon@example.invalid',`${width}: upgrade retains account email`);
      check(await page.locator('#wizard-name').inputValue()==='Peserta Webinar Uji',`${width}: upgrade retains name`);
      await advance(page);
      await advance(page);
      await page.locator('#wizard-title').filter({hasText:'Kamu belajar atau meneliti di mana?'}).waitFor();
      await page.locator('#wizard-campus').selectOption({index:1});
      await page.screenshot({path:`membership-flow-design-audit/membership-campus-${width}.jpg`,type:'jpeg',quality:62,fullPage:true});
      await advance(page);
      await page.locator('#wizard-program').fill('Computer Science');
      await advance(page);
      await page.locator('input[name="study_level"][value="master"]').check();
      await advance(page);
      check(await page.locator('#wizard-consent').isChecked()===false,`${width}: new membership consent required after upgrade`);
      await advance(page);
      check((await page.locator('#wizard-error').textContent()||'').includes('Persetujuan'),`${width}: membership consent guard`);
      await page.locator('#wizard-consent').check();
      await advance(page);
      check((await page.locator('#wizard-progress').getAttribute('aria-valuemax'))==='7',`${width}: membership 7 steps`);
      const memberReview=await page.locator('#wizard-review').innerText();
      check(memberReview.includes('Calon anggota resmi PPI')&&memberReview.includes('Institusi')&&memberReview.includes('Jurusan')&&memberReview.includes('Jenjang'),`${width}: official member academic profile reviewed`);
      await advance(page);
      await page.locator('#prototype-finished').waitFor({state:'visible'});
      check((await page.locator('#finished-description').innerText()).includes('diperiksa pengurus'),`${width}: membership verification required`);
      check(await page.locator('#prototype-upgrade').isHidden(),`${width}: no upgrade loop for membership`);

      // Returning account skips initial onboarding, but can seek membership later.
      await page.locator('#scenario-existing').click();
      await start(page,'existing@example.invalid');
      await page.getByText('Selamat datang kembali!').waitFor();
      check(await page.locator('#prototype-wizard').isHidden(),`${width}: existing account skips wizard`);
      await page.locator('#prototype-existing-upgrade').click();
      check(await page.locator('input[name="intent"][value="membership"]').isChecked(),`${width}: existing participant may apply for PPI membership`);
      check(await page.locator('#prototype-email').inputValue()==='existing@example.invalid',`${width}: existing account email retained`);
      check(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=2,`${width}: final horizontal overflow`);
      check(networkCalls.length===0,`${width}: prototype sent Supabase requests`);
      check(errors.length===0,`${width}: script errors: ${errors.join('; ')}`);
    }catch(e){failures.push(`${width}: ${e.message}`);}
    finally{await page.close();}
  }
}finally{await browser.close();}
if(failures.length){console.error('Two-track membership prototype QA failed:\n'+failures.join('\n'));process.exitCode=1;}
else console.log('Two-track membership prototype QA passed: public event and official membership, upgrade, returning login, validation and 4 responsive widths; no backend calls.');
