export type Volatility = 'Rendah' | 'Sedang' | 'Tinggi' | 'Live';

export interface SurvivalGuideMeta {
  code: string;
  title: string;
  href: string;
  appliesTo: string;
  audience: string;
  lastVerified: string;
  volatility: Volatility;
}

export const survivalGuides: SurvivalGuideMeta[] = [
  { code: 'SG00', title: 'Start Here', href: '/life-in-ishikawa/', appliesTo: 'Jepang + Ishikawa + municipality', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Sedang' },
  { code: 'SG01', title: 'Sebelum Berangkat', href: '/life-in-ishikawa/sebelum-berangkat/', appliesTo: 'Jepang + Ishikawa', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi' },
  { code: 'SG02', title: 'Hari Pertama di Ishikawa', href: '/life-in-ishikawa/hari-pertama/', appliesTo: 'Jepang + municipality', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi' },
  { code: 'SG03', title: 'Administrasi', href: '/life-in-ishikawa/administrasi/', appliesTo: 'Jepang + municipality', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi' },
  { code: 'SG04', title: 'Tempat Tinggal', href: '/life-in-ishikawa/tempat-tinggal/', appliesTo: 'Jepang + Ishikawa', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Sedang' },
  { code: 'SG05', title: 'Kehidupan Sehari-hari', href: '/life-in-ishikawa/kehidupan-sehari-hari/', appliesTo: 'Municipality + daily life', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Live' },
  { code: 'SG06', title: 'Transportasi', href: '/life-in-ishikawa/transportasi/', appliesTo: 'Ishikawa + operator transport', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Live' },
  { code: 'SG07', title: 'Kesehatan', href: '/life-in-ishikawa/kesehatan/', appliesTo: 'Jepang + Ishikawa + municipality', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Live' },
  { code: 'SG08', title: 'Keluarga & Anak', href: '/life-in-ishikawa/family-anak/', appliesTo: 'Jepang + Ishikawa + municipality', audience: 'Mahasiswa dengan pasangan/anak', lastVerified: '29 September 2026', volatility: 'Tinggi' },
  { code: 'SG09', title: 'Bank & Keuangan', href: '/life-in-ishikawa/bank-money/', appliesTo: 'Jepang', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi' },
  { code: 'SG10', title: 'Bencana & Darurat', href: '/life-in-ishikawa/disaster-emergency/', appliesTo: 'Jepang + Ishikawa + municipality', audience: 'Semua residents', lastVerified: '29 September 2026', volatility: 'Live' },
  { code: 'SG11', title: 'Musim Dingin di Ishikawa', href: '/life-in-ishikawa/winter/', appliesTo: 'Ishikawa', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Live' },
  { code: 'SG12', title: 'Bahasa Jepang & Dukungan', href: '/life-in-ishikawa/japanese-support/', appliesTo: 'Ishikawa + national support', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi' },
  { code: 'SG13', title: 'Meninggalkan Ishikawa / Jepang', href: '/life-in-ishikawa/leaving/', appliesTo: 'Jepang + municipality', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi' },
  { code: 'SG14', title: 'Panduan Pemerintah Lokal', href: '/life-in-ishikawa/municipality-guides/', appliesTo: 'Seluruh 19 municipality di Ishikawa', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi' },
];

export function getGuide(code: string) {
  return survivalGuides.find((guide) => guide.code === code);
}
