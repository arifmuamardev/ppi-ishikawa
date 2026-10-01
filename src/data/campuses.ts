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

export interface CampusProfileDetail {
  slug: string;
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
