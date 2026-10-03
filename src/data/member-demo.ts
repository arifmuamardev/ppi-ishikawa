import type { DirectoryMember, MemberProfile } from '../lib/member';

const now = '2026-10-03T00:00:00.000Z';

export const demoMemberProfile: MemberProfile = {
  user_id: 'demo-member',
  full_name: 'Anggota Demo',
  campus_slug: 'kanazawa-university',
  program: 'Information Science',
  study_level: 'doctoral',
  field_of_study: 'Data Science',
  city: 'Kanazawa',
  instagram: null,
  linkedin_url: null,
  bio: 'Profil contoh untuk mencoba Area Anggota PPI Ishikawa.',
  membership_status: 'active',
  verification_status: 'approved',
  role: 'member',
  directory_visible: true,
  show_instagram: false,
  show_linkedin: false,
  show_city: true,
  show_field_of_study: true,
  created_at: now,
  updated_at: now,
};

export const demoAdminProfile: MemberProfile = {
  ...demoMemberProfile,
  user_id: 'demo-admin',
  full_name: 'Admin Demo',
  role: 'admin',
  bio: 'Profil admin contoh untuk mencoba alur verifikasi anggota.',
};

export const demoDirectoryMembers: DirectoryMember[] = [
  {
    user_id: 'demo-directory-01',
    full_name: 'Contoh Anggota 01',
    campus_slug: 'kanazawa-university',
    program: 'Engineering',
    study_level: 'master',
    field_of_study: 'Information Engineering',
    city: 'Kanazawa',
    instagram: null,
    linkedin_url: null,
    bio: 'Contoh profil anggota untuk menguji tampilan direktori.',
    membership_status: 'active',
  },
  {
    user_id: 'demo-directory-02',
    full_name: 'Contoh Anggota 02',
    campus_slug: 'jaist',
    program: 'Information Science',
    study_level: 'doctoral',
    field_of_study: 'Artificial Intelligence',
    city: 'Nomi',
    instagram: null,
    linkedin_url: null,
    bio: 'Contoh profil anggota JAIST dalam mode demo.',
    membership_status: 'active',
  },
  {
    user_id: 'demo-directory-03',
    full_name: 'Contoh Alumni 01',
    campus_slug: 'kanazawa-institute-of-technology',
    program: 'Engineering',
    study_level: 'master',
    field_of_study: 'Robotics',
    city: null,
    instagram: null,
    linkedin_url: null,
    bio: 'Contoh profil alumni untuk menguji filter status.',
    membership_status: 'alumni',
  },
];

export const demoPendingMembers = [
  {
    user_id: 'demo-pending-01',
    full_name: 'Pendaftar Demo 01',
    campus_slug: 'kanazawa-university',
    program: 'Economics',
    study_level: 'master',
    field_of_study: 'Regional Economics',
    membership_status: 'incoming',
    created_at: now,
  },
  {
    user_id: 'demo-pending-02',
    full_name: 'Pendaftar Demo 02',
    campus_slug: 'jaist',
    program: 'Materials Science',
    study_level: 'doctoral',
    field_of_study: 'Materials Science',
    membership_status: 'incoming',
    created_at: now,
  },
];
