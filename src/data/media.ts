export interface PublicMedia {
  id: string;
  title: string;
  imageUrl: string;
  sourcePage: string;
  credit: string;
  license: string;
  alt: string;
}

const commonsImage = (filename: string, width = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}?width=${width}`;

export const publicMedia: Record<string, PublicMedia> = {
  kanazawaStation: {
    id: 'kanazawa-station',
    title: 'Tsuzumi-mon, Kanazawa Station',
    imageUrl: commonsImage('Tsuzumi-mon, Kanazawa Station - Kanazawa, Japan - DSC09640.jpg', 1600),
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Tsuzumi-mon,_Kanazawa_Station_-_Kanazawa,_Japan_-_DSC09640.jpg',
    credit: 'Daderot / Wikimedia Commons',
    license: 'CC0 1.0',
    alt: 'Tsuzumi-mon di Kanazawa Station'
  },
  ishikawaMap: {
    id: 'ishikawa-map',
    title: 'Map of Ishikawa Prefecture',
    imageUrl: commonsImage('IshikawaMapCurrent.png', 981),
    sourcePage: 'https://commons.wikimedia.org/wiki/File:IshikawaMapCurrent.png',
    credit: 'Akanemoto~commonswiki / Wikimedia Commons',
    license: 'Public Domain',
    alt: 'Peta Prefektur Ishikawa dan pembagian wilayahnya'
  },
  shinkansenKanazawa: {
    id: 'shinkansen-kanazawa',
    title: 'Shinkansen W7 at Kanazawa Station',
    imageUrl: commonsImage('Shinkansen W7 at Kanazawa Station 2025-03-13 2.jpg', 1400),
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Shinkansen_W7_at_Kanazawa_Station_2025-03-13_2.jpg',
    credit: 'ERIC SALARD (airlines470) / Wikimedia Commons',
    license: 'CC BY-SA 2.0',
    alt: 'Kereta Hokuriku Shinkansen W7 di Kanazawa Station'
  },
  kanazawaCastle: {
    id: 'kanazawa-castle',
    title: 'Kanazawa Castle',
    imageUrl: commonsImage('131109 Kanazawa Castle Kanazawa Ishikawa pref Japan08n.jpg', 1600),
    sourcePage: 'https://commons.wikimedia.org/wiki/File:131109_Kanazawa_Castle_Kanazawa_Ishikawa_pref_Japan08n.jpg',
    credit: '663highland / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    alt: 'Bangunan Kanazawa Castle di Ishikawa'
  },
  higashiyama: {
    id: 'higashiyama',
    title: 'Higashiyama-higashi, Kanazawa',
    imageUrl: commonsImage('Higashiyama-higashi Kanazawa Ishikawa03n3200.jpg', 1600),
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Higashiyama-higashi_Kanazawa_Ishikawa03n3200.jpg',
    credit: '663highland / Wikimedia Commons',
    license: 'CC BY 2.5',
    alt: 'Jalan di kawasan Higashiyama-higashi, Kanazawa'
  }
};

export const campusMedia: Record<string, PublicMedia | null> = {
  'kanazawa-university': {
    id: 'kanazawa-university-campus',
    title: 'Kanazawa University Kakuma Campus',
    imageUrl: commonsImage('Kanazawa Univ. Kakuma campus Central-area.JPG', 1280),
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Kanazawa_Univ._Kakuma_campus_Central-area.JPG',
    credit: 'Genppy / Wikimedia Commons',
    license: 'Public Domain',
    alt: 'Kakuma Campus Kanazawa University'
  },
  'jaist': {
    id: 'jaist-campus',
    title: 'JAIST Campus',
    imageUrl: commonsImage('JAIST.JPG', 1280),
    sourcePage: 'https://commons.wikimedia.org/wiki/File:JAIST.JPG',
    credit: 'jaist / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    alt: 'Kampus JAIST di Nomi'
  },
  'kanazawa-institute-of-technology': {
    id: 'kit-campus',
    title: 'Kanazawa Institute of Technology',
    imageUrl: commonsImage('Kanazawa Institute of Technology.jpg', 1280),
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Kanazawa_Institute_of_Technology.jpg',
    credit: 'Hirorinmasa / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    alt: 'Gerbang Kanazawa Institute of Technology'
  },
  'ishikawa-prefectural-university': {
    id: 'ipu-campus',
    title: 'Ishikawa Prefectural University',
    imageUrl: commonsImage('Ishikawa Prefectural University.jpg', 1280),
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Ishikawa_Prefectural_University.jpg',
    credit: 'Hirorinmasa / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    alt: 'Kampus Ishikawa Prefectural University'
  },
  'kinjo-university': {
    id: 'kinjo-campus',
    title: 'Kinjo University',
    imageUrl: commonsImage('Kinjyo University.jpg', 1280),
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Kinjyo_University.jpg',
    credit: 'Hirorinmasa / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    alt: 'Gerbang Kinjo University di Hakusan'
  },
  'alice-gakuen': null
};
