import { mkdir, readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.CERT_STUDIO_BASE_URL || 'http://127.0.0.1:4321';
await mkdir('certificate-studio-audit', {recursive:true});
const browser = await chromium.launch({headless:true,channel:'chrome'});
const errors = [];

try {
  for(const width of [390,1280]) {
    const page = await browser.newPage({viewport:{width,height:880},acceptDownloads:true,reducedMotion:'reduce'});
    const pageErrors = [];
    page.on('pageerror',err=>pageErrors.push(err.message));
    await page.addInitScript(() => localStorage.setItem('ppi-ishikawa-demo-session','admin'));
    try {
      const response = await page.goto(base+'/member/admin/certificate-studio/',{waitUntil:'domcontentloaded'});
      if(response?.status()!==200) throw new Error('Studio page not served');
      await page.locator('#member-content').waitFor({state:'visible'});
      await page.locator('#studio-export-all').waitFor({state:'visible'});
      if(!await page.locator('#studio-export-all').isDisabled()) throw new Error('Empty form should disable export');
      const defaultSigner = await page.locator('#studio-signer').inputValue();
      if(defaultSigner !== "Arif Mu'amar Wahid")throw new Error('Default signatory incorrect: '+defaultSigner);
      const baselineCanvas = await page.locator('#studio-preview').evaluate(el => el.toDataURL('image/png'));
      await page.locator('#studio-event').fill('Webinar Penelitian Ilmiah 2026');
      await page.locator('#studio-date').fill('2026-10-16');
      await page.locator('#studio-signer').fill('Ketua Pengujian');
      await page.locator('#studio-names').fill('Nama Lengkap\nSiti Aminah\nBudi Santoso\nSITI AMINAH');

      // The QR points to event information, not the official certificate verifier.
      await page.getByText('Tambahkan QR informasi kegiatan (opsional)').click();
      await page.locator('#studio-enable-qr').check();
      await page.locator('#studio-qr-url').fill('http://example.org/event');
      if(!await page.locator('#studio-issue').isDisabled()) throw new Error('Demo cannot issue certificates');
      await page.locator('#studio-qr-url').fill('https://ppi-ishikawa.org/programs/');
      await page.waitForFunction(() => document.querySelector('#studio-qr-url')?.value === 'https://ppi-ishikawa.org/programs/', {timeout:15000});
      const qrCanvas = await page.locator('#studio-preview').evaluate(el => el.toDataURL('image/png'));
      if(baselineCanvas === qrCanvas)throw new Error('QR option does not affect certificate preview');
      await page.getByText('2 nama',{exact:true}).waitFor();
      await page.locator('#studio-export-all').waitFor({state:'visible'});
      if(!await page.locator('#studio-export-all').isDisabled())throw new Error('Demo must not permit official PDF export without database issuance');
      if(!await page.getByText('Pratinjau untuk: Siti Aminah (+1 nama lain)').isVisible())
        throw new Error('Preview does not track first recipient');
      if(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth+2))
        throw new Error('Horizontal layout overflow');
      await page.screenshot({path:`certificate-studio-audit/studio-${width}.jpg`,type:'jpeg',quality:65,fullPage:true,animations:'disabled'});
      if(width===390) {
        if(!await page.locator('#studio-issue').isDisabled()) throw new Error('Preview/demo authorization bypass');
      }
      if(pageErrors.length)throw new Error('Browser JS error: '+pageErrors.join('; '));
    }catch(err){errors.push(`${width}px: ${err.message}`);}
    finally {await page.close();}
  }

  const guest=await browser.newPage({viewport:{width:390,height:850}});
  await guest.goto(base+'/member/admin/certificate-studio/',{waitUntil:'domcontentloaded'});
  await guest.waitForURL(/\/member\/login\//,{timeout:10000});
  await guest.close();
}finally{await browser.close();}
if(errors.length){console.error('Certificate Studio audit failed:\n'+errors.join('\n'));process.exit(1);}
console.log('Certificate Studio verified: admin-only access, validated forms, mobile/desktop layout, bulk PDF download.');
