import { departments as departmentData } from './organization';

export const site = {
  name: 'PPI Ishikawa',
  period: '2026/27',
  tagline: 'Rumah digital pelajar Indonesia di Ishikawa.',
  description:
    'Portal informasi, komunitas, program, dan panduan hidup untuk pelajar Indonesia di Prefektur Ishikawa, Jepang.',
};

export const nav = [
  { label: 'Tentang', href: '/about' },
  { label: 'Hidup di Ishikawa', href: '/life-in-ishikawa' },
  { label: 'Komunitas', href: '/community' },
  { label: 'Program', href: '/programs' },
  { label: 'Sumber Daya', href: '/resources' },
  { label: 'Kontak', href: '/contact' },
];

export const departments = departmentData.map((department) => department.name);
