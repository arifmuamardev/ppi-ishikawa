import { departments as departmentData } from './organization';

export const site = {
  name: 'PPI Ishikawa',
  period: '2026/27',
  tagline: 'Rumah digital pelajar Indonesia di Ishikawa.',
  description:
    'Portal informasi, komunitas, program, dan panduan hidup untuk pelajar Indonesia di Prefektur Ishikawa, Jepang.',
};

export const nav = [
  { label: 'Tentang PPI', href: '/about' },
  { label: 'Kampus', href: '/community/kampus' },
  { label: 'Hidup di Ishikawa', href: '/life-in-ishikawa' },
  { label: 'Beasiswa', href: '/beasiswa' },
  { label: 'Komunitas', href: '/community' },
];

export const departments = departmentData.map((department) => department.name);
