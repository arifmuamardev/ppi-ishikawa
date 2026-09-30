export interface CampusLink {
  label: string;
  url: string;
}

export interface Campus {
  slug: string;
  name: string;
  shortName: string;
  japanese?: string;
  type: string;
  city: string;
  memberCount: number;
  censusDate: string;
  summary: string;
  ppiNote: string;
  officialLinks: CampusLink[];
}

export const campuses: Campus[] = [
  {
    slug: 'kanazawa-university',
    name: 'Kanazawa University',
    shortName: 'Kanazawa University',
    japanese: '金沢大学',
    type: 'National university',
    city: 'Kanazawa',
    memberCount: 133,
    censusDate: 'September 2026',
    summary: 'Universitas nasional dengan kampus utama Kakuma serta kampus Takaramachi–Tsuruma untuk bidang medis dan kesehatan.',
    ppiNote: 'Merupakan komunitas anggota terbesar dalam sensus PPI Ishikawa 2025/26.',
    officialLinks: [
      { label: 'Official website', url: 'https://www.kanazawa-u.ac.jp/en/' },
      { label: 'International student support', url: 'https://intl-support.w3.kanazawa-u.ac.jp/' },
      { label: 'Study at Kanazawa U', url: 'https://www.kanazawa-u.ac.jp/en/global-network/study?wovn=en' },
      { label: 'Campus & access', url: 'https://www.kanazawa-u.ac.jp/en/university/campus-guidance' }
    ]
  },
  {
    slug: 'jaist',
    name: 'Japan Advanced Institute of Science and Technology',
    shortName: 'JAIST',
    japanese: '北陸先端科学技術大学院大学',
    type: 'National graduate university',
    city: 'Nomi',
    memberCount: 14,
    censusDate: 'September 2026',
    summary: 'Universitas pascasarjana nasional yang berfokus pada pendidikan dan riset tingkat master, doktoral, serta non-degree.',
    ppiNote: 'Komunitas Indonesia terbesar kedua dalam sensus PPI Ishikawa 2025/26.',
    officialLinks: [
      { label: 'Official website', url: 'https://www.jaist.ac.jp/english/' },
      { label: 'International students', url: 'https://www.jaist.ac.jp/english/international/' },
      { label: 'Admissions', url: 'https://www.jaist.ac.jp/english/admissions/' },
      { label: 'Student support contacts', url: 'https://www.jaist.ac.jp/english/studentlife/contact/index.html' }
    ]
  },
  {
    slug: 'kanazawa-institute-of-technology',
    name: 'Kanazawa Institute of Technology',
    shortName: 'KIT',
    japanese: '金沢工業大学',
    type: 'Private university',
    city: 'Nonoichi',
    memberCount: 2,
    censusDate: 'September 2026',
    summary: 'Universitas swasta bidang teknologi, engineering, information, architecture, bioscience, dan bidang terkait.',
    ppiNote: 'Anggota tercatat berada dalam jaringan PPI Ishikawa; halaman detail dapat dikembangkan bersama mahasiswa KIT.',
    officialLinks: [
      { label: 'Official website', url: 'https://www.kanazawa-it.ac.jp/ekit/' },
      { label: 'International programs', url: 'https://www.kanazawa-it.ac.jp/ekit/exchanges/index.html' },
      { label: 'Incoming student information', url: 'https://www.kanazawa-it.ac.jp/ekit/exchanges/living.html' },
      { label: 'Campus & access', url: 'https://www.kanazawa-it.ac.jp/ekit/map/ohgigaoka.html' }
    ]
  },
  {
    slug: 'ishikawa-prefectural-university',
    name: 'Ishikawa Prefectural University',
    shortName: 'IPU',
    japanese: '石川県立大学',
    type: 'Public university',
    city: 'Nonoichi',
    memberCount: 1,
    censusDate: 'September 2026',
    summary: 'Universitas publik Prefektur Ishikawa dengan fokus utama pada bioscience, environmental science, food science, dan bidang terkait.',
    ppiNote: 'Anggota tercatat dalam sensus PPI Ishikawa; informasi praktis lokal akan ditambah ketika sudah diverifikasi.',
    officialLinks: [
      { label: 'Official website', url: 'https://www.ishikawa-pu.ac.jp/' },
      { label: 'Graduate admissions', url: 'https://www.ishikawa-pu.ac.jp/admission/graduate_admission/' },
      { label: 'International undergraduate admissions', url: 'https://www.ishikawa-pu.ac.jp/admission/faculty_admission/' },
      { label: 'Access', url: 'https://www.ishikawa-pu.ac.jp/access/' }
    ]
  },
  {
    slug: 'kinjo-university',
    name: 'Kinjo University',
    shortName: 'Kinjo University',
    japanese: '金城大学',
    type: 'Private university',
    city: 'Hakusan',
    memberCount: 1,
    censusDate: 'September 2026',
    summary: 'Universitas swasta di Hakusan dengan program kesehatan, sosial, pendidikan, dan bidang profesional lainnya.',
    ppiNote: 'Anggota tercatat dalam sensus PPI Ishikawa; International Exchange Center menjadi salah satu pintu dukungan kampus.',
    officialLinks: [
      { label: 'Official English website', url: 'https://www.kinjo.ac.jp/english/' },
      { label: 'International Exchange Center', url: 'https://www.kinjo.ac.jp/english/student/center.html' },
      { label: 'International admissions', url: 'https://www.kinjo.ac.jp/english/entrance/' },
      { label: 'Access', url: 'https://www.kinjo.ac.jp/english/access/access.html' }
    ]
  },
  {
    slug: 'alice-gakuen',
    name: 'Vocational School Alice Gakuen',
    shortName: 'Alice Gakuen',
    japanese: '専門学校アリス学園',
    type: 'Vocational school',
    city: 'Kanazawa / Kaga',
    memberCount: 2,
    censusDate: 'September 2026',
    summary: 'Sekolah vokasi dengan kampus di Kanazawa dan Kaga serta program yang mencakup international business, care welfare, dan Japanese language.',
    ppiNote: 'LPJ sebelumnya mencatat institusi ini sebagai Alice International College. Website menggunakan nama resmi saat ini dan tetap menghubungkannya dengan data anggota lama.',
    officialLinks: [
      { label: 'Official website', url: 'https://gakuen.alice-japan.net/' },
      { label: 'International student admissions', url: 'https://gakuen.alice-japan.net/entrance-exam/admissions-in' },
      { label: 'School information', url: 'https://gakuen.alice-japan.net/about-us' }
    ]
  }
];

export const campusCensus = {
  label: 'Data anggota PPI Ishikawa',
  verified: 'September 2026',
  totalRepresentedInstitutions: campuses.length,
  note: 'Jumlah bersifat agregat berdasarkan sensus anggota dan survey mahasiswa baru periode 2025/26. Data individu tidak ditampilkan di website publik.'
};
