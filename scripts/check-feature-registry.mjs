import assert from 'node:assert/strict';
import { featureStates, featureForPath, featureState, isAvailableHref, isDiscoverableHref } from '../src/config/features.mjs';

const valid = new Set(['enabled', 'hidden', 'disabled']);
for (const [key, value] of Object.entries(featureStates))
  assert(valid.has(value), `Invalid state in ${key}`);

const routes = {
  '/': null,
  '/about/': 'organization',
  '/community/kampus/jaist/': 'campuses',
  '/community/': 'community',
  '/life-in-ishikawa/': 'survivalGuide',
  '/life-in-ishikawa/family-anak/': 'familyGuide',
  '/life-in-ishikawa/family/faq/': 'familyGuide',
  '/life-in-ishikawa/places/': 'places',
  '/beasiswa/': 'scholarships',
  '/career/': 'career',
  '/programs/#akademik': 'programs',
  '/stories/demo-story/': 'stories',
  '/design-lab/unnes-inspired/': 'designLab',
  '/member/': 'membership',
  '/member/login/': 'membership',
  '/member/admin/organization/': 'memberAdministration',
  '/member/admin/certificate-studio/': 'memberCertificateStudio',
  '/member/mentoring/': 'memberGrowth',
  '/member/events/': 'memberEvents',
  '/member/card/': 'memberCards',
  '/verify/member/': 'publicVerification',
  '/verify/certificate/?token=example': 'publicVerification',
};
for (const [url, expected] of Object.entries(routes))
  assert.equal(featureForPath(url), expected, `Route classification: ${url}`);

assert.equal(featureForPath('https://kanazawa-u.ac.jp/'), null);
assert.equal(featureState('membership'), 'hidden');
assert.equal(isAvailableHref('/member/'), true);
assert.equal(isDiscoverableHref('/member/'), false);
assert.equal(isDiscoverableHref('/member/events/', { withinMember: true }), true);
assert.equal(isDiscoverableHref('/member/events/'), false);

const flags = { ...featureStates, membership: 'disabled', stories: 'disabled', campuses: 'hidden' };
assert.equal(featureState('memberEvents', flags), 'disabled');
assert.equal(isAvailableHref('/member/admin/organization/', flags), false);
assert.equal(isAvailableHref('/member/admin/certificate-studio/', flags), false);
assert.equal(isAvailableHref('/stories/example/', flags), false);
assert.equal(isDiscoverableHref('/community/kampus/jaist/', { overrides: flags }), false);
assert.equal(isAvailableHref('/community/kampus/jaist/', flags), true);
assert.equal(isAvailableHref('/verify/member/', flags), true, 'Verification stays separate from the portal');
assert.equal(isAvailableHref('/member/admin/certificate-studio/', { ...featureStates, memberCertificateStudio: 'disabled' }), false);
assert.equal(isAvailableHref('/member/admin/certificate-studio/', { ...featureStates, memberAdministration: 'disabled' }), false);
console.log(`Feature registry OK: ${Object.keys(featureStates).length} modules, ${Object.keys(routes).length} routing fixtures.`);
