import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// Mock administrator and Supabase HTTP only. No real member data or production writes.
const origin = (process.env.ADMIN_AUDIT_BASE_URL || 'http://127.0.0.1:4321/ppi-ishikawa').replace(/\/$/, '');
const widths = [360, 390, 768, 1280];
const output = 'admin-announcement-audit';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const failures = [];
const verify = (condition, reason) => { if (!condition) failures.push(reason); };
const uid = '11111111-1111-4111-8111-111111111111';
const user = { id: uid, aud: 'authenticated', role: 'authenticated', email: 'admin@example.invalid', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const profile = { user_id: uid, full_name: 'Admin Pengujian', membership_status: 'active', verification_status: 'approved', role: 'admin' };
const token = [Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'), Buffer.from(JSON.stringify({ sub: uid, exp: 1893456000, aud: 'authenticated' })).toString('base64url'), 'fake-only'].join('.');
const session = { access_token: token, refresh_token: 'fake-only', token_type: 'bearer', expires_at: 1893456000, expires_in: 315360000, user };
const sample = { id: '22222222-2222-4222-8222-222222222222', title: 'Pengumuman Uji', body: 'Isi pengumuman', category: 'Kegiatan', audience: 'Semua anggota', important: false, published_at: '2026-10-11T00:00:00Z' };
async function setup(page, hooks = {}) {
  await page.addInitScript(s => localStorage.setItem('sb-hdeepkpiacfjdrlydemc-auth-token', JSON.stringify(s)), session);
  await page.route(/^https:\/\/[^/]+\.supabase\.co\//, async route => {
    const req = route.request(), path = new URL(req.url()).pathname, method = req.method();
    let response = { status: 200, body: {} };
    if (path === '/auth/v1/user') response.body = user;
    else if (path === '/rest/v1/profiles') response.body = profile;
    else if (path === '/rest/v1/member_announcements') {
      if (method === 'GET') response.body = hooks.read ? hooks.read() : [sample];
      else if (hooks.write) response = await hooks.write(req);
      else response = { status: 400, body: { message: 'Writes blocked by mock' } };
    } else response = { status: 404, body: { message: 'Unmocked endpoint: ' + path } };
    await route.fulfill({ status: response.status, contentType: 'application/json', headers: {
      'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*'
    }, body: JSON.stringify(response.body) });
  });
}
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 860 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await setup(page);
    try {
      const response = await page.goto(origin + '/member/admin/announcements/', { waitUntil: 'domcontentloaded' });
      await page.locator('#member-content').waitFor({ state: 'visible' });
      await page.getByText('1 pengumuman').waitFor();
      verify(response?.status() === 200, width + ': page HTTP');
      verify(await page.locator('#announcement-admin-form').getAttribute('aria-busy') === 'false', width + ': form idle');
      verify(await page.locator('#announcement-admin-message-status').getAttribute('role') === 'status', width + ': status role');
      verify(await page.locator('#announcement-admin-message-error').getAttribute('role') === 'alert', width + ': alert role');
      verify(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2), width + ': no overflow');
      await page.screenshot({ path: output + '/announcements-' + width + '.jpg', type: 'jpeg', quality: 60, fullPage: true, animations: 'disabled' });
      if (width === 390) {
        await page.locator('[data-theme-toggle]').click();
        verify(await page.locator('html').evaluate(el => el.classList.contains('dark')), 'dark mode');
        await page.screenshot({ path: output + '/announcements-dark-390.jpg', type: 'jpeg', quality: 60, fullPage: true, animations: 'disabled' });
      }
      verify(errors.length === 0, width + ': JS errors: ' + errors.join(', '));
    } catch (e) { failures.push(width + ': ' + e.message); }
    finally { await page.close(); }
  }

  let releaseSave = () => {};
  const heldSave = new Promise(resolve => { releaseSave = resolve; });
  let releaseDelete = () => {};
  const heldDelete = new Promise(resolve => { releaseDelete = resolve; });
  let inserts = 0, updates = 0, deletes = 0, existing = [sample];
  const page = await browser.newPage({ viewport: { width: 390, height: 860 }, reducedMotion: 'reduce' });
  page.on('dialog', d => d.accept());
  await setup(page, {
    read: () => existing,
    write: async req => {
      if (req.method() === 'POST') {
        inserts++;
        if (inserts === 1) {
          await heldSave;
          return { status: 409, body: { message: 'Test conflict', code: '23505' } };
        }
        const item = { ...sample, ...req.postDataJSON(), id: '33333333-3333-4333-8333-333333333333' };
        existing = [item, ...existing];
        return { status: 201, body: item };
      }
      if (req.method() === 'PATCH') {
        updates++;
        existing = existing.map(item => item.id === sample.id ? { ...item, ...req.postDataJSON() } : item);
        return { status: 200, body: existing.find(item => item.id === sample.id) };
      }
      if (req.method() === 'DELETE') {
        deletes++;
        if (deletes === 1) {
          await heldDelete;
          return { status: 409, body: { message: 'Test delete failure', code: '23503' } };
        }
        existing = existing.filter(item => item.id !== sample.id);
        return { status: 200, body: {} };
      }
      return { status: 400, body: { message: 'Unexpected method' } };
    }
  });
  try {
    await page.goto(origin + '/member/admin/announcements/', { waitUntil: 'domcontentloaded' });
    await page.locator('#member-content').waitFor({ state: 'visible' });
    await page.getByText('1 pengumuman').waitFor();
    await page.locator('input[name="title"]').fill('Pengumuman Baru Uji');
    await page.locator('textarea[name="body"]').fill('Informasi untuk anggota.');
    await page.locator('input[name="important"]').check();
    await page.locator('#announcement-admin-form button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('#announcement-admin-form')?.getAttribute('aria-busy') === 'true');
    verify(await page.locator('#announcement-admin-form button[type="submit"]').isDisabled(), 'pending save disabled');
    await page.locator('#announcement-admin-form').evaluate(el => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    releaseSave();
    await page.locator('#announcement-admin-message-error').filter({ hasText: 'Pengumuman belum dapat disimpan' }).waitFor({ state: 'visible' });
    verify(inserts === 1, 'save double submit guard');
    verify(await page.locator('input[name="important"]').isChecked(), 'save failure retains important flag');
    verify(await page.locator('input[name="title"]').inputValue() === 'Pengumuman Baru Uji', 'save failure retains title');
    await page.locator('#announcement-admin-form button[type="submit"]').click();
    await page.locator('#announcement-admin-message-status').filter({ hasText: 'Pengumuman berhasil disimpan' }).waitFor({ state: 'visible' });
    verify(inserts === 2, 'save retry once');
    await page.getByText('2 pengumuman').waitFor();

    await page.locator('#announcement-admin-list article').filter({ hasText: 'Pengumuman Uji' }).getByRole('button', { name: 'Edit' }).click();
    verify(await page.locator('#announcement-form-title').textContent() === 'Edit pengumuman', 'edit mode');
    await page.locator('input[name="title"]').fill('Pengumuman Uji Diperbarui');
    await page.locator('#announcement-admin-form button[type="submit"]').click();
    await page.locator('#announcement-admin-list article').filter({ hasText: 'Pengumuman Uji Diperbarui' }).waitFor();
    verify(updates === 1, 'edit used PATCH');
    verify(existing.length === 2, 'edit did not insert third announcement');

    const card = page.locator('#announcement-admin-list article').filter({ hasText: 'Pengumuman Uji Diperbarui' });
    const remove = card.getByRole('button', { name: 'Hapus' });
    await remove.click();
    await page.waitForFunction(() => document.querySelector('#announcement-admin-list article button:disabled') !== null);
    verify(await card.getAttribute('aria-busy') === 'true', 'delete row busy');
    await card.getByRole('button', { name: /Menghapus/ }).evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    releaseDelete();
    await page.locator('#announcement-admin-message-error').filter({ hasText: 'Pengumuman belum dapat dihapus' }).waitFor({ state: 'visible' });
    verify(deletes === 1, 'delete double click guard');
    verify(await remove.isEnabled(), 'delete retry available');
    await remove.click();
    await page.locator('#announcement-admin-message-status').filter({ hasText: 'Pengumuman berhasil dihapus' }).waitFor({ state: 'visible' });
    verify(deletes === 2, 'delete retry once');
    verify(await card.count() === 0, 'removed row absent');
  } catch (e) { failures.push('write lifecycle: ' + e.message); }
  finally { releaseSave(); releaseDelete(); await page.close(); }
} finally { await browser.close(); }
await writeFile(output + '/report.json', JSON.stringify({ widths, failures }, null, 2));
if (failures.length) { console.error('Admin Announcement QA failed:\n' + failures.join('\n')); process.exitCode = 1; }
else console.log('Admin Announcement QA passed: 4 widths and save/edit/delete failure/retry scenarios.');
