import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// Mock Supabase entirely. Never send test credentials or requests to a real backend.
// Run after build + preview: node scripts/audit-auth-feedback.mjs
const baseURL = (process.env.AUTH_AUDIT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const paths = ['login', 'register', 'forgot-password', 'reset-password'];
const widths = [360, 390, 768, 1280];
const dir = 'auth-feedback-audit';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const failures = [];
const report = [];

function verify(ok, description) {
  if (!ok) failures.push(description);
}
async function mockAuth(page, response) {
  await page.route(/^https:\/\/[^/]+\.supabase\.co\//, async (route) => {
    const uri = new URL(route.request().url());
    const outcome = await response(uri.pathname, route.request().method());
    await route.fulfill({
      status: outcome?.status || 401,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' },
      body: JSON.stringify(outcome?.body || { message: 'unauthorized' })
    });
  });
}
const signinFailure = async () => ({ status: 400, body: { code: 'invalid_credentials', message: 'Invalid login credentials' } });
try {
  for (const width of widths) {
    for (const route of paths) {
      const page = await browser.newPage({ viewport: { width, height: 860 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await mockAuth(page, signinFailure);
      try {
        const response = await page.goto(baseURL + '/member/' + route + '/', { waitUntil: 'domcontentloaded' });
        const prefix = { login: 'login-message', register: 'register-message', 'forgot-password': 'forgot-message', 'reset-password': 'reset-message' }[route];
        const form = page.locator('form');
        verify(response?.status() === 200, route + '/' + width + ': HTTP 200');
        verify(await form.count() === 1, route + '/' + width + ': one form');
        verify(await form.getAttribute('aria-busy') === 'false', route + '/' + width + ': idle form');
        verify(await page.locator('#' + prefix + '-status').getAttribute('role') === 'status', route + '/' + width + ': status live region');
        verify(await page.locator('#' + prefix + '-error').getAttribute('role') === 'alert', route + '/' + width + ': error live region');
        verify(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 2, route + '/' + width + ': no overflow');
        await page.screenshot({ path: dir + '/' + route + '-' + width + '.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled' });
        if (width === 390) {
          await page.locator('[data-theme-toggle]').click();
          verify(await page.locator('html').evaluate((el) => el.classList.contains('dark')), route + ': dark mode');
          verify(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 2, route + ': no dark overflow');
          await page.screenshot({ path: dir + '/' + route + '-dark-390.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled' });
        }
        verify(errors.length === 0, route + '/' + width + ': no JS errors ' + errors.join(', '));
        report.push({ route, width, errors });
      } catch (e) {
        failures.push(route + '/' + width + ': ' + e.message);
      } finally {
        await page.close();
      }
    }
  }

  // Validate mismatch is explicitly linked to confirmation field, and clears on correction.
  for (const route of ['register', 'reset-password']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
    await mockAuth(page, signinFailure);
    try {
      await page.goto(baseURL + '/member/' + route + '/', { waitUntil: 'domcontentloaded' });
      const pass = page.locator('input[name="password"]');
      const confirm = page.locator('input[name="password_confirm"]');
      if (route === 'register') {
        await page.locator('input[name="full_name"]').fill('Contoh Pengujian');
        await page.locator('input[name="email"]').fill('example@example.invalid');
        await page.locator('select[name="campus_slug"]').selectOption({ index: 1 });
        await page.locator('input[name="program"]').fill('Example');
        await page.locator('select[name="study_level"]').selectOption({ index: 1 });
        await page.locator('input[name="consent"]').check();
      }
      await pass.fill('ValidExample999');
      await confirm.fill('Mismatch999');
      await page.locator('button[type="submit"]').click();
      const prefix = route === 'register' ? 'register-message' : 'reset-message';
      verify(await confirm.getAttribute('aria-invalid') === 'true', route + ': invalid confirmation marked');
      verify((await confirm.getAttribute('aria-describedby') || '').includes(prefix + '-error'), route + ': alert associated with field');
      verify(await page.locator('#' + prefix + '-error').innerText() !== '', route + ': error feedback visible');
      await confirm.fill('ValidExample999');
      verify(await confirm.getAttribute('aria-invalid') === null, route + ': invalid state clears upon edit');
    } catch (e) {
      failures.push(route + ': validation test: ' + e.message);
    } finally {
      await page.close();
    }
  }

  // A held recovery request must disable submit and ignore synthetic repeated submit events.
  const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  let recoverCalls = 0;
  await mockAuth(page, async (path) => {
    if (path.endsWith('/recover')) {
      recoverCalls++;
      await held;
      return { status: 200, body: {} };
    }
    return { status: 401, body: { message: 'unauthorized' } };
  });
  try {
    await page.goto(baseURL + '/member/forgot-password/', { waitUntil: 'domcontentloaded' });
    await page.locator('input[name="email"]').fill('example@example.invalid');
    await page.locator('button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('form')?.getAttribute('aria-busy') === 'true');
    verify(await page.locator('button[type="submit"]').isDisabled(), 'recovery: action disabled while pending');
    verify(await page.locator('form').getAttribute('data-auth-state') === 'loading', 'recovery: loading state');
    await page.locator('form').evaluate((el) => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    release();
    await page.locator('#forgot-message-status').filter({ hasText: 'Jika email tersebut terdaftar' }).waitFor({ state: 'visible' });
    verify(recoverCalls === 1, 'recovery: only one request for two submit events');
    verify(await page.locator('button[type="submit"]').isEnabled(), 'recovery: action re-enabled');
    verify(await page.locator('form').getAttribute('aria-busy') === 'false', 'recovery: pending cleared');
    verify(await page.locator('form').getAttribute('data-auth-state') === 'success', 'recovery: real mocked success state');
  } catch (e) {
    failures.push('recovery: ' + e.message);
  } finally {
    release();
    await page.close();
  }

  // Auth failure is a real mocked error, not successful completion.
  const login = await browser.newPage({ viewport: { width: 390, height: 860 } });
  await mockAuth(login, signinFailure);
  try {
    await login.goto(baseURL + '/member/login/', { waitUntil: 'domcontentloaded' });
    await login.locator('input[name="email"]').fill('example@example.invalid');
    await login.locator('input[name="password"]').fill('ExampleWrong999');
    await login.locator('button[type="submit"]').click();
    await login.locator('#login-message-error').filter({ hasText: 'Email atau password belum' }).waitFor({ state: 'visible' });
    verify(await login.locator('button[type="submit"]').isEnabled(), 'login: unlocked after failure');
    verify(await login.locator('form').getAttribute('data-auth-state') === 'error', 'login: error not success');
    verify(await login.locator('input[name="email"]').inputValue() === 'example@example.invalid', 'login: retains email on failure');
  } catch (e) {
    failures.push('login: failure state: ' + e.message);
  } finally { await login.close(); }
} finally {
  await browser.close();
}
await writeFile(dir + '/report.json', JSON.stringify({ routes: paths, widths, report, failures }, null, 2));
if (failures.length) {
  console.error('Auth feedback audit failures:\n' + failures.join('\n'));
  process.exitCode = 1;
} else console.log('Auth feedback audit OK: 4 auth routes at 4 widths, dark mode, validation and mocked async request states.');
