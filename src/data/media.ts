export interface PublicMedia {
  id: string;
  title: string;
  imageUrl: string;
  sourcePage: string;
  credit: string;
  license: string;
  alt: string;
}

export const publicMedia: Record<string, PublicMedia> = {
  kanazawaStation: {
    id: 'kanazawa-station',
    title: 'Tsuzumi-mon, Kanazawa Station',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tsuzumi-mon,_Kanazawa_Station_-_Kanazawa,_Japan_-_DSC09640.jpg?width=1600',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Tsuzumi-mon,_Kanazawa_Station_-_Kanazawa,_Japan_-_DSC09640.jpg',
    credit: 'Daderot / Wikimedia Commons',
    license: 'CC0 1.0',
    alt: 'Tsuzumi-mon di Kanazawa Station'
  },
  ishikawaMap: {
    id: 'ishikawa-map',
    title: 'Map of Ishikawa Prefecture',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/IshikawaMapCurrent.png?width=981',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:IshikawaMapCurrent.png',
    credit: 'Akanemoto~commonswiki / Wikimedia Commons',
    license: 'Public Domain',
    alt: 'Peta Prefektur Ishikawa dan pembagian wilayahnya'
  },
  shinkansenKanazawa: {
    id: 'shinkansen-kanazawa',
    title: 'Shinkansen W7 at Kanazawa Station',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Shinkansen_W7_at_Kanazawa_Station_2025-03-13_2.jpg?width=1400',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Shinkansen_W7_at_Kanazawa_Station_2025-03-13_2.jpg',
    credit: 'ERIC SALARD (airlines470) / Wikimedia Commons',
    license: 'CC BY-SA 2.0',
    alt: 'Kereta Hokuriku Shinkansen W7 di Kanazawa Station'
  },
  kanazawaCentralPark: {
    id: 'kanazawa-central-park',
    title: 'Central Park, Kanazawa',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kanazawa-C-3228.jpg?width=1500',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Kanazawa-C-3228.jpg',
    credit: 'Daderot / Wikimedia Commons',
    license: 'Public Domain',
    alt: 'Area hijau di Central Park Kanazawa yang cocok untuk aktivitas keluarga'
  },
  kanazawaCastle: {
    id: 'kanazawa-castle',
    title: 'Kanazawa Castle',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/131109_Kanazawa_Castle_Kanazawa_Ishikawa_pref_Japan08n.jpg?width=1600',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:131109_Kanazawa_Castle_Kanazawa_Ishikawa_pref_Japan08n.jpg',
    credit: '663highland / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    alt: 'Bangunan Kanazawa Castle di Ishikawa'
  },
  higashiyama: {
    id: 'higashiyama',
    title: 'Higashiyama-higashi, Kanazawa',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Higashiyama-higashi_Kanazawa_Ishikawa03n3200.jpg?width=1600',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Higashiyama-higashi_Kanazawa_Ishikawa03n3200.jpg',
    credit: '663highland / Wikimedia Commons',
    license: 'CC BY 2.5',
    alt: 'Jalan di kawasan Higashiyama-higashi, Kanazawa'
  },
  kanazawaFlatBus: {
    id: 'kanazawa-flat-bus',
    title: 'Kanazawa Flat Bus',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kanazawa_Flat_Bus_Zaimoku-route.jpg?width=1400',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Kanazawa_Flat_Bus_Zaimoku-route.jpg',
    credit: 'Hirorinmasa / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    alt: 'Kanazawa Flat Bus di halte Fukuro-machi'
  },
  kanazawaSnow: {
    id: 'kanazawa-snow',
    title: 'Kanazawa Castle in snow',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kanazawa_Castle_260123_05.jpg?width=1400',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Kanazawa_Castle_260123_05.jpg',
    credit: 'Aspere / Wikimedia Commons',
    license: 'CC0 1.0',
    alt: 'Kanazawa Castle tertutup salju pada musim dingin'
  },
  kanazawaMedicalCenter: {
    id: 'kanazawa-medical-center',
    title: 'National Hospital Organization Kanazawa Medical Center',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/National_Hospital_Organization_Kanazawa_Medical_Center.JPG?width=1400',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:National_Hospital_Organization_Kanazawa_Medical_Center.JPG',
    credit: 'Waka77 / Wikimedia Commons',
    license: 'Public Domain',
    alt: 'National Hospital Organization Kanazawa Medical Center'
  },
  kanazawaCityHall: {
    id: 'kanazawa-city-hall',
    title: 'Kanazawa City Hall',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kanazawa_city_hall.jpg?width=1400',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Kanazawa_city_hall.jpg',
    credit: 'Drivephotographer / Wikimedia Commons',
    license: 'CC0 1.0',
    alt: 'Gedung Kanazawa City Hall'
  },
  omichoMarket: {
    id: 'omicho-market',
    title: 'Omicho Market, Kanazawa',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kanazawa_fish_market.jpg?width=1400',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Kanazawa_fish_market.jpg',
    credit: 'Zacharymccune / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    alt: 'Produk makanan laut di Omicho Market, Kanazawa'
  }
};

export const campusMedia: Record<string, PublicMedia | null> = {
  'kanazawa-university': {
    id: 'kanazawa-university-campus',
    title: 'Kanazawa University Kakuma Campus',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kanazawa_Univ._Kakuma_campus_Central-area.JPG?width=1280',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Kanazawa_Univ._Kakuma_campus_Central-area.JPG',
    credit: 'Genppy / Wikimedia Commons',
    license: 'Public Domain',
    alt: 'Kakuma Campus Kanazawa University'
  },
  'jaist': {
    id: 'jaist-campus',
    title: 'JAIST Campus',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/JAIST.JPG?width=1280',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:JAIST.JPG',
    credit: 'jaist / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    alt: 'Kampus JAIST di Nomi'
  },
  'kanazawa-institute-of-technology': {
    id: 'kit-campus',
    title: 'Kanazawa Institute of Technology',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kanazawa_Institute_of_Technology.jpg?width=1280',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Kanazawa_Institute_of_Technology.jpg',
    credit: 'Hirorinmasa / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    alt: 'Gerbang Kanazawa Institute of Technology'
  },
  'ishikawa-prefectural-university': {
    id: 'ipu-campus',
    title: 'Ishikawa Prefectural University',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ishikawa_Prefectural_University.jpg?width=1280',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Ishikawa_Prefectural_University.jpg',
    credit: 'Hirorinmasa / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    alt: 'Kampus Ishikawa Prefectural University'
  },
  'kinjo-university': {
    id: 'kinjo-campus',
    title: 'Kinjo University',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kinjyo_University.jpg?width=1280',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Kinjyo_University.jpg',
    credit: 'Hirorinmasa / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    alt: 'Gerbang Kinjo University di Hakusan'
  },
  'alice-gakuen': {
    id: 'alice-gakuen-campus',
    title: 'Alice Gakuen',
    imageUrl: 'data:image/jpeg;base64,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',
    sourcePage: 'https://gakuen.alice-japan.net/access',
    credit: 'Foto diberikan untuk situs PPI Ishikawa',
    license: 'Digunakan dengan izin',
    alt: 'Gedung Alice Gakuen di Ishikawa'
  }
};


export const campusProfileMedia: Record<string, PublicMedia[]> = {
  'kanazawa-university': [
    {
      id: 'ku-central-library',
      title: 'Kanazawa University Central Library',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kanazawa_Univ._Central_Library.jpg?width=1280',
      sourcePage: 'https://commons.wikimedia.org/wiki/File:Kanazawa_Univ._Central_Library.jpg',
      credit: 'Miisan1112 / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      alt: 'Central Library Kanazawa University di Kakuma Campus'
    }
  ],
  'jaist': [
    {
      id: 'jaist-information-science',
      title: 'Information Science Building, JAIST',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/The_building_of_Information_Science_at_JAIST.JPG?width=1280',
      sourcePage: 'https://commons.wikimedia.org/wiki/File:The_building_of_Information_Science_at_JAIST.JPG',
      credit: 'Jwalker / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      alt: 'Gedung Information Science di JAIST'
    }
  ],
  'kanazawa-institute-of-technology': [
    {
      id: 'kit-yumekobo',
      title: 'Yumekobo · Factory for Dreams and Ideas',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/KIT_Yumekobo.jpg?width=1280',
      sourcePage: 'https://commons.wikimedia.org/wiki/File:KIT_Yumekobo.jpg',
      credit: 'Hirorinmasa / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      alt: 'Yumekobo, ruang produksi dan project di Kanazawa Institute of Technology'
    }
  ],
  'ishikawa-prefectural-university': [
    {
      id: 'ipu-campus-profile',
      title: 'Ishikawa Prefectural University',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ishikawa_Prefectural_University.jpg?width=1280',
      sourcePage: 'https://commons.wikimedia.org/wiki/File:Ishikawa_Prefectural_University.jpg',
      credit: 'Hirorinmasa / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      alt: 'Kampus Ishikawa Prefectural University di Nonoichi'
    }
  ],
  'kinjo-university': [
    {
      id: 'kinjo-campus-profile',
      title: 'Kinjo University',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kinjyo_University.jpg?width=1280',
      sourcePage: 'https://commons.wikimedia.org/wiki/File:Kinjyo_University.jpg',
      credit: 'Hirorinmasa / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      alt: 'Gerbang Kinjo University di Hakusan'
    }
  ],
  'alice-gakuen': [campusMedia['alice-gakuen']!]
};
