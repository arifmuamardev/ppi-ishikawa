import { chromium } from 'playwright';

// Browser-only acceptance using intercepted Supabase requests.
// No production users, emails or database records are ever touched.
const base = (process.env.AUTH_AUDIT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const failures = [];
const log = [];
const expect = (ok, message) => { if (!ok) failures.push(message); };
const userId = '00000000-0000-4000-8000-000000000222';
const now = Math.floor(Date.now() / 1000);

function profile(extra = {}) {
  return {
    user_id: userId, full_name: 'Anggota Pengujian', campus_slug: 'kanazawa-university',
    program: 'Information Science', study_level: 'master', field_of_study: 'AI',
    city: 'Kanazawa', bio: null, instagram: null, linkedin_url: null,
    directory_visible: false, show_instagram: false, show_linkedin: false,
    show_city: false, show_field_of_study: false,
    role: 'member', membership_status: 'incoming', verification_status: 'pending',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...extra,
  };
}

async function testPage(testName, width, userProfile, execute, pendingList = []) {
  const page = await browser.newPage({ viewport: { width, height: 860 }, reducedMotion: 'reduce' });
  const reviews = [];
  const updates = [];
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(({ id, expires }) => {
    const session = {
      access_token: 'mock-app-token', refresh_token: 'mock-refresh-token',
      token_type: 'bearer', expires_at: expires, expires_in: 3600,
      user: { id, aud: 'authenticated', email: 'audit@example.invalid', role: 'authenticated' },
    };
    localStorage.setItem('sb-hdeepkpiacfjdrlydemc-auth-token', JSON.stringify(session));
  }, { id: userId, expires: now + 3600 });

  await page.route(/^https:\/\/[^/]+\.supabase\.co\//, async route => {
    const url = new URL(route.request().url());
    const pathname = url.pathname;
    const method = route.request().method();
    const headers = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
    let status = 200;
    let body = {};
    if (pathname === '/auth/v1/user') {
      body = { id: userId, aud: 'authenticated', email: 'audit@example.invalid', role: 'authenticated', app_metadata: { provider: 'email' }, user_metadata: {} };
    } else if (pathname === '/rest/v1/profiles') {
      if (method === 'GET' && url.searchParams.get('verification_status')?.includes('pending')) {
        body = pendingList.filter(p => p.verification_status === 'pending' || p.verification_status === 'rejected');
      } else if (method === 'GET' && url.searchParams.get('verification_status')?.includes('in.')) {
        body = [...pendingList];
      } else if (method === 'PATCH') {
        const payload = route.request().postDataJSON();
        updates.push(payload);
        body = { ...userProfile, ...payload };
      } else {
        body = userProfile;
      }
    } else if (pathname === '/rest/v1/rpc/review_membership') {
      const payload = route.request().postDataJSON();
      reviews.push(payload);
      const item = pendingList.find(p => p.user_id === payload.target_user_id);
      if (item) item.verification_status = payload.decision;
      body = true;
    } else if (pathname === '/rest/v1/rpc/get_member_directory') {
      if (userProfile.verification_status !== 'approved') {
        status = 403; body = { message: 'Verified membership required', code: '42501' };
      } else body = [];
    } else {
      status = 403; body = { message: 'Network isolated for membership browser audit' };
    }
    await route.fulfill({ status, headers, contentType: 'application/json', body: JSON.stringify(body) });
  });

  try {
    await execute(page, { reviews, updates, pendingList });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow <= 2, testName + ': responsive overflow at ' + width);
    expect(errors.length === 0, testName + ': no JS errors (' + errors.join(', ') + ')');
    log.push({ testName, width, reviews: reviews.length, updates: updates.length, errors: errors.length });
  } catch(e) {
    failures.push(testName + ': ' + e.message);
  } finally { await page.close(); }
}

try {
  await testPage('pending member has dashboard but no approved directory', 390, profile(), async (page) => {
    await page.goto(base + '/member/directory/', { waitUntil: 'domcontentloaded' });
    await page.waitForURL(url => url.pathname === '/member/', { timeout: 15000 });
    await page.locator('#verification-title').filter({ hasText: 'Menunggu verifikasi pengurus' }).waitFor({ timeout: 15000 });
    expect(await page.locator('#member-content').isVisible(), 'pending: dashboard visible');
  });

  await testPage('approved member may load directory', 390, profile({ verification_status:'approved', membership_status:'active' }), async (page) => {
    await page.goto(base + '/member/directory/', { waitUntil:'domcontentloaded' });
    await page.locator('#directory-count').filter({ hasText:'0 anggota' }).waitFor({timeout:15000});
    expect(page.url().includes('/member/directory/'), 'approved: remains at directory');
  });

  await testPage('inactive member cannot open directory', 390, profile({ verification_status:'approved', membership_status:'inactive' }), async (page) => {
    await page.goto(base + '/member/directory/', { waitUntil:'domcontentloaded' });
    await page.waitForURL(url => url.pathname === '/member/', { timeout:15000 });
    expect(page.url().includes('/member/'), 'inactive: returned to dashboard');
  });

  const pending = [
    { ...profile({user_id:'00000000-0000-4000-8000-000000000223',full_name:'Calon Anggota Pertama',verification_status:'pending'}) },
    { ...profile({user_id:'00000000-0000-4000-8000-000000000224',full_name:'Perlu Perbaikan',verification_status:'rejected'}) },
  ];
  await testPage('admin can approve both pending and follow-up applicants', 390,
    profile({ role:'admin', verification_status:'approved',membership_status:'active' }),
    async (page,{reviews})=>{
      page.on('dialog', dialog => dialog.accept());
      await page.goto(base + '/member/admin/verification/', { waitUntil:'domcontentloaded' });
      await page.locator('#verification-admin-count').filter({hasText:'1 menunggu · 1 tindak lanjut'}).waitFor({timeout:15000});
      expect(await page.locator('#verification-admin-list article').count() === 2, 'admin: both pending and rejected shown');
      const followup = page.locator('#verification-admin-list article').filter({hasText:'Perlu Perbaikan'});
      expect(await followup.getByRole('button',{name:'Tindak lanjut'}).count()===0,'admin: rejected applicant not rejected repeatedly');
      await followup.getByRole('button',{name:'Setujui'}).click();
      await page.locator('#verification-admin-count').filter({hasText:'1 menunggu · 0 tindak lanjut'}).waitFor({timeout:15000});
      expect(reviews.length===1&&reviews[0].decision==='approved','admin: follow-up approved via server RPC');
    }, pending);

  await testPage('non-admin cannot view approval queue', 390, profile(), async page=>{
    await page.goto(base+'/member/admin/verification/',{waitUntil:'domcontentloaded'});
    await page.waitForURL(url=>url.pathname==='/member/',{timeout:15000});
    expect(page.url().includes('/member/'),'non-admin: redirected from admin');
  });
} finally { await browser.close(); }

if(failures.length){console.error('Membership launch audit failed:\n'+failures.join('\n'));process.exitCode=1;}
else console.log('Membership launch browser audit OK: '+log.length+' isolated cases; no real account or email requests.');
