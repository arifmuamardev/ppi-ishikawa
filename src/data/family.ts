export interface FamilyHubItem {
  code: string;
  title: string;
  description: string;
  href: string;
  icon: 'documents' | 'health' | 'family' | 'academic' | 'money' | 'city' | 'info' | 'guide';
}

export const familyHubItems: FamilyHubItem[] = [
  {
    code: 'F01',
    title: 'Datang bersama pasangan & anak',
    description: 'Residence status, dokumen keluarga, kedatangan, registrasi alamat, insurance, dan langkah awal.',
    href: '/life-in-ishikawa/family/datang-bersama-keluarga/',
    icon: 'documents'
  },
  {
    code: 'F02',
    title: 'Kehamilan & kelahiran',
    description: 'Pregnancy notification, mother-child handbook, prenatal care, childbirth, dan prosedur setelah bayi lahir.',
    href: '/life-in-ishikawa/family/kehamilan-kelahiran/',
    icon: 'health'
  },
  {
    code: 'F03',
    title: 'Childcare & daycare',
    description: 'Hoikusho, kodomo-en, kindergarten, application timing, temporary childcare, dan support untuk orang tua.',
    href: '/life-in-ishikawa/family/childcare/',
    icon: 'family'
  },
  {
    code: 'F04',
    title: 'Sekolah anak',
    description: 'Public school, school district, Japanese-language support, transfer, dan dukungan pendidikan.',
    href: '/life-in-ishikawa/family/sekolah-anak/',
    icon: 'academic'
  },
  {
    code: 'F05',
    title: 'Benefit & kesehatan',
    description: 'Child allowance, medical subsidy, insurance, health checkups, vaccination, dan dukungan keluarga.',
    href: '/life-in-ishikawa/family/benefit-kesehatan/',
    icon: 'money'
  },
  {
    code: 'F06',
    title: 'Aktivitas keluarga',
    description: 'Tempat bermain, ruang indoor, perpustakaan, event, parenting support, dan ide akhir pekan.',
    href: '/life-in-ishikawa/family/aktivitas/',
    icon: 'city'
  },
  {
    code: 'F07',
    title: 'FAQ keluarga',
    description: 'Jawaban singkat untuk pertanyaan yang sering muncul saat tinggal di Ishikawa bersama keluarga.',
    href: '/life-in-ishikawa/family/faq/',
    icon: 'info'
  },
  {
    code: 'F08',
    title: 'Family by Municipality',
    description: 'Shortcut childcare, benefit, medical support, school, dan consultation berdasarkan kota tempat tinggal.',
    href: '/life-in-ishikawa/family/municipality/',
    icon: 'city'
  },
  {
    code: 'F09',
    title: 'Family Timeline',
    description: 'Checklist berdasarkan waktu: sebelum datang, 14 hari pertama, bulan pertama, school/daycare, kelahiran, dan pindah.',
    href: '/life-in-ishikawa/family/timeline/',
    icon: 'guide'
  }
];

export const familyLastVerified = '6 Oktober 2026';
