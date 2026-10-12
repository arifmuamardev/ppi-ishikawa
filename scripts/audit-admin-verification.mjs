import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// Test-only session and full Supabase HTTP interception. Never use real member data.
const base = (process.env.ADMIN_AUDIT_BASE_URL || 'http://127.0.0.1:4321/ppi-ishikawa').replace(/\/$/, '');
const dir = 'admin-verification-audit';
const widths = [360, 390, 768, 1280];
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const failures = [];
const check = (condition, label) => { if (!condition) failures.push(label); };
const adminId = '11111111-1111-4111-8111-111111111111';
const memberId1 = '22222222-2222-4222-8222-222222222222';
const memberId2 = '33333333-3333-4333-8333-333333333333';
const user = { id: adminId, aud: 'authenticated', role: 'authenticated', email: 'admin@example.invalid', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const profile = { user_id: adminId, full_name: 'Admin Pengujian', role: 'admin', verification_status: 'approved', membership_status: 'active' };
const jwt = [Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'), Buffer.from(JSON.stringify({ sub: adminId, exp: 1893456000, aud: 'authenticated' })).toString('base64url'), 'synthetic-only'].join('.');
const session = { access_token: jwt, token_type: 'bearer', refresh_token: 'synthetic-only', expires_in: 315360000, expires_at: 1893456000, user };
const member = (id, name) => ({
  user_id: id, full_name: name, campus_slug: 'kanazawa-university',
  program: 'Program Uji', study_level: 'S2', field_of_study: 'Data Science',
  membership_status: 'incoming', verification_status: 'pending', created_at: '2026-10-01T00:00:00Z'
});
function fixture() { return { pending: [member(memberId1,'Anggota Satu Uji'), member(memberId2,'Anggota Dua Uji')], attempts: 0, payloads: [], held: null, reads: 0, failNextLoad: false }; }
async function mock(page, s) {
  await page.addInitScript(value => localStorage.setItem('sb-hdeepkpiacfjdrlydemc-auth-token', JSON.stringify(value)), session);
  await page.route(/^https:\/\/[^/]+\.supabase\.co\//, async route => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    let response = { status: 200, body: {} };
    if (path === '/auth/v1/user') response.body = user;
    else if (path === '/rest/v1/profiles') {
      if (url.searchParams.get('verification_status') === 'eq.pending') {
        s.reads++;
        if (s.failNextLoad) {
          s.failNextLoad = false;
          response = { status: 503, body: { code: 'PGRST000', message: 'Synthetic refresh failure' } };
        } else response.body = s.pending;
      } else response.body = profile;
    } else if (path === '/rest/v1/rpc/review_membership' && request.method() === 'POST') {
      s.attempts++;
      const payload = request.postDataJSON();
      s.payloads.push(payload);
      if (s.held && s.attempts === 1) {
        await s.held;
        response = { status: 409, body: { code: '23505', message: 'Synthetic request failure' } };
      } else {
        s.pending = s.pending.filter(item => item.user_id !== payload.target_user_id);
        response.body = null;
      }
    } else response = { status: 404, body: { message: 'Unmocked endpoint ' + path } };
    await route.fulfill({
      status: response.status,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' },
      body: JSON.stringify(response.body)
    });
  });
}
async function ready(page) {
  await page.goto(base + '/member/admin/verification/', { waitUntil: 'domcontentloaded' });
  await page.locator('#member-content').waitFor({ state: 'visible' });
  await page.getByText('2 menunggu', { exact: true }).waitFor({ timeout: 20000 });
  await page.waitForFunction(() => document.querySelector('#verification-admin-list')?.getAttribute('aria-busy') === 'false');
  await page.locator('#verification-refresh').waitFor({ state: 'visible' });
  await page.waitForFunction(() => document.querySelector('#verification-refresh')?.disabled === false);
}
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 860 }, reducedMotion: 'reduce' });
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await mock(page, fixture());
    try {
      await ready(page);
      check(await page.locator('#verification-admin-list').getAttribute('aria-busy') === 'false', width + ': loading cleared');
      check(await page.locator('#verification-admin-message-status').getAttribute('role') === 'status', width + ': live status');
      check(await page.locator('#verification-admin-message-error').getAttribute('role') === 'alert', width + ': alert');
      check(await page.locator('#verification-admin-list article').count() === 2, width + ': two pending rows');
      check(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2), width + ': no overflow');
      await page.screenshot({ path: dir + '/verification-' + width + '.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled' });
      if (width === 390) {
        await page.locator('[data-theme-toggle]').click();
        check(await page.locator('html').evaluate(el => el.classList.contains('dark')), 'dark toggle');
        await page.screenshot({ path: dir + '/verification-dark-390.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled' });
      }
      check(pageErrors.length === 0, width + ': errors ' + pageErrors.join('; '));
    } catch (error) { failures.push(width + ': ' + error.message); }
    finally { await page.close(); }
  }

  // Approval: cancellation never mutates; first confirmed RPC fails, then retry succeeds.
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 860 }, reducedMotion: 'reduce' });
    const s = fixture();
    let release = () => {};
    s.held = new Promise(resolve => { release = resolve; });
    let accept = false, confirmations = 0;
    page.on('dialog', d => { confirmations++; if (accept) d.accept(); else d.dismiss(); });
    await mock(page, s);
    try {
      await ready(page);
      const row = page.locator('#verification-admin-list article').filter({ hasText: 'Anggota Satu Uji' });
      const approve = row.locator('button[data-review-control="approve"]');
      const selected = row.locator('select[data-review-control]');
      await selected.selectOption('active');
      await approve.click();
      check(s.attempts === 0, 'cancel: no RPC mutation');
      check(await approve.isEnabled(), 'cancel: controls available');

      accept = true;
      await approve.click();
      await row.waitFor({ state: 'visible' });
      await page.waitForFunction(() => document.querySelector('#verification-admin-list article[aria-busy="true"]') !== null);
      check(await approve.isDisabled(), 'pending: decision disabled');
      check(await page.locator('#verification-refresh').isDisabled(), 'pending: refresh disabled');
      await approve.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
      release();
      await page.locator('#verification-admin-message-error').filter({ hasText: 'Keputusan verifikasi belum dapat disimpan' }).waitFor({ state: 'visible' });
      check(s.attempts === 1, 'pending: double decision guarded');
      check(await selected.inputValue() === 'active', 'error: membership selection preserved');
      check(await approve.isEnabled(), 'error: decision retry unlocked');
      await approve.click();
      await page.locator('#verification-admin-message-status').filter({ hasText: 'Membership berhasil disetujui' }).waitFor({ state: 'visible' });
      check(s.attempts === 2, 'success: exactly one retry');
      check(s.payloads[1]?.target_user_id === memberId1, 'success: correct user');
      check(s.payloads[1]?.next_status === 'active', 'success: selected status sent');
      check(s.payloads[1]?.decision === 'approved', 'success: approval decision sent');
      check(confirmations === 3, 'confirm before each deliberate decision');
      await page.getByText('1 menunggu', { exact: true }).waitFor();

      // Rejection/tindak lanjut uses the same guard with distinct decision value.
      const other = page.locator('#verification-admin-list article').filter({ hasText: 'Anggota Dua Uji' });
      await other.getByRole('button', { name: 'Tindak lanjut' }).click();
      await page.locator('#verification-admin-message-status').filter({ hasText: 'Pendaftaran berhasil ditandai' }).waitFor({ state: 'visible' });
      check(s.attempts === 3 && s.payloads[2]?.decision === 'rejected', 'rejection: correct RPC decision');
      await page.getByText('0 menunggu', { exact: true }).waitFor();
      check(await page.locator('#verification-admin-empty').isVisible(), 'empty queue announced');
    } catch (error) { failures.push('decision lifecycle: ' + error.message); }
    finally { release(); await page.close(); }
  }

  // Confirmed write followed by failed queue refresh must not be described as a failed write.
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 860 }, reducedMotion: 'reduce' });
    const s = fixture();
    page.on('dialog', dialog => dialog.accept());
    await mock(page, s);
    try {
      await ready(page);
      s.failNextLoad = true;
      await page.locator('#verification-admin-list article').first().getByRole('button', { name: 'Setujui' }).click();
      await page.locator('#verification-admin-message-status').filter({ hasText: 'Keputusan berhasil disimpan, tetapi antrean belum dapat dimuat ulang' }).waitFor({ state: 'visible' });
      check(s.attempts === 1, 'refresh failure: write performed once');
      check(await page.locator('#verification-refresh').isEnabled(), 'refresh failure: manual retry enabled');
      await page.locator('#verification-refresh').click();
      await page.getByText('1 menunggu', { exact: true }).waitFor();
    } catch (error) { failures.push('refresh recovery: ' + error.message); }
    finally { await page.close(); }
  }
} finally { await browser.close(); }
await writeFile(dir + '/report.json', JSON.stringify({ widths, failures }, null, 2));
if (failures.length) { console.error('Verification Admin QA failures:\n' + failures.join('\n')); process.exitCode = 1; }
else console.log('Verification Admin QA passed: 4 viewports; approval/rejection confirmation, failure, retry, refresh recovery.');
