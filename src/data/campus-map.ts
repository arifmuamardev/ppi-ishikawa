export interface CampusMapPoint {
  id?: string;
  name: string;
  shortName: string;
  city: string;
  lat: number;
  lng: number;
  address: string;
  officialUrl: string;
  approximate?: boolean;
}

export const campusMapPoints: Record<string, CampusMapPoint[]> = {
  'kanazawa-university': [
    {
      name: 'Kanazawa University · Kakuma Campus',
      shortName: 'KU · Kakuma',
      city: 'Kanazawa',
      lat: 36.546406,
      lng: 136.70875,
      address: 'Kakuma-machi, Kanazawa, Ishikawa 920-1192',
      officialUrl: 'https://www.kanazawa-u.ac.jp/en/university/campus-guidance/map/'
    }
  ],
  jaist: [
    {
      name: 'Japan Advanced Institute of Science and Technology (JAIST)',
      shortName: 'JAIST',
      city: 'Nomi',
      lat: 36.44367,
      lng: 136.59303,
      address: '1-1 Asahidai, Nomi, Ishikawa 923-1292',
      officialUrl: 'https://www.jaist.ac.jp/english/top/access/'
    }
  ],
  'kanazawa-institute-of-technology': [
    {
      name: 'Kanazawa Institute of Technology · Ohgigaoka Campus',
      shortName: 'KIT',
      city: 'Nonoichi',
      lat: 36.529917,
      lng: 136.627194,
      address: '7-1 Ohgigaoka, Nonoichi, Ishikawa 921-8501',
      officialUrl: 'https://www.kanazawa-it.ac.jp/ekit/map/ohgigaoka.html'
    }
  ],
  'ishikawa-prefectural-university': [
    {
      name: 'Ishikawa Prefectural University',
      shortName: 'IPU',
      city: 'Nonoichi',
      lat: 36.506531,
      lng: 136.596825,
      address: '1-308 Suematsu, Nonoichi, Ishikawa 921-8836',
      officialUrl: 'https://www.ishikawa-pu.ac.jp/access/'
    }
  ],
  'kinjo-university': [
    {
      name: 'Kinjo University · Kasama Campus',
      shortName: 'Kinjo',
      city: 'Hakusan',
      lat: 36.509667,
      lng: 136.528528,
      address: '1200 Kasama-machi, Hakusan, Ishikawa 924-8511',
      officialUrl: 'https://www.kinjo.ac.jp/ku/access/'
    }
  ],
  'alice-gakuen': [
    {
      name: 'Alice Gakuen · Kanazawa Campus',
      shortName: 'Alice · Kanazawa',
      city: 'Kanazawa',
      lat: 36.533019,
      lng: 136.642729,
      address: '8-50 Enkoji-honmachi, Kanazawa, Ishikawa 921-8176',
      officialUrl: 'https://gakuen.alice-japan.net/access',
      approximate: true
    },
    {
      name: 'Alice Gakuen · Kaga Campus',
      shortName: 'Alice · Kaga',
      city: 'Kaga',
      lat: 36.308278,
      lng: 136.308107,
      address: '65 Daishoji Hachikenmichi, Kaga, Ishikawa 922-0057',
      officialUrl: 'https://gakuen.alice-japan.net/access',
      approximate: true
    }
  ]
};

export const campusOverviewPoints: CampusMapPoint[] = Object.values(campusMapPoints).flat();
