import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// All HTTP requests to Supabase are intercepted; no real users or data.
const base = (process.env.MEMBER_FEEDBACK_BASE_URL || 'http://127.0.0.1:4321/ppi-ishikawa').replace(/\/$/, '');
const widths = [360, 390, 768, 1280];
const directory = 'member-interests-audit';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const failures = [];
const verify = (yes, msg) => { if (!yes) failures.push(msg); };
const id = '11111111-1111-4111-8111-111111111111';
const user = { id, aud: 'authenticated', role: 'authenticated', email: 'test@example.invalid', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const profile = { user_id: id, full_name: 'Pengguna Uji', membership_status: 'active', verification_status: 'approved', role: 'member' };
const jwt = [Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'), Buffer.from(JSON.stringify({ sub: id, exp: 1893456000, aud: 'authenticated' })).toString('base64url'), 'fake-test-only'].join('.');
const session = { access_token: jwt, token_type: 'bearer', refresh_token: 'fake-test', expires_in: 315360000, expires_at: 1893456000, user };

async function setup(page, hook) {
  await page.addInitScript((s) => localStorage.setItem('sb-hdeepkpiacfjdrlydemc-auth-token', JSON.stringify(s)), session);
  await page.route(/^https:\/\/[^/]+\.supabase\.co\//, async (route) => {
    const path = new URL(route.request().url()).pathname;
    const method = route.request().method();
    let result = { status: 200, body: {} };
    if (path === '/auth/v1/user') result.body = user;
    else if (path === '/rest/v1/profiles') result.body = profile;
    else if (path === '/rest/v1/member_preferences') {
      if (method === 'POST' && hook?.save) result = await hook.save(route.request());
      else result.body = { interests: [], skills: [], volunteer_available: false };
    } else result = { status: 404, body: { message: 'Unexpected mock URL: ' + path } };
    await route.fulfill({
      status: result.status,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' },
      body: JSON.stringify(result.body)
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
      const response = await page.goto(base + '/member/interests/', { waitUntil: 'domcontentloaded' });
      await page.locator('#member-content').waitFor({ state: 'visible' });
      verify(response?.status() === 200, width + ': route HTTP');
      verify(await page.locator('#interest-form').getAttribute('aria-busy') === 'false', width + ': idle busy');
      verify(await page.locator('#interest-message-status').getAttribute('role') === 'status', width + ': status region');
      verify(await page.locator('#interest-message-error').getAttribute('role') === 'alert', width + ': alert region');
      verify(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2), width + ': overflow');
      await page.screenshot({ path: directory + '/interests-' + width + '.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled' });
      if (width === 390) {
        await page.locator('[data-theme-toggle]').click();
        verify(await page.locator('html').evaluate(el => el.classList.contains('dark')), 'dark mode toggle');
        await page.screenshot({ path: directory + '/interests-dark-390.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled' });
      }
      verify(errors.length === 0, width + ': JS errors ' + errors.join('; '));
    } catch (error) { failures.push(width + ': ' + error.message); }
    finally { await page.close(); }
  }

  let release = () => {};
  const held = new Promise(resolve => { release = resolve; });
  let saves = 0;
  const payloads = [];
  const page = await browser.newPage({ viewport: { width: 390, height: 860 }, reducedMotion: 'reduce' });
  await setup(page, {
    save: async (request) => {
      saves++;
      payloads.push(request.postDataJSON());
      if (saves === 1) {
        await held;
        return { status: 409, body: { message: 'Mock failure', code: '23505' } };
      }
      return { status: 201, body: {} };
    }
  });
  try {
    await page.goto(base + '/member/interests/', { waitUntil: 'domcontentloaded' });
    await page.locator('#member-content').waitFor({ state: 'visible' });
    const interest = page.locator('input[name="interests"]').first();
    const skill = page.locator('input[name="skills"]').first();
    const volunteer = page.locator('input[name="volunteer_available"]');
    const chosenInterest = await interest.inputValue();
    const chosenSkill = await skill.inputValue();
    await interest.check();
    await skill.check();
    await volunteer.check();
    await page.locator('#interest-form button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('#interest-form')?.getAttribute('aria-busy') === 'true');
    verify(await page.locator('#interest-form button[type="submit"]').isDisabled(), 'pending: submit disabled');
    await page.locator('#interest-form').evaluate(el => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    release();
    await page.locator('#interest-message-error').filter({ hasText: 'Data belum dapat disimpan' }).waitFor({ state: 'visible' });
    verify(saves === 1, 'pending: no duplicate write');
    verify(await page.locator('#interest-form button[type="submit"]').isEnabled(), 'error: retry possible');
    verify(await interest.isChecked() && await skill.isChecked() && await volunteer.isChecked(), 'error: choices preserved');
    await page.locator('#interest-form button[type="submit"]').click();
    await page.locator('#interest-message-status').filter({ hasText: 'Minat, skills, dan preferensi volunteer berhasil disimpan' }).waitFor({ state: 'visible' });
    verify(saves === 2, 'success: exactly one retry');
    verify(payloads[1]?.interests?.includes(chosenInterest), 'payload: selected interest');
    verify(payloads[1]?.skills?.includes(chosenSkill), 'payload: selected skill');
    verify(payloads[1]?.volunteer_available === true, 'payload: volunteer opt-in preserved');
    verify(await page.locator('#interest-form').getAttribute('aria-busy') === 'false', 'success: no pending state');
    verify(await page.locator('#interest-message-error').textContent() === '', 'success: error cleared');
  } catch (error) { failures.push('save lifecycle: ' + error.message); }
  finally { release(); await page.close(); }
} finally { await browser.close(); }
await writeFile(directory + '/report.json', JSON.stringify({ widths, failures }, null, 2));
if (failures.length) { console.error('Interests QA failures:\n' + failures.join('\n')); process.exitCode = 1; }
else console.log('Interests/Skills feedback QA passed.');
