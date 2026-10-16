import { chromium } from 'playwright';

const origin = (process.env.EVENT_DESIGN_AUDIT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const widths = [360, 390, 768, 1280];
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };
const text = async (page, sel) => (await page.locator(sel).textContent()) || '';
const chooseScenario = async (page, name) => page.locator('[data-scenario="' + name + '"]').click();
const chooseEvent = async (page, name) => page.locator('[data-event-type="' + name + '"]').click();

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [], backendRequests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', req => {
      if (req.url().includes('supabase.co') || req.url().includes('/auth/v1/') || req.url().includes('/rest/v1/')) backendRequests.push(req.url());
    });
    try {
      const res = await page.goto(origin+'/design-lab/event-registration/', {waitUntil:'domcontentloaded'});
      check(res?.status()===200, width+': design lab HTTP 200');
      check(await page.getByText('PROTOTIPE · TANPA DATABASE').isVisible(), width+': demo disclaimer');
      check((await text(page,'#flow-stage')).includes('1/7'), width+': new visitor has 7 stages');
      check((await text(page,'#event-register')).includes('Daftar dengan email'), width+': new visitor email CTA');
      check(await page.locator('#event-access-badge').isVisible(), width+': public event visible before login');
      check(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 2, width+': initial no overflow');

      // First-time public visitor: real identity steps in the prototype.
      await page.locator('#event-register').click();
      check(await page.locator('#view-email').isVisible(), width+': new visitor email required');
      await page.locator('#event-email').fill('baru@example.invalid');
      await page.locator('#view-email button[type=submit]').click();
      check(await page.locator('#view-verify').isVisible(), width+': new visitor simulated verification');
      await page.locator('#simulate-verify').click();
      check(await page.locator('#view-name').isVisible(), width+': new visitor name step');
      await page.locator('#event-name').fill('Peserta Baru');
      await page.locator('#view-name button[type=submit]').click();
      check(await page.locator('#view-consent').isVisible(), width+': new visitor event consent');
      await page.locator('#view-consent button[type=submit]').click();
      check((await text(page,'#consent-error')).includes('wajib'), width+': consent validation shown');
      await page.locator('#event-consent').check();
      await page.locator('#view-consent button[type=submit]').click();
      check(await page.locator('#view-review').isVisible(), width+': new visitor event review');
      check((await text(page,'#review-status'))==='Akun publik baru', width+': new participant not a PPI member');
      check(await page.locator('#wizard-campus').count()===0, width+': no academic details');
      await page.locator('#confirm-event').click();
      check(await page.locator('#view-success').isVisible(), width+': new visitor confirmation');
      check((await text(page,'#success-explanation')).includes('Tidak otomatis menjadi anggota PPI'),width+': event does not create member status');

      // Existing public account is explicitly already signed in: no email, no verification, no name.
      await chooseScenario(page,'public');
      check((await text(page,'#landing-session')).includes('Tidak perlu verifikasi email'),width+': signed-in notice for public account');
      check((await text(page,'#event-register')).includes('Daftar dengan akun saya'),width+': signed-in public CTA');
      check((await page.locator('#flow-progress').getAttribute('aria-valuemax'))==='4',width+': fewer steps logged in');
      await page.locator('#event-register').click();
      check(await page.locator('#view-consent').isVisible(),width+': public signed-in immediately at consent');
      check(await page.locator('#view-email').isHidden()&&await page.locator('#view-verify').isHidden()&&await page.locator('#view-name').isHidden(),width+': login and onboarding skipped');
      await page.locator('#event-consent').check();
      await page.locator('#view-consent button[type=submit]').click();
      check((await text(page,'#review-name'))==='Dina Peserta',width+': reuse existing public identity');
      await page.locator('#confirm-event').click();
      check(await page.locator('#view-success').isVisible(),width+': public signed-in registration done');

      // Public account cannot get into member-only events just by being logged in.
      await chooseEvent(page,'members');
      check((await text(page,'#landing-requirement'))==='Anggota PPI terverifikasi',width+': member-only rules clear on landing');
      check((await text(page,'#poster-policy')).includes('Khusus anggota'),width+': poster reflects policy');
      await page.locator('#event-register').click();
      check(await page.locator('#view-blocked').isVisible(),width+': public account blocked');
      check(await page.locator('#view-consent').isHidden(),width+': blocked visitor cannot consent to bypass eligibility');
      await page.locator('#blocked-public-event').click();
      check(await page.locator('#view-landing').isVisible(),width+': can return to open event');

      // New visitor is also blocked for member-only events, not forced into membership form.
      await chooseScenario(page,'new');
      await chooseEvent(page,'members');
      await page.locator('#event-register').click();
      check(await page.locator('#view-blocked').isVisible(),width+': unregistered visitor cannot join members-only');

      // Approved PPI member is already logged in and authorized.
      await chooseScenario(page,'member');
      check((await text(page,'#landing-session')).includes('anggota resmi PPI'),width+': approved member recognized');
      check((await text(page,'#event-register')).includes('Daftar dengan akun saya'),width+': member eligible CTA');
      await page.locator('#event-register').click();
      check(await page.locator('#view-consent').isVisible(),width+': member skips login and identity form');
      await page.locator('#view-consent button[type=submit]').click();
      check((await text(page,'#consent-error')).includes('wajib'),width+': member event consent still required');
      await page.locator('#event-consent').check();
      await page.locator('#view-consent button[type=submit]').click();
      check((await text(page,'#review-status'))==='Anggota PPI terverifikasi',width+': membership preserved');
      check((await text(page,'#review-policy-note')).includes('diperiksa dari status PPI terverifikasi'),width+': eligibility message');
      await page.locator('#confirm-event').click();
      check(await page.locator('#view-success').isVisible(),width+': PPI member can register member-only event');
      check((await text(page,'#success-access')).includes('khusus anggota'),width+': member-only confirmation');

      check(backendRequests.length===0,width+': design lab made zero backend requests');
      check(errors.length===0,width+': browser errors: '+errors.join('; '));
      check(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 2,width+': no horizontal overflow');
    } catch (e) {
      failures.push(width+': '+e.message);
    } finally { await page.close(); }
  }
} finally { await browser.close(); }

if (failures.length) {
  console.error('Event registration V2 audit failed:\n'+failures.join('\n'));
  process.exitCode=1;
} else {
  console.log('Event registration V2 audit passed: new visitors, signed-in accounts, members-only gating, event consent, 4 viewport widths, zero backend requests.');
}
