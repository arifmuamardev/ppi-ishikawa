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
  censusDate: string;
  summary: string;
  officialFacts: string[];
  ppiFocus: string[];
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
    censusDate: 'September 2026',
    summary: 'Universitas nasional dengan kampus utama Kakuma serta Takaramachi–Tsuruma untuk bidang medis dan kesehatan.',
    officialFacts: [
      'Kakuma Campus menampung bidang humanities/social sciences, science, engineering, pharmacy, dan transdisciplinary sciences.',
      'Takaramachi–Tsuruma Campus digunakan terutama untuk medicine dan health sciences.',
      'Kanazawa University memiliki One-Stop Consultation Counter khusus mahasiswa internasional untuk isu seperti residence status, scholarship, insurance, housing, dan kehidupan sehari-hari.'
    ],
    ppiFocus: [
      'Transportasi dan pilihan area tempat tinggal menuju Kakuma / Takaramachi–Tsuruma.',
      'Administrasi kampus yang sering ditanyakan mahasiswa Indonesia.',
      'Dormitory, apartment, scholarship, dan support route.',
      'Panduan arrival untuk mahasiswa degree, research, exchange, dan double degree.'
    ],
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
    censusDate: 'September 2026',
    summary: 'Universitas pascasarjana nasional di Nomi yang berfokus pada pendidikan dan riset master, doktoral, serta non-degree.',
    officialFacts: [
      'JAIST merupakan graduate university dengan program master, doctoral, research student, dan visiting/special visiting student.',
      'International Student Section menangani dukungan mahasiswa internasional, scholarship, immigration guidance, tutors, dan perubahan alamat.',
      'JAIST menyediakan student housing dan informasi khusus prospective international students.'
    ],
    ppiFocus: [
      'Transportasi Nomi–Kanazawa dan akses dari/ke kampus.',
      'JAIST housing, kehidupan sehari-hari, belanja, dan mobilitas tanpa kendaraan pribadi.',
      'Administrasi mahasiswa internasional dan immigration support.',
      'Koneksi komunitas JAIST dengan kegiatan PPI Ishikawa di area Kanazawa.'
    ],
    officialLinks: [
      { label: 'Official website', url: 'https://www.jaist.ac.jp/english/' },
      { label: 'International students', url: 'https://www.jaist.ac.jp/english/international/' },
      { label: 'Prospective international students', url: 'https://www.jaist.ac.jp/english/international/abroad/applicants.html' },
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
    censusDate: 'September 2026',
    summary: 'Universitas swasta di Nonoichi dengan bidang engineering, information, architecture, bioscience, psychology, dan innovation management.',
    officialFacts: [
      'Ohgigaoka Campus berada di Nonoichi dan menjadi kampus utama KIT.',
      'Center for International Programs menjadi titik utama program internasional dan incoming international students.',
      'KIT menyediakan living information dan opsi accommodation untuk mahasiswa internasional sesuai jenis serta durasi program.'
    ],
    ppiFocus: [
      'Transportasi dari Kanazawa dan kehidupan mahasiswa di Nonoichi.',
      'Housing dan layanan sekitar Ohgigaoka Campus.',
      'Support route untuk incoming / exchange / research students.',
      'Catatan praktis mahasiswa Indonesia di KIT.'
    ],
    officialLinks: [
      { label: 'Official website', url: 'https://www.kanazawa-it.ac.jp/ekit/' },
      { label: 'International programs', url: 'https://www.kanazawa-it.ac.jp/ekit/exchanges/index.html' },
      { label: 'Living information', url: 'https://www.kanazawa-it.ac.jp/ekit/exchanges/living.html' },
      { label: 'Campus & access', url: 'https://www.kanazawa-it.ac.jp/ekit/map/ohgigaoka.html' }
    ]
  },
  {
    slug: 'ishikawa-prefectural-university',
    name: 'Ishikawa Prefectural University',
    shortName: 'Ishikawa Prefectural University',
    japanese: '石川県立大学',
    type: 'Public university',
    city: 'Nonoichi',
    censusDate: 'September 2026',
    summary: 'Universitas publik Prefektur Ishikawa di Nonoichi dengan fokus pada bioresources, environment, food, dan applied bioscience.',
    officialFacts: [
      'Faculty of Bioresources and Environmental Sciences memiliki tiga departemen: Bioproduction Science, Environmental Science, dan Food Science.',
      'Graduate School memiliki jalur master dan doctoral pada bidang terkait bioresources/environment serta applied life science.',
      'Universitas menyediakan special selection untuk international students pada jalur tertentu; detail berubah setiap admission year.'
    ],
    ppiFocus: [
      'Akses kampus dan transportasi dari Kanazawa/Nonoichi.',
      'Administrasi dan admission route mahasiswa internasional.',
      'Kehidupan harian di sekitar Nonoichi.',
      'Catatan riset dan graduate-student life dari anggota PPI.'
    ],
    officialLinks: [
      { label: 'Official website', url: 'https://www.ishikawa-pu.ac.jp/' },
      { label: 'Undergraduate programs', url: 'https://www.ishikawa-pu.ac.jp/undergraduate/' },
      { label: 'Graduate admissions', url: 'https://www.ishikawa-pu.ac.jp/admission/graduate_admission/' },
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
    censusDate: 'September 2026',
    summary: 'Universitas swasta di Hakusan dengan program kesehatan, sosial, pendidikan, dan bidang profesional lainnya.',
    officialFacts: [
      'Kampus berlokasi di Kasama-machi, Hakusan, dekat Kaga-Kasama Station.',
      'International Exchange Center menyediakan dukungan terkait residency, housing, medical matters, study, dan scholarships bagi mahasiswa internasional.',
      'University/College menyediakan jalur informasi admission khusus international students.'
    ],
    ppiFocus: [
      'Akses dari Kanazawa/Hakusan dan mobilitas harian.',
      'International Exchange Center sebagai support route utama.',
      'Housing dan kebutuhan harian di area Hakusan.',
      'Catatan praktis anggota Indonesia di Kinjo University.'
    ],
    officialLinks: [
      { label: 'Official English website', url: 'https://www.kinjo.ac.jp/english/' },
      { label: 'International Exchange Center', url: 'https://www.kinjo.ac.jp/english/student/center.html' },
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
    censusDate: 'September 2026',
    summary: 'Sekolah vokasi dengan kampus di Kanazawa dan Kaga serta program untuk international business, care welfare, dan Japanese language.',
    officialFacts: [
      'Alice Gakuen memiliki Kanazawa Campus dan Kaga Campus di Ishikawa.',
      'Program untuk international students mencakup International Business, Care Welfare, dan Japanese Language.',
      'Website resminya menyediakan admission information, scholarship, living expenses, dormitory, serta informasi kehidupan mahasiswa internasional.'
    ],
    ppiFocus: [
      'Membedakan informasi Kanazawa Campus dan Kaga Campus.',
      'Dukungan pelajar vocational/Japanese-language yang kebutuhannya dapat berbeda dari university students.',
      'Housing, part-time work, transportasi, dan administrasi sehari-hari.',
      'Integrasi anggota Alice Gakuen ke komunitas PPI Ishikawa yang lebih luas.'
    ],
    officialLinks: [
      { label: 'Official website', url: 'https://gakuen.alice-japan.net/' },
      { label: 'International student admissions', url: 'https://gakuen.alice-japan.net/entrance-exam/admissions-in' },
      { label: 'School information', url: 'https://gakuen.alice-japan.net/about-us' }
    ]
  }
];

export const campusCensus = {
  verified: 'September 2026',
  totalRepresentedInstitutions: campuses.length,
  note: 'Kehadiran anggota diverifikasi dari data sensus anggota dan survey mahasiswa baru periode 2025/26. Jumlah dan data individu tidak ditampilkan di website publik.'
};
