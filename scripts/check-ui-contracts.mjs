import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const errors = [];
let assertions = 0;

const read = (relativePath) =>
  readFile(path.join(root, relativePath), 'utf8');

const requireText = (relativePath, source, needle, reason) => {
  assertions += 1;
  if (!source.includes(needle)) {
    errors.push(`${relativePath}: expected ${reason} (${needle})`);
  }
};

const forbidText = (relativePath, source, needle, reason) => {
  assertions += 1;
  if (source.includes(needle)) {
    errors.push(`${relativePath}: ${reason} (${needle})`);
  }
};

const checkFile = async (relativePath, { required = [], forbidden = [] } = {}) => {
  const source = await read(relativePath);
  for (const [needle, reason] of required) requireText(relativePath, source, needle, reason);
  for (const [needle, reason] of forbidden) forbidText(relativePath, source, needle, reason);
  return source;
};

const walk = async (relativeDir) => {
  const dir = path.join(root, relativeDir);
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relative = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(relative));
    else files.push(relative.replaceAll('\\', '/'));
  }

  return files;
};

const survivalGuides = [
  'src/pages/life-in-ishikawa/sebelum-berangkat.astro',
  'src/pages/life-in-ishikawa/hari-pertama.astro',
  'src/pages/life-in-ishikawa/administrasi.astro',
  'src/pages/life-in-ishikawa/tempat-tinggal.astro',
  'src/pages/life-in-ishikawa/kehidupan-sehari-hari.astro',
  'src/pages/life-in-ishikawa/transportasi.astro',
  'src/pages/life-in-ishikawa/kesehatan.astro',
  'src/pages/life-in-ishikawa/bank-money.astro',
  'src/pages/life-in-ishikawa/disaster-emergency.astro',
  'src/pages/life-in-ishikawa/winter.astro',
  'src/pages/life-in-ishikawa/japanese-support.astro',
  'src/pages/life-in-ishikawa/leaving.astro',
];

const landingPages = [
  'src/pages/life-in-ishikawa.astro',
  'src/pages/community.astro',
  'src/pages/about.astro',
  'src/pages/programs.astro',
  'src/pages/contact.astro',
];

const nestedLandingPages = [
  'src/pages/community/kampus/index.astro',
  'src/pages/life-in-ishikawa/family-anak.astro',
];

const finderPages = [
  'src/pages/beasiswa.astro',
  'src/pages/career.astro',
  'src/pages/life-in-ishikawa/places.astro',
  'src/pages/life-in-ishikawa/municipality-guides.astro',
  'src/pages/life-in-ishikawa/family/aktivitas.astro',
  'src/pages/life-in-ishikawa/family/municipality.astro',
  'src/pages/resources.astro',
  'src/pages/stories.astro',
];

const campusGuides = [
  'src/pages/community/kampus/kanazawa-university.astro',
  'src/pages/community/kampus/jaist.astro',
  'src/pages/community/kampus/kanazawa-institute-of-technology.astro',
  'src/pages/community/kampus/ishikawa-prefectural-university.astro',
  'src/pages/community/kampus/kinjo-university.astro',
  'src/pages/community/kampus/alice-gakuen.astro',
];

const familyGuidePageRoutes = [
  ['src/pages/life-in-ishikawa/family/datang-bersama-keluarga.astro', 'F01'],
  ['src/pages/life-in-ishikawa/family/kehamilan-kelahiran.astro', 'F02'],
  ['src/pages/life-in-ishikawa/family/childcare.astro', 'F03'],
  ['src/pages/life-in-ishikawa/family/sekolah-anak.astro', 'F04'],
  ['src/pages/life-in-ishikawa/family/benefit-kesehatan.astro', 'F05'],
  ['src/pages/life-in-ishikawa/family/faq.astro', 'F07'],
];

const directFamilyGuides = [
  'src/pages/life-in-ishikawa/family/timeline.astro',
  'src/pages/life-in-ishikawa/family/starter-pack.astro',
];

const authPages = [
  'src/pages/member/login.astro',
  'src/pages/member/register.astro',
  'src/pages/member/forgot-password.astro',
  'src/pages/member/reset-password.astro',
];

const verificationPages = [
  'src/pages/verify/member.astro',
  'src/pages/verify/certificate.astro',
];

for (const relativePath of survivalGuides) {
  await checkFile(relativePath, {
    required: [
      ['<GuideHeader', 'shared GuideHeader'],
      ['<GuideToc', 'guide table of contents'],
      ['<OfficialSources', 'shared official-source block'],
      ['<GuidePager', 'linear guide pager'],
    ],
    forbidden: [
      ['<RelatedLinks', 'linear Survival Guide must not also render RelatedLinks'],
      ['<Breadcrumbs', 'breadcrumb belongs inside GuideHeader'],
      ['<GuideMeta', 'metadata belongs inside GuideHeader'],
    ],
  });
}

for (const relativePath of landingPages) {
  await checkFile(relativePath, {
    required: [['<LandingHeader', 'shared LandingHeader']],
    forbidden: [
      ['<PageIntro', 'legacy PageIntro must not return'],
      ['<GuideMeta', 'Landing must not use GuideMeta'],
      ['<GuidePager', 'Landing must not use a guide pager'],
    ],
  });
}

for (const relativePath of nestedLandingPages) {
  await checkFile(relativePath, {
    required: [['<NestedLandingHeader', 'shared NestedLandingHeader']],
    forbidden: [
      ['<PageIntro', 'legacy PageIntro must not return'],
      ['<GuideMeta', 'Nested Landing must not use GuideMeta'],
      ['<GuidePager', 'Nested Landing must not use a guide pager'],
      ['<RelatedLinks', 'child destinations already provide next-step navigation'],
    ],
  });
}

for (const relativePath of finderPages) {
  await checkFile(relativePath, {
    required: [['<FinderHeader', 'shared FinderHeader']],
    forbidden: [
      ['<PageIntro', 'legacy PageIntro must not return'],
      ['<GuideMeta', 'Finder must not use GuideMeta'],
      ['<GuidePager', 'Finder must not use a guide pager'],
      ['<RelatedLinks', 'Finder task must not append generic RelatedLinks'],
    ],
  });
}

for (const relativePath of campusGuides) {
  await checkFile(relativePath, {
    required: [['<CampusGuideHeader', 'shared CampusGuideHeader']],
    forbidden: [['<Breadcrumbs', 'campus breadcrumb belongs inside CampusGuideHeader']],
  });
}

for (const [relativePath, code] of familyGuidePageRoutes) {
  await checkFile(relativePath, {
    required: [
      ['<FamilyGuidePage', 'shared FamilyGuidePage'],
      [`code="${code}"`, `Family guide code ${code}`],
    ],
    forbidden: [['kicker=', 'legacy Family guide kicker prop must not return']],
  });
}

for (const relativePath of directFamilyGuides) {
  await checkFile(relativePath, {
    required: [
      ['<FamilyGuideHeader', 'shared FamilyGuideHeader'],
      ['<GuideToc', 'Family reference TOC'],
      ['<OfficialSources', 'shared official-source block'],
    ],
    forbidden: [
      ['<Breadcrumbs', 'breadcrumb belongs inside FamilyGuideHeader'],
      ['label: \'Family\'', 'breadcrumb label must be Keluarga'],
    ],
  });
}

for (const relativePath of authPages) {
  await checkFile(relativePath, {
    required: [['<AuthShell', 'shared AuthShell']],
  });
}

for (const relativePath of verificationPages) {
  await checkFile(relativePath, {
    required: [['<VerificationShell', 'shared VerificationShell']],
    forbidden: [
      ['rounded-[2rem]', 'verification pages must use the shared standard-radius shell'],
      ['text-sm font-bold uppercase tracking-[0.16em] text-brand', 'verification header belongs inside VerificationShell'],
    ],
  });
}

// Supporting sections use the semantic layout rhythm. Main tasks remain
// closest to Page Intro; do not force major padding before primary actions.
for (const id of ['arah', 'nilai', 'cara-kerja', 'struktur-organisasi']) {
  requireText(
    'src/pages/about.astro',
    await read('src/pages/about.astro'),
    'id="' + id + '" class="scroll-mt-24 mx-auto max-w-7xl px-5 ui-section-space-compact',
    'shared compact spacing for About supporting sections'
  );
}
const communityLayout = await read('src/pages/community.astro');
assertions += 1;
if ((communityLayout.match(/ui-section-space lg:px-8/g) || []).length !== 2) {
  errors.push('src/pages/community.astro: two supporting sections should use shared normal spacing');
}

// Featured narrative and contact CTA panels must share the same accent surface
// and remain distinct from navigation, result, and advisory roles.
for (const relativePath of ['src/pages/about.astro', 'src/pages/community.astro']) {
  await checkFile(relativePath, {
    required: [['<HighlightPanel>', 'shared accent highlight panel']],
    forbidden: [['class="rounded-[2rem] border border-accent/35 bg-accent/10', 'duplicate highlight panel styling']],
  });
}
await checkFile('src/components/HighlightPanel.astro', {
  required: [
    ['data-ui-panel="highlight"', 'semantic panel test hook'],
    ['rounded-[2rem] border border-accent/35 bg-accent/10', 'shared accent visual style'],
    ['<slot />', 'slot preserves narrative content'],
  ],
});

// Navigation cards are a single cross-route role, separate from results and
// informational panels. Protect the shared implementation and its consumers.
for (const relativePath of ['src/pages/about.astro', 'src/pages/community.astro']) {
  await checkFile(relativePath, {
    required: [['<NavigationCard', 'navigation destinations use shared NavigationCard']],
    forbidden: [['class="group rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-accent/35 hover:bg-accent/5"', 'deprecated inline navigation card surface']],
  });
}
await checkFile('src/components/NavigationCard.astro', {
  required: [
    ['data-ui-card="navigation"', 'stable navigation-card test hook'],
    ['type-card-title', 'shared compact title scale'],
    ['hover:border-accent/35', 'shared navigation interaction'],
    ["withBase(href)", 'internal destinations respect deployment base path'],
  ],
});

// For task-first Landing pages, photography remains contextual and must not
// precede the primary destination choices users came to find.
for (const [relativePath, choiceMarker] of [
  ['src/pages/life-in-ishikawa.astro', 'journeys.map'],
  ['src/pages/community.astro', 'communityPaths.map'],
]) {
  const source = await read(relativePath);
  const header = source.indexOf('<LandingHeader');
  const choices = source.indexOf(choiceMarker, header);
  const photo = source.indexOf('<figure', header);
  assertions += 1;
  if (header < 0 || choices < 0 || photo < 0 || choices > photo) {
    errors.push(relativePath + ': Landing must show primary destination choices before supporting photography');
  }
}

// Landing and Finder share one visual geometry; wrappers may supply route-specific data
// but must not independently duplicate title, intro or section layout markup.
for (const relativePath of ['src/components/LandingHeader.astro', 'src/components/FinderHeader.astro']) {
  await checkFile(relativePath, {
    required: [['<PublicPageHeader', 'canonical public Page Intro shell']],
    forbidden: [
      ['<section', 'wrapper must not own independent Page Intro layout'],
      ['<h1', 'wrapper must not duplicate the canonical h1'],
    ],
  });
}
await checkFile('src/components/PublicPageHeader.astro', {
  required: [
    ['<h1', 'shared primary heading'],
    ['type-display', 'standard display typography'],
    ['type-lead', 'standard lead typography'],
    ['max-w-7xl', 'standard public page content width'],
  ],
});

// Finder archetype: controls are the first primary task after Page Intro.
// Optional shortcuts/section navigation follow controls, not the full result list.
for (const [relativePath, sectionId, resultId, secondary] of [
  ['src/pages/beasiswa.astro', 'finder', 'scholarship-grid', 'Pintasan pencarian beasiswa'],
  ['src/pages/career.astro', 'sources', 'career-grid', 'Navigasi Karier'],
]) {
  const source = await read(relativePath);
  const start = source.indexOf('id="' + sectionId + '"');
  const controls = source.indexOf('<FinderControls', start);
  const controlsEnd = source.indexOf('</FinderControls>', controls);
  const result = source.indexOf('id="' + resultId + '"', start);
  const next = source.indexOf(secondary, start);
  assertions += 1;
  if ([start, controls, controlsEnd, next, result].some((point) => point < 0)
      || !(start < controls && controls < controlsEnd && controlsEnd < next && next < result)) {
    errors.push(relativePath + ': Finder must show shared controls, secondary navigation, and results in that order');
  }
}

// Finder result density must be progressive, without truncating the dataset
// or applying filtering only to the initially rendered cards.
await checkFile('src/pages/beasiswa.astro', {
  required: [
    ['id="scholarship-show-more"', 'accessible progressive result action'],
    ['aria-controls="scholarship-grid"', 'show-more button controls the result grid'],
    ['const PAGE_SIZE = 4', 'bounded initial result density'],
    ['let matched = 0', 'count of all matching scholarship records'],
    ['visibleLimit += PAGE_SIZE', 'users can reveal remaining matching records'],
    ['apply(true)', 'filters reset the number of visible results'],
  ],
});

// Major section headings must use the semantic responsive type scale,
// not ad-hoc text-3xl styles that diverge across primary navigation pages.
for (const relativePath of [
  'src/pages/community/kampus/index.astro',
  'src/pages/beasiswa.astro',
  'src/pages/career.astro',
]) {
  await checkFile(relativePath, {
    required: [['type-section', 'semantic section-heading typography']],
    forbidden: [['text-3xl font-bold tracking-tight', 'use type-section for major headings']],
  });
}

forbidText(
  'src/pages/community/kampus/index.astro',
  await read('src/pages/community/kampus/index.astro'),
  'eyebrow="Kampus"',
  'a level-1 page eyebrow must not duplicate the page title'
);

// A nested route can still be a top-level menu destination.
// Keep the nested Landing shell based on navigation semantics, not URL depth.
await checkFile('src/components/NestedLandingHeader.astro', {
  required: [
    ['<PublicPageHeader', 'nested landings share the common Page Intro geometry'],
    ['isPrimaryNavigation', 'top-level menu destinations override URL nesting'],
    ['nav.some', 'primary menu is the source of truth'],
  ],
  forbidden: [
    ['<Breadcrumbs', 'breadcrumb rendering belongs in PublicPageHeader'],
    ['<h1', 'heading rendering belongs in PublicPageHeader'],
  ],
});

const legacyControlSignatures = [
  'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900',
  'mt-2 w-full rounded-xl border border-slate-300 px-4 py-3',
  'mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800',
  'rounded-xl bg-brand px-6 py-3 font-bold text-white',
  'min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700',
  'class="mt-1 size-4"',
];

const pageFiles = (await walk('src/pages')).filter((file) => file.endsWith('.astro'));

for (const relativePath of pageFiles) {
  const source = await read(relativePath);

  assertions += 1;
  if (source.includes('<RelatedLinks') && source.includes('<GuidePager')) {
    errors.push(`${relativePath}: RelatedLinks and GuidePager must not appear together`);
  }

  assertions += 1;
  if ((source.includes('<BaseLayout') || source.includes('<MemberLayout')) && source.includes('<main')) {
    errors.push(`${relativePath}: nested <main> detected; layout already owns the main landmark`);
  }

  assertions += 1;
  if (source.includes('<PageIntro')) {
    errors.push(`${relativePath}: legacy PageIntro usage is not allowed`);
  }

  for (const signature of legacyControlSignatures) {
    assertions += 1;
    if (source.includes(signature)) {
      errors.push(`${relativePath}: legacy form-control signature must use semantic ui-field/ui-action/ui-check classes (${signature})`);
    }
  }

  if (relativePath.startsWith('src/pages/member/') && source.includes('<MemberLayout')) {
    const isDashboard = relativePath === 'src/pages/member/index.astro';
    if (!isDashboard) {
      assertions += 1;
      if (!source.includes('<AppPageHeader')) {
        errors.push(`${relativePath}: Member/Admin task page must use AppPageHeader`);
      }
    }
  }
}

const sourceFiles = (await walk('src')).filter((file) => /\.(astro|ts|js|mjs)$/.test(file));
const forbiddenVisiblePhrases = [
  'Family Hub',
  'Campus Hub',
  'Career Hub',
  'Scholarship Hub',
  'Campus Pack',
];

for (const relativePath of sourceFiles) {
  const source = await read(relativePath);
  for (const phrase of forbiddenVisiblePhrases) {
    assertions += 1;
    if (source.includes(phrase)) {
      errors.push(`${relativePath}: legacy user-facing phrase must not return: "${phrase}"`);
    }
  }
}

// Govern public destinations in the global navigation. This deliberately checks
// the existing route-family contracts, not subjective visual composition.
// NestedLandingHeader on Kampus is a documented temporary exception; its
// navigation LEVEL is still top-level (see Design System Governance).
const siteNavigation = await read('src/data/site.ts');
const navList = siteNavigation.match(/export const nav\s*=\s*\[([\s\S]*?)\];/);
assertions += 1;
if (!navList) {
  errors.push('src/data/site.ts: expected parseable primary navigation array');
} else {
  const destinations = [
    ...navList[1].matchAll(/\{\s*label:\s*'([^']+)'\s*,\s*href:\s*'([^']+)'\s*\}/g)
  ].map((match) => ({ label: match[1], href: match[2] }));
  assertions += 1;
  if (destinations.length === 0) errors.push('src/data/site.ts: primary menu must not be empty');

  const pagePaths = new Set(pageFiles);
  const visualAudit = await read('scripts/audit-responsive.mjs');
  const checkedHrefs = new Set();
  const checkedLabels = new Set();
  const headerTypes = ['LandingHeader', 'NestedLandingHeader', 'FinderHeader'];

  for (const { label, href } of destinations) {
    assertions += 1;
    if (!href.startsWith('/') || href === '/') {
      errors.push('src/data/site.ts: navigation destinations must have a non-root absolute path: ' + href);
      continue;
    }

    const route = href.replace(/\/+$/, '');
    if (checkedHrefs.has(route) || checkedLabels.has(label)) {
      errors.push('src/data/site.ts: duplicate navigation route or label: ' + label + ' → ' + route);
    }
    checkedHrefs.add(route);
    checkedLabels.add(label);

    const candidates = ['src/pages' + route + '.astro', 'src/pages' + route + '/index.astro'];
    const file = candidates.find((candidate) => pagePaths.has(candidate));
    assertions += 1;
    if (!file) {
      errors.push('src/data/site.ts: no static Astro page for menu route ' + route);
      continue;
    }

    const expected = landingPages.includes(file)
      ? 'LandingHeader'
      : finderPages.includes(file)
        ? 'FinderHeader'
        : nestedLandingPages.includes(file)
          ? 'NestedLandingHeader'
          : null;

    assertions += 1;
    if (!expected) {
      errors.push(file + ': primary navigation route must declare a Landing or Finder page contract');
      continue;
    }
    if (expected === 'NestedLandingHeader' && route !== '/community/kampus') {
      errors.push(file + ': Nested Landing is not allowed for a new level-1 menu destination without an approved exception');
    }

    const markup = await read(file);
    const used = headerTypes.filter((component) => markup.includes('<' + component));
    assertions += 1;
    if (used.length !== 1 || used[0] !== expected) {
      errors.push(file + ': expected exactly one canonical ' + expected + ' header; found ' + (used.join(', ') || 'none'));
    }

    // Every top-nav route must be explicitly captured by the responsive test.
    // Keep the test's route list in sync whenever src/data/site.ts changes.
    assertions += 1;
    if (!visualAudit.includes(", '" + route + "/']")) {
      errors.push('scripts/audit-responsive.mjs: screenshot coverage missing for menu route ' + route);
    }
  }
}

if (errors.length > 0) {
  console.error(`UI contract check failed with ${errors.length} issue(s):\n`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`UI contract check passed (${assertions} assertions).`);
