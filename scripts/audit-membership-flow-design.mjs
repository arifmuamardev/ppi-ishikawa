import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = (process.env.AUTH_AUDIT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const path='/design-lab/membership-flow/';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const widths=[360,390,768,1280];
const failures=[];
const check=(truth,desc)=>{if(!truth)failures.push(desc);};
await mkdir('membership-flow-design-audit',{recursive:true});
try{
 for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];
  const unexpectedAuth=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route(/^https:\/\/[^/]+\.supabase\.co\//,async route=>{
    unexpectedAuth.push(route.request().url().split('?')[0]);
    await route.abort();
  });
  try{
   await page.goto(base+path,{waitUntil:'domcontentloaded'});
   check(await page.getByText('PROTOTIPE · TANPA DATABASE').isVisible(),`${width}: preview warning`);
   check(await page.locator('#password-login-option').count()===0,`${width}: no legacy password UI`);
   check(await page.locator('#prototype-login-form input[type="email"]').isVisible(),`${width}: email entry visible`);
   check(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=2,`${width}: no horizontal overflow`);
   await page.screenshot({path:`membership-flow-design-audit/login-${width}.jpg`,type:'jpeg',quality:64,fullPage:true});
   await page.locator('#prototype-email').fill('calon@example.invalid');
   await page.locator('#prototype-login-form button[type="submit"]').click();
   await page.getByText('Periksa email Anda').waitFor({state:'visible'});
   await page.locator('#prototype-open-link').click();
   await page.locator('#wizard-title').filter({hasText:'Siapa nama lengkapmu?'}).waitFor({state:'visible'});
   await page.locator('#wizard-next').click();
   check((await page.locator('#wizard-error').textContent()||'').includes('Masukkan nama'),`${width}: name required`);
   await page.locator('#wizard-name').fill('Calon Anggota Uji');
   await page.locator('#wizard-next').click();
   await page.locator('#wizard-title').filter({hasText:'Kamu kuliah di mana?'}).waitFor();
   await page.screenshot({path:`membership-flow-design-audit/campus-${width}.jpg`,type:'jpeg',quality:64,fullPage:true});
   await page.locator('#wizard-campus').selectOption({index:1});
   await page.locator('#wizard-next').click();
   await page.locator('#wizard-program').fill('Computer Science');
   await page.locator('#wizard-next').click();
   await page.locator('input[name="study_level"][value="master"]').check();
   await page.locator('#wizard-next').click();
   await page.locator('#wizard-next').click();
   check((await page.locator('#wizard-error').textContent()||'').includes('Persetujuan'),`${width}: consent required`);
   await page.locator('#wizard-consent').check();
   await page.locator('#wizard-next').click();
   await page.locator('#wizard-title').filter({hasText:'Tinjau sebelum selesai'}).waitFor();
   check(await page.locator('#wizard-review').getByText('Calon Anggota Uji').isVisible(),`${width}: name in review`);
   await page.screenshot({path:`membership-flow-design-audit/review-${width}.jpg`,type:'jpeg',quality:64,fullPage:true});
   await page.locator('#wizard-back').click();
   await page.locator('#wizard-title').filter({hasText:'Setujui penggunaan data'}).waitFor();
   await page.locator('#wizard-next').click();
   await page.locator('#wizard-next').click();
   await page.getByText('Selesai,').first().waitFor({state:'visible'});
   check(await page.locator('#prototype-finished').isVisible(),`${width}: completion state`);

   await page.locator('#scenario-existing').click();
   await page.locator('#prototype-email').fill('lama@example.invalid');
   await page.locator('#prototype-login-form button[type="submit"]').click();
   await page.locator('#prototype-open-link').click();
   await page.getByText('Selamat datang kembali!').waitFor({state:'visible'});
   check(await page.locator('#prototype-wizard').isHidden(),`${width}: existing account skips onboarding`);
   check(unexpectedAuth.length===0,`${width}: prototype called real auth endpoint`);
   check(errors.length===0,`${width}: JS errors: ${errors.join('; ')}`);
  }catch(e){failures.push(`${width}: ${e.message}`);}
  finally{await page.close();}
 }
}finally{await browser.close();}
if(failures.length){console.error('Membership prototype QA failed:\n'+failures.join('\n'));process.exitCode=1;}
else console.log('Membership prototype QA passed: 4 widths, password hidden, wizard validation, back/review, returning user, no API.');
