import { campusOverviewPoints } from './campus-map';
import { familyActivityPlaces } from './family-activities';

export type PlaceCategory =
  | 'campus'
  | 'administration'
  | 'support'
  | 'family'
  | 'health'
  | 'transport';

export interface IshikawaPlace {
  id: string;
  name: string;
  shortName: string;
  category: PlaceCategory;
  city: string;
  address: string;
  description: string;
  officialUrl: string;
  tags: string[];
  lat?: number;
  lng?: number;
  approximate?: boolean;
  lastVerified: string;
}

export const placeCategoryLabels: Record<PlaceCategory, string> = {
  campus: 'Kampus',
  administration: 'Administrasi',
  support: 'Dukungan',
  family: 'Keluarga & Anak',
  health: 'Kesehatan',
  transport: 'Transportasi'
};

const campusPlaces: IshikawaPlace[] = campusOverviewPoints.map((point) => ({
  id: `campus-${point.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
  name: point.name,
  shortName: point.shortName,
  category: 'campus',
  city: point.city,
  address: point.address,
  description: 'Kampus yang tercakup dalam PPI Ishikawa. Gunakan halaman kampus untuk panduan mahasiswa yang lebih lengkap.',
  officialUrl: point.officialUrl,
  tags: ['kampus', 'mahasiswa', point.city.toLowerCase()],
  lat: point.lat,
  lng: point.lng,
  approximate: point.approximate,
  lastVerified: '6 October 2026'
}));


const familyActivityCityById: Record<string, string> = {
  'kanazawa-station-kids-land': 'Kanazawa',
  'omicho-childrens-play-area': 'Kanazawa',
  'amerun-park': 'Kanazawa',
  'tamagawa-childrens-library': 'Kanazawa',
  'ishikawa-prefectural-library': 'Kanazawa',
  'tamagawa-park': 'Kanazawa',
  'oku-utatsuyama': 'Kanazawa',
  'civic-art-village': 'Kanazawa',
  'nonoichi-mitte': 'Nonoichi',
  'matto-childrens-center': 'Hakusan',
  'nomi-childcare-support-center': 'Nomi',
  'ishikawa-zoo': 'Nomi'
};

const familyActivityDirectoryPlaces: IshikawaPlace[] = familyActivityPlaces.map((place) => ({
  id: `activity-${place.id}`,
  name: place.name,
  shortName: place.name,
  category: 'family',
  city: familyActivityCityById[place.id] ?? 'Ishikawa',
  address: place.address,
  description: place.summary,
  officialUrl: place.sourceUrl,
  tags: ['aktivitas keluarga', ...place.tags, place.bestFor.toLowerCase()],
  lastVerified: '6 October 2026'
}));

const publicServicePlaces: IshikawaPlace[] = [
  {
    id: 'ifie-rifare',
    name: 'Ishikawa Foundation for International Exchange (IFIE)',
    shortName: 'IFIE',
    category: 'support',
    city: 'Kanazawa',
    address: 'Rifare 3F, 1-5-3 Honmachi, Kanazawa, Ishikawa 920-0853',
    description: 'Titik dukungan utama warga asing di Ishikawa, termasuk konsultasi kehidupan sehari-hari dan dukungan Bahasa Indonesia.',
    officialUrl: 'https://www.ifie.or.jp/foreigners_life/soudan/',
    tags: ['konsultasi', 'bahasa indonesia', 'warga asing', 'keluarga'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'ishikawa-prefectural-office',
    name: 'Ishikawa Prefectural Government Office',
    shortName: 'Ishikawa Pref.',
    category: 'administration',
    city: 'Kanazawa',
    address: '1-1 Kuratsuki, Kanazawa, Ishikawa 920-8580',
    description: 'Kantor Pemerintah Prefektur Ishikawa untuk layanan dan informasi tingkat prefektur.',
    officialUrl: 'https://www.pref.ishikawa.lg.jp/kensei/shisetsu/kenchoannai/',
    tags: ['prefektur', 'administrasi', 'pemerintah'],
    lat: 36.594722,
    lng: 136.625556,
    lastVerified: '6 October 2026'
  },
  {
    id: 'kanazawa-city-hall',
    name: 'Kanazawa City Hall',
    shortName: 'Kanazawa City Hall',
    category: 'administration',
    city: 'Kanazawa',
    address: '1-1-1 Hirosaka, Kanazawa, Ishikawa 920-8577',
    description: 'Titik awal layanan municipality bagi warga yang alamat tinggalnya terdaftar di Kanazawa.',
    officialUrl: 'https://www4.city.kanazawa.lg.jp/',
    tags: ['city hall', 'administrasi', 'resident registration', 'keluarga'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'nonoichi-city-hall',
    name: 'Nonoichi City Hall',
    shortName: 'Nonoichi City Hall',
    category: 'administration',
    city: 'Nonoichi',
    address: '1-1 Sanno, Nonoichi, Ishikawa 921-8510',
    description: 'Layanan municipality untuk warga Nonoichi; gedung juga menyediakan fasilitas seperti nursing room.',
    officialUrl: 'https://www.city.nonoichi.lg.jp/map/6996.html',
    tags: ['city hall', 'administrasi', 'keluarga', 'nursing room'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'nonoichi-health-center',
    name: 'Nonoichi Health Center',
    shortName: 'Nonoichi Health Center',
    category: 'health',
    city: 'Nonoichi',
    address: '3-128 Sanno, Nonoichi, Ishikawa',
    description: 'Fasilitas kesehatan publik Nonoichi yang relevan untuk layanan kesehatan lokal dan kebutuhan keluarga.',
    officialUrl: 'https://www.city.nonoichi.lg.jp/soshiki/10/1173.html',
    tags: ['kesehatan', 'keluarga', 'anak', 'public health'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'hakusan-city-hall',
    name: 'Hakusan City Hall',
    shortName: 'Hakusan City Hall',
    category: 'administration',
    city: 'Hakusan',
    address: '2-1 Kuramitsu, Hakusan, Ishikawa 924-8688',
    description: 'Titik utama layanan municipality bagi warga yang terdaftar di Hakusan.',
    officialUrl: 'https://www.city.hakusan.lg.jp/shisetsu/1006424/1004494.html',
    tags: ['city hall', 'administrasi', 'keluarga'],
    lat: 36.514423,
    lng: 136.565615,
    lastVerified: '6 October 2026'
  },
  {
    id: 'nomi-city-hall',
    name: 'Nomi City Hall',
    shortName: 'Nomi City Hall',
    category: 'administration',
    city: 'Nomi',
    address: '1110 Raimaru-machi, Nomi, Ishikawa 923-1297',
    description: 'Titik utama layanan municipality Nomi, termasuk resident services, insurance/pension, dan childcare support.',
    officialUrl: 'https://www.city.nomi.ishikawa.jp/docs/450.html',
    tags: ['city hall', 'administrasi', 'keluarga', 'childcare', 'insurance'],
    lat: 36.447012,
    lng: 136.554204,
    lastVerified: '6 October 2026'
  },
  {
    id: 'komatsu-city-hall',
    name: 'Komatsu City Hall',
    shortName: 'Komatsu City Hall',
    category: 'administration',
    city: 'Komatsu',
    address: '91 Konmade-machi, Komatsu, Ishikawa 923-8650',
    description: 'Titik utama layanan municipality bagi warga Komatsu; layanan anak dan keluarga kota juga terhubung dengan unit di lingkungan pemerintah kota.',
    officialUrl: 'https://www.city.komatsu.lg.jp/',
    tags: ['city hall', 'administrasi', 'resident services', 'keluarga', 'childcare'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'kanazawa-education-plaza-togashi',
    name: 'Kanazawa Education Plaza Togashi',
    shortName: 'Education Plaza',
    category: 'family',
    city: 'Kanazawa',
    address: '3-10-1 Togashi, Kanazawa, Ishikawa 921-8171',
    description: 'Pusat dukungan tumbuh kembang anak di Kanazawa. Di kompleks ini tersedia konsultasi anak serta area bermain orang tua-anak Koala untuk usia 0–2 tahun dan Zou untuk usia 3 tahun hingga sekolah dasar.',
    officialUrl: 'https://www4.city.kanazawa.lg.jp/kosodate_kyoiku/kosodate_kyoikushisetsu/kyoikuplaza/9588.html',
    tags: ['anak', 'parent-child', 'konsultasi', 'play space', '0-2 tahun', 'sekolah dasar'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'kanazawa-station-kodomo-land',
    name: 'Kanazawa Station Kodomo Land',
    shortName: 'Kodomo Land',
    category: 'family',
    city: 'Kanazawa',
    address: '1-1 Kinoshinbo-machi, Kanazawa, Ishikawa 920-0858',
    description: 'Ruang bermain dan berkumpul untuk orang tua dan anak di area Kanazawa Station; berguna terutama saat berada di pusat kota atau bepergian bersama anak.',
    officialUrl: 'https://www4.city.kanazawa.lg.jp/kosodate_kyoiku/ikuji_mishugakuji/hoikujo_kodomoen_yochien/10644.html',
    tags: ['anak', 'play space', 'kanazawa station', 'parent-child', 'indoor'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'nonoichi-child-rearing-station',
    name: 'Nonoichi Child-Rearing Station',
    shortName: 'Kosodate Station',
    category: 'family',
    city: 'Nonoichi',
    address: '3-2-22 Honmachi, Nonoichi, Ishikawa 921-8815',
    description: 'Kompleks dukungan pengasuhan Nonoichi. Child and Family Center menerima konsultasi terkait kehamilan, persalinan, pengasuhan, dan kebutuhan keluarga; Childcare Support Center Mitte juga berada di lokasi ini.',
    officialUrl: 'https://www.city.nonoichi.lg.jp/soshiki/44/59669.html',
    tags: ['kehamilan', 'anak', 'konsultasi', 'childcare', 'parent-child'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'hakusan-genkikko',
    name: 'Hakusan Childcare Support Center Genkikko',
    shortName: 'Genkikko',
    category: 'family',
    city: 'Hakusan',
    address: '8-16-1 Kuramitsu, Hakusan, Ishikawa 924-0865',
    description: 'Pusat dukungan pengasuhan Hakusan di Fukushi Fureai Center. Menyediakan ruang bagi orang tua dan anak, konsultasi, informasi layanan, serta menjadi basis Family Support Center.',
    officialUrl: 'https://www.city.hakusan.lg.jp/kosodate/1012895/1019324/index.html',
    tags: ['anak', 'childcare', 'konsultasi', 'family support', 'parent-child'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'hakusan-matto-health-center',
    name: 'Matto Health Center',
    shortName: 'Matto Health Center',
    category: 'health',
    city: 'Hakusan',
    address: '3-100 Kuramitsu, Hakusan, Ishikawa 924-0865',
    description: 'Pusat kesehatan publik Hakusan. Menjadi salah satu lokasi layanan ibu-anak dan konsultasi kesehatan keluarga yang dijadwalkan oleh kota.',
    officialUrl: 'https://www.city.hakusan.lg.jp/kenkofukushi/kenko/1001950.html',
    tags: ['kesehatan', 'ibu-anak', 'konsultasi', 'public health', 'keluarga'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'nomi-childcare-support-center',
    name: 'Nomi Childcare Support Center',
    shortName: 'Nomi Childcare',
    category: 'family',
    city: 'Nomi',
    address: 'Terai-machi Ta 8-1, Nomi, Ishikawa 923-1121',
    description: 'Pusat dukungan pengasuhan di Fureai Plaza dengan playroom, ruang konsultasi, kegiatan keluarga, dan Family Support Center dalam kompleks yang sama.',
    officialUrl: 'https://www.city.nomi.ishikawa.jp/docs/194.html',
    tags: ['anak', 'playroom', 'konsultasi', 'family support', 'childcare'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'nomi-sante-child-consultation',
    name: 'Nomi Health & Welfare Center Sante · Child Consultation Station',
    shortName: 'Sante',
    category: 'health',
    city: 'Nomi',
    address: 'Terai-machi Nu 48, Nomi, Ishikawa',
    description: 'Pusat kesehatan dan kesejahteraan Nomi. Child Consultation Station melayani dukungan dari masa kehamilan hingga anak di bawah 18 tahun; layanan pemeriksaan bayi dan balita juga dilaksanakan di kompleks ini.',
    officialUrl: 'https://www.city.nomi.ishikawa.jp/docs/3218.html',
    tags: ['kehamilan', 'anak', 'kesehatan', 'perkembangan', 'konsultasi'],
    lastVerified: '6 October 2026'
  },
  {
    id: 'komatsu-kabukky-land',
    name: 'Kabukky Land',
    shortName: 'Kabukky Land',
    category: 'family',
    city: 'Komatsu',
    address: 'Komatsu Az Square 1F, 10-10 Doihara-machi, Komatsu, Ishikawa 923-8640',
    description: 'Kompleks dukungan keluarga dengan area bermain anak, ruang kegiatan, konsultasi pengasuhan, serta Family Support Center. Sebagian area atau kegiatan dapat berbayar.',
    officialUrl: 'https://faq1.city.komatsu.lg.jp/faq/detail.aspx?id=1221',
    tags: ['anak', 'indoor', 'play space', 'konsultasi', 'family support'],
    lastVerified: '6 October 2026'
  }
];

const duplicatedByFamilyActivity = new Set(['kanazawa-station-kodomo-land', 'nomi-childcare-support-center']);

const servicePlaces = publicServicePlaces.filter((place) => !duplicatedByFamilyActivity.has(place.id));

export const ishikawaPlaces: IshikawaPlace[] = [
  ...campusPlaces,
  ...servicePlaces,
  ...familyActivityDirectoryPlaces
];

export const placeCities = Array.from(new Set(ishikawaPlaces.map((place) => place.city))).sort();

export const mappablePlaces = ishikawaPlaces.filter(
  (place): place is IshikawaPlace & { lat: number; lng: number } =>
    typeof place.lat === 'number' && typeof place.lng === 'number'
);
