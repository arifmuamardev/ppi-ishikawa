import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// Mocked test only: no production authentication, database writes, or real member data.
const baseURL = (process.env.MEMBER_FEEDBACK_BASE_URL || 'http://127.0.0.1:4321/ppi-ishikawa').replace(/\/$/, '');
const widths = [360, 390, 768, 1280];
const directory = 'member-feedback-audit';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const failures = [];
const results = [];
const id = '11111111-1111-4111-8111-111111111111';
const user = { id, aud: 'authenticated', role: 'authenticated', email: 'test@example.invalid', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const profile = {
  user_id: id, full_name: 'Pengguna Uji', campus_slug: null, program: 'Test Program',
  study_level: null, field_of_study: null, city: null, instagram: null,
  linkedin_url: null, bio: null, membership_status: 'active',
  verification_status: 'approved', role: 'member', directory_visible: false,
  show_instagram: false, show_linkedin: false, show_city: false,
  show_field_of_study: false, created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z'
};
const token = [
  Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'),
  Buffer.from(JSON.stringify({ sub: id, exp: 1893456000, aud: 'authenticated', role: 'authenticated' })).toString('base64url'),
  'mock-signature'
].join('.');
const session = {
  access_token: token, token_type: 'bearer', refresh_token: 'mock-refresh-token',
  expires_in: 315360000, expires_at: 1893456000, user
};
const record = (condition, label) => { if (!condition) failures.push(label); };

async function fixture(page, behavior = {}) {
  await page.addInitScript((session) => {
    // This is a fake test session placed only in a local test page.
    localStorage.setItem('sb-hdeepkpiacfjdrlydemc-auth-token', JSON.stringify(session));
  }, session);
  await page.route(/^https:\/\/[^/]+\.supabase\.co\//, async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    const method = request.method();
    let status = 200;
    let body;
    if (path === '/auth/v1/user') {
      body = user;
    } else if (path === '/rest/v1/profiles') {
      if (method === 'PATCH') {
        if (behavior.patch) {
          const override = await behavior.patch(request);
          status = override.status;
          body = override.body;
        } else body = profile;
      } else body = profile;
    } else {
      // Block all other Supabase network traffic.
      status = 404;
      body = { message: 'Mock route not configured: ' + path };
    }
    await route.fulfill({
      status,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' },
      body: JSON.stringify(body)
    });
  });
}

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 860 }, reducedMotion: 'reduce' });
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await fixture(page);
    try {
      const response = await page.goto(baseURL + '/member/profile/', { waitUntil: 'domcontentloaded' });
      await page.locator('#member-content').waitFor({ state: 'visible' });
      record(response?.status() === 200, width + ': HTTP success');
      record(await page.locator('#member-profile-form').getAttribute('aria-busy') === 'false', width + ': idle form');
      record(await page.locator('#profile-message-status').getAttribute('role') === 'status', width + ': status live region');
      record(await page.locator('#profile-message-error').getAttribute('role') === 'alert', width + ': alert live region');
      record(await page.locator('input[name="full_name"]').inputValue() === 'Pengguna Uji', width + ': account data loaded');
      record(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 2, width + ': no horizontal overflow');
      await page.screenshot({ path: directory + '/profile-' + width + '.jpg', fullPage: true, type: 'jpeg', quality: 62, animations: 'disabled' });
      if (width === 390) {
        await page.locator('[data-theme-toggle]').click();
        record(await page.locator('html').evaluate(el => el.classList.contains('dark')), 'dark mode toggle');
        record(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 2, 'dark mode no overflow');
        await page.screenshot({ path: directory + '/profile-dark-390.jpg', fullPage: true, type: 'jpeg', quality: 62, animations: 'disabled' });
      }
      record(!pageErrors.length, width + ': JS errors ' + pageErrors.join('; '));
      results.push({ width, pageErrors });
    } catch (error) {
      failures.push(width + ': ' + error.message);
    } finally {
      await page.close();
    }
  }

  // Realistic lifecycle with a deliberately held HTTP PATCH, then retry after failure.
  let releasePatch = () => {};
  const held = new Promise(resolve => { releasePatch = resolve; });
  let attempts = 0;
  const patches = [];
  const page = await browser.newPage({ viewport: { width: 390, height: 860 }, reducedMotion: 'reduce' });
  await fixture(page, {
    patch: async (request) => {
      attempts++;
      patches.push(request.postDataJSON());
      if (attempts === 1) {
        await held;
        return { status: 409, body: { message: 'Mock conflict', code: '23505' } };
      }
      return { status: 200, body: { ...profile, ...request.postDataJSON() } };
    }
  });
  try {
    await page.goto(baseURL + '/member/profile/', { waitUntil: 'domcontentloaded' });
    await page.locator('#member-content').waitFor({ state: 'visible' });
    await page.locator('input[name="full_name"]').fill('Pengguna Uji Revisi');
    await page.locator('input[name="directory_visible"]').check();
    await page.locator('#member-profile-form button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('#member-profile-form')?.getAttribute('aria-busy') === 'true');
    record(await page.locator('#member-profile-form button[type="submit"]').isDisabled(), 'pending: submit disabled');
    await page.locator('#member-profile-form').evaluate(el => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    releasePatch();
    await page.locator('#profile-message-error').filter({ hasText: 'Perubahan belum dapat disimpan' }).waitFor({ state: 'visible' });
    record(attempts === 1, 'pending: guarded from duplicate requests');
    record(await page.locator('#member-profile-form').getAttribute('aria-busy') === 'false', 'error: busy cleared');
    record(await page.locator('#member-profile-form button[type="submit"]').isEnabled(), 'error: retry unlocked');
    record(await page.locator('input[name="full_name"]').inputValue() === 'Pengguna Uji Revisi', 'error: retains unsaved values');
    record(await page.locator('input[name="directory_visible"]').isChecked(), 'error: retains privacy choice');
    await page.locator('#member-profile-form button[type="submit"]').click();
    await page.locator('#profile-message-status').filter({ hasText: 'Profil dan pengaturan privasi berhasil disimpan' }).waitFor({ state: 'visible' });
    record(attempts === 2, 'retry: exactly one second request');
    record(patches[1]?.directory_visible === true, 'retry: selected privacy flag sent to mock');
    record(await page.locator('#member-profile-form').getAttribute('data-auth-state') === 'success', 'success: final state');
    record(await page.locator('#profile-message-error').textContent() === '', 'success: stale error cleared');
  } catch (error) {
    failures.push('Save lifecycle: ' + error.message);
  } finally {
    releasePatch();
    await page.close();
  }
} finally {
  await browser.close();
}
await writeFile(directory + '/report.json', JSON.stringify({ widths, results, failures }, null, 2));
if (failures.length) {
  console.error('Member profile QA failed:\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Member profile QA passed: 4 widths + mocked delayed/error/retry/success lifecycle');
}
