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

export interface CampusGlanceItem {
  label: string;
  value: string;
  note?: string;
  sourceUrl: string;
}

export interface CampusLandmark {
  name: string;
  type: string;
  description: string;
  url: string;
}

export interface CampusAcademicHighlight {
  title: string;
  category: string;
  description: string;
  url: string;
}

export interface InternationalStudentSnapshot {
  admission: string;
  language: string;
  housing: string;
  funding: string;
  firstContact: string;
  sourceUrl: string;
}

export interface StudentLifeSnapshot {
  transport: string;
  livingArea: string;
  dailyNeeds: string;
  winter: string;
  community: string;
  sourceUrl: string;
}

export interface UsefulPlace {
  name: string;
  category: string;
  description: string;
  mapUrl: string;
}

export interface CampusProfileDetail {
  slug: string;
  glance: CampusGlanceItem[];
  landmarks: CampusLandmark[];
  academicHighlights: CampusAcademicHighlight[];
  internationalStudent: InternationalStudentSnapshot;
  studentLife: StudentLifeSnapshot;
  usefulPlaces: UsefulPlace[];
  history: string;
  academicStructure: string;
  academicCharacter: string;
  campusEnvironment: string;
  studyAreas: string[];
  signatureFacilities: string[];
  studentExperience: string;
  orientation: string;
  distinctive: string[];
  profileSources: CampusLink[];
}

export const campusProfileDetails: CampusProfileDetail[] = [
  {
    slug: 'kanazawa-university',
    glance: [
      { label: 'Sejarah', value: '160+ tahun', note: 'Akar institusi sejak 1862', sourceUrl: 'https://www.kanazawa-u.ac.jp/en/university/' },
      { label: 'Mahasiswa', value: '10.787', note: 'Angka profil universitas yang ditampilkan saat ini', sourceUrl: 'https://www.kanazawa-u.ac.jp/en/university/' },
      { label: 'Struktur', value: '4 colleges · 20 schools', note: 'Ditambah 7 graduate schools', sourceUrl: 'https://www.kanazawa-u.ac.jp/en/university/' },
      { label: 'Luas kampus', value: '±2,41 juta m²', note: 'Total campus area yang dicantumkan universitas', sourceUrl: 'https://www.kanazawa-u.ac.jp/en/university/' }
    ],
    landmarks: [
      { name: 'Central Library', type: 'Belajar', description: 'Perpustakaan utama di Kakuma North Area dan salah satu titik penting kehidupan akademik lintas bidang.', url: 'https://library.kanazawa-u.ac.jp/' },
      { name: 'Natural Science and Technology Library', type: 'Belajar & riset', description: 'Perpustakaan khusus di Kakuma South Area yang dekat dengan kompleks natural science dan engineering.', url: 'https://library.kanazawa-u.ac.jp/' },
      { name: 'Kanazawa University Hospital', type: 'Kesehatan & pendidikan', description: 'Rumah sakit universitas di area Takaramachi yang menjadi pusat layanan medis sekaligus pendidikan klinis.', url: 'https://web.hosp.kanazawa-u.ac.jp/' },
      { name: 'Nano Life Science Institute', type: 'Riset', description: 'Salah satu pusat riset unggulan di Kakuma yang mencerminkan kekuatan riset advanced science universitas.', url: 'https://nanolsi.kanazawa-u.ac.jp/en/' }
    ],
    academicHighlights: [
      { title: 'Nano Life Science Institute (WPI-NanoLSI)', category: 'Nano & life science', description: 'World Premier International Research Center yang mengembangkan nano-probe life science dan advanced microscopy untuk mengamati fenomena biologis pada skala nano.', url: 'https://nanolsi.kanazawa-u.ac.jp/en/about/' },
      { title: 'Cancer Research Institute', category: 'Cancer research', description: 'Salah satu research institute utama universitas yang berfokus pada mekanisme kanker dan pengembangan pendekatan baru untuk diagnosis serta terapi.', url: 'https://www.kanazawa-u.ac.jp/en/research/' },
      { title: 'Institute of Nature and Environmental Technology', category: 'Environment', description: 'Pusat riset yang mencakup lingkungan, atmospheric science, regional environment, dan isu alam yang relevan dengan kawasan Sea of Japan.', url: 'https://www.kanazawa-u.ac.jp/en/research/' },
      { title: 'Advanced Mobility & Manufacturing Institutes', category: 'Engineering', description: 'Dua institut yang memperlihatkan arah riset terapan universitas pada mobility, manufacturing, design, dan engineering technologies.', url: 'https://www.kanazawa-u.ac.jp/en/research/' }
    ],
    internationalStudent: {
      admission: 'Jalur international undergraduate/graduate, exchange, research student, dan program lain berbeda menurut school/graduate school.',
      language: 'Banyak program reguler menggunakan bahasa Jepang; sejumlah graduate/program internasional menggunakan English atau bilingual format.',
      housing: 'University housing tersedia dalam beberapa kategori, tetapi kapasitas dan eligibility berbeda; private apartment tetap umum.',
      funding: 'MEXT, JASSO, tuition exemption/reduction, dan scholarship internal/eksternal tersedia tergantung status mahasiswa.',
      firstContact: 'International Student Support / One-Stop Consultation Counter',
      sourceUrl: 'https://www.kanazawa-u.ac.jp/en/global-network/study/'
    },
    studentLife: {
      transport: 'Kakuma sangat bergantung pada Hokutetsu Bus; university shuttle menghubungkan Kakuma dan Takaramachi–Tsuruma pada hari kerja tertentu. Sepeda dan mobil juga digunakan sesuai aturan kampus.',
      livingArea: 'Mahasiswa tersebar di sekitar Kakuma, Morinosato, pusat Kanazawa, dan area yang lebih dekat Takaramachi–Tsuruma sesuai lokasi studi.',
      dailyNeeds: 'Kampus menyediakan cafeteria/store; kebutuhan harian lain banyak dipenuhi di Morinosato atau pusat Kanazawa.',
      winter: 'Rute ke Kakuma menanjak dan musim dingin dapat memengaruhi bus, sepeda, serta waktu perjalanan. Buffer waktu dan rencana transport alternatif penting.',
      community: 'Akses ke kegiatan PPI relatif mudah dari area Kanazawa, tetapi mahasiswa Kakuma dan Takaramachi–Tsuruma memiliki pola perjalanan harian yang berbeda.',
      sourceUrl: 'https://www.kanazawa-u.ac.jp/en/students/livelihood/'
    },
    usefulPlaces: [
      { name: 'Kakuma Campus Bus Stop', category: 'Transport', description: 'Titik utama turun/naik bus untuk akses Kakuma Campus.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kanazawa+University+Kakuma+Campus+bus+stop' },
      { name: 'Morinosato Area', category: 'Belanja & makan', description: 'Area dekat Kakuma dengan supermarket, restoran, drugstore, dan kebutuhan harian mahasiswa.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Morinosato+Kanazawa' },
      { name: 'Kanazawa University Hospital', category: 'Kesehatan', description: 'Rumah sakit universitas utama di Takaramachi dan rujukan penting untuk layanan medis.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kanazawa+University+Hospital' },
      { name: 'Kanazawa City Hall', category: 'Administrasi', description: 'Pusat administrasi kota untuk berbagai urusan kependudukan dan layanan kota.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kanazawa+City+Hall' }
    ],
    history: 'Berakar dari Smallpox Vaccination Center Kaga Domain yang didirikan pada 1862; kini Kanazawa University merupakan universitas nasional komprehensif dengan sejarah lebih dari 160 tahun.',
    academicStructure: '4 colleges, 20 schools, dan 7 graduate schools. Spektrumnya mencakup humanities, social sciences, science, engineering, medicine, health sciences, pharmacy, hingga bidang lintas disiplin.',
    academicCharacter: 'Research university yang menggabungkan pendidikan komprehensif dengan riset lintas bidang. Skala dan pilihan bidangnya paling luas di antara kampus anggota PPI Ishikawa saat ini.',
    campusEnvironment: 'Kakuma adalah kampus terbesar dan berada di area perbukitan; Takaramachi–Tsuruma menjadi pusat medicine dan health sciences. Pemilihan tempat tinggal dan rute perjalanan sangat dipengaruhi lokasi studi.',
    studyAreas: ['Humanities & social sciences', 'Science & engineering', 'Medicine & health sciences', 'Pharmacy', 'Transdisciplinary sciences'],
    signatureFacilities: ['Kanazawa University Hospital', 'Natural Science and Technology Main Hall', 'Libraries and learning facilities', 'International Student Support / One-Stop Consultation'],
    studentExperience: 'Pengalaman belajar sangat bergantung pada school, laboratory, dan campus assignment. Di Kakuma, banyak bidang berada dalam satu kawasan besar sehingga interaksi lintas disiplin lebih mudah; mahasiswa medicine dan health sciences memiliki ritme yang lebih terpusat di Takaramachi–Tsuruma.',
    orientation: 'Universitas komprehensif dan research-oriented dengan spektrum bidang paling luas dalam jaringan kampus PPI Ishikawa.',
    distinctive: [
      'Universitas komprehensif dengan lebih dari 160 tahun sejarah institusional.',
      'Dua pola kehidupan kampus utama: Kakuma dan Takaramachi–Tsuruma.',
      'Ekosistem riset luas, termasuk science, engineering, medicine, humanities, dan interdisciplinary research.',
      'Layanan mahasiswa internasional memiliki One-Stop Consultation Counter sebagai pintu awal konsultasi.'
    ],
    profileSources: [
      { label: 'About Kanazawa University', url: 'https://www.kanazawa-u.ac.jp/en/university/' },
      { label: 'Campus Map', url: 'https://www.kanazawa-u.ac.jp/en/university/campus-guidance/map/' },
      { label: 'Campus Life & Support', url: 'https://www.kanazawa-u.ac.jp/en/students/livelihood/' }
    ]
  },
  {
    slug: 'jaist',
    glance: [
      { label: 'Didirikan', value: '1990', note: 'Graduate university nasional tanpa undergraduate division', sourceUrl: 'https://www.jaist.ac.jp/english/about/mission/' },
      { label: 'Mahasiswa', value: '1.132', note: '747 master + 385 doctoral; 1 Mei 2026', sourceUrl: 'https://www.jaist.ac.jp/about/outline/student.html' },
      { label: 'Intake 2026', value: '305', note: '256 master + 49 doctoral; April 2026', sourceUrl: 'https://www.jaist.ac.jp/about/outline/newstudent.html' },
      { label: 'Fokus studi', value: 'Graduate only', note: 'Master, doctoral, research / advanced science & technology', sourceUrl: 'https://www.jaist.ac.jp/english/' }
    ],
    landmarks: [
      { name: 'Center for Nano Materials and Technology', type: 'Riset', description: 'Pusat fasilitas nano dengan clean room, machine shop, NMR, mass spectrometry, dan instrumen analisis tingkat lanjut.', url: 'https://www.jaist.ac.jp/nmcenter/facility/' },
      { name: 'JAIST Innovation Plaza', type: 'Inovasi', description: 'Fasilitas yang menonjol dalam ekosistem kolaborasi dan innovation-related activities di kampus Asahidai.', url: 'https://www.jaist.ac.jp/english/top/campusmap/' },
      { name: 'JAIST Library', type: 'Belajar', description: 'Perpustakaan berada di tengah cluster utama kampus dan dekat dengan Institute Hall serta gedung riset.', url: 'https://www.jaist.ac.jp/library/english/' },
      { name: 'JAIST HOUSE & Student Housing', type: 'Kehidupan kampus', description: 'Housing berada di dalam kawasan kampus, sehingga kehidupan sehari-hari sangat terintegrasi dengan lingkungan akademik.', url: 'https://www.jaist.ac.jp/english/top/campusmap/' }
    ],
    academicHighlights: [
      { title: 'AI-Driven Social Transformation', category: 'AI & society', description: 'Center baru pada 2026 yang mengembangkan riset AI untuk transformasi sosial dan aplikasi lintas bidang.', url: 'https://www.jaist.ac.jp/english/about/history/' },
      { title: 'Unlimited Data-Driven Materials Exploration', category: 'Materials informatics', description: 'Center yang dibentuk pada April 2026 untuk eksplorasi material berbasis data dan komputasi.', url: 'https://www.jaist.ac.jp/english/about/history/' },
      { title: 'AI & Soft Robotics', category: 'Robotics', description: 'Research core yang menghubungkan artificial intelligence, soft robotics, sensing, dan interaksi dengan dunia fisik.', url: 'https://www.jaist.ac.jp/english/about/history/' },
      { title: 'Quantum Materials & Information Sciences', category: 'Quantum', description: 'Neo Excellent Core untuk riset pada material kuantum dan information sciences yang dibentuk dalam penguatan riset frontier JAIST.', url: 'https://www.jaist.ac.jp/english/about/history/' }
    ],
    internationalStudent: {
      admission: 'Fokus pada master, doctoral, research student, dan visiting/special visiting routes untuk pelamar internasional.',
      language: 'Banyak aktivitas akademik dan riset dapat dilakukan dalam English, terutama pada graduate study; requirement tetap berbeda menurut program/lab.',
      housing: 'Student housing dan JAIST HOUSE berada di dalam/sekitar campus area; private housing juga digunakan.',
      funding: 'MEXT, JASSO, JAIST scholarship/financial support, dan tuition-related support tersedia menurut eligibility.',
      firstContact: 'International Student Section',
      sourceUrl: 'https://www.jaist.ac.jp/english/international/'
    },
    studentLife: {
      transport: 'JAIST Shuttle menghubungkan Asahidai dengan Komatsu dan Tsurugi; Nomi Bus berguna untuk belanja, rumah sakit, city hall, dan kebutuhan lain di Nomi.',
      livingArea: 'Student Housing dan JAIST HOUSE berada di campus area; sebagian mahasiswa juga tinggal di luar kampus dan menyesuaikan perjalanan dengan shuttle atau kendaraan pribadi.',
      dailyNeeds: 'Cafeteria, convenience store, health center, library, gym, dan housing berada dalam satu cluster kampus. Untuk pilihan belanja lebih luas, mahasiswa perlu keluar dari Asahidai.',
      winter: 'Asahidai berada di area yang lebih terbuka dan terpisah dari pusat kota; salju dan kondisi jalan membuat jadwal shuttle serta perencanaan mobilitas penting.',
      community: 'Kegiatan PPI banyak berlangsung di Kanazawa, sehingga mahasiswa JAIST biasanya perlu merencanakan perjalanan Nomi–Kanazawa lebih awal.',
      sourceUrl: 'https://www.jaist.ac.jp/english/top/access/'
    },
    usefulPlaces: [
      { name: 'JAIST Bus Stop', category: 'Transport', description: 'Titik utama shuttle/bus di area kampus Asahidai.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=JAIST+bus+stop+Nomi' },
      { name: 'Tsurugi Station', category: 'Transport', description: 'Salah satu titik rail utama yang terhubung dengan shuttle JAIST.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tsurugi+Station+Ishikawa' },
      { name: 'Nomi City Hall', category: 'Administrasi', description: 'Pusat layanan kota Nomi untuk prosedur kependudukan dan administrasi lokal.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nomi+City+Hall' },
      { name: 'Nomi Area Supermarkets', category: 'Belanja', description: 'Pilihan supermarket dan toko harian berada di luar cluster Asahidai dan biasanya diakses dengan bus, mobil, atau perjalanan terencana.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=supermarket+Nomi+Ishikawa' }
    ],
    history: 'Didirikan pada 1990 sebagai universitas pascasarjana nasional independen pertama di Jepang tanpa divisi undergraduate.',
    academicStructure: 'Pendidikan berpusat pada graduate study dan riset lanjutan. Area utamanya berkembang dari Knowledge Science, Information Science, dan Materials Science dalam struktur graduate school terpadu.',
    academicCharacter: 'Lingkungan graduate-focused dengan pendidikan berbasis coursework yang sistematis dan riset frontier science and technology. Mahasiswa datang dari latar disiplin yang beragam.',
    campusEnvironment: 'Kampus Asahidai di Nomi bersifat terintegrasi: gedung riset, lecture halls, library, cafeteria, student housing, JAIST HOUSE, gym, dan layanan utama berada dalam satu kawasan.',
    studyAreas: ['Information Science', 'Knowledge Science', 'Materials Science', 'Interdisciplinary graduate research'],
    signatureFacilities: ['Center for Information Infrastructure', 'Center for Nano Materials and Technology', 'JAIST Innovation Plaza', 'Library, student housing, and JAIST HOUSE'],
    studentExperience: 'Kehidupan akademik berpusat pada research group, coursework pascasarjana, seminar, dan aktivitas laboratorium. Karena sebagian besar fasilitas utama berada di Asahidai, batas antara ruang belajar, riset, dan kehidupan kampus terasa lebih terintegrasi.',
    orientation: 'Graduate university khusus yang kehidupan akademiknya dibentuk oleh riset, seminar, dan komunitas pascasarjana.',
    distinctive: [
      'Tidak memiliki undergraduate division; kehidupan akademiknya berpusat pada master, doctoral, dan research.',
      'Dirancang sejak awal sebagai model pendidikan pascasarjana berbasis riset tingkat lanjut.',
      'Kampus dan student housing berada dalam satu lingkungan Asahidai yang relatif terpisah dari pusat kota.',
      'Mobilitas shuttle/bus dan perencanaan tempat tinggal berpengaruh besar pada pengalaman sehari-hari.'
    ],
    profileSources: [
      { label: 'Mission & Goals', url: 'https://www.jaist.ac.jp/english/about/mission/' },
      { label: 'Campus Map', url: 'https://www.jaist.ac.jp/english/top/campusmap/' },
      { label: 'JAIST Overview', url: 'https://www.jaist.ac.jp/english/' }
    ]
  },
  {
    slug: 'kanazawa-institute-of-technology',
    glance: [
      { label: 'Mahasiswa', value: '6.331', note: '5.780 undergraduate + 551 graduate; 1 Mei 2026', sourceUrl: 'https://www.kanazawa-it.ac.jp/about_kit/gakuseisuu.html' },
      { label: 'Undergraduate', value: '5.780', note: 'Data 1 Mei 2026', sourceUrl: 'https://www.kanazawa-it.ac.jp/about_kit/gakuseisuu.html' },
      { label: 'Graduate', value: '551', note: 'Data 1 Mei 2026', sourceUrl: 'https://www.kanazawa-it.ac.jp/about_kit/gakuseisuu.html' },
      { label: 'Karakter', value: 'Project Design', note: 'Problem-solving dan project-based education', sourceUrl: 'https://www.kanazawa-it.ac.jp/about_kit/' }
    ],
    landmarks: [
      { name: 'Ohgigaoka Campus', type: 'Kampus utama', description: 'Pusat utama pendidikan dan aktivitas mahasiswa KIT di Nonoichi.', url: 'https://www.kanazawa-it.ac.jp/ekit/map/ohgigaoka.html' },
      { name: 'Yatsukaho Research Campus', type: 'Riset', description: 'Research campus di Hakusan yang mendukung aktivitas riset dan proyek tertentu di luar Ohgigaoka.', url: 'https://www.kanazawa-it.ac.jp/ekit/map/yatsukaho.html' },
      { name: 'Library Center', type: 'Belajar', description: 'Salah satu fasilitas inti untuk belajar mandiri dan akses sumber akademik mahasiswa.', url: 'https://www.kanazawa-it.ac.jp/' },
      { name: 'Project Design Facilities', type: 'Project-based learning', description: 'Ruang dan fasilitas pembelajaran yang mendukung problem finding, prototyping, teamwork, dan project implementation.', url: 'https://www.kanazawa-it.ac.jp/about_kit/' }
    ],
    academicHighlights: [
      { title: 'Robotics & Physical AI', category: 'Robotics', description: 'Robotics di KIT menggabungkan AI, machine learning, sensing, control, mechanical design, drones, dan system integration.', url: 'https://www.kanazawa-it.ac.jp/gakubu_daigakuin/c-joho/robo/' },
      { title: 'Project Design Education', category: 'Project-based learning', description: 'Model pembelajaran problem-finding dan problem-solving yang menghubungkan mahasiswa dengan tema perusahaan dan persoalan nyata.', url: 'https://www.kanazawa-it.ac.jp/about_kit/' },
      { title: 'Architecture & Design', category: 'Built environment', description: 'Bidang architecture dan design menjadi salah satu kekuatan akademik KIT dengan orientasi pada perancangan, teknologi, dan implementasi.', url: 'https://www.kanazawa-it.ac.jp/' },
      { title: 'Bioscience & Applied Chemistry', category: 'Bio & chemistry', description: 'KIT juga memiliki jalur bioscience dan applied chemistry yang memperluas spektrum universitas di luar engineering klasik.', url: 'https://www.kanazawa-it.ac.jp/' }
    ],
    internationalStudent: {
      admission: 'Incoming international students dapat datang melalui degree, exchange, research, atau partner-program route tergantung skema.',
      language: 'Program reguler terutama berbahasa Jepang; program exchange/international tertentu menyediakan dukungan atau coursework dalam English.',
      housing: 'Accommodation options tersedia untuk jenis program tertentu; private housing di Nonoichi juga umum.',
      funding: 'Scholarship dan tuition-related support mengikuti status program dan skema penerimaan masing-masing.',
      firstContact: 'Center for International Programs',
      sourceUrl: 'https://www.kanazawa-it.ac.jp/ekit/exchanges/index.html'
    },
    studentLife: {
      transport: 'Ohgigaoka dapat dicapai dengan Hokutetsu Bus dari Kanazawa Station; dari pusat Kanazawa perjalanan bus sekitar 30–40 menit menurut panduan resmi.',
      livingArea: 'Nonoichi dan area selatan Kanazawa praktis untuk akses ke Ohgigaoka. Pilihan tempat tinggal tetap perlu disesuaikan dengan program dan durasi studi.',
      dailyNeeds: 'Cafeteria, library, student support, international programs, dan fasilitas belajar tersedia di kampus; Nonoichi memiliki banyak toko dan layanan dalam radius harian.',
      winter: 'Sepeda tetap berguna pada banyak musim, tetapi salju dapat mengurangi kepraktisannya. Bus atau berjalan kaki perlu menjadi alternatif saat kondisi jalan buruk.',
      community: 'Lokasi Nonoichi masih relatif dekat dengan Kanazawa, sehingga akses ke kegiatan PPI umumnya lebih mudah dibanding kampus yang berada lebih jauh ke selatan.',
      sourceUrl: 'https://www.kanazawa-it.ac.jp/ekit/map/ohgigaoka.html'
    },
    usefulPlaces: [
      { name: 'Ohgigaoka Campus', category: 'Transport', description: 'Titik utama akses kampus KIT di Nonoichi.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kanazawa+Institute+of+Technology+Ohgigaoka' },
      { name: 'Nonoichi Station Area', category: 'Transport & belanja', description: 'Koridor penting untuk rail access, toko, restoran, dan kebutuhan harian.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nonoichi+Station+Ishikawa' },
      { name: 'Nonoichi City Hall', category: 'Administrasi', description: 'Pusat layanan kota untuk registrasi alamat dan layanan warga.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nonoichi+City+Hall' },
      { name: 'Nonoichi Supermarkets', category: 'Belanja', description: 'Banyak pilihan supermarket dan drugstore tersebar di Nonoichi dan area selatan Kanazawa.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=supermarket+Nonoichi+Ishikawa' }
    ],
    history: 'Kanazawa Institute of Technology berkembang sebagai universitas swasta teknologi dengan orientasi kuat pada pendidikan rekayasa, kreativitas, dan hubungan antara pembelajaran dengan penerapan di masyarakat.',
    academicStructure: 'Struktur akademik terkini mencakup enam faculties dan 17 departments, termasuk engineering, information, media/information design, architecture, bioscience/chemistry, serta bidang terkait.',
    academicCharacter: 'Project Design education menjadi ciri penting KIT: mahasiswa dibiasakan menemukan masalah, merumuskan solusi, menguji gagasan, dan bekerja pada persoalan yang terhubung dengan masyarakat atau industri.',
    campusEnvironment: 'Ohgigaoka Campus di Nonoichi menjadi pusat utama kehidupan mahasiswa; Yatsukaho Research Campus di Hakusan memperluas aktivitas riset dan proyek tertentu.',
    studyAreas: ['Engineering', 'Information & computer fields', 'Architecture & design', 'Bioscience & chemistry', 'Media / information design'],
    signatureFacilities: ['Ohgigaoka learning facilities', 'Yatsukaho Research Campus', 'Library and self-learning spaces', 'Project and fabrication-oriented facilities'],
    studentExperience: 'Mahasiswa banyak berhadapan dengan project, team-based problem solving, presentation, prototyping, dan aktivitas yang menghubungkan kelas dengan kasus nyata. Kultur kampus menempatkan belajar aktif di luar lecture sebagai bagian penting dari pengalaman pendidikan.',
    orientation: 'Universitas teknologi dengan identitas kuat pada project-based learning, engineering, design, dan penerapan solusi.',
    distinctive: [
      'Identitas kuat pada engineering, technology, design, dan problem-solving.',
      'Project-based learning digunakan sebagai bagian penting dari pendidikan.',
      'Ohgigaoka memiliki banyak fasilitas belajar dan aktivitas mahasiswa yang dirancang untuk penggunaan aktif di luar jam kelas.',
      'Hubungan dengan industri dan proyek implementatif cukup menonjol dalam model pendidikan KIT.'
    ],
    profileSources: [
      { label: 'About KIT', url: 'https://www.kanazawa-it.ac.jp/about_kit/' },
      { label: 'KIT Main Site', url: 'https://www.kanazawa-it.ac.jp/' },
      { label: 'International Exchange', url: 'https://www.kanazawa-it.ac.jp/ekit/exchanges/index.html' }
    ]
  },
  {
    slug: 'ishikawa-prefectural-university',
    glance: [
      { label: 'Mahasiswa', value: '589', note: '535 undergraduate + 54 graduate; 1 Mei 2026', sourceUrl: 'https://www.ishikawa-pu.ac.jp/information/outline/number-2/' },
      { label: 'Undergraduate', value: '535', note: 'Faculty of Bioresources and Environmental Sciences', sourceUrl: 'https://www.ishikawa-pu.ac.jp/information/outline/number-2/' },
      { label: 'Graduate', value: '54', note: '47 master + 7 doctoral; 1 Mei 2026', sourceUrl: 'https://www.ishikawa-pu.ac.jp/information/outline/number-2/' },
      { label: 'Departemen utama', value: '3', note: 'Bioproduction, Environmental, Food Science', sourceUrl: 'https://www.ishikawa-pu.ac.jp/undergraduate/' }
    ],
    landmarks: [
      { name: 'University Farm', type: 'Field learning', description: 'Sekitar 2,6 ha lahan pertanian dengan greenhouse dan fasilitas praktikum untuk pembelajaran produksi pertanian secara langsung.', url: 'https://www.ishikawa-pu.ac.jp/research/farm/' },
      { name: 'Research Institute for Bioresources and Biotechnology', type: 'Riset', description: 'Pusat riset yang terhubung erat dengan kekuatan kampus pada bioresources dan life science.', url: 'https://www.ishikawa-pu.ac.jp/' },
      { name: 'Large Greenhouse & Environmental Facilities', type: 'Eksperimen', description: 'Bagian dari cluster fasilitas eksperimen untuk tanaman, lingkungan, air, dan biosains.', url: 'https://www.ishikawa-pu.ac.jp/access/campusmap/' },
      { name: 'Library & Information Center', type: 'Belajar', description: 'Pusat sumber belajar yang berada di kompleks utama kampus Suematsu.', url: 'https://www.ishikawa-pu.ac.jp/access/campusmap/' }
    ],
    academicHighlights: [
      { title: 'Bioproduction Science', category: 'Agriculture & bioresources', description: 'Mengkaji produksi biologis dan pertanian melalui kombinasi ilmu tanaman, biologi, teknologi produksi, dan field-based learning.', url: 'https://www.ishikawa-pu.ac.jp/undergraduate/' },
      { title: 'Environmental Science', category: 'Environment', description: 'Berfokus pada lingkungan alam, ekosistem, water/environmental systems, dan pengelolaan sumber daya.', url: 'https://www.ishikawa-pu.ac.jp/undergraduate/' },
      { title: 'Food Science', category: 'Food', description: 'Menghubungkan kimia, mikrobiologi, nutrisi, keamanan, pengolahan, dan pengembangan pangan.', url: 'https://www.ishikawa-pu.ac.jp/undergraduate/' },
      { title: 'Applied Life Science', category: 'Life science', description: 'Graduate-level research memperdalam bioscience, biotechnology, dan life science dengan fasilitas eksperimen yang kuat.', url: 'https://www.ishikawa-pu.ac.jp/admission/graduate_admission/' }
    ],
    internationalStudent: {
      admission: 'Tersedia special selection untuk international students pada jalur tertentu; graduate admission memiliki ketentuan tersendiri.',
      language: 'Sebagian besar program reguler menggunakan bahasa Jepang; kemampuan Japanese penting untuk perkuliahan dan kehidupan akademik sehari-hari.',
      housing: 'Tidak memiliki university dormitory; mahasiswa perlu menyiapkan private housing.',
      funding: 'Scholarship eksternal dan dukungan mahasiswa dapat tersedia, tetapi eligibility harus diperiksa per tahun akademik.',
      firstContact: 'Academic & Student Affairs Section',
      sourceUrl: 'https://www.ishikawa-pu.ac.jp/admission/'
    },
    studentLife: {
      transport: 'Akses dapat menggunakan JR Nonoichi yang dilanjutkan community shuttle/bus; sepeda dan mobil juga relevan untuk kehidupan sehari-hari.',
      livingArea: 'Mahasiswa umumnya perlu memilih private housing di Nonoichi atau area dengan koneksi praktis ke kampus Suematsu karena tidak ada university dormitory.',
      dailyNeeds: 'Nonoichi menyediakan supermarket, drugstore, restoran, city facilities, dan community bus; kebutuhan sehari-hari relatif tersebar di sekitar kota.',
      winter: 'Perjalanan dengan sepeda dapat menjadi lebih sulit saat salju; akses bus/shuttle dan jarak berjalan kaki dari tempat tinggal perlu dipertimbangkan.',
      community: 'Secara geografis masih dekat dengan Kanazawa dan KIT/Nonoichi area, sehingga relatif mudah terhubung dengan kegiatan PPI dan mahasiswa kampus lain.',
      sourceUrl: 'https://www.ishikawa-pu.ac.jp/access/'
    },
    usefulPlaces: [
      { name: 'Ishikawa Prefectural University', category: 'Kampus', description: 'Titik utama kampus Suematsu di Nonoichi.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ishikawa+Prefectural+University' },
      { name: 'Nonoichi Station', category: 'Transport', description: 'Rail access utama dari arah Kanazawa, dilanjutkan bus/shuttle atau sepeda.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nonoichi+Station+Ishikawa' },
      { name: 'Nonoichi City Hall', category: 'Administrasi', description: 'Pusat administrasi kota untuk prosedur penduduk dan layanan lokal.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nonoichi+City+Hall' },
      { name: 'Suematsu / Nonoichi Shopping Area', category: 'Belanja', description: 'Area sekitar kampus dan pusat Nonoichi memiliki supermarket, drugstore, dan restoran untuk kebutuhan harian.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=supermarket+Suematsu+Nonoichi' }
    ],
    history: 'Universitas publik yang dikelola oleh Ishikawa Prefectural Public University Corporation dan berakar kuat pada kebutuhan pertanian, lingkungan, pangan, serta biosains di wilayah Ishikawa.',
    academicStructure: 'Faculty of Bioresources and Environmental Sciences mencakup Bioproduction Science, Environmental Science, dan Food Science; graduate study memperdalam bidang bioresources/environment dan applied life science.',
    academicCharacter: 'Kampusnya relatif spesialis dibanding universitas komprehensif: pendidikan dan riset berpusat pada hubungan antara sumber daya hayati, lingkungan, pangan, pertanian, dan life science.',
    campusEnvironment: 'Kampus Suematsu di Nonoichi memiliki fasilitas yang langsung mendukung pembelajaran terapan, seperti experimental farm, greenhouse, Bioresource Engineering Research Institute, water-related experimental facilities, dan LEAF lab.',
    studyAreas: ['Bioproduction Science', 'Environmental Science', 'Food Science', 'Applied Life Science'],
    signatureFacilities: ['Experimental Farm', 'Greenhouse facilities', 'Bioresource Engineering Research Institute', 'LEAF and environmental / water-related research facilities'],
    studentExperience: 'Pengalaman belajar dekat dengan laboratory, fieldwork, agriculture, environmental measurement, food science, dan eksperimen biologis. Skala disiplin yang lebih fokus membuat hubungan antara mata kuliah, laboratorium, dan fasilitas eksperimen terlihat jelas.',
    orientation: 'Universitas publik spesialis yang berpusat pada bioresources, lingkungan, pangan, pertanian, dan life science.',
    distinctive: [
      'Fokus akademik jelas pada agriculture, environment, food, bioresources, dan applied life science.',
      'Banyak fasilitas kampus berkaitan langsung dengan eksperimen biologis, pertanian, dan lingkungan.',
      'Skala bidang yang lebih fokus membuat hubungan study–laboratory–fieldwork terasa kuat.',
      'Lokasinya di Nonoichi menghubungkan suasana kampus yang tenang dengan akses ke kawasan Kanazawa.'
    ],
    profileSources: [
      { label: 'University Guide', url: 'https://www.ishikawa-pu.ac.jp/information/university_guide/' },
      { label: 'Campus Facilities', url: 'https://www.ishikawa-pu.ac.jp/access/campusmap/' },
      { label: 'Around Campus', url: 'https://www.ishikawa-pu.ac.jp/campus/guide/' }
    ]
  },
  {
    slug: 'kinjo-university',
    glance: [
      { label: 'Faculties', value: '4', note: 'Interdisciplinary Economics, Human and Social Sciences, Health Sciences, Nursing', sourceUrl: 'https://www.kinjo.ac.jp/english/about/department.html' },
      { label: 'Graduate', value: '1 school', note: 'Graduate School of Comprehensive Rehabilitation', sourceUrl: 'https://www.kinjo.ac.jp/english/about/department.html' },
      { label: 'Kampus utama', value: 'Kasama + Matto', note: 'Lokasi studi berbeda menurut program', sourceUrl: 'https://www.kinjo.ac.jp/ku/access/' },
      { label: 'International support', value: 'Dedicated center', note: 'International Exchange Center lintas faculty/department', sourceUrl: 'https://www.kinjo.ac.jp/english/student/center.html' }
    ],
    landmarks: [
      { name: 'Kasama Campus Library', type: 'Belajar', description: 'Perpustakaan dengan koleksi sekitar 130 ribu buku dan materi yang berfokus pada bidang akademik universitas.', url: 'https://www.kinjo.ac.jp/ku/campuslife/library.html' },
      { name: 'KINJO Sky Deck', type: 'Campus life', description: 'Rooftop deck ber-Wi-Fi di Kasama Campus dengan pandangan ke Hakusan dan Laut Jepang pada cuaca cerah.', url: 'https://www.kinjo.ac.jp/ku/campuslife/factory.html' },
      { name: 'Learning Commons', type: 'Belajar kolaboratif', description: 'Ruang untuk group work dan diskusi yang mendukung pembelajaran aktif mahasiswa.', url: 'https://www.kinjo.ac.jp/ku/campuslife/studentsupport.html' },
      { name: 'Career Support Center', type: 'Karier', description: 'Pusat dengan staf khusus untuk konsultasi individual, mock interview, résumé review, dan informasi kerja.', url: 'https://www.kinjo.ac.jp/ku/job/support.html' }
    ],
    academicHighlights: [
      { title: 'Comprehensive Rehabilitation', category: 'Rehabilitation', description: 'Graduate School dan Faculty of Health Sciences memperkuat pendidikan dan riset pada physical therapy, occupational therapy, serta rehabilitation sciences.', url: 'https://www.kinjo.ac.jp/english/about/department.html' },
      { title: 'Nursing & Public Health', category: 'Nursing', description: 'Nursing dan Advanced Course of Public Health Nursing menekankan clinical learning, community health, dan professional qualification.', url: 'https://www.kinjo.ac.jp/english/about/department.html' },
      { title: 'Social Welfare & Education', category: 'Welfare & education', description: 'Bidang social welfare, child education, dan human services menjadi salah satu pilar akademik utama Kinjo.', url: 'https://www.kinjo.ac.jp/english/about/department.html' },
      { title: 'Interdisciplinary Economics', category: 'Economics', description: 'Faculty of Interdisciplinary Economics menghubungkan business, economics, regional society, dan practical problem-solving.', url: 'https://www.kinjo.ac.jp/english/about/department.html' }
    ],
    internationalStudent: {
      admission: 'Memiliki international-student admission route tersendiri untuk program tertentu.',
      language: 'Perkuliahan reguler umumnya menggunakan bahasa Jepang; kemampuan Japanese penting untuk class, practicum, dan professional training.',
      housing: 'Tidak menyediakan foreign-student dormitory; mahasiswa internasional menggunakan private apartment.',
      funding: 'Tuition reduction dan scholarship support tersedia menurut ketentuan yang berlaku.',
      firstContact: 'International Exchange Center',
      sourceUrl: 'https://www.kinjo.ac.jp/english/'
    },
    studentLife: {
      transport: 'Kasama Campus dekat koridor Kaga-Kasama; Matto Campus memiliki pola akses berbeda. Pemilihan route perlu mengikuti faculty dan lokasi kelas/practicum.',
      livingArea: 'Karena tidak ada foreign-student dormitory, mahasiswa internasional menggunakan private apartment; akses rail/bus menjadi faktor penting saat memilih lokasi.',
      dailyNeeds: 'Hakusan memiliki layanan harian di sekitar stasiun dan koridor utama, tetapi pola belanja dan commute berbeda dari pusat Kanazawa.',
      winter: 'Rail biasanya menjadi tulang punggung perjalanan yang lebih stabil, sementara sepeda dan bus lokal dapat lebih terpengaruh kondisi musim dingin.',
      community: 'Untuk kegiatan PPI di Kanazawa, mahasiswa perlu memperhitungkan perjalanan Hakusan–Kanazawa dan jadwal kereta terakhir.',
      sourceUrl: 'https://www.kinjo.ac.jp/english/prospective/living.html'
    },
    usefulPlaces: [
      { name: 'Kaga-Kasama Station', category: 'Transport', description: 'Stasiun rail penting untuk akses Kasama Campus.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kaga-Kasama+Station' },
      { name: 'Matto Station', category: 'Transport', description: 'Titik rail utama untuk akses area Matto dan fasilitas terkait Nursing.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Matto+Station+Ishikawa' },
      { name: 'Hakusan City Hall', category: 'Administrasi', description: 'Pusat layanan administrasi Kota Hakusan.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hakusan+City+Hall' },
      { name: 'Kasama / Matto Shopping Area', category: 'Belanja', description: 'Supermarket, restoran, dan layanan harian tersebar di koridor Kasama–Matto.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=supermarket+Hakusan+Ishikawa' }
    ],
    history: 'Kinjo University berkembang sebagai universitas swasta di Hakusan dengan pendidikan yang dekat dengan kebutuhan profesi, layanan masyarakat, kesehatan, welfare, pendidikan, dan ekonomi.',
    academicStructure: 'Memiliki faculties pada Interdisciplinary Economics, Human and Social Sciences, Health Sciences, dan Nursing, ditambah Advanced Course of Public Health Nursing serta Graduate School of Comprehensive Rehabilitation.',
    academicCharacter: 'Banyak program diarahkan pada kompetensi profesional dan praktik lapangan. Universitas juga menekankan pendidikan kelompok kecil dan pendampingan mahasiswa dari awal hingga akhir studi.',
    campusEnvironment: 'Kasama Campus menjadi basis utama banyak program, sedangkan Matto Campus juga penting terutama untuk Nursing. Karena itu lokasi kelas dan practicum harus dipahami sejak memilih tempat tinggal.',
    studyAreas: ['Interdisciplinary Economics', 'Social Welfare & Education', 'Rehabilitation / Health Sciences', 'Nursing', 'Comprehensive Rehabilitation'],
    signatureFacilities: ['Kasama Campus professional-learning facilities', 'Matto Campus nursing facilities', 'Health and Counseling Rooms', 'Career Support and International Exchange services'],
    studentExperience: 'Banyak program memiliki practicum, professional training, qualification preparation, dan interaksi dengan institusi eksternal. Karena itu pengalaman mahasiswa tidak hanya dibentuk oleh kelas, tetapi juga praktik, placement, dan kesiapan profesi.',
    orientation: 'Universitas profesional dengan fokus kuat pada kesehatan, welfare, pendidikan, ekonomi, dan jalur menuju profesi.',
    distinctive: [
      'Kuat pada bidang health, rehabilitation, nursing, welfare, education, dan professional pathways.',
      'Pembelajaran memiliki hubungan erat dengan qualification, practicum, dan kesiapan kerja profesional.',
      'Kasama dan Matto menciptakan dua pola perjalanan kampus yang perlu dibedakan.',
      'International Exchange Center menjadi jalur penting bagi mahasiswa internasional.'
    ],
    profileSources: [
      { label: 'University Overview', url: 'https://www.kinjo.ac.jp/ku/outline/' },
      { label: 'University Features', url: 'https://www.kinjo.ac.jp/ku/outline/feature.html' },
      { label: 'International Student Guide', url: 'https://www.kinjo.ac.jp/english/prospective/pdf/A%20General%20Guide%20for%20International%20Students.pdf' }
    ]
  },
  {
    slug: 'alice-gakuen',
    glance: [
      { label: 'Berdiri', value: '1992', note: 'Alice International Gakuen didirikan setelah dua tahun persiapan', sourceUrl: 'https://gakuen.alice-japan.net/about-us/history' },
      { label: 'Kampus Ishikawa', value: '2', note: 'Kanazawa dan Kaga', sourceUrl: 'https://gakuen.alice-japan.net/access' },
      { label: 'Program utama', value: '3', note: 'Japanese Language, International Business, Care Worker', sourceUrl: 'https://gakuen.alice-japan.net/courses' },
      { label: 'Jaringan internasional', value: '10+ negara/region', note: 'Menerima siswa melalui partner institutions di lebih dari 10 negara/region', sourceUrl: 'https://gakuen.alice-japan.net/about-us/education-philosophy' }
    ],
    landmarks: [
      { name: 'Kanazawa Campus', type: 'Kampus', description: 'Kampus Enkoji-honmachi untuk Japanese Language, International Business, dan Care Worker.', url: 'https://gakuen.alice-japan.net/access' },
      { name: 'Kaga Campus', type: 'Kampus', description: 'Kampus di area Daishoji untuk Japanese Language dan International Business.', url: 'https://gakuen.alice-japan.net/access' },
      { name: 'Student Dormitory Network', type: 'Tempat tinggal', description: 'Dormitory menjadi bagian penting pengalaman siswa; Japanese Language students pada prinsipnya tinggal di dorm sesuai ketentuan sekolah.', url: 'https://gakuen.alice-japan.net/entrance-exam/dormitory' },
      { name: 'Employment Support Center', type: 'Karier', description: 'Jalur khusus untuk employment support dan koneksi dengan perusahaan yang menerima international students.', url: 'https://gakuen.alice-japan.net/' }
    ],
    academicHighlights: [
      { title: 'Japanese Language Education', category: 'Language', description: 'Program bahasa Jepang menjadi fondasi untuk studi lanjut, vocational education, dan transisi menuju kehidupan akademik atau kerja di Jepang.', url: 'https://gakuen.alice-japan.net/courses' },
      { title: 'International Business', category: 'Business', description: 'Program vocational yang menggabungkan bahasa Jepang, business skills, dan persiapan kerja untuk lingkungan internasional di Jepang.', url: 'https://gakuen.alice-japan.net/courses' },
      { title: 'Care Worker Education', category: 'Care & welfare', description: 'Program care worker mengarah pada kompetensi profesional dan kesiapan bekerja di sektor welfare/care di Jepang.', url: 'https://gakuen.alice-japan.net/courses' },
      { title: 'Employment & Career Pathway', category: 'Career', description: 'Pendidikan vokasi didukung jalur employment support dan persiapan transisi siswa internasional menuju kerja atau studi berikutnya.', url: 'https://gakuen.alice-japan.net/' }
    ],
    internationalStudent: {
      admission: 'International students dapat masuk ke Japanese Language, International Business, atau Care Worker routes sesuai syarat program.',
      language: 'Japanese menjadi bahasa utama pembelajaran dan target kompetensi; level awal berbeda menurut program.',
      housing: 'Japanese Language students pada prinsipnya tinggal di student dormitory sesuai guidance sekolah.',
      funding: 'Informasi biaya, reduction, dan dukungan finansial mengikuti program serta intake masing-masing.',
      firstContact: 'Academic Affairs / international life-support staff',
      sourceUrl: 'https://gakuen.alice-japan.net/entrance-exam/admissions-in'
    },
    studentLife: {
      transport: 'Kanazawa Campus mengikuti pola bus/bicycle kota Kanazawa, sedangkan Kaga Campus lebih berpusat pada Daishoji dan jaringan transportasi Kaga.',
      livingArea: 'Japanese Language students di Kanazawa dan Kaga pada prinsipnya tinggal di dormitory yang ditentukan sekolah; aturan berbeda dapat berlaku untuk program lain.',
      dailyNeeds: 'Kehidupan siswa sangat terkait dengan dormitory, sekolah, part-time work, supermarket, city procedures, dan kemampuan bahasa Jepang praktis.',
      winter: 'Kanazawa dan Kaga sama-sama mengalami musim dingin Hokuriku; siswa perlu mempertimbangkan jarak dorm–kampus, sepatu salju, dan waktu perjalanan.',
      community: 'Siswa Kanazawa lebih dekat dengan pusat kegiatan PPI; siswa Kaga perlu merencanakan perjalanan yang lebih panjang untuk kegiatan lintas wilayah.',
      sourceUrl: 'https://gakuen.alice-japan.net/entrance-exam/dormitory'
    },
    usefulPlaces: [
      { name: 'Alice Gakuen Kanazawa Campus', category: 'Kampus', description: 'Kampus utama Kanazawa di Enkoji-honmachi.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Alice+Gakuen+Kanazawa' },
      { name: 'Alice Gakuen Kaga Campus', category: 'Kampus', description: 'Kampus Kaga di area Daishoji.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Alice+Gakuen+Kaga' },
      { name: 'Daishoji Station', category: 'Transport', description: 'Titik rail penting untuk siswa Kaga Campus.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Daishoji+Station' },
      { name: 'Kaga City Hall', category: 'Administrasi', description: 'Pusat administrasi Kota Kaga untuk siswa yang tinggal di wilayah Kaga.', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kaga+City+Hall' }
    ],
    history: 'Alice International Gakuen group was established in 1992 and develops vocational education, Japanese-language education, welfare-related training, and support for international human resources.',
    academicStructure: 'Di Ishikawa, Alice Gakuen memiliki Japanese Language Department, International Business Department, dan Care Worker Department, dengan kegiatan pendidikan di Kanazawa dan Kaga.',
    academicCharacter: 'Berbeda dari universitas, Alice berorientasi pada language progression, vocational skills, qualification, employment preparation, dan transisi mahasiswa internasional menuju studi atau pekerjaan berikutnya.',
    campusEnvironment: 'Kanazawa Campus berada di Enkoji-honmachi, sedangkan Kaga Campus berada di Daishoji. Kedua lokasi memiliki pola transportasi, tempat tinggal, dan kehidupan sehari-hari yang berbeda.',
    studyAreas: ['Japanese Language', 'International Business', 'Care Worker / welfare education', 'Career and employment preparation'],
    signatureFacilities: ['Kanazawa Campus', 'Kaga Campus', 'Student dormitory network', 'Employment Support Center and life-support services'],
    studentExperience: 'Ritme belajar lebih dekat dengan language acquisition, attendance, vocational practice, qualification, part-time-work management, dan persiapan kerja atau studi lanjutan. Bagi siswa internasional, dukungan kehidupan sehari-hari menjadi bagian penting dari pengalaman sekolah.',
    orientation: 'Sekolah vokasi dan bahasa yang menghubungkan kemampuan bahasa Jepang, keterampilan kerja, qualification, dan jalur setelah lulus.',
    distinctive: [
      'Lingkungan belajar multinasional dengan siswa internasional dari lebih dari sepuluh negara menurut profil resmi sekolah.',
      'Jalur Japanese Language dapat terhubung ke program vocational internal tertentu.',
      'International Business dan Care Worker menekankan keterampilan yang langsung terkait dengan pekerjaan di Jepang.',
      'Dukungan kehidupan sehari-hari, dormitory, part-time work, dan employment support menjadi bagian penting pengalaman siswa.'
    ],
    profileSources: [
      { label: 'About Alice', url: 'https://gakuen.alice-japan.net/about-us' },
      { label: 'Courses', url: 'https://gakuen.alice-japan.net/courses' },
      { label: 'Alice in 10 Keywords', url: 'https://gakuen.alice-japan.net/about-us/alice-keywords' }
    ]
  }
];

export const campusProfileBySlug = Object.fromEntries(
  campusProfileDetails.map((profile) => [profile.slug, profile])
) as Record<string, CampusProfileDetail>;

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
