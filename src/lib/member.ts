import { supabase } from './supabase';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type MembershipStatus = 'incoming' | 'active' | 'alumni' | 'inactive';
export type MemberRole = 'member' | 'staff' | 'admin';

export interface MemberProfile {
  user_id: string;
  full_name: string;
  campus_slug: string | null;
  program: string | null;
  study_level: string | null;
  field_of_study: string | null;
  city: string | null;
  instagram: string | null;
  linkedin_url: string | null;
  bio: string | null;
  membership_status: MembershipStatus;
  verification_status: VerificationStatus;
  role: MemberRole;
  directory_visible: boolean;
  show_instagram: boolean;
  show_linkedin: boolean;
  show_city: boolean;
  show_field_of_study: boolean;
  created_at: string;
  updated_at: string;
}

export interface DirectoryMember {
  user_id: string;
  full_name: string;
  campus_slug: string | null;
  program: string | null;
  study_level: string | null;
  field_of_study: string | null;
  city: string | null;
  instagram: string | null;
  linkedin_url: string | null;
  bio: string | null;
  membership_status: MembershipStatus;
}

export function memberPath(path = '/member/') {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export async function getCurrentMember() {
  if (!supabase) return { user: null, profile: null, error: new Error('Supabase belum dikonfigurasi.') };

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { user: null, profile: null, error: userError || null };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userData.user.id)
    .single();

  return {
    user: userData.user,
    profile: (profile as MemberProfile | null),
    error: profileError,
  };
}

export async function requireMember(options: { approved?: boolean; admin?: boolean } = {}) {
  const member = await getCurrentMember();

  if (!member.user) {
    window.location.replace(memberPath('/member/login/'));
    return null;
  }

  if (!member.profile) return member;

  if (options.admin && member.profile.role !== 'admin') {
    window.location.replace(memberPath('/member/'));
    return null;
  }

  if (options.approved && member.profile.verification_status !== 'approved') {
    window.location.replace(memberPath('/member/'));
    return null;
  }

  return member;
}

export async function signOutMember() {
  if (!supabase) return;
  await supabase.auth.signOut();
  window.location.replace(memberPath('/member/login/'));
}

export function profileCompletion(profile: MemberProfile) {
  const checks = [
    profile.full_name,
    profile.campus_slug,
    profile.program,
    profile.study_level,
    profile.field_of_study,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
