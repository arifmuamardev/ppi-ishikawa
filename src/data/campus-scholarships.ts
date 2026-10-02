export interface ScholarshipItem {
  title: string;
  type: string;
  summary: string;
  note?: string;
  url: string;
}

export interface CampusScholarshipProfile {
  campusSlug: string;
  heading: string;
  intro: string;
  beforeArrival: string[];
  afterArrival: string[];
  items: ScholarshipItem[];
  caution: string;
  lastChecked: string;
}

export const campusScholarships: Record<string, CampusScholarshipProfile> = {
  'kanazawa-university': {
    campusSlug: 'kanazawa-university',
    heading: 'Beasiswa dan dukungan biaya di Kanazawa University',
    intro: 'Pisahkan tiga jalur: beasiswa yang sudah diamankan sebelum datang, beasiswa yang diumumkan setelah menjadi mahasiswa KU, dan tuition/admission fee waiver. Eligibility berbeda menurut status, jenjang, visa, dan sumber pendanaan.',
    beforeArrival: [
      'MEXT Scholarship dapat diperoleh melalui jalur yang sesuai sebelum/ketika masuk Jepang; scholarship students memiliki perlakuan biaya tersendiri.',
      'Jika Anda self-financed, jangan berasumsi akan memperoleh scholarship setelah tiba. Siapkan rencana biaya yang tetap aman tanpa scholarship tambahan.'
    ],
    afterArrival: [
      'Pantau halaman Financial Support / Scholarships KU dan pengumuman school/graduate school.',
      'Privately financed international students dapat memiliki jalur bantuan atau tuition-fee waiver tertentu, tetapi syarat dan periode aplikasi berubah per semester.',
      'Untuk doctoral students, KU juga memiliki program dukungan doktoral/peneliti dengan eligibility khusus.'
    ],
    items: [
      {
        title: 'KU Financial Support & Scholarships',
        type: 'Portal utama',
        summary: 'Portal resmi untuk scholarship, benefit/loan, tuition waiver, dan KU unique scholarship systems.',
        url: 'https://www.kanazawa-u.ac.jp/en/students/economic/'
      },
      {
        title: 'Tuition Fee Waiver',
        type: 'Pengurangan biaya',
        summary: 'KU membuka tuition-fee waiver per semester/kelompok mahasiswa. Privately financed international students harus mengikuti eligibility dan jadwal yang berlaku.',
        url: 'https://www.kanazawa-u.ac.jp/students/economic/tuition_waiver'
      },
      {
        title: 'KU Unique Scholarship / Doctoral Support',
        type: 'Internal KU',
        summary: 'KU memiliki skema internal termasuk dukungan untuk doctoral students dan researcher-track tertentu; eligibility berbeda menurut program.',
        url: 'https://www.kanazawa-u.ac.jp/students/economic/special_support/'
      }
    ],
    caution: 'JASSO loan-type dan sebagian national support schemes yang ditujukan untuk Japanese/permanent-resident students tidak otomatis tersedia untuk international students. Selalu cek label eligibility sebelum mendaftar.',
    lastChecked: 'October 2026'
  },

  'jaist': {
    campusSlug: 'jaist',
    heading: 'Beasiswa dan tuition support di JAIST',
    intro: 'JAIST membedakan scholarship yang dapat dicari sebelum tiba di Jepang dan scholarship yang baru dapat diajukan setelah menjadi mahasiswa. Untuk calon mahasiswa internasional, MEXT adalah salah satu jalur penting yang perlu dicek jauh sebelum enrollment.',
    beforeArrival: [
      'MEXT Scholarship tersedia melalui jalur yang relevan, termasuk university recommendation untuk kandidat yang memenuhi syarat.',
      'JAIST juga mencantumkan scholarship pemerintah negara asal serta beberapa local/private foundations yang dapat dibuka sebelum datang.'
    ],
    afterArrival: [
      'Setelah masuk JAIST, ada scholarship local government/private foundations; sebagian memerlukan recommendation dari JAIST.',
      'JAIST memiliki benefit-type scholarship dan fee-reduction systems dengan syarat akademik/finansial tertentu.',
      'JAIST mengingatkan bahwa kompetisi scholarship setelah enrollment tinggi; jangan datang dengan asumsi pasti memperoleh scholarship.'
    ],
    items: [
      {
        title: 'Scholarships for International Students',
        type: 'Portal utama',
        summary: 'Halaman resmi yang membedakan scholarship sebelum dan setelah tiba di Jepang, termasuk MEXT dan foundation scholarships.',
        url: 'https://www.jaist.ac.jp/english/studentlife/support/scholarships.html'
      },
      {
        title: 'MEXT Scholarship Track',
        type: 'Sebelum enrollment',
        summary: 'JAIST menyediakan application guides untuk International Priority Graduate Programs / MEXT scholarship track pada program tertentu.',
        url: 'https://www.jaist.ac.jp/english/admissions/application-guide/guide-m-scholarship'
      },
      {
        title: 'Entrance / Tuition Fee Reduction',
        type: 'Pengurangan biaya',
        summary: 'Mahasiswa dengan kesulitan finansial yang memenuhi kriteria akademik dapat mengajukan reduction/deferment sesuai aturan JAIST.',
        url: 'https://www.jaist.ac.jp/english/studentlife/support/fee.html'
      }
    ],
    caution: 'Scholarship setelah masuk tidak dijamin. JAIST sendiri menyarankan mahasiswa internasional menyiapkan dana yang cukup karena persaingan scholarship cukup tinggi.',
    lastChecked: 'October 2026'
  },

  'kanazawa-institute-of-technology': {
    campusSlug: 'kanazawa-institute-of-technology',
    heading: 'Beasiswa dan financial support di KIT',
    intro: 'KIT memiliki berbagai scholarship dan tuition-support systems, tetapi eligibility sangat bergantung pada status mahasiswa, jenjang, dan jenis program. Incoming exchange/research students tidak boleh mengasumsikan semua skema Japanese domestic students berlaku untuk mereka.',
    beforeArrival: [
      'Tanyakan Center for International Programs apakah program incoming Anda memiliki tuition arrangement atau scholarship melalui partner university/home institution.',
      'Jika Anda degree-seeking student, cek admission guide dan scholarship rules yang berlaku untuk intake Anda.'
    ],
    afterArrival: [
      'KIT menyediakan portal scholarship dan menangani berbagai external scholarship procedures.',
      'Graduate students dapat memiliki graduate-study incentives atau research-related support tertentu sesuai eligibility.',
      'Pantau pengumuman kampus; beberapa skema hanya dibuka pada periode tertentu.'
    ],
    items: [
      {
        title: 'KIT Scholarships',
        type: 'Portal utama',
        summary: 'Portal resmi KIT tentang scholarship, grant-type support, JASSO-related procedures, dan sistem bantuan lain.',
        url: 'https://www.kanazawa-it.ac.jp/campuslife/shogakukin.html'
      },
      {
        title: 'Graduate Study Incentives',
        type: 'Graduate support',
        summary: 'KIT memiliki Graduate School incentives untuk kebutuhan finansial, research achievement, conference travel, dan keadaan darurat tertentu.',
        url: 'https://www.kanazawa-it.ac.jp/campuslife/daigakuin_shoreikin.html'
      },
      {
        title: 'Center for International Programs',
        type: 'Cek eligibility',
        summary: 'Incoming international students sebaiknya mengonfirmasi skema yang benar-benar berlaku untuk status/program mereka melalui international office.',
        url: 'https://www.kanazawa-it.ac.jp/ekit/exchanges/center.html'
      }
    ],
    caution: 'Jangan memakai tabel JASSO/domestic scholarship KIT sebagai bukti eligibility mahasiswa internasional. Konfirmasi langsung ke KIT untuk status Anda.',
    lastChecked: 'October 2026'
  },

  'ishikawa-prefectural-university': {
    campusSlug: 'ishikawa-prefectural-university',
    heading: 'Beasiswa untuk mahasiswa internasional di IPU',
    intro: 'FAQ resmi IPU menyatakan tidak ada tuition-exemption atau scholarship system internal khusus yang dapat dijanjikan kepada international applicants. Jika ada scholarship dari foundation atau organisasi eksternal, kampus akan mengumumkannya ketika募集 tersedia.',
    beforeArrival: [
      'Buat rencana biaya tanpa mengandalkan scholarship internal IPU.',
      'Cari MEXT, scholarship pemerintah/organisasi di negara asal, atau external foundation yang dapat diajukan sebelum datang.'
    ],
    afterArrival: [
      'Pantau pengumuman Academic & Student Affairs untuk scholarship foundation/external yang dibuka.',
      'Tanyakan eligibility dan apakah aplikasi perlu melalui recommendation universitas.',
      'Jangan menggunakan informasi scholarship kampus lain sebagai asumsi untuk IPU.'
    ],
    items: [
      {
        title: 'International Applicant FAQ',
        type: 'Sumber utama',
        summary: 'FAQ resmi IPU menjelaskan posisi kampus mengenai tuition exemption dan scholarship untuk international applicants.',
        url: 'https://www.ishikawa-pu.ac.jp/admission/abroad/'
      },
      {
        title: 'Academic & Student Affairs',
        type: 'Kontak',
        summary: 'Gunakan bagian ini untuk menanyakan pengumuman scholarship eksternal yang sedang dibuka dan prosedur rekomendasi.',
        url: 'https://www.ishikawa-pu.ac.jp/about_ipu/contact/'
      }
    ],
    caution: 'Saat ini jangan menulis “IPU menyediakan scholarship X” tanpa pengumuman resmi aktif. Skema foundation dapat berubah dari tahun ke tahun.',
    lastChecked: 'October 2026'
  },

  'kinjo-university': {
    campusSlug: 'kinjo-university',
    heading: 'Beasiswa dan tuition reduction di Kinjo University',
    intro: 'Kinjo mempublikasikan tuition-reduction scholarship untuk privately financed international students dan juga mengarahkan mahasiswa ke external scholarships. Skema tetap memiliki syarat akademik dan student conduct.',
    beforeArrival: [
      'Baca international-student admission/living guide terbaru dan pastikan tuition reduction tersedia untuk intake/program Anda.',
      'Siapkan budget tanpa menganggap scholarship eksternal pasti diperoleh.'
    ],
    afterArrival: [
      'Tuition-reduction scholarship Kinjo untuk international students diajukan pada periode enrollment sesuai panduan yang berlaku.',
      'Kinjo juga menyebut JASSO Honors Scholarship dan Ishikawa Prefectural Scholarship sebagai contoh external support untuk international students.',
      'International Exchange Center dapat membantu informasi scholarship dan prosedur aplikasi.'
    ],
    items: [
      {
        title: 'International Student Guide',
        type: 'International scholarship',
        summary: 'Panduan Kinjo menjelaskan tuition-reduction scholarship untuk privately financed international students; pada guide yang tersedia, reduction sebesar 50% tuition dengan persyaratan tertentu.',
        url: 'https://www.kinjo.ac.jp/english/prospective/pdf/A%20General%20Guide%20for%20International%20Students.pdf'
      },
      {
        title: 'International Exchange Center',
        type: 'Kontak',
        summary: 'Pusat dukungan mahasiswa internasional untuk scholarship, study, residence status, housing, dan daily life.',
        url: 'https://www.kinjo.ac.jp/english/student/center.html'
      },
      {
        title: 'Other Scholarship Systems',
        type: 'Portal kampus',
        summary: 'Kinjo juga menangani berbagai scholarship dan tuition-support procedures; eligibility harus dicek per skema.',
        url: 'https://kinjo.ac.jp/ku/admissions/scholarships/'
      }
    ],
    caution: 'Tuition reduction dapat dibatalkan bila academic performance atau conduct tidak memenuhi ketentuan. Selalu gunakan guide intake terbaru.',
    lastChecked: 'October 2026'
  },

  'alice-gakuen': {
    campusSlug: 'alice-gakuen',
    heading: 'Beasiswa dan pengurangan biaya di Alice Gakuen',
    intro: 'Alice mempublikasikan scholarship/discount yang berbeda menurut department. Karena Japanese Language, International Business, dan Care Worker memiliki skema berbeda, cek program Anda terlebih dahulu sebelum membandingkan nominal.',
    beforeArrival: [
      'Periksa tuition/fees dan scholarship page sesuai department sebelum membayar.',
      'Untuk Care Worker, ada skema khusus international students yang dapat sangat besar, tetapi eligibility dan obligation harus dibaca penuh pada募集要項.',
      'N1/N2 atau jalur admission tertentu dapat memengaruhi admission-fee discount/exemption pada program tertentu.'
    ],
    afterArrival: [
      'Alice mengumumkan scholarship external untuk international students setelah enrollment sesuai program dan availability.',
      'Contoh yang dicantumkan Alice meliputi Ishikawa Prefectural Scholarship dan JASSO Honors Scholarship untuk program tertentu.',
      'Care Worker scholarship dapat memiliki kewajiban kerja/ketentuan setelah lulus; baca repayment/waiver conditions, bukan hanya nominal bantuan.'
    ],
    items: [
      {
        title: 'Tuition & Scholarships',
        type: 'Portal utama',
        summary: 'Halaman resmi Alice berisi tuition, discounts, dan scholarship menurut department untuk Japanese/international students.',
        url: 'https://gakuen.alice-japan.net/apply/tuition-fee'
      },
      {
        title: 'International Student Admissions',
        type: 'Admission',
        summary: 'Gunakan admission information untuk memastikan eligibility, payment schedule, dan dokumen program yang Anda tuju.',
        url: 'https://gakuen.alice-japan.net/entrance-exam/admissions-in'
      },
      {
        title: 'Employment / Life Support',
        type: 'Konsultasi',
        summary: 'Tanyakan kewajiban scholarship, career pathway, dan pengaruh scholarship terhadap rencana setelah lulus kepada staff terkait.',
        url: 'https://gakuen.alice-japan.net/entrance-exam/teachers'
      }
    ],
    caution: 'Jangan menyalin angka JASSO dari halaman sekolah tanpa memeriksa sumber JASSO terbaru; nominal, durasi, dan jumlah penerima dapat berubah. Untuk Care Worker, pahami kewajiban pasca-lulus sebelum menerima scholarship.',
    lastChecked: 'October 2026'
  }
};
