/**
 * PPI Ishikawa Feature Registry (static-site release configuration).
 *
 * enabled  = visible in feature-aware navigation and published.
 * hidden   = omitted from feature-aware navigation; direct URL still works.
 * disabled = removed from the generated site by scripts/apply-feature-gates.mjs.
 *
 * NOTE: These settings DO NOT grant/revoke permissions in Supabase.
 * Backend authorization and RLS must be maintained independently.
 *
 * Change a value, commit, and allow GitHub Actions to build/test/deploy.
 */
export const featureStates = Object.freeze({
  organization: 'enabled',
  campuses: 'enabled',
  survivalGuide: 'enabled',
  familyGuide: 'enabled',
  scholarships: 'enabled',
  career: 'enabled',
  places: 'enabled',
  community: 'enabled',
  programs: 'enabled',
  stories: 'enabled',
  instagram: 'enabled',
  membership: 'hidden', // Preserve current behavior: direct URL, no header button.
  memberEvents: 'enabled',
  memberCommunity: 'enabled',
  memberOrganization: 'enabled',
  memberGrowth: 'enabled',
  memberCards: 'enabled',
  memberCertificates: 'enabled',
  memberCertificateStudio: 'enabled',
  memberDocuments: 'enabled',
  memberAdministration: 'enabled',
  publicVerification: 'enabled',
  designLab: 'hidden',
});

export const FEATURE_MODES = Object.freeze(['enabled', 'hidden', 'disabled']);

// The order is significant: a nested module must take precedence over its parent.
// All paths are site-relative, with a final slash. External URLs are never gated.
const exact = (pathname, prefix) => pathname === prefix || pathname.startsWith(prefix);
const memberRoutes = [
  ['/member/admin/certificate-studio/', 'memberCertificateStudio'],
  ['/member/admin/studio-registry/', 'memberCertificateStudio'],
  ['/member/admin/', 'memberAdministration'],
  ['/member/events/', 'memberEvents'],
  ['/member/calendar/', 'memberEvents'],
  ['/member/checkin/', 'memberEvents'],
  ['/member/announcements/', 'memberCommunity'],
  ['/member/aspirations/', 'memberCommunity'],
  ['/member/interests/', 'memberCommunity'],
  ['/member/organization/', 'memberOrganization'],
  ['/member/programs/', 'memberOrganization'],
  ['/member/volunteer/', 'memberOrganization'],
  ['/member/opportunities/', 'memberGrowth'],
  ['/member/mentoring/', 'memberGrowth'],
  ['/member/alumni/', 'memberGrowth'],
  ['/member/stories/', 'memberGrowth'],
  ['/member/card/', 'memberCards'],
  ['/member/certificates/', 'memberCertificates'],
  ['/member/documents/', 'memberDocuments'],
];

export function sitePath(href) {
  if (typeof href !== 'string' || !href) return null;
  if (/^(?:https?:|mailto:|tel:|javascript:|\/\/)/i.test(href)) return null;
  if (href.startsWith('#')) return null;
  if (!href.startsWith('/')) return null;
  const pathname = href.split(/[?#]/, 1)[0];
  return pathname.endsWith('/') ? pathname : pathname + '/';
}

export function featureForPath(href) {
  const pathname = sitePath(href);
  if (!pathname) return null;

  if (exact(pathname, '/community/kampus/')) return 'campuses';
  if (exact(pathname, '/life-in-ishikawa/family-anak/') || exact(pathname, '/life-in-ishikawa/family/')) return 'familyGuide';
  if (exact(pathname, '/life-in-ishikawa/places/')) return 'places';
  if (exact(pathname, '/life-in-ishikawa/')) return 'survivalGuide';
  if (exact(pathname, '/beasiswa/')) return 'scholarships';
  if (exact(pathname, '/career/')) return 'career';
  if (exact(pathname, '/programs/')) return 'programs';
  if (exact(pathname, '/stories/')) return 'stories';
  if (exact(pathname, '/community/')) return 'community';
  if (exact(pathname, '/about/')) return 'organization';
  if (exact(pathname, '/design-lab/')) return 'designLab';
  if (exact(pathname, '/verify/')) return 'publicVerification';
  for (const [prefix, key] of memberRoutes) if (exact(pathname, prefix)) return key;
  if (exact(pathname, '/member/')) return 'membership';
  return null; // Public core routes are always available.
}

export function featureState(key, overrides = featureStates) {
  if (!key) return 'enabled';
  const state = overrides[key] ?? featureStates[key];
  if (!FEATURE_MODES.includes(state)) throw new Error(`Unknown feature state for ${key}: ${state}`);
  if (key === 'memberCertificateStudio' && featureState('memberAdministration', overrides) !== 'enabled')
    return featureState('memberAdministration', overrides);
  if (key.startsWith('member') && key !== 'membership' &&
      (overrides.membership ?? featureStates.membership) === 'disabled') return 'disabled';
  return state;
}

export function isAvailableHref(href, overrides = featureStates) {
  return featureState(featureForPath(href), overrides) !== 'disabled';
}

// Within the already-open member portal, child navigation remains available
// when the parent is merely hidden from the public header.
export function isDiscoverableHref(href, { withinMember = false, overrides = featureStates } = {}) {
  const key = featureForPath(href);
  if (!key) return true;
  if (withinMember && key.startsWith('member') && key !== 'membership')
    return featureState(key, overrides) === 'enabled' && featureState('membership', overrides) !== 'disabled';
  return featureState(key, overrides) === 'enabled'
    && (!key.startsWith('member') || featureState('membership', overrides) === 'enabled');
}

export function showFeature(key) {
  return featureState(key) === 'enabled';
}
