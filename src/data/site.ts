import { departments as departmentData } from './organization';
import { brandTheme } from './brand';

export const site = {
  name: 'PPI Ishikawa',
  period: brandTheme.period,
  tagline: 'Rumah digital pelajar Indonesia di Ishikawa.',
  description:
    'Informasi kampus, kehidupan di Ishikawa, beasiswa, karier, komunitas, dan organisasi untuk pelajar Indonesia dan alumni di Prefektur Ishikawa, Jepang.',
};

export const nav = [
  { label: 'Tentang PPI', href: '/about' },
  { label: 'Kampus', href: '/community/kampus' },
  { label: 'Hidup di Ishikawa', href: '/life-in-ishikawa' },
  { label: 'Beasiswa', href: '/beasiswa' },
  { label: 'Karier', href: '/career' },
  { label: 'Komunitas', href: '/community' },
];

export const departments = departmentData.map((department) => department.name);
