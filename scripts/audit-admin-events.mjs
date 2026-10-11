import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// Synthetic administrator and intercepted Supabase HTTP only. Never access real member records.
const baseURL = (process.env.ADMIN_AUDIT_BASE_URL || 'http://127.0.0.1:4321/ppi-ishikawa').replace(/\/$/, '');
const widths = [360, 390, 768, 1280];
const output = 'admin-event-audit';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const failures = [];
const assert = (ok, message) => { if (!ok) failures.push(message); };
const uid = '11111111-1111-4111-8111-111111111111';
const user = { id: uid, aud: 'authenticated', role: 'authenticated', email: 'admin@example.invalid', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const profile = { user_id: uid, full_name: 'Admin Pengujian', membership_status: 'active', verification_status: 'approved', role: 'admin' };
const token = [
  Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'),
  Buffer.from(JSON.stringify({ sub: uid, exp: 1893456000, aud: 'authenticated' })).toString('base64url'),
  'fake-only'
].join('.');
const session = { access_token: token, refresh_token: 'fake-only', token_type: 'bearer', expires_at: 1893456000, expires_in: 315360000, user };
const sample = { id: '22222222-2222-4222-8222-222222222222', title: 'Kegiatan Uji', description: 'Deskripsi kegiatan', category: 'Akademik', starts_at: '2026-11-15T04:00:00Z', ends_at: '2026-11-15T06:00:00Z', location: 'Kanazawa', mode: 'onsite', capacity: null, registration_deadline: null };

async function setup(page, hooks = {}) {
  await page.addInitScript(s => localStorage.setItem('sb-hdeepkpiacfjdrlydemc-auth-token', JSON.stringify(s)), session);
  await page.route(/^https:\/\/[^/]+\.supabase\.co\//, async route => {
    const req = route.request();
    const pathname = new URL(req.url()).pathname;
    const method = req.method();
    let response = { status: 200, body: {} };
    if (pathname === '/auth/v1/user') response.body = user;
    else if (pathname === '/rest/v1/profiles') response.body = profile;
    else if (pathname === '/rest/v1/member_events') {
      if (method === 'GET') response.body = hooks.read ? hooks.read() : [sample];
      else if (hooks.write) response = await hooks.write(req);
      else response = { status: 400, body: { message: 'Synthetic write blocked', code: 'test_only' } };
    } else response = { status: 404, body: { message: 'Unmocked: ' + pathname } };
    await route.fulfill({ status: response.status, contentType: 'application/json', headers: {
      'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*'
    }, body: JSON.stringify(response.body) });
  });
}
async function fillForm(page) {
  await page.locator('input[name="title"]').fill('Agenda Baru Pengujian');
  await page.locator('input[name="starts_at"]').fill('2026-11-15T13:00');
  await page.locator('input[name="ends_at"]').fill('2026-11-15T15:00');
  await page.locator('input[name="location"]').fill('Kanazawa');
  await page.locator('textarea[name="description"]').fill('Agenda pengujian sintetis');
}
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 850 }, reducedMotion: 'reduce' });
    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(e.message));
    await setup(page);
    try {
      const res = await page.goto(baseURL + '/member/admin/events/', { waitUntil: 'domcontentloaded' });
      await page.locator('#member-content').waitFor({ state: 'visible' });
      await page.getByText('1 kegiatan').waitFor();
      assert(res?.status() === 200, width + ': HTTP');
      assert(await page.locator('#event-admin-form').getAttribute('aria-busy') === 'false', width + ': form idle');
      assert(await page.locator('#event-admin-message-status').getAttribute('role') === 'status', width + ': live status');
      assert(await page.locator('#event-admin-message-error').getAttribute('role') === 'alert', width + ': live error');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2), width + ': no overflow');
      await page.screenshot({ path: output + '/events-' + width + '.jpg', type: 'jpeg', quality: 60, fullPage: true, animations: 'disabled' });
      if (width === 390) {
        await page.locator('[data-theme-toggle]').click();
        assert(await page.locator('html').evaluate(el => el.classList.contains('dark')), 'dark mode');
        await page.screenshot({ path: output + '/events-dark-390.jpg', type: 'jpeg', quality: 60, fullPage: true, animations: 'disabled' });
      }
      assert(pageErrors.length === 0, width + ': runtime errors: ' + pageErrors.join(', '));
    } catch (e) { failures.push(width + ': ' + e.message); }
    finally { await page.close(); }
  }

  let releaseSave = () => {};
  const heldSave = new Promise(resolve => { releaseSave = resolve; });
  let releaseDelete = () => {};
  const heldDelete = new Promise(resolve => { releaseDelete = resolve; });
  let inserts = 0, updates = 0, deletes = 0, existing = [sample];
  const page = await browser.newPage({ viewport: { width: 390, height: 850 }, reducedMotion: 'reduce' });
  page.on('dialog', d => d.accept());
  await setup(page, {
    read: () => existing,
    write: async req => {
      const method = req.method();
      if (method === 'POST') {
        inserts++;
        if (inserts === 1) {
          await heldSave;
          return { status: 409, body: { message: 'Test conflict', code: '23505' } };
        }
        const obj = { ...sample, ...req.postDataJSON(), id: '33333333-3333-4333-8333-333333333333' };
        existing = [...existing, obj];
        return { status: 201, body: obj };
      }
      if (method === 'PATCH') {
        updates++;
        const changed = req.postDataJSON();
        existing = existing.map(item => item.id === sample.id ? { ...item, ...changed } : item);
        return { status: 200, body: existing.find(item => item.id === sample.id) };
      }
      if (method === 'DELETE') {
        deletes++;
        if (deletes === 1) {
          await heldDelete;
          return { status: 409, body: { message: 'Test deletion failure', code: '23503' } };
        }
        existing = existing.filter(x => x.id !== sample.id);
        return { status: 200, body: {} };
      }
      return { status: 400, body: { message: 'Unexpected write method' } };
    }
  });
  try {
    await page.goto(baseURL + '/member/admin/events/', { waitUntil: 'domcontentloaded' });
    await page.locator('#member-content').waitFor({ state: 'visible' });
    await page.getByText('1 kegiatan').waitFor();
    await fillForm(page);

    // Date validation: invalid state associated with the end field.
    await page.locator('input[name="ends_at"]').fill('2026-11-15T12:00');
    await page.locator('#event-admin-form button[type="submit"]').click();
    assert(await page.locator('input[name="ends_at"]').getAttribute('aria-invalid') === 'true', 'end date invalid');
    await page.locator('input[name="ends_at"]').fill('2026-11-15T15:00');
    assert(await page.locator('input[name="ends_at"]').getAttribute('aria-invalid') === null, 'end date invalid clears');

    // Held save and repeated synthetic submission.
    await page.locator('#event-admin-form button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('#event-admin-form')?.getAttribute('aria-busy') === 'true');
    assert(await page.locator('#event-admin-form button[type="submit"]').isDisabled(), 'save pending disabled');
    await page.locator('#event-admin-form').evaluate(el => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    releaseSave();
    await page.locator('#event-admin-message-error').filter({ hasText: 'Kegiatan belum dapat disimpan' }).waitFor({ state: 'visible' });
    assert(inserts === 1, 'save double submit guarded');
    assert(await page.locator('input[name="title"]').inputValue() === 'Agenda Baru Pengujian', 'save error preserves title');
    assert(await page.locator('#event-admin-form button[type="submit"]').isEnabled(), 'save retry available');
    await page.locator('#event-admin-form button[type="submit"]').click();
    await page.locator('#event-admin-message-status').filter({ hasText: 'Kegiatan berhasil disimpan' }).waitFor({ state: 'visible' });
    assert(inserts === 2, 'save retry exactly once');
    await page.getByText('2 kegiatan').waitFor();

    // Edit must preserve the existing ID and update the row, not create a third event.
    await page.locator('#event-admin-list article').filter({ hasText: 'Kegiatan Uji' }).getByRole('button', { name: 'Edit' }).click();
    assert(await page.locator('#event-form-title').textContent() === 'Edit kegiatan', 'edit: form switched to edit mode');
    await page.locator('input[name="title"]').fill('Kegiatan Uji Diperbarui');
    await page.locator('#event-admin-form button[type="submit"]').click();
    await page.locator('#event-admin-list article').filter({ hasText: 'Kegiatan Uji Diperbarui' }).waitFor();
    assert(updates === 1, 'edit: one PATCH request');
    assert(await page.locator('input[name="id"]').inputValue() === '', 'edit: form reset after save');
    assert(existing.length === 2, 'edit: does not create another event');

    // Delete failure should keep row and permit retry; confirm is still required.
    const card = page.locator('#event-admin-list article').filter({ hasText: 'Kegiatan Uji Diperbarui' });
    const remove = card.getByRole('button', { name: 'Hapus' });
    await remove.click();
    await card.waitFor({ state: 'visible' });
    await page.waitForFunction(() => document.querySelector('#event-admin-list article button:disabled') !== null);
    assert(await card.getAttribute('aria-busy') === 'true', 'delete row busy');
    await card.getByRole('button', { name: /Menghapus/ }).evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    releaseDelete();
    await page.locator('#event-admin-message-error').filter({ hasText: 'Kegiatan belum dapat dihapus' }).waitFor({ state: 'visible' });
    assert(deletes === 1, 'delete duplicate guarded');
    assert(await remove.isEnabled(), 'delete retry unlocked');
    await remove.click();
    await page.locator('#event-admin-message-status').filter({ hasText: 'Kegiatan berhasil dihapus' }).waitFor({ state: 'visible' });
    assert(deletes === 2, 'delete retried once');
    assert(await card.count() === 0, 'deleted row removed');
  } catch (e) { failures.push('write lifecycle: ' + e.message); }
  finally { releaseSave(); releaseDelete(); await page.close(); }
} finally { await browser.close(); }
await writeFile(output + '/report.json', JSON.stringify({ widths, failures }, null, 2));
if (failures.length) { console.error('Admin Event QA failed:\n' + failures.join('\n')); process.exitCode = 1; }
else console.log('Admin Event QA passed: four widths, date validation, save and delete pending/error/retry.');
