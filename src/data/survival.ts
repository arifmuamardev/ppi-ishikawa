export type Volatility = 'Rendah' | 'Sedang' | 'Tinggi' | 'Live';

export interface SurvivalGuideMeta {
  code: string;
  title: string;
  href: string;
  appliesTo: string;
  audience: string;
  lastVerified: string;
  volatility: Volatility;
  sourceIds: string[];
}

export const survivalGuides: SurvivalGuideMeta[] = [
  { code: 'SG00', title: 'Start Here', href: '/life-in-ishikawa/', appliesTo: 'Jepang + Ishikawa + municipality', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Sedang', sourceIds: ['N01', 'N02', 'I02', 'I03'] },
  { code: 'SG01', title: 'Sebelum Berangkat', href: '/life-in-ishikawa/sebelum-berangkat/', appliesTo: 'Jepang + Ishikawa', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi', sourceIds: ['N02', 'N03', 'N06', 'N13', 'I08'] },
  { code: 'SG02', title: 'Hari Pertama di Ishikawa', href: '/life-in-ishikawa/hari-pertama/', appliesTo: 'Jepang + municipality', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi', sourceIds: ['N03', 'N05', 'N07', 'N09', 'N10', 'K01'] },
  { code: 'SG03', title: 'Administrasi', href: '/life-in-ishikawa/administrasi/', appliesTo: 'Jepang + municipality', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi', sourceIds: ['N04', 'N05', 'N06', 'N08', 'N09', 'N10', 'N11', 'N19', 'N20', 'N21'] },
  { code: 'SG04', title: 'Tempat Tinggal', href: '/life-in-ishikawa/tempat-tinggal/', appliesTo: 'Jepang + Ishikawa', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Sedang', sourceIds: ['N13', 'K01', 'I03'] },
  { code: 'SG05', title: 'Kehidupan Sehari-hari', href: '/life-in-ishikawa/kehidupan-sehari-hari/', appliesTo: 'Municipality + daily life', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Live', sourceIds: ['N02', 'K06', 'K07', 'H03'] },
  { code: 'SG06', title: 'Transportasi', href: '/life-in-ishikawa/transportasi/', appliesTo: 'Ishikawa + operator transport', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Live', sourceIds: ['N14', 'I11', 'I14', 'I15', 'I16'] },
  { code: 'SG07', title: 'Kesehatan', href: '/life-in-ishikawa/kesehatan/', appliesTo: 'Jepang + Ishikawa + municipality', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Live', sourceIds: ['N09', 'N15', 'I05', 'I13', 'I17'] },
  { code: 'SG08', title: 'Family Hub · Keluarga & Anak', href: '/life-in-ishikawa/family-anak/', appliesTo: 'Jepang + Ishikawa + municipality', audience: 'Mahasiswa dengan pasangan/anak', lastVerified: '6 Oktober 2026', volatility: 'Tinggi', sourceIds: ['N18', 'I07', 'I04'] },
  { code: 'SG09', title: 'Bank & Keuangan', href: '/life-in-ishikawa/bank-money/', appliesTo: 'Jepang', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi', sourceIds: ['N22', 'N02'] },
  { code: 'SG10', title: 'Bencana & Darurat', href: '/life-in-ishikawa/disaster-emergency/', appliesTo: 'Jepang + Ishikawa + municipality', audience: 'Semua residents', lastVerified: '29 September 2026', volatility: 'Live', sourceIds: ['I08', 'I09', 'I10', 'N16', 'N17'] },
  { code: 'SG11', title: 'Musim Dingin di Ishikawa', href: '/life-in-ishikawa/winter/', appliesTo: 'Ishikawa', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Live', sourceIds: ['I11', 'I12', 'I14', 'N16'] },
  { code: 'SG12', title: 'Bahasa Jepang & Dukungan', href: '/life-in-ishikawa/japanese-support/', appliesTo: 'Ishikawa + national support', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi', sourceIds: ['I04', 'I06', 'N01'] },
  { code: 'SG13', title: 'Meninggalkan Ishikawa / Jepang', href: '/life-in-ishikawa/leaving/', appliesTo: 'Jepang + municipality', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi', sourceIds: ['N04', 'N06', 'N12', 'N13', 'N22', 'N23'] },
  { code: 'SG14', title: 'Panduan Pemerintah Lokal', href: '/life-in-ishikawa/municipality-guides/', appliesTo: 'Seluruh 19 municipality di Ishikawa', audience: 'Mahasiswa & keluarga', lastVerified: '29 September 2026', volatility: 'Tinggi', sourceIds: ['K01', 'H01', 'NO01', 'KO01', 'KA01'] },
];

export function getGuide(code: string) {
  return survivalGuides.find((guide) => guide.code === code);
}
