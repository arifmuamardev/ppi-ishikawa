export type CareerOpportunityType = 'job' | 'internship' | 'postdoc' | 'research' | 'faculty' | 'fellowship';
export type CareerLocation = 'ishikawa' | 'japan' | 'global';
export type CareerAudience = 'student' | 'graduate' | 'alumni' | 'doctoral';

export interface CareerSource {
  slug: string;
  name: string;
  provider: string;
  description: string;
  url: string;
  types: CareerOpportunityType[];
  locations: CareerLocation[];
  audiences: CareerAudience[];
  language: string;
  sourceType: 'official' | 'public' | 'research';
  featured?: boolean;
  note?: string;
  verified: string;
}

export interface CampusCareerProfile {
  campusSlug: string;
  heading: string;
  description: string;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  note?: string;
  lastChecked: string;
}

export const careerTypeLabels: Record<CareerOpportunityType, string> = {
  job: 'Pekerjaan',
  internship: 'Internship',
  postdoc: 'Postdoc',
  research: 'Researcher',
  faculty: 'Faculty',
  fellowship: 'Fellowship'
};

export const careerLocationLabels: Record<CareerLocation, string> = {
  ishikawa: 'Ishikawa',
  japan: 'Jepang',
  global: 'Global'
};

export const careerAudienceLabels: Record<CareerAudience, string> = {
  student: 'Mahasiswa',
  graduate: 'Fresh graduate',
  alumni: 'Alumni',
  doctoral: 'Doktoral / PhD'
};

export const careerSources: CareerSource[] = [
  {
    slug: 'jrec-in',
    name: 'JREC-IN Portal',
    provider: 'Japan Science and Technology Agency (JST)',
    description: 'Portal utama untuk posisi akademik dan riset di Jepang, termasuk researcher/postdoc, assistant professor, lecturer, associate professor, dan professor.',
    url: 'https://jrecin.jst.go.jp/seek/SeekTop',
    types: ['postdoc', 'research', 'faculty'],
    locations: ['japan'],
    audiences: ['graduate', 'alumni', 'doctoral'],
    language: 'JP / EN',
    sourceType: 'research',
    featured: true,
    note: 'Gunakan filter job type, research field, institution, dan location di portal.',
    verified: 'October 2026'
  },
  {
    slug: 'jsps-postdoc',
    name: 'JSPS Postdoctoral Fellowships',
    provider: 'Japan Society for the Promotion of Science (JSPS)',
    description: 'Skema fellowship untuk peneliti internasional yang akan melakukan riset di institusi host di Jepang. Jadwal dan kategori fellowship mengikuti call resmi JSPS.',
    url: 'https://www.jsps.go.jp/english/e-fellow/application.html',
    types: ['postdoc', 'fellowship', 'research'],
    locations: ['japan'],
    audiences: ['alumni', 'doctoral'],
    language: 'EN / JP',
    sourceType: 'official',
    featured: true,
    note: 'Ini fellowship, bukan job board. Periksa eligibility, host institution, dan deadline pada call terbaru.',
    verified: 'October 2026'
  },
  {
    slug: 'euraxess',
    name: 'EURAXESS Jobs & Opportunities',
    provider: 'European Commission / EURAXESS',
    description: 'Portal internasional untuk research jobs, postdoctoral opportunities, faculty/research positions, dan hosting offers di banyak negara.',
    url: 'https://euraxess.ec.europa.eu/jobs',
    types: ['postdoc', 'research', 'faculty', 'fellowship'],
    locations: ['global'],
    audiences: ['graduate', 'alumni', 'doctoral'],
    language: 'EN',
    sourceType: 'research',
    featured: true,
    note: 'Berguna bila pencarian tidak dibatasi pada Jepang.',
    verified: 'October 2026'
  },
  {
    slug: 'hellowork',
    name: 'Hello Work Internet Service',
    provider: 'Ministry of Health, Labour and Welfare (MHLW)',
    description: 'Layanan resmi untuk mencari lowongan yang diterima Hello Work di seluruh Jepang.',
    url: 'https://www.hellowork.mhlw.go.jp/',
    types: ['job'],
    locations: ['japan'],
    audiences: ['student', 'graduate', 'alumni'],
    language: 'JP',
    sourceType: 'official',
    featured: true,
    note: 'Untuk konsultasi khusus pencari kerja asing, gunakan juga Foreign Employment Service Center.',
    verified: 'October 2026'
  },
  {
    slug: 'mhlw-foreign-employment',
    name: 'Foreign Employment Service Centers',
    provider: 'Ministry of Health, Labour and Welfare (MHLW)',
    description: 'Jalur konsultasi dan job placement resmi bagi international students dan professional/technical foreign workers yang ingin bekerja di Jepang.',
    url: 'https://www.mhlw.go.jp/stf/newpage_12638.html',
    types: ['job', 'internship'],
    locations: ['japan'],
    audiences: ['student', 'graduate', 'alumni'],
    language: 'JP / multilingual support varies',
    sourceType: 'official',
    note: 'MHLW mencantumkan pusat layanan di Tokyo, Nagoya, Osaka, dan Fukuoka serta dukungan terkait guidance, internship, dan interview events.',
    verified: 'October 2026'
  },
  {
    slug: 'jobcafe-ishikawa',
    name: 'Ishikawa Foreign Residents Employment Support Desk',
    provider: 'Job Cafe Ishikawa',
    description: 'Dukungan lokal untuk international students dan foreign residents yang mencari pekerjaan di Ishikawa, termasuk konsultasi dan informasi perusahaan.',
    url: 'https://www.jobcafe-ishikawa.jp/ifres/en/student/',
    types: ['job', 'internship'],
    locations: ['ishikawa', 'japan'],
    audiences: ['student', 'graduate', 'alumni'],
    language: 'JP / EN information',
    sourceType: 'public',
    featured: true,
    note: 'Sangat relevan bila target utama adalah perusahaan di Ishikawa.',
    verified: 'October 2026'
  }
];

export const careerGuides = [
  {
    title: 'Job Hunting Guide for International Students',
    provider: 'JASSO',
    description: 'Panduan tahunan untuk memahami timeline, persiapan, aplikasi, interview, dan konteks job hunting di Jepang.',
    url: 'https://www.jasso.go.jp/en/ryugaku/after_study_j/job/guide.html',
    label: 'Panduan resmi JASSO'
  },
  {
    title: 'Employment Policy for Foreign Workers',
    provider: 'MHLW',
    description: 'Pintu masuk resmi untuk layanan pencari kerja asing dan dukungan employment bagi international students.',
    url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/gaikokujin/index.html',
    label: 'Informasi resmi MHLW'
  }
];

export const campusCareerProfiles: Record<string, CampusCareerProfile> = {
  'kanazawa-university': {
    campusSlug: 'kanazawa-university',
    heading: 'Career Support Kanazawa University',
    description: 'KU Career Support Office melayani career consultation, job hunting, internship, international students, graduate-school pathways, dan dukungan khusus doctoral students.',
    primaryLabel: 'Career Support Office',
    primaryUrl: 'https://career-support.adm.kanazawa-u.ac.jp/',
    secondaryLabel: 'International students',
    secondaryUrl: 'https://career-support.adm.kanazawa-u.ac.jp/international/',
    note: 'KU juga memiliki layanan career khusus doctoral students dan konsultasi untuk jalur academia maupun non-academia.',
    lastChecked: 'October 2026'
  },
  jaist: {
    campusSlug: 'jaist',
    heading: 'Career Support JAIST',
    description: 'JAIST Career Support Office menyediakan counseling, seminars, internship support, corporate events, job information resources, dan dukungan khusus international students.',
    primaryLabel: 'JAIST Career Support',
    primaryUrl: 'https://www.jaist.ac.jp/english/careersupport/support/',
    secondaryLabel: 'For International Students',
    secondaryUrl: 'https://www.jaist.ac.jp/english/careersupport/i-student/index.html',
    note: 'JAIST juga menyediakan jalur dan resources yang relevan untuk master/doctoral students serta alumni career information.',
    lastChecked: 'October 2026'
  },
  'kanazawa-institute-of-technology': {
    campusSlug: 'kanazawa-institute-of-technology',
    heading: 'Career Planning & Placement at KIT',
    description: 'KIT Career Planning and Placement Office menyediakan job placement advice, resume editing, interview practice, dan akses informasi perusahaan.',
    primaryLabel: 'KIT Career Services',
    primaryUrl: 'https://www.kanazawa-it.ac.jp/career/index.html',
    secondaryLabel: 'Career facilities',
    secondaryUrl: 'https://www.kanazawa-it.ac.jp/ekit/life/facilities/index.html',
    lastChecked: 'October 2026'
  },
  'ishikawa-prefectural-university': {
    campusSlug: 'ishikawa-prefectural-university',
    heading: 'Career Center Ishikawa Prefectural University',
    description: 'IPU Career Center / Employment Support Office menyediakan consultation, resume dan entry-sheet review, interview guidance, seminars, serta informasi pekerjaan.',
    primaryLabel: 'IPU Career Center',
    primaryUrl: 'https://www.ishikawa-pu.ac.jp/career/careercenter/',
    lastChecked: 'October 2026'
  },
  'kinjo-university': {
    campusSlug: 'kinjo-university',
    heading: 'Career Support Kinjo University',
    description: 'Kinjo Career Support Center menyediakan career guidance, application preparation, interview practice, individual consultation, dan akses job information.',
    primaryLabel: 'Kinjo Career Support',
    primaryUrl: 'https://www.kinjo.ac.jp/ku/job/support.html',
    lastChecked: 'October 2026'
  },
  'alice-gakuen': {
    campusSlug: 'alice-gakuen',
    heading: 'Employment Support Center Alice Gakuen',
    description: 'Alice Gakuen Employment Support Center memberikan career counseling, resume review, interview preparation, internship support, dan penghubung dengan employers.',
    primaryLabel: 'Alice Employment Support Center',
    primaryUrl: 'https://gakuen.alice-japan.net/for-companies/employment-support-center',
    lastChecked: 'October 2026'
  }
};
