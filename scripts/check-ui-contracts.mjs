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

if (errors.length > 0) {
  console.error(`UI contract check failed with ${errors.length} issue(s):\n`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`UI contract check passed (${assertions} assertions).`);
