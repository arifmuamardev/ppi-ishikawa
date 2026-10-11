import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// Entirely synthetic member + mocked Supabase HTTP. No real credentials/records.
const url = (process.env.MEMBER_FEEDBACK_BASE_URL || 'http://127.0.0.1:4321/ppi-ishikawa').replace(/\/$/, '') + '/member/aspirations/';
const widths = [360, 390, 768, 1280];
const directory = 'member-aspiration-audit';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const failures = [];
const check = (ok, desc) => { if (!ok) failures.push(desc); };
const id = '11111111-1111-4111-8111-111111111111';
const user = { id, aud: 'authenticated', role: 'authenticated', email: 'test@example.invalid', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const profile = { user_id: id, full_name: 'Pengguna Uji', membership_status: 'active', verification_status: 'approved', role: 'member' };
const jwt = [Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'), Buffer.from(JSON.stringify({ sub: id, exp: 1893456000, aud: 'authenticated' })).toString('base64url'), 'fake-test-only'].join('.');
const session = { access_token: jwt, token_type: 'bearer', refresh_token: 'fake-test', expires_in: 315360000, expires_at: 1893456000, user };

async function setup(page, hooks = {}) {
  await page.addInitScript((s) => localStorage.setItem('sb-hdeepkpiacfjdrlydemc-auth-token', JSON.stringify(s)), session);
  await page.route(/^https:\/\/[^/]+\.supabase\.co\//, async (route) => {
    const path = new URL(route.request().url()).pathname;
    const method = route.request().method();
    let response = { status: 200, body: {} };
    if (path === '/auth/v1/user') response.body = user;
    else if (path === '/rest/v1/profiles') response.body = profile;
    else if (path === '/rest/v1/member_aspirations') {
      if (method === 'POST' && hooks.insert) response = await hooks.insert(route.request());
      else if (method === 'GET') response.body = hooks.read ? hooks.read() : [];
    } else response = { status: 404, body: { message: 'Unmocked endpoint ' + path } };
    await route.fulfill({
      status: response.status,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' },
      body: JSON.stringify(response.body)
    });
  });
}
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 860 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await setup(page);
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.locator('#member-content').waitFor({ state: 'visible' });
      check(response?.status() === 200, width + ': HTTP 200');
      check(await page.locator('#aspiration-form').getAttribute('aria-busy') === 'false', width + ': idle');
      check(await page.locator('#aspiration-message-status').getAttribute('role') === 'status', width + ': live status');
      check(await page.locator('#aspiration-message-error').getAttribute('role') === 'alert', width + ': error alert');
      check(await page.locator('#aspiration-empty').getAttribute('role') === 'status', width + ': semantic empty');
      check(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2), width + ': overflow');
      await page.screenshot({ path: directory + '/aspirations-' + width + '.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled' });
      if (width === 390) {
        await page.locator('[data-theme-toggle]').click();
        check(await page.locator('html').evaluate(el => el.classList.contains('dark')), 'dark theme');
        await page.screenshot({ path: directory + '/aspirations-dark-390.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled' });
      }
      check(errors.length === 0, width + ': JS errors ' + errors.join(', '));
    } catch (error) { failures.push(width + ': ' + error.message); }
    finally { await page.close(); }
  }

  let release = () => {};
  const held = new Promise(resolve => { release = resolve; });
  let sends = 0;
  let stored = null;
  let payloads = [];
  const page = await browser.newPage({ viewport: { width: 390, height: 860 }, reducedMotion: 'reduce' });
  await setup(page, {
    read: () => stored ? [stored] : [],
    insert: async (request) => {
      sends++;
      payloads.push(request.postDataJSON());
      if (sends === 1) {
        await held;
        return { status: 409, body: { code: '23505', message: 'Mock failure' } };
      }
      stored = { id: 'mock-aspiration', ...request.postDataJSON(), status: 'received', created_at: '2026-10-11T00:00:00Z' };
      return { status: 201, body: stored };
    }
  });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.locator('#member-content').waitFor({ state: 'visible' });
    await page.locator('select[name="category"]').selectOption('Akademik');
    await page.locator('input[name="subject"]').fill('Usulan akademik');
    await page.locator('textarea[name="message"]').fill('Tambahkan sesi diskusi riset.');
    await page.locator('input[name="anonymous"]').check();
    await page.locator('#aspiration-form button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('#aspiration-form')?.getAttribute('aria-busy') === 'true');
    check(await page.locator('#aspiration-form button[type="submit"]').isDisabled(), 'pending: disabled');
    await page.locator('#aspiration-form').evaluate(el => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    release();
    await page.locator('#aspiration-message-error').filter({ hasText: 'Aspirasi belum dapat dikirim' }).waitFor({ state: 'visible' });
    check(sends === 1, 'pending: only one request');
    check(await page.locator('#aspiration-form button[type="submit"]').isEnabled(), 'error: retry enabled');
    check(await page.locator('input[name="anonymous"]').isChecked(), 'error: anonymity preserved');
    check(await page.locator('input[name="subject"]').inputValue() === 'Usulan akademik', 'error: text preserved');
    await page.locator('#aspiration-form button[type="submit"]').click();
    await page.locator('#aspiration-message-status').filter({ hasText: 'Aspirasi berhasil disimpan' }).waitFor({ state: 'visible' });
    check(sends === 2, 'retry: exactly 2 requests');
    check(payloads[1]?.anonymous === true, 'retry: anonymous flag preserved');
    check(await page.locator('#aspiration-form').getAttribute('aria-busy') === 'false', 'success: not busy');
    check(await page.locator('input[name="subject"]').inputValue() === '', 'success: form reset');
    await page.getByText('1 aspirasi').waitFor();
    check(await page.locator('#aspiration-empty').isHidden(), 'success: updated list hides empty state');
  } catch (error) { failures.push('submit lifecycle: ' + error.message); }
  finally { release(); await page.close(); }
} finally { await browser.close(); }
await writeFile(directory + '/report.json', JSON.stringify({ widths, failures }, null, 2));
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('Aspirations mock browser QA passed.');
