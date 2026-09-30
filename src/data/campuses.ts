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
    summary: 'Universitas swasta di Hakusan dengan bidang interdisciplinary economics, social welfare/education, rehabilitation, nursing, serta graduate study di comprehensive rehabilitation.',
    officialFacts: [
      'Kasama Campus menampung empat faculties dan Graduate School of Comprehensive Rehabilitation; Matto Campus juga digunakan oleh Faculty of Nursing dan Advanced Course of Public Health Nursing.',
      'International Exchange Center menyediakan consultation terkait residence status, housing, medical matters, daily life, study, dan scholarships untuk international students.',
      'Kinjo memiliki international-student admission route tersendiri dan tidak menyediakan foreign-student dormitory; mahasiswa internasional menggunakan private apartments.'
    ],
    ppiFocus: [
      'Membedakan kebutuhan Kasama Campus dan Matto Campus sejak memilih housing dan commute.',
      'International Exchange Center sebagai support route utama mahasiswa internasional.',
      'Private housing, transportasi Hakusan, dan administrasi daily life.',
      'Health, counseling, accessibility, practicum, dan career support.'
    ],
    officialLinks: [
      { label: 'Official website', url: 'https://www.kinjo.ac.jp/ku/' },
      { label: 'International students', url: 'https://www.kinjo.ac.jp/english/' },
      { label: 'International Exchange Center', url: 'https://www.kinjo.ac.jp/english/student/center.html' },
      { label: 'Campus & access', url: 'https://www.kinjo.ac.jp/ku/access/' }
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
    summary: 'Sekolah vokasi di Kanazawa dan Kaga dengan Japanese Language, International Business, serta Care Worker programs dan dukungan kehidupan sehari-hari yang kuat untuk international students.',
    officialFacts: [
      'Japanese Language Department tersedia di Kanazawa dan Kaga; International Business juga tersedia di kedua kampus, sedangkan Care Worker Department berada di Kanazawa.',
      'Untuk Japanese Language students di Kanazawa dan Kaga, official dormitory guidance menyatakan pada prinsipnya siswa tinggal di student dormitory.',
      'Alice menyediakan academic-affairs, life-support, multilingual, dan employment-support routes untuk isu seperti city procedures, residence status, part-time work, illness/accident, study, serta career.'
    ],
    ppiFocus: [
      'Membedakan Kanazawa Campus dan Kaga Campus serta program yang tersedia di masing-masing lokasi.',
      'Dormitory, housing rules, bicycle/transport, city procedures, dan daily-life adaptation.',
      'Part-time work yang legal dan tetap seimbang dengan attendance serta study.',
      'Japanese-language progression, vocational study, career support, dan pathway setelah lulus.'
    ],
    officialLinks: [
      { label: 'Official website', url: 'https://gakuen.alice-japan.net/' },
      { label: 'International student admissions', url: 'https://gakuen.alice-japan.net/entrance-exam/admissions-in' },
      { label: 'Courses', url: 'https://gakuen.alice-japan.net/courses' },
      { label: 'Dormitory & student life', url: 'https://gakuen.alice-japan.net/entrance-exam/dormitory' },
      { label: 'Campus & access', url: 'https://gakuen.alice-japan.net/access' }
    ]
  }
];

export interface CampusHubProfile {
  slug: string;
  studyProfile: string;
  academicFocus: string;
  housing: string;
  mobility: string;
  supportPoint: string;
  tags: string[];
}

export const campusHubProfiles: CampusHubProfile[] = [
  {
    slug: 'kanazawa-university',
    studyProfile: 'Undergraduate, graduate, exchange, research',
    academicFocus: 'Comprehensive university: humanities, sciences, engineering, medicine, health, pharmacy, dan bidang lintas disiplin.',
    housing: 'University housing dan private apartment; pilihan sangat dipengaruhi campus assignment.',
    mobility: 'Bus-centered untuk Kakuma; Takaramachi–Tsuruma memiliki pola commute berbeda.',
    supportPoint: 'One-Stop Consultation Counter / international student support',
    tags: ['Comprehensive', 'Research', 'Multi-campus']
  },
  {
    slug: 'jaist',
    studyProfile: 'Graduate-focused: master, doctoral, research',
    academicFocus: 'Graduate education dan research pada information science, materials science, serta knowledge science.',
    housing: 'Student housing tersedia; private apartment juga relevan menurut kebutuhan.',
    mobility: 'Nomi-based; shuttle/bus, bicycle, dan car planning lebih penting dibanding kampus pusat kota.',
    supportPoint: 'International Student Section',
    tags: ['Graduate', 'Research', 'Nomi']
  },
  {
    slug: 'kanazawa-institute-of-technology',
    studyProfile: 'Undergraduate, graduate, exchange / research',
    academicFocus: 'Engineering, information, architecture, bioscience, psychology, dan project-based education.',
    housing: 'Accommodation options bergantung program/durasi; private housing di Nonoichi juga umum.',
    mobility: 'Nonoichi; bus dan bicycle relatif penting untuk daily commute.',
    supportPoint: 'Center for International Programs',
    tags: ['Engineering', 'Project-based', 'Nonoichi']
  },
  {
    slug: 'ishikawa-prefectural-university',
    studyProfile: 'Undergraduate dan graduate',
    academicFocus: 'Bioresources, environmental science, food science, dan applied life science.',
    housing: 'Tidak memiliki university dormitory; private housing perlu direncanakan sejak awal.',
    mobility: 'Nonoichi; IR Nonoichi + community shuttle/bus, bicycle, atau car.',
    supportPoint: 'Academic & Student Affairs Section',
    tags: ['Bioresources', 'Environment', 'Food']
  },
  {
    slug: 'kinjo-university',
    studyProfile: 'Undergraduate dan selected graduate / advanced study',
    academicFocus: 'Economics, social welfare/education, rehabilitation, nursing, dan professional pathways.',
    housing: 'Tidak ada foreign-student dormitory; international students menggunakan private apartment.',
    mobility: 'Kasama dan Matto harus dibedakan; rail access utama melalui Kaga-Kasama / Matto.',
    supportPoint: 'International Exchange Center',
    tags: ['Health', 'Welfare', 'Professional']
  },
  {
    slug: 'alice-gakuen',
    studyProfile: 'Japanese language dan vocational',
    academicFocus: 'Japanese Language, International Business, serta Care Worker education.',
    housing: 'Dormitory menjadi bagian penting terutama untuk Japanese Language students; aturan berbeda menurut program.',
    mobility: 'Kanazawa dan Kaga adalah dua pola hidup berbeda; bus/bicycle di Kanazawa, Daishoji-centered di Kaga.',
    supportPoint: 'Academic Affairs + life-support staff',
    tags: ['Japanese', 'Vocational', 'Career pathway']
  }
];

export const campusHubProfileBySlug = Object.fromEntries(
  campusHubProfiles.map((profile) => [profile.slug, profile])
) as Record<string, CampusHubProfile>;

export const campusCensus = {
  verified: 'September 2026',
  totalRepresentedInstitutions: campuses.length,
  note: 'Kehadiran anggota diverifikasi dari data sensus anggota dan survey mahasiswa baru periode 2025/26. Data digunakan untuk menunjukkan cakupan institusi; jumlah dan identitas individu tidak dipublikasikan.'
};
