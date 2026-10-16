import { chromium } from 'playwright';

const origin = (process.env.EVENT_DESIGN_AUDIT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const widths = [360, 390, 768, 1280];
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const getText = async (page, selector) => (await page.locator(selector).textContent()) || '';

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    const backendRequests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', req => {
      if (req.url().includes('supabase.co') || req.url().includes('/auth/v1/') || req.url().includes('/rest/v1/')) backendRequests.push(req.url());
    });
    try {
      const result = await page.goto(origin + '/design-lab/event-registration/', {waitUntil:'domcontentloaded'});
      check(result?.status() === 200, width + ': page returns HTTP 200');
      check(await page.getByText('PROTOTIPE · TANPA DATABASE').isVisible(), width + ': prototype clearly labeled');
      check(await page.getByText('Acara, tanggal, identitas, tiket, dan alur email').isVisible(), width + ': fiction disclaimer');
      check(await page.locator('#view-landing').isVisible(), width + ': public landing first');
      check(!await page.locator('#view-email').isVisible(), width + ': does not force sign in before event information');
      check(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 2, width + ': no initial horizontal overflow');
      await page.locator('#event-register').click();
      await page.locator('#event-email').fill('peserta.baru@example.invalid');
      await page.locator('#view-email button[type=submit]').click();
      check(await page.locator('#view-verify').isVisible(), width + ': email verification screen');
      await page.locator('#simulate-verify').click();
      check(await page.locator('#view-name').isVisible(), width + ': new visitors asked name');
      check(await page.locator('#event-name').getAttribute('required') !== null, width + ': new visitor name required');
      check(await page.locator('#wizard-campus').count() === 0, width + ': no academic data asked');
      await page.locator('#event-name').fill('Budi Peserta');
      await page.locator('#view-name button[type=submit]').click();
      await page.locator('#view-consent button[type=submit]').click();
      check((await getText(page,'#consent-error')).includes('wajib'), width + ': consent enforced');
      await page.locator('#event-consent').check();
      await page.locator('#view-consent button[type=submit]').click();
      check(await page.locator('#view-review').isVisible(), width + ': review is shown');
      check((await getText(page,'#review-status')) === 'Akun publik baru', width + ': public membership unchanged');
      await page.locator('#confirm-event').click();
      check(await page.locator('#view-success').isVisible(), width + ': new visitor confirmed');
      check((await getText(page,'#success-explanation')).includes('Tidak otomatis menjadi anggota PPI'), width + ': event is not automatic membership');
      await page.locator('#register-another').click();

      // Existing public participant should reuse the same identity with no name step.
      await page.locator('[data-scenario=public]').click();
      await page.locator('#event-register').click();
      await page.locator('#view-email button[type=submit]').click();
      await page.locator('#simulate-verify').click();
      check(await page.locator('#view-consent').isVisible(), width + ': existing public skips profile');
      check(await page.locator('#view-name').isHidden(), width + ': no duplicate name onboarding');
      await page.locator('#event-consent').check();
      await page.locator('#view-consent button[type=submit]').click();
      check((await getText(page,'#review-name')) === 'Dina Peserta', width + ': existing public name prefilled');
      check((await getText(page,'#review-status')) === 'Akun publik', width + ': existing public status');
      await page.locator('#confirm-event').click();
      check(await page.locator('#view-success').isVisible(), width + ': existing public confirms');

      // Approved PPI membership is a status of the same identity.
      await page.locator('[data-scenario=member]').click();
      await page.locator('#event-register').click();
      await page.locator('#view-email button[type=submit]').click();
      await page.locator('#simulate-verify').click();
      check(await page.locator('#view-consent').isVisible(), width + ': member skips onboarding');
      await page.locator('#event-consent').check();
      await page.locator('#view-consent button[type=submit]').click();
      check((await getText(page,'#review-status')) === 'Anggota PPI terverifikasi', width + ': member recognized');
      check((await getText(page,'#review-name')) === 'Rani Anggota', width + ': member name reused');
      await page.locator('#confirm-event').click();
      check(await page.locator('#view-success').isVisible(), width + ': member can register');
      check((await getText(page,'#success-explanation')).includes('tanpa registrasi keanggotaan ulang'), width + ': member remains member');
      check(backendRequests.length === 0, width + ': prototype must not call backend');
      check(errors.length === 0, width + ': no browser errors: ' + errors.join('; '));
      check(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 2, width + ': no final overflow');
    } catch (e) {
      failures.push(width + ': ' + e.message);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
if (failures.length) {
  console.error('Event registration prototype audit failed:\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Event registration prototype audit passed: 3 identities × 4 widths, validation, confirmation, accessibility basics, and zero backend calls.');
}
