import { campusOverviewPoints } from './campus-map';

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
  description: 'Kampus yang tercakup dalam Campus Hub PPI Ishikawa. Gunakan halaman kampus untuk panduan mahasiswa yang lebih lengkap.',
  officialUrl: point.officialUrl,
  tags: ['kampus', 'mahasiswa', point.city.toLowerCase()],
  lat: point.lat,
  lng: point.lng,
  approximate: point.approximate,
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
    description: 'Titik utama layanan municipality bagi warga yang terdaftar di Komatsu.',
    officialUrl: 'https://www.city.komatsu.lg.jp/',
    tags: ['city hall', 'administrasi', 'resident services', 'keluarga'],
    lastVerified: '6 October 2026'
  }
];

export const ishikawaPlaces: IshikawaPlace[] = [...campusPlaces, ...publicServicePlaces];

export const placeCities = Array.from(new Set(ishikawaPlaces.map((place) => place.city))).sort();

export const mappablePlaces = ishikawaPlaces.filter(
  (place): place is IshikawaPlace & { lat: number; lng: number } =>
    typeof place.lat === 'number' && typeof place.lng === 'number'
);
