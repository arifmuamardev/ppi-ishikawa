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
      await page.locator('#studio-event').fill('Webinar Penelitian Ilmiah 2026');
      await page.locator('#studio-date').fill('2026-10-16');
      await page.locator('#studio-signer').fill('Ketua Pengujian');
      await page.locator('#studio-names').fill('Nama Lengkap\nSiti Aminah\nBudi Santoso\nSITI AMINAH');
      await page.getByText('2 nama',{exact:true}).waitFor();
      await page.locator('#studio-export-all').waitFor({state:'visible'});
      if(await page.locator('#studio-export-all').isDisabled())throw new Error('Valid form must enable export');
      if(!await page.getByText('Pratinjau untuk: Siti Aminah (+1 nama lain)').isVisible())
        throw new Error('Preview does not track first recipient');
      if(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth+2))
        throw new Error('Horizontal layout overflow');
      await page.screenshot({path:`certificate-studio-audit/studio-${width}.jpg`,type:'jpeg',quality:65,fullPage:true,animations:'disabled'});
      if(width===390){
        const downloadPromise=page.waitForEvent('download',{timeout:60000});
        await page.locator('#studio-export-all').click();
        const download=await downloadPromise;
        const file=await download.path();
        const buffer=await readFile(file);
        if(buffer.subarray(0,5).toString()!=='%PDF-')throw new Error('Downloaded file is not a PDF');
        if(buffer.length < 15000)throw new Error('PDF looks unexpectedly small');
        if(!download.suggestedFilename().includes('webinar-penelitian-ilmiah-2026'))
          throw new Error('Unexpected filename: '+download.suggestedFilename());
        await page.getByText(/PDF siap: 2 sertifikat/).waitFor();
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
