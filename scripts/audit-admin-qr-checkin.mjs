import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// Test-only user and intercepted Supabase requests. Never touch a live session or QR token.
const origin = (process.env.ADMIN_AUDIT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const out = 'admin-qr-audit';
const widths = [360, 390, 768, 1280];
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const failures = [];
const check = (ok, label) => { if (!ok) failures.push(label); };
const uid = '11111111-1111-4111-8111-111111111111';
const eventId = '22222222-2222-4222-8222-222222222222';
const qrId = '33333333-3333-4333-8333-333333333333';
const user = { id: uid, aud: 'authenticated', role: 'authenticated', email: 'admin@example.invalid', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const profile = { user_id: uid, full_name: 'Admin Uji', role: 'admin', verification_status: 'approved', membership_status: 'active' };
const mockEvent = { id: eventId, title: 'Agenda QR Uji', starts_at: '2026-11-15T04:00:00Z', ends_at: '2026-11-15T06:00:00Z', category: 'Akademik', description: '', location: 'Kanazawa', mode: 'onsite', capacity: null, registration_deadline: null };
const qr = { id: qrId, event_id: eventId, checkin_token: 'test-qr-token-only', opens_at: '2026-11-15T03:30:00Z', closes_at: '2026-11-15T06:30:00Z', active: true, member_events: { title: mockEvent.title } };
const jwt = [Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'), Buffer.from(JSON.stringify({ sub: uid, exp: 1893456000, aud: 'authenticated' })).toString('base64url'), 'test-only'].join('.');
const session = { access_token: jwt, refresh_token: 'test-only', token_type: 'bearer', expires_at: 1893456000, expires_in: 315360000, user };

function state() { return { sessions: [{ ...qr }], writes: {}, payloads: {}, delayed: {}, clipboard: 'ok' }; }
async function mount(page, s) {
  await page.addInitScript(({ session }) => {
    localStorage.setItem('sb-hdeepkpiacfjdrlydemc-auth-token', JSON.stringify(session));
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async value => {
        if (window.__denyClipboard) throw new Error('Clipboard blocked by test');
        window.__copiedQr = value;
      }
    } });
  }, { session });
  await page.route(/^https:\/\/[^/]+\.supabase\.co\//, async route => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    const method = req.method();
    let response = { status: 200, body: {} };
    if (path === '/auth/v1/user') response.body = user;
    else if (path === '/rest/v1/profiles') response.body = profile;
    else if (path === '/rest/v1/member_events') response.body = [mockEvent];
    else if (path === '/rest/v1/event_checkin_sessions') {
      if (method === 'GET') response.body = s.sessions;
      else {
        const key = method;
        s.writes[key] = (s.writes[key] || 0) + 1;
        (s.payloads[key] ||= []).push(req.postDataJSON());
        if (s.delayed[key] && s.writes[key] === 1) {
          await s.delayed[key];
          response = { status: 409, body: { message: 'Synthetic failure', code: '23505' } };
        } else if (method === 'POST') {
          const item = { ...qr, ...req.postDataJSON(), id: '44444444-4444-4444-8444-444444444444', checkin_token: 'second-test-token' };
          s.sessions = [item, ...s.sessions];
          response = { status: 201, body: item };
        } else if (method === 'PATCH') {
          const requestedId = new URL(req.url()).searchParams.get('id');
          s.sessions = s.sessions.map(item => requestedId?.includes(item.id) ? { ...item, ...req.postDataJSON() } : item);
          response.body = s.sessions.find(item => item.id === qrId) ?? s.sessions[0];
        } else response = { status: 400, body: { message: 'Unexpected request' } };
      }
    } else response = { status: 404, body: { message: 'Unexpected endpoint ' + path } };
    await route.fulfill({ status: response.status, contentType: 'application/json', headers: {
      'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*'
    }, body: JSON.stringify(response.body) });
  });
}
async function ready(page) {
  await page.goto(origin + '/member/admin/checkin-qr/', { waitUntil: 'domcontentloaded' });
  await page.locator('#member-content').waitFor({ state: 'visible' });
  await page.getByText('1 sesi', { exact: true }).waitFor();
  await page.locator('#qr-session-form button[type="submit"]').waitFor({ state: 'visible' });
  await page.waitForFunction(() => document.querySelector('#qr-session-form button[type="submit"]')?.disabled === false);
}
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 860 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await mount(page, state());
    try {
      await ready(page);
      check(await page.locator('#qr-session-form').getAttribute('aria-busy') === 'false', width + ': form idle');
      check(await page.locator('#qr-admin-message-status').getAttribute('role') === 'status', width + ': status live region');
      check(await page.locator('#qr-admin-message-error').getAttribute('role') === 'alert', width + ': alert region');
      check(await page.locator('#qr-session-list canvas').count() === 1, width + ': QR canvas');
      check(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2), width + ': no horizontal overflow');
      await page.screenshot({ path: out + '/qr-' + width + '.jpg', type: 'jpeg', quality: 60, fullPage: true, animations: 'disabled' });
      if (width === 390) {
        await page.locator('[data-theme-toggle]').click();
        check(await page.locator('html').evaluate(el => el.classList.contains('dark')), 'dark mode toggle');
        await page.screenshot({ path: out + '/qr-dark-390.jpg', type: 'jpeg', quality: 60, fullPage: true, animations: 'disabled' });
      }
      check(errors.length === 0, width + ': JS runtime errors ' + errors.join(', '));
    } catch (e) { failures.push(width + ': ' + e.message); }
    finally { await page.close(); }
  }

  // Date validation must avoid all write requests, and clear on correction.
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
    const s = state();
    await mount(page, s);
    try {
      await ready(page);
      await page.locator('input[name="opens_at"]').fill('2026-11-15T13:00');
      await page.locator('input[name="closes_at"]').fill('2026-11-15T12:00');
      await page.locator('#qr-session-form button[type="submit"]').click();
      check(await page.locator('input[name="closes_at"]').getAttribute('aria-invalid') === 'true', 'invalid end marked');
      check((s.writes.POST || 0) === 0, 'invalid end prevents POST');
      await page.locator('input[name="closes_at"]').fill('2026-11-15T14:00');
      check(await page.locator('input[name="closes_at"]').getAttribute('aria-invalid') === null, 'invalid flag clears');
    } catch (e) { failures.push('date validation: ' + e.message); }
    finally { await page.close(); }
  }

  // Synthetic create request: pending, duplicate prevention, error retry and successful reload.
  {
    const s = state();
    let release = () => {};
    s.delayed.POST = new Promise(resolve => { release = resolve; });
    const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
    await mount(page, s);
    try {
      await ready(page);
      await page.locator('input[name="opens_at"]').fill('2026-11-15T13:00');
      await page.locator('input[name="closes_at"]').fill('2026-11-15T14:00');
      await page.locator('#qr-session-form button[type="submit"]').click();
      await page.waitForFunction(() => document.querySelector('#qr-session-form')?.getAttribute('aria-busy') === 'true');
      check(await page.locator('#qr-session-form button[type="submit"]').isDisabled(), 'create: submit disabled');
      await page.locator('#qr-session-form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
      release();
      await page.locator('#qr-admin-message-error').filter({ hasText: 'Sesi QR belum dapat dibuat' }).waitFor({ state: 'visible' });
      check(s.writes.POST === 1, 'create: exactly one request while pending');
      check(await page.locator('#qr-session-form button[type="submit"]').isEnabled(), 'create: retry enabled');
      check(await page.locator('input[name="opens_at"]').inputValue() === '2026-11-15T13:00', 'create: input preserved after failure');
      await page.locator('#qr-session-form button[type="submit"]').click();
      await page.locator('#qr-admin-message-status').filter({ hasText: 'Sesi QR berhasil dibuat' }).waitFor({ state: 'visible' });
      check(s.writes.POST === 2, 'create: one retry');
      check(s.payloads.POST[1].event_id === eventId, 'create: correct event');
      check(await page.locator('#qr-session-form').getAttribute('aria-busy') === 'false', 'create: pending cleared');
      await page.getByText('2 sesi', { exact: true }).waitFor();
    } catch (e) { failures.push('create lifecycle: ' + e.message); }
    finally { release(); await page.close(); }
  }

  // Deactivate: confirmation, held failed request, duplicate guard, retry and activation.
  {
    const s = state();
    let release = () => {};
    s.delayed.PATCH = new Promise(resolve => { release = resolve; });
    const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
    let dialogs = 0;
    page.on('dialog', d => { dialogs++; d.accept(); });
    await mount(page, s);
    try {
      await ready(page);
      const toggle = page.locator('button[data-qr-toggle]').first();
      await toggle.click();
      await page.locator('#qr-session-list article[aria-busy="true"]').waitFor({ state: 'visible' });
      check(await toggle.isDisabled(), 'toggle: pending disabled');
      await toggle.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
      release();
      await page.locator('#qr-admin-message-error').filter({ hasText: 'Status sesi belum dapat diperbarui' }).waitFor({ state: 'visible' });
      check(s.writes.PATCH === 1, 'toggle: duplicate blocked');
      check(await toggle.isEnabled(), 'toggle: retry available');
      await toggle.click();
      await page.locator('#qr-admin-message-status').filter({ hasText: 'Status sesi QR berhasil diperbarui' }).waitFor({ state: 'visible' });
      check(s.writes.PATCH === 2, 'toggle: one retry');
      check(dialogs === 2, 'toggle: confirmation on deactivation');
      check(s.sessions[0].active === false, 'toggle: backend mock state inactive');
      await page.getByRole('button', { name: 'Aktifkan kembali' }).click();
      await page.getByRole('button', { name: 'Nonaktifkan' }).waitFor();
      check(s.sessions[0].active === true, 'toggle: reactivation succeeds');
      check(dialogs === 2, 'toggle: no confirmation required for reactivation');
    } catch (e) { failures.push('toggle lifecycle: ' + e.message); }
    finally { release(); await page.close(); }
  }

  // Browser clipboard denied: useful error and fallback focus; successful copy announces success.
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
    await mount(page, state());
    try {
      await ready(page);
      await page.evaluate(() => { window.__denyClipboard = true; });
      await page.getByRole('button', { name: 'Salin link' }).click();
      await page.locator('#qr-admin-message-error').filter({ hasText: 'tidak dapat disalin otomatis' }).waitFor({ state: 'visible' });
      check(await page.locator('#qr-session-list article p[tabindex="-1"]').count() === 1, 'copy: manual link available');
      await page.evaluate(() => { window.__denyClipboard = false; });
      await page.getByRole('button', { name: 'Salin link' }).click();
      await page.locator('#qr-admin-message-status').filter({ hasText: 'berhasil disalin' }).waitFor({ state: 'visible' });
      check((await page.evaluate(() => window.__copiedQr)).includes('test-qr-token-only'), 'copy: exact mocked URL copied');
    } catch (e) { failures.push('clipboard: ' + e.message); }
    finally { await page.close(); }
  }

  // True empty state; no visual blank section.
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
    const s = state(); s.sessions = [];
    await mount(page, s);
    try {
      await page.goto(origin + '/member/admin/checkin-qr/', { waitUntil: 'domcontentloaded' });
      await page.locator('#member-content').waitFor({ state: 'visible' });
      await page.getByText('0 sesi', { exact: true }).waitFor();
      check(await page.locator('#qr-session-empty').isVisible(), 'empty: semantic empty message visible');
    } catch (e) { failures.push('empty: ' + e.message); }
    finally { await page.close(); }
  }
} finally { await browser.close(); }

await writeFile(out + '/report.json', JSON.stringify({ widths, failures }, null, 2));
if (failures.length) {
  console.error('Admin QR QA failed:\n' + failures.join('\n'));
  process.exitCode = 1;
} else console.log('Admin QR QA passed: four viewports, create/toggle pending/error/retry, clipboard, empty.');
