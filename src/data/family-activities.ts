export type ActivityTag = 'indoor' | 'outdoor' | 'free' | 'baby' | 'preschool' | 'school' | 'winter';

export interface FamilyActivityPlace {
  id: string;
  name: string;
  area: string;
  address: string;
  summary: string;
  bestFor: string;
  costLabel: string;
  tags: ActivityTag[];
  sourceUrl: string;
  sourceLabel: string;
  note?: string;
}

export const familyActivityFilters: { id: ActivityTag | 'all'; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'indoor', label: 'Indoor' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'free', label: 'Gratis' },
  { id: 'baby', label: 'Bayi' },
  { id: 'preschool', label: 'Balita / Preschool' },
  { id: 'school', label: 'Anak sekolah' },
  { id: 'winter', label: 'Winter / hujan' }
];

export const familyActivityPlaces: FamilyActivityPlace[] = [
  {
    id: 'kanazawa-station-kids-land',
    name: "Kanazawa Station Kids' Land",
    area: 'Kanazawa Station',
    address: '1-1 Kinoshinbo-machi, Kanazawa · di area Kanazawa Station',
    summary: 'Ruang bermain anak gratis di area stasiun; praktis untuk singgah ketika menunggu kereta, belanja, atau cuaca buruk.',
    bestFor: 'Bayi–preschool · transit singkat · hari hujan',
    costLabel: 'Gratis',
    tags: ['indoor', 'free', 'baby', 'preschool', 'winter'],
    sourceUrl: 'https://www4.city.kanazawa.lg.jp/kosodate_kyoiku/ikuji_mishugakuji/hoikujo_kodomoen_yochien/10644.html',
    sourceLabel: 'Kanazawa City',
    note: 'Cek hari tutup sebelum berangkat.'
  },
  {
    id: 'omicho-childrens-play-area',
    name: "Omicho Children's Play Area",
    area: 'Omicho Market',
    address: '88 Aokusa-machi, Kanazawa · Omicho Ichiba-kan 3F',
    summary: 'Indoor play area untuk usia 0 sampai sebelum sekolah, dengan nursing room, diaper-changing station, toilet anak, dan opsi temporary childcare.',
    bestFor: 'Bayi–preschool · pusat kota · nursing/diaper needs',
    costLabel: 'Area bermain gratis',
    tags: ['indoor', 'free', 'baby', 'preschool', 'winter'],
    sourceUrl: 'https://www4.city.kanazawa.lg.jp/kosodate_kyoiku/kosodate_kyoikushisetsu/omichokoryuplaza/12430.html',
    sourceLabel: 'Kanazawa City',
    note: 'Temporary childcare terpisah dan berbayar; cek reservasi dan aturan terbaru.'
  },
  {
    id: 'amerun-park',
    name: 'Amerun Park',
    area: 'Isobe, Kanazawa',
    address: 'Ro-23-1 Isobe-machi, Kanazawa',
    summary: 'Indoor active-play facility dengan area turf dan adventure play; berguna saat hujan, salju, atau anak perlu bergerak lebih banyak.',
    bestFor: 'Preschool–anak sekolah · active play · winter',
    costLabel: 'Berbayar ringan',
    tags: ['indoor', 'preschool', 'school', 'winter'],
    sourceUrl: 'https://www.okunaikouryuhiroba.jp/index.html',
    sourceLabel: 'Amerun Park official',
    note: 'Cek slot penggunaan, maintenance closure, dan tarif terbaru sebelum berangkat.'
  },
  {
    id: 'tamagawa-childrens-library',
    name: "Tamagawa Children's Library",
    area: 'Tamagawa, Kanazawa',
    address: '2-2 Tamagawa-cho, Kanazawa',
    summary: 'Children-focused library dengan Wooden Plaza dan program keluarga; cocok untuk aktivitas tenang, membaca, dan waktu indoor.',
    bestFor: 'Bayi–anak sekolah · buku · aktivitas tenang',
    costLabel: 'Gratis',
    tags: ['indoor', 'free', 'baby', 'preschool', 'school', 'winter'],
    sourceUrl: 'https://www4.city.kanazawa.lg.jp/material/files/group/6/kosodate_handbook_2026.pdf',
    sourceLabel: 'Kanazawa Child-Rearing Handbook 2026'
  },
  {
    id: 'ishikawa-prefectural-library',
    name: 'Ishikawa Prefectural Library · Children’s Area',
    area: 'Kodatsuno, Kanazawa',
    address: '2-43-1 Kodatsuno, Kanazawa',
    summary: 'Children’s Area yang memang dirancang untuk orang tua dan anak, dengan board/card games, picture books, story sessions, dan outdoor Narrative Forest.',
    bestFor: 'Bayi–anak sekolah · buku · mixed indoor/outdoor',
    costLabel: 'Gratis',
    tags: ['indoor', 'outdoor', 'free', 'baby', 'preschool', 'school', 'winter'],
    sourceUrl: 'https://www.library.pref.ishikawa.lg.jp/category/bypurpose/1017.html',
    sourceLabel: 'Ishikawa Prefectural Library',
    note: 'Story sessions punya jadwal tersendiri; cek kalender library.'
  },
  {
    id: 'tamagawa-park',
    name: 'Tamagawa Park',
    area: 'Tamagawa, Kanazawa',
    address: '2 Tamagawa-cho, Kanazawa',
    summary: 'Park dekat Omicho/Nagamachi dengan lawn, playground, shaded seating, dan inclusive play equipment; mudah dipadukan dengan Tamagawa Children’s Library.',
    bestFor: 'Preschool–anak sekolah · picnic · kombinasi park + library',
    costLabel: 'Gratis',
    tags: ['outdoor', 'free', 'preschool', 'school'],
    sourceUrl: 'https://www4.city.kanazawa.lg.jp/kids/shiminnokurashi/3/24264.html',
    sourceLabel: 'Kanazawa City'
  },
  {
    id: 'oku-utatsuyama',
    name: 'Oku-Utatsuyama Kenmin Park',
    area: 'Wakamatsu, Kanazawa',
    address: 'E-85 Wakamatsu-machi, Kanazawa',
    summary: 'Large hillside park dengan adventure playground, lawn, hammocks, dan ruang istirahat; lebih cocok jika punya waktu setengah hari.',
    bestFor: 'Preschool–anak sekolah · outdoor besar · picnic',
    costLabel: 'Gratis',
    tags: ['outdoor', 'free', 'preschool', 'school'],
    sourceUrl: 'https://visitkanazawa.jp/en/attractions/detail_50566.html',
    sourceLabel: 'Visit Kanazawa official',
    note: 'Lebih praktis dengan kendaraan; cek cuaca dan kondisi musim dingin.'
  },
  {
    id: 'civic-art-village',
    name: 'Kanazawa Civic Art Center · Yamato-machi Square',
    area: 'Yamato-machi, Kanazawa',
    address: '1-1 Yamato-machi, Kanazawa',
    summary: 'Area seni dengan lawn yang luas, walking space, dan kegiatan budaya. Cocok untuk keluarga yang ingin ruang terbuka tanpa harus keluar jauh dari pusat kota.',
    bestFor: 'Preschool–anak sekolah · lawn · event budaya',
    costLabel: 'Area luar gratis',
    tags: ['outdoor', 'free', 'preschool', 'school'],
    sourceUrl: 'https://www.artvillage.gr.jp/facilities/square',
    sourceLabel: 'Kanazawa Civic Art Center',
    note: 'Area air bukan kolam renang; ikuti aturan keselamatan dan informasi musim panas terbaru.'
  },
  {
    id: 'ishikawa-zoo',
    name: 'Ishikawa Zoo',
    area: 'Nomi',
    address: '600 Tokusan-machi, Nomi, Ishikawa',
    summary: 'Pilihan outing setengah atau satu hari dengan koleksi satwa dan area edukasi; berguna untuk keluarga yang ingin aktivitas di luar Kanazawa.',
    bestFor: 'Preschool–anak sekolah · half/full day · edukasi satwa',
    costLabel: 'Berbayar',
    tags: ['outdoor', 'preschool', 'school'],
    sourceUrl: 'https://www.ishikawazoo.jp/',
    sourceLabel: 'Ishikawa Zoo official',
    note: 'Jam musim panas/dingin dan hari tutup berbeda; cek situs resmi sebelum berangkat.'
  }
];
