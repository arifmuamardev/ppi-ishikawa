export interface FamilyMunicipalityLink {
  label: string;
  description: string;
  url: string;
}

export interface FamilyMunicipality {
  id: 'kanazawa' | 'nonoichi' | 'hakusan' | 'nomi' | 'komatsu';
  name: string;
  jp: string;
  context: string;
  startingPoint: string;
  caution: string;
  links: FamilyMunicipalityLink[];
}

export const familyMunicipalities: FamilyMunicipality[] = [
  {
    id: 'kanazawa',
    name: 'Kanazawa City',
    jp: '金沢市',
    context: 'Paling relevan untuk banyak mahasiswa Kanazawa University dan anggota yang tinggal di pusat Kanazawa.',
    startingPoint: 'Mulai dari halaman Children & Family untuk foreign residents atau portal 子育て・教育. Untuk urusan spesifik, gunakan link langsung di bawah.',
    caution: 'Kanazawa punya banyak sumber English/multilingual, tetapi eligibility tetap mengikuti resident registration dan kondisi keluarga.',
    links: [
      {
        label: 'Family guide untuk foreign residents',
        description: 'Pregnancy, childbirth, childcare, allowance, medical support, dan education.',
        url: 'https://www4.city.kanazawa.lg.jp/kurashi_tetsuzuki/gaikokujimmuke/9990.html'
      },
      {
        label: 'Childcare & education portal',
        description: 'Pintu utama pregnancy, preschool, school, allowance, facility, dan application.',
        url: 'https://www4.city.kanazawa.lg.jp/kosodate_kyoiku/index.html'
      },
      {
        label: 'Child allowance',
        description: 'Eligibility, prosedur, dan perubahan kondisi penerima.',
        url: 'https://www4.city.kanazawa.lg.jp/kosodate_kyoiku/jidoteate_jidofuyoteate/10612.html'
      },
      {
        label: 'Child medical fee subsidy',
        description: 'Cakupan subsidi biaya medis anak dan update terbaru.',
        url: 'https://www4.city.kanazawa.lg.jp/hojokin_joseikin/1/17585.html'
      },
      {
        label: 'Education for foreign children',
        description: 'Japanese coaching dan support untuk foreign/returnee students.',
        url: 'https://www4.city.kanazawa.lg.jp/kosodate_kyoiku/kyoikuiinkai/gakkokyoiku/12405.html'
      },
      {
        label: 'Bahasa Indonesia di City Hall',
        description: 'Multilingual telephone interpretation termasuk Bahasa Indonesia.',
        url: 'https://www4.city.kanazawa.lg.jp/kurashi_tetsuzuki/gaikokujimmuke/9989.html'
      }
    ]
  },
  {
    id: 'nonoichi',
    name: 'Nonoichi City',
    jp: '野々市市',
    context: 'Sangat relevan untuk keluarga di sekitar Kanazawa Institute of Technology dan Ishikawa Prefectural University.',
    startingPoint: 'Gunakan portal 子育て sebagai hub, lalu 子育て支援課 untuk nursery/kodomo-en, allowance, medical support, dan family support.',
    caution: 'Deadline childcare dan school-year information diperbarui per tahun; gunakan halaman tahun entry yang benar.',
    links: [
      {
        label: 'Parenting portal',
        description: 'Childcare, vaccination, nursery/kodomo-en, after-school club, dan family support.',
        url: 'https://www.city.nonoichi.lg.jp/life/1/10/'
      },
      {
        label: 'Childcare Support Division',
        description: 'Nursery, kodomo-en, family support, child allowance, dan medical support.',
        url: 'https://www.city.nonoichi.lg.jp/soshiki/17/index-2.html'
      },
      {
        label: 'Child allowance',
        description: 'Eligibility dan prosedur 児童手当.',
        url: 'https://www.city.nonoichi.lg.jp/site/kosodate-biyori/1133.html'
      },
      {
        label: 'Child medical subsidy',
        description: 'Medical fee assistance sampai usia yang ditetapkan kota.',
        url: 'https://www.city.nonoichi.lg.jp/site/kosodate-biyori/990.html'
      },
      {
        label: 'School / Board of Education',
        description: 'Enrollment, transfer, school district, dan education administration.',
        url: 'https://www.city.nonoichi.lg.jp/soshiki/33/index.html'
      },
      {
        label: 'Mitte Childcare Support Center',
        description: 'Open play, consultation, temporary care, dan post-illness childcare.',
        url: 'https://www.city.nonoichi.lg.jp/soshiki/27/'
      }
    ]
  },
  {
    id: 'hakusan',
    name: 'Hakusan City',
    jp: '白山市',
    context: 'Relevan untuk keluarga di area Hakusan, termasuk sekitar Kinjo University.',
    startingPoint: 'Portal 子育て Hakusan adalah titik awal terbaik karena mengumpulkan childcare, health, allowance, medical support, dan child-rearing services.',
    caution: 'Beberapa halaman sekolah bersifat lebih lama tetapi masih menjadi jalur resmi; cek update dan kontak section bila kondisi Anda spesifik.',
    links: [
      {
        label: 'Hakusan parenting portal',
        description: 'Childcare support, health, nursery/kodomo-en, allowance, dan services.',
        url: 'https://www.city.hakusan.lg.jp/kosodate/'
      },
      {
        label: 'Child allowance',
        description: 'Eligibility, amount, dan prosedur terbaru.',
        url: 'https://www.city.hakusan.lg.jp/kosodate/1001577/1018950/index.html'
      },
      {
        label: 'Child medical support',
        description: 'Medical fee support untuk anak sampai batas usia yang ditetapkan kota.',
        url: 'https://www.city.hakusan.lg.jp/kosodate/1001577/1001888.html'
      },
      {
        label: 'School enrollment & transfer',
        description: 'School district, enrollment, transfer, dan education support.',
        url: 'https://www.city.hakusan.lg.jp/kurashi/koseki/nyugaku.html'
      },
      {
        label: 'Child-Rearing Support Division',
        description: 'Counter untuk allowance, medical support, children centers, dan family consultation.',
        url: 'https://www.city.hakusan.lg.jp/shisei/soshiki/hon/1005292/1012292.html'
      }
    ]
  },
  {
    id: 'nomi',
    name: 'Nomi City',
    jp: '能美市',
    context: 'Paling relevan untuk keluarga mahasiswa JAIST dan anggota yang tinggal di Terai, Tatsunokuchi, atau Neagari.',
    startingPoint: 'Untuk urusan anak, Child-Rearing Support Division menangani allowance, child medical support, nursery, children centers, dan after-school care.',
    caution: 'Sebagian school-procedure page Nomi lebih lama; gunakan sebagai alur dasar dan konfirmasi langsung jika Anda baru pindah dari luar Jepang.',
    links: [
      {
        label: 'Child-Rearing Support Division',
        description: 'Allowance, medical support, nursery, children center, dan after-school care.',
        url: 'https://www.city.nomi.ishikawa.jp/docs/450.html'
      },
      {
        label: 'Childcare / kodomo-en admission',
        description: 'Certification category, yearly application, dan admission procedure.',
        url: 'https://www.city.nomi.ishikawa.jp/docs/2919.html'
      },
      {
        label: 'Childcare Support Center',
        description: 'Parenting consultation, monthly program, dan Family Support Center.',
        url: 'https://www.city.nomi.ishikawa.jp/docs/194.html'
      },
      {
        label: 'School enrollment & transfer',
        description: 'Elementary/junior-high enrollment dan transfer procedure.',
        url: 'https://www.city.nomi.ishikawa.jp/docs/667.html'
      },
      {
        label: 'Moving checklist',
        description: 'Nomi mencantumkan child medical support, allowance, dan school contacts dalam moving procedure.',
        url: 'https://www.city.nomi.ishikawa.jp/docs/139.html'
      }
    ]
  },
  {
    id: 'komatsu',
    name: 'Komatsu City',
    jp: '小松市',
    context: 'Relevan untuk keluarga yang tinggal di South Kaga dan anggota dengan aktivitas studi/kerja di area Komatsu.',
    startingPoint: 'Mulai dari Child-Rearing Support Division untuk allowance/medical support dan Childcare Environment Division untuk nursery/kodomo-en.',
    caution: 'Komatsu memiliki banyak program keluarga lokal; jangan menganggap semua benefit berlaku otomatis untuk setiap foreign student family.',
    links: [
      {
        label: 'Child-Rearing Support Division',
        description: 'Medical subsidy, child allowance, dan family welfare support.',
        url: 'https://www.city.komatsu.lg.jp/soshiki/1029/index.html'
      },
      {
        label: 'Parenting / medical support',
        description: 'Child medical subsidy dan program family support lainnya.',
        url: 'https://www.city.komatsu.lg.jp/soshiki/1029/kosodate/index.html'
      },
      {
        label: 'School enrollment & transfer',
        description: 'Elementary/junior-high admission, transfer, dan designated school process.',
        url: 'https://www.city.komatsu.lg.jp/soshiki/1045/kyouiku_gakkou/2038.html'
      },
      {
        label: 'Foreign resident support',
        description: 'Living guide dan support portal untuk foreign residents.',
        url: 'https://www.city.komatsu.lg.jp/kurasi_tetuzuki/foreigner/index.html'
      },
      {
        label: 'City department directory',
        description: 'Childcare Environment, Child-Rearing Support, maternal/child health, dan contact desk.',
        url: 'https://www.city.komatsu.lg.jp/soshiki/837.html'
      }
    ]
  }
];
