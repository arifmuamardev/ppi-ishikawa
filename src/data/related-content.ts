export interface RelatedContentItem {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export const relatedSurvivalContent: Record<string, RelatedContentItem[]> = {
  SG01: [
    { title: 'Hari Pertama di Ishikawa', description: 'Lanjutkan dari persiapan keberangkatan ke urutan tindakan setelah tiba.', href: '/life-in-ishikawa/hari-pertama/', icon: 'arrival' },
    { title: 'Tempat Tinggal', description: 'Pahami kontrak, biaya awal, aturan unit, dan hal yang perlu dicek sebelum memilih housing.', href: '/life-in-ishikawa/tempat-tinggal/', icon: 'housing' },
    { title: 'Campus Hub', description: 'Buka panduan kampus untuk akses, housing, support, dan kebutuhan spesifik institusimu.', href: '/community/kampus/', icon: 'campus' }
  ],
  SG02: [
    { title: 'Administrasi', description: 'Resident registration, insurance, pension, My Number, dan prosedur awal lainnya.', href: '/life-in-ishikawa/administrasi/', icon: 'documents' },
    { title: 'Panduan Pemerintah Lokal', description: 'Cari city/town yang sesuai dengan alamat tempat tinggalmu.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' },
    { title: 'Bank & Keuangan', description: 'Siapkan rekening, pembayaran, kartu, dan pengelolaan uang setelah kebutuhan awal selesai.', href: '/life-in-ishikawa/bank-money/', icon: 'money' }
  ],
  SG03: [
    { title: 'Panduan Pemerintah Lokal', description: 'Banyak prosedur administrasi berbeda menurut municipality tempat alamatmu terdaftar.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' },
    { title: 'Bank & Keuangan', description: 'Hubungkan administrasi awal dengan rekening, pembayaran, dan kebutuhan finansial.', href: '/life-in-ishikawa/bank-money/', icon: 'money' },
    { title: 'Bahasa Jepang & Dukungan', description: 'Gunakan IFIE, kampus, atau support resmi ketika prosedur sulit dipahami.', href: '/life-in-ishikawa/japanese-support/', icon: 'language' }
  ],
  SG04: [
    { title: 'Transportasi', description: 'Nilai housing berdasarkan commute harian, bukan hanya harga sewa.', href: '/life-in-ishikawa/transportasi/', icon: 'transport' },
    { title: 'Panduan Pemerintah Lokal', description: 'Alamat menentukan city hall, garbage calendar, water, tax, dan layanan lokal.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' },
    { title: 'Musim Dingin', description: 'Cek apakah lokasi dan unit tetap praktis saat hujan, salju, dan freezing.', href: '/life-in-ishikawa/winter/', icon: 'winter' }
  ],
  SG05: [
    { title: 'Panduan Pemerintah Lokal', description: 'Garbage, water, local services, dan aturan harian mengikuti municipality.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' },
    { title: 'Transportasi', description: 'Bus, train, bicycle, dan winter travel sangat memengaruhi rutinitas sehari-hari.', href: '/life-in-ishikawa/transportasi/', icon: 'transport' },
    { title: 'Bahasa Jepang & Dukungan', description: 'Cari kelas bahasa dan bantuan ketika komunikasi sehari-hari menjadi hambatan.', href: '/life-in-ishikawa/japanese-support/', icon: 'language' }
  ],
  SG06: [
    { title: 'Tempat Tinggal', description: 'Commute yang baik dimulai dari pilihan lokasi housing yang tepat.', href: '/life-in-ishikawa/tempat-tinggal/', icon: 'housing' },
    { title: 'Musim Dingin', description: 'Pelajari backup transport dan keselamatan ketika snow atau ice mengubah perjalanan.', href: '/life-in-ishikawa/winter/', icon: 'winter' },
    { title: 'Campus Hub', description: 'Bandingkan lokasi kampus dan pola mobilitas tiap institusi.', href: '/community/kampus/', icon: 'campus' }
  ],
  SG07: [
    { title: 'Bahasa Jepang & Dukungan', description: 'Gunakan jalur support ketika bahasa menjadi hambatan saat mencari layanan medis.', href: '/life-in-ishikawa/japanese-support/', icon: 'language' },
    { title: 'Bencana & Darurat', description: 'Bedakan layanan kesehatan biasa dengan situasi yang membutuhkan 119 atau respons darurat.', href: '/life-in-ishikawa/disaster-emergency/', icon: 'emergency' },
    { title: 'Keluarga & Anak', description: 'Lihat jalur pediatric care, pregnancy, childcare, dan layanan keluarga lainnya.', href: '/life-in-ishikawa/family-anak/', icon: 'family' }
  ],
  SG08: [
    { title: 'Panduan Pemerintah Lokal', description: 'Childcare, school, subsidy, dan family support sangat terkait municipality.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' },
    { title: 'Kesehatan', description: 'Cari clinic, pediatric care, medical support, dan informasi darurat.', href: '/life-in-ishikawa/kesehatan/', icon: 'health' },
    { title: 'Tempat Tinggal', description: 'Kebutuhan keluarga mengubah prioritas ukuran unit, lokasi, sekolah, dan commute.', href: '/life-in-ishikawa/tempat-tinggal/', icon: 'housing' }
  ],
  SG09: [
    { title: 'Administrasi', description: 'Rekening dan pembayaran sering berkaitan dengan resident status, insurance, tax, dan dokumen.', href: '/life-in-ishikawa/administrasi/', icon: 'documents' },
    { title: 'Kehidupan Sehari-hari', description: 'Hubungkan pengelolaan uang dengan utilities, belanja, pembayaran rutin, dan konsumsi.', href: '/life-in-ishikawa/kehidupan-sehari-hari/', icon: 'guide' },
    { title: 'Meninggalkan Ishikawa / Jepang', description: 'Sebelum pulang, selesaikan rekening, pembayaran, refund, dan kewajiban finansial.', href: '/life-in-ishikawa/leaving/', icon: 'documents' }
  ],
  SG10: [
    { title: 'Kesehatan', description: 'Ketahui kapan menggunakan clinic, #7119, atau ambulance 119.', href: '/life-in-ishikawa/kesehatan/', icon: 'health' },
    { title: 'Musim Dingin', description: 'Heavy snow, frozen roads, dan disruption membutuhkan persiapan khusus.', href: '/life-in-ishikawa/winter/', icon: 'winter' },
    { title: 'Panduan Pemerintah Lokal', description: 'Hazard map, evacuation place, dan informasi lokal mengikuti municipality.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' }
  ],
  SG11: [
    { title: 'Transportasi', description: 'Siapkan alternatif commute ketika bicycle, bus, atau road condition terpengaruh snow.', href: '/life-in-ishikawa/transportasi/', icon: 'transport' },
    { title: 'Tempat Tinggal', description: 'Heating, condensation, frozen pipes, dan akses saat snow terkait langsung dengan housing.', href: '/life-in-ishikawa/tempat-tinggal/', icon: 'housing' },
    { title: 'Bencana & Darurat', description: 'Buka jalur informasi live ketika heavy snow berkembang menjadi disruption atau emergency.', href: '/life-in-ishikawa/disaster-emergency/', icon: 'emergency' }
  ],
  SG12: [
    { title: 'Kesehatan', description: 'Dukungan bahasa sangat penting ketika mencari clinic, hospital, atau counseling.', href: '/life-in-ishikawa/kesehatan/', icon: 'health' },
    { title: 'Administrasi', description: 'Gunakan support resmi ketika residence, insurance, pension, atau dokumen sulit dipahami.', href: '/life-in-ishikawa/administrasi/', icon: 'documents' },
    { title: 'Community', description: 'Temukan jalur komunitas PPI ketika yang dibutuhkan adalah pengalaman dan koneksi antarmahasiswa.', href: '/community/', icon: 'support' }
  ],
  SG13: [
    { title: 'Administrasi', description: 'Pastikan moving-out, insurance, pension, residence, dan dokumen selesai sebelum pergi.', href: '/life-in-ishikawa/administrasi/', icon: 'documents' },
    { title: 'Bank & Keuangan', description: 'Tutup atau rapikan rekening, pembayaran, refund, dan kewajiban finansial.', href: '/life-in-ishikawa/bank-money/', icon: 'money' },
    { title: 'Panduan Pemerintah Lokal', description: 'Moving-out notification dan layanan lokal mengikuti municipality tempat tinggalmu.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' }
  ],
  SG14: [
    { title: 'Administrasi', description: 'Gunakan municipality yang benar untuk resident registration, insurance, pension, dan My Number.', href: '/life-in-ishikawa/administrasi/', icon: 'documents' },
    { title: 'Kehidupan Sehari-hari', description: 'Garbage, water, utilities, dan banyak kebutuhan lokal mengikuti aturan city/town.', href: '/life-in-ishikawa/kehidupan-sehari-hari/', icon: 'guide' },
    { title: 'Bencana & Darurat', description: 'Hazard map, evacuation shelter, dan alert lokal juga terkait municipality.', href: '/life-in-ishikawa/disaster-emergency/', icon: 'emergency' }
  ]
};

export const campusRelatedContent: Record<string, RelatedContentItem[]> = {
  'kanazawa-university': [
    { title: 'Transportasi', description: 'Pahami commute ke Kakuma dan pilihan mobilitas dari Kanazawa.', href: '/life-in-ishikawa/transportasi/', icon: 'transport' },
    { title: 'Panduan Kanazawa', description: 'Layanan municipality mengikuti alamat tempat tinggal di Kanazawa atau city lain.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' },
    { title: 'Tempat Tinggal', description: 'Bandingkan dormitory, apartment, biaya, dan akses sebelum memilih lokasi.', href: '/life-in-ishikawa/tempat-tinggal/', icon: 'housing' }
  ],
  jaist: [
    { title: 'Transportasi', description: 'JAIST membutuhkan perhatian khusus pada shuttle, train, dan first/last mile.', href: '/life-in-ishikawa/transportasi/', icon: 'transport' },
    { title: 'Panduan Nomi', description: 'City services, garbage, family support, dan local procedures mengikuti Nomi.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' },
    { title: 'Tempat Tinggal', description: 'Bandingkan student housing dengan kebutuhan family, transport, dan daily life.', href: '/life-in-ishikawa/tempat-tinggal/', icon: 'housing' }
  ],
  'kanazawa-institute-of-technology': [
    { title: 'Transportasi', description: 'Nonoichi dan Kanazawa punya banyak opsi mobilitas, tetapi commute tetap perlu dihitung.', href: '/life-in-ishikawa/transportasi/', icon: 'transport' },
    { title: 'Panduan Nonoichi', description: 'Gunakan layanan municipality sesuai alamat tinggal, terutama untuk administrasi dan garbage.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' },
    { title: 'Tempat Tinggal', description: 'Pertimbangkan jarak ke Ohgigaoka, station, supermarket, dan winter travel.', href: '/life-in-ishikawa/tempat-tinggal/', icon: 'housing' }
  ],
  'ishikawa-prefectural-university': [
    { title: 'Transportasi', description: 'IPU berada di Nonoichi; cek akses bus, bicycle, dan pilihan commute lainnya.', href: '/life-in-ishikawa/transportasi/', icon: 'transport' },
    { title: 'Panduan Nonoichi', description: 'Layanan municipality penting untuk resident registration, garbage, dan family support.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' },
    { title: 'Kehidupan Sehari-hari', description: 'Hubungkan lokasi kampus dengan shopping, daily services, dan kebutuhan rutin.', href: '/life-in-ishikawa/kehidupan-sehari-hari/', icon: 'guide' }
  ],
  'kinjo-university': [
    { title: 'Transportasi', description: 'Kasama/Hakusan memerlukan perencanaan train, bicycle, bus, atau car sesuai housing.', href: '/life-in-ishikawa/transportasi/', icon: 'transport' },
    { title: 'Panduan Hakusan', description: 'Gunakan Hakusan Living Guide untuk layanan lokal sesuai alamat tempat tinggal.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' },
    { title: 'Tempat Tinggal', description: 'Nilai housing berdasarkan access ke kampus dan kehidupan harian di Hakusan.', href: '/life-in-ishikawa/tempat-tinggal/', icon: 'housing' }
  ],
  'alice-gakuen': [
    { title: 'Transportasi', description: 'Kanazawa dan Kaga memiliki pola commute yang berbeda; pilih panduan sesuai kampus.', href: '/life-in-ishikawa/transportasi/', icon: 'transport' },
    { title: 'Panduan Pemerintah Lokal', description: 'Gunakan municipality Kanazawa atau Kaga sesuai lokasi dan alamat tempat tinggal.', href: '/life-in-ishikawa/municipality-guides/', icon: 'city' },
    { title: 'Bahasa Jepang & Dukungan', description: 'Cari IFIE dan jalur support lain ketika kebutuhan bahasa melampaui dukungan kampus.', href: '/life-in-ishikawa/japanese-support/', icon: 'language' }
  ]
};


export const generalRelatedContent: Record<string, RelatedContentItem[]> = {
  about: [
    { title: 'Program & kegiatan', description: 'Lihat fokus kerja tujuh departemen dan bidang layanan yang ditangani periode 2026/27.', href: '/programs/', icon: 'guide' },
    { title: 'Komunitas', description: 'Lihat jalur anggota, keluarga, pendatang baru, dan dukungan yang tersedia.', href: '/community/', icon: 'support' },
    { title: 'Hubungi PPI', description: 'Gunakan jalur bantuan atau kontak organisasi sesuai kebutuhanmu.', href: '/contact/', icon: 'collaboration' }
  ],
  community: [
    { title: 'Campus Hub', description: 'Temukan panduan enam institusi dan bandingkan housing, mobility, serta support.', href: '/community/kampus/', icon: 'campus' },
    { title: 'Survival Guide', description: 'Gunakan panduan hidup di Ishikawa untuk administrasi, kesehatan, transportasi, dan kebutuhan sehari-hari.', href: '/life-in-ishikawa/', icon: 'guide' },
    { title: 'Bahasa & dukungan', description: 'Cari IFIE, dukungan kampus, immigration, labor support, dan jalur konsultasi lainnya.', href: '/life-in-ishikawa/japanese-support/', icon: 'support' }
  ],
  resources: [
    { title: 'Campus Hub', description: 'Mulai dari institusimu jika kebutuhanmu spesifik pada kampus.', href: '/community/kampus/', icon: 'campus' },
    { title: 'Survival Guide', description: 'Mulai dari kebutuhan hidup jika topikmu lintas kampus dan municipality.', href: '/life-in-ishikawa/', icon: 'guide' },
    { title: 'Hubungi PPI', description: 'Gunakan jalur bantuan ketika informasi yang tersedia belum menjawab kebutuhanmu.', href: '/contact/', icon: 'support' }
  ],
  contact: [
    { title: 'Survival Guide', description: 'Banyak kebutuhan praktis dapat dijawab langsung melalui panduan yang sudah tersedia.', href: '/life-in-ishikawa/', icon: 'guide' },
    { title: 'Campus Hub', description: 'Gunakan panduan kampus jika pertanyaanmu terkait institusi tertentu.', href: '/community/kampus/', icon: 'campus' },
    { title: 'Komunitas', description: 'Kenali ruang komunitas dan jalur keterlibatan anggota PPI Ishikawa.', href: '/community/', icon: 'support' }
  ],
  programs: [
    { title: 'Tentang PPI Ishikawa', description: 'Lihat visi, nilai, struktur, dan pembagian tanggung jawab organisasi.', href: '/about/', icon: 'documents' },
    { title: 'Komunitas', description: 'Program berangkat dari kebutuhan komunitas pelajar Indonesia di Ishikawa.', href: '/community/', icon: 'support' },
    { title: 'Hubungi PPI', description: 'Gunakan kanal kontak untuk kolaborasi, media, atau kebutuhan organisasi.', href: '/contact/', icon: 'collaboration' }
  ]
};
