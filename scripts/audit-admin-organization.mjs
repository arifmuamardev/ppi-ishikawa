import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// No production credentials: every Supabase HTTP request is intercepted.
const base = (process.env.ADMIN_AUDIT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const output = 'admin-organization-audit';
const widths = [360, 390, 768, 1280];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const errors = [];
function check(ok, why) { if (!ok) errors.push(why); }
const uid = '11111111-1111-4111-8111-111111111111';
const termId = '22222222-2222-4222-8222-222222222222';
const unitId = '33333333-3333-4333-8333-333333333333';
const positionId = '44444444-4444-4444-8444-444444444444';
const assignmentId = '55555555-5555-4555-8555-555555555555';
const user = { id: uid, aud: 'authenticated', role: 'authenticated', email: 'admin@example.invalid', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const profile = { user_id: uid, full_name: 'Pengurus Uji', role: 'admin', verification_status: 'approved', membership_status: 'active' };
const jwt = [Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'), Buffer.from(JSON.stringify({ sub: uid, exp: 1893456000, aud: 'authenticated' })).toString('base64url'), 'mock-signature'].join('.');
const session = { access_token: jwt, refresh_token: 'mock-refresh', token_type: 'bearer', expires_in: 315360000, expires_at: 1893456000, user };

function fixture() {
  return {
    terms: [{ id: termId, label: '2026/2027', starts_on: '2026-10-01', ends_on: '2027-09-30', is_current: true }],
    units: [{ id: unitId, term_id: termId, name: 'Akademik', slug: 'akademik', unit_type: 'department', description: '', sort_order: 1 }],
    positions: [{ id: positionId, term_id: termId, unit_id: unitId, title: 'Koordinator', slug: 'koordinator', sort_order: 1 }],
    members: [{ user_id: uid, full_name: 'Pengurus Uji' }],
    assignments: [{ id: assignmentId, term_id: termId, user_id: uid, position_id: positionId, can_manage: false }],
    pending: {},
    attempts: {},
    payloads: {}
  };
}
async function mock(page, state) {
  await page.addInitScript((s) => localStorage.setItem('sb-hdeepkpiacfjdrlydemc-auth-token', JSON.stringify(s)), session);
  await page.route(/^https:\/\/[^/]+\.supabase\.co\//, async route => {
    const request = route.request();
    const uri = new URL(request.url());
    const table = uri.pathname.replace('/rest/v1/', '');
    const method = request.method();
    let status = 200;
    let body = {};
    if (uri.pathname === '/auth/v1/user') body = user;
    else if (table === 'profiles') body = uri.searchParams.has('verification_status') ? state.members : profile;
    else if (table.startsWith('organization_')) {
      const key = table.slice('organization_'.length);
      if (!['terms', 'units', 'positions', 'assignments'].includes(key)) {
        status = 404; body = { message: 'Unexpected table ' + table };
      } else if (method === 'GET') {
        body = state[key];
      } else {
        const id = key + ':' + method;
        state.attempts[id] = (state.attempts[id] || 0) + 1;
        (state.payloads[id] ||= []).push(request.postDataJSON?.() || null);
        const controlled = state.pending[id];
        if (controlled && state.attempts[id] === 1) {
          await controlled;
          status = 409;
          body = { code: '23505', message: 'Synthetic retry case' };
        } else if (method === 'DELETE') {
          state.assignments = state.assignments.filter(item => item.id !== assignmentId);
          body = {};
        } else if (method === 'POST') {
          const rows = request.postDataJSON();
          const payload = Array.isArray(rows) ? rows[0] : rows;
          const newItem = { id: '99999999-9999-4999-8999-999999999999', ...payload };
          state[key] = [...state[key], newItem];
          status = 201;
          body = newItem;
        } else if (method === 'PATCH' && key === 'terms') {
          state.terms = state.terms.map(item => ({ ...item, is_current: false }));
          body = state.terms;
        } else {
          status = 400;
          body = { message: 'Unexpected PATCH' };
        }
      }
    } else {
      status = 404; body = { message: 'Unmocked endpoint: ' + uri.pathname };
    }
    await route.fulfill({
      status, contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' },
      body: JSON.stringify(body)
    });
  });
}

async function pageReady(page) {
  await page.goto(base + '/member/admin/organization/', { waitUntil: 'domcontentloaded' });
  await page.locator('#member-content').waitFor({ state: 'visible' });
  await page.getByText('1 penugasan').waitFor({ timeout: 20000 });
}

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 860 }, reducedMotion: 'reduce' });
    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(e.message));
    const state = fixture();
    await mock(page, state);
    try {
      await pageReady(page);
      check(await page.locator('#term-selector').inputValue() === termId, width + ': selected current term');
      for (const [formId, feedbackId] of [
        ['term-form', 'org-term-message'], ['unit-form', 'org-unit-message'],
        ['position-form', 'org-position-message'], ['assignment-form', 'org-assignment-message']
      ]) {
        check(await page.locator('#' + formId).getAttribute('aria-busy') === 'false', width + ': idle ' + formId);
        check(await page.locator('#' + feedbackId + '-status').getAttribute('role') === 'status', width + ': status ' + formId);
        check(await page.locator('#' + feedbackId + '-error').getAttribute('role') === 'alert', width + ': alert ' + formId);
      }
      check(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2), width + ': horizontal overflow');
      await page.screenshot({ path: output + '/organization-' + width + '.jpg', type: 'jpeg', quality: 58, fullPage: true, animations: 'disabled' });
      if (width === 390) {
        await page.locator('[data-theme-toggle]').click();
        check(await page.locator('html').evaluate(el => el.classList.contains('dark')), 'dark mode toggle');
        await page.screenshot({ path: output + '/organization-dark-390.jpg', type: 'jpeg', quality: 58, fullPage: true, animations: 'disabled' });
      }
      check(pageErrors.length === 0, width + ': runtime error ' + pageErrors.join(', '));
    } catch (e) { errors.push(width + ': ' + e.message); }
    finally { await page.close(); }
  }

  // Each of the four independent forms: first request held, fails; second succeeds.
  for (const target of [
    { form: 'term-form', key: 'terms:POST', feedback: 'org-term-message', field: 'label', value: '2027/2028', fill: async page => {
      await page.locator('#term-form input[name="starts_on"]').fill('2027-10-01');
      await page.locator('#term-form input[name="ends_on"]').fill('2028-09-30');
      await page.locator('#term-form input[name="is_current"]').check();
    }},
    { form: 'unit-form', key: 'units:POST', feedback: 'org-unit-message', field: 'name', value: 'Riset', fill: async page => {
      await page.locator('#unit-form input[name="slug"]').fill('riset');
    }},
    { form: 'position-form', key: 'positions:POST', feedback: 'org-position-message', field: 'title', value: 'PIC Riset', fill: async page => {
      await page.locator('#position-form input[name="slug"]').fill('pic-riset');
    }},
    { form: 'assignment-form', key: 'assignments:POST', feedback: 'org-assignment-message', field: null, value: null, fill: async page => {
      await page.locator('#assignment-form input[name="can_manage"]').check();
    }}
  ]) {
    const state = fixture();
    let release = () => {};
    state.pending[target.key] = new Promise(resolve => { release = resolve; });
    const page = await browser.newPage({ viewport: { width: 390, height: 860 }, reducedMotion: 'reduce' });
    await mock(page, state);
    try {
      await pageReady(page);
      if (target.field) await page.locator('#' + target.form + ' [name="' + target.field + '"]').fill(target.value);
      await target.fill(page);
      await page.locator('#' + target.form + ' button[type="submit"]').click();
      await page.waitForFunction(id => document.getElementById(id)?.getAttribute('aria-busy') === 'true', target.form);
      check(await page.locator('#term-selector').isDisabled(), target.form + ': context selector disabled');
      check(await page.locator('#' + target.form + ' button[type="submit"]').isDisabled(), target.form + ': submit disabled');
      await page.locator('#' + target.form).evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
      release();
      await page.locator('#' + target.feedback + '-error').filter({ hasText: 'belum dapat' }).waitFor({ state: 'visible' });
      check(state.attempts[target.key] === 1, target.form + ': duplicate request blocked');
      check(await page.locator('#' + target.form + ' button[type="submit"]').isEnabled(), target.form + ': retry available');
      if (target.field) check(await page.locator('#' + target.form + ' [name="' + target.field + '"]').inputValue() === target.value, target.form + ': values retained');
      if (target.form === 'assignment-form') check(await page.locator('#assignment-form input[name="can_manage"]').isChecked(), target.form + ': opt-in retained');
      await page.locator('#' + target.form + ' button[type="submit"]').click();
      await page.locator('#' + target.feedback + '-status').filter({ hasText: 'berhasil' }).waitFor({ state: 'visible' });
      check(state.attempts[target.key] === 2, target.form + ': exactly one retry');
      if (target.form === 'term-form') {
        check(await page.locator('#term-selector').inputValue() === '99999999-9999-4999-8999-999999999999', 'new active term selected for context');
      }
      check(await page.locator('#' + target.form).getAttribute('aria-busy') === 'false', target.form + ': loading cleared');
    } catch (e) { errors.push(target.form + ' lifecycle: ' + e.message); }
    finally { release(); await page.close(); }
  }

  // End date invalid: link error to the affected field; correct it without issuing a request.
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
    const state = fixture();
    await mock(page, state);
    try {
      await pageReady(page);
      await page.locator('#term-form input[name="label"]').fill('Invalid term');
      await page.locator('#term-form input[name="starts_on"]').fill('2027-10-01');
      await page.locator('#term-form input[name="ends_on"]').fill('2027-09-30');
      await page.locator('#term-form button[type="submit"]').click();
      check(await page.locator('#term-form input[name="ends_on"]').getAttribute('aria-invalid') === 'true', 'date field invalid');
      check(!(state.attempts['terms:POST']), 'date invalid prevents write');
      await page.locator('#term-form input[name="ends_on"]').fill('2028-09-30');
      check(await page.locator('#term-form input[name="ends_on"]').getAttribute('aria-invalid') === null, 'invalid flag cleared');
    } catch (e) { errors.push('date validation: ' + e.message); }
    finally { await page.close(); }
  }

  // Delete assignment: explicit confirmation plus held request and retry.
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
    const state = fixture();
    let release = () => {};
    state.pending['assignments:DELETE'] = new Promise(resolve => { release = resolve; });
    let dialogs = 0;
    page.on('dialog', d => { dialogs++; d.accept(); });
    await mock(page, state);
    try {
      await pageReady(page);
      const remove = page.locator('#assignment-list button[data-remove-assignment]').first();
      await remove.click();
      await page.waitForFunction(() => document.querySelector('#assignment-list article[aria-busy="true"]') !== null);
      check(await remove.isDisabled(), 'delete locked');
      await remove.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
      release();
      await page.locator('#org-admin-message-error').filter({ hasText: 'Penugasan belum dapat dihapus' }).waitFor({ state: 'visible' });
      check(state.attempts['assignments:DELETE'] === 1, 'delete duplicate blocked');
      check(await remove.isEnabled(), 'delete retry enabled');
      await remove.click();
      await page.locator('#org-admin-message-status').filter({ hasText: 'Penugasan berhasil dihapus' }).waitFor({ state: 'visible' });
      check(state.attempts['assignments:DELETE'] === 2, 'delete retry once');
      check(dialogs === 2, 'confirmation before each delete');
      check(await page.locator('#assignment-empty').isVisible(), 'empty state after delete');
    } catch (e) { errors.push('delete lifecycle: ' + e.message); }
    finally { release(); await page.close(); }
  }
} finally { await browser.close(); }

await writeFile(output + '/report.json', JSON.stringify({ widths, errors }, null, 2));
if (errors.length) { console.error('Organization audit failed:\n' + errors.join('\n')); process.exitCode = 1; }
else console.log('Organization audit passed: 4 viewports, four forms, duplicate guards, retry and confirmed delete.');
