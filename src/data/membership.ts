export const membershipStatusLabels = {
  incoming: 'Incoming',
  active: 'Anggota aktif',
  alumni: 'Alumni',
  inactive: 'Tidak aktif',
} as const;

export const verificationStatusLabels = {
  pending: 'Menunggu verifikasi',
  approved: 'Terverifikasi',
  rejected: 'Perlu tindak lanjut',
} as const;

export const studyLevels = [
  { value: 'language', label: 'Japanese Language' },
  { value: 'vocational', label: 'Vocational / Professional School' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'master', label: 'Master' },
  { value: 'doctoral', label: 'Doctoral' },
  { value: 'research', label: 'Research Student' },
  { value: 'exchange', label: 'Exchange / Visiting' },
  { value: 'other', label: 'Lainnya' },
];

export const ishikawaCities = [
  'Kanazawa',
  'Nomi',
  'Nonoichi',
  'Hakusan',
  'Kaga',
  'Komatsu',
  'Lainnya',
];
