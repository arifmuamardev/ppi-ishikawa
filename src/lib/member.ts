import { isSupabaseConfigured, supabase } from './supabase';
import { demoAdminProfile, demoDirectoryMembers, demoMemberProfile, demoPendingMembers } from '../data/member-demo';

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

interface DemoUser {
  id: string;
  email: string;
}

const DEMO_SESSION_KEY = 'ppi-ishikawa-demo-session';
const DEMO_PROFILE_KEY = 'ppi-ishikawa-demo-profile';
const DEMO_PENDING_KEY = 'ppi-ishikawa-demo-pending';

export const isMembershipDemoMode = !isSupabaseConfigured;

export function memberPath(path = '/member/') {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export function memberAbsoluteUrl(path = '/member/') {
  const site = (import.meta.env.SITE || window.location.origin).replace(/\/$/, '');
  return `${site}${memberPath(path)}`;
}

function getStoredDemoProfile(): MemberProfile | null {
  try {
    const raw = localStorage.getItem(DEMO_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredDemoProfile(profile: MemberProfile) {
  localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile));
}

export function demoSignIn(role: 'member' | 'admin') {
  localStorage.setItem(DEMO_SESSION_KEY, role);
  if (!getStoredDemoProfile()) {
    setStoredDemoProfile(role === 'admin' ? demoAdminProfile : demoMemberProfile);
  }
}

export function demoRegister(input: {
  full_name: string;
  email: string;
  campus_slug: string;
  program: string;
  study_level: string;
  field_of_study?: string;
  city?: string;
}) {
  const now = new Date().toISOString();
  const profile: MemberProfile = {
    user_id: 'demo-registered',
    full_name: input.full_name,
    campus_slug: input.campus_slug || null,
    program: input.program || null,
    study_level: input.study_level || null,
    field_of_study: input.field_of_study || null,
    city: input.city || null,
    instagram: null,
    linkedin_url: null,
    bio: null,
    membership_status: 'incoming',
    verification_status: 'pending',
    role: 'member',
    directory_visible: false,
    show_instagram: false,
    show_linkedin: true,
    show_city: false,
    show_field_of_study: true,
    created_at: now,
    updated_at: now,
  };
  setStoredDemoProfile(profile);
  localStorage.setItem(DEMO_SESSION_KEY, 'registered');
  localStorage.setItem(DEMO_PENDING_KEY, JSON.stringify({
    user_id: profile.user_id,
    full_name: profile.full_name,
    campus_slug: profile.campus_slug,
    program: profile.program,
    study_level: profile.study_level,
    field_of_study: profile.field_of_study,
    membership_status: profile.membership_status,
    created_at: profile.created_at,
    email: input.email,
  }));
  return profile;
}

export async function getCurrentMember() {
  if (!isSupabaseConfigured || !supabase) {
    const session = localStorage.getItem(DEMO_SESSION_KEY);
    if (!session) return { user: null, profile: null, error: null };

    const stored = getStoredDemoProfile();
    let profile: MemberProfile;
    if (session === 'admin') {
      profile = stored?.role === 'admin' ? stored : demoAdminProfile;
      setStoredDemoProfile(profile);
    } else if (session === 'registered') {
      profile = stored || demoMemberProfile;
    } else {
      profile = stored?.role !== 'admin' ? stored || demoMemberProfile : demoMemberProfile;
      setStoredDemoProfile(profile);
    }

    const user: DemoUser = {
      id: profile.user_id,
      email: session === 'admin' ? 'admin.demo@example.invalid' : 'anggota.demo@example.invalid',
    };
    return { user, profile, error: null };
  }

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
    profile: profile as MemberProfile | null,
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
  if (!isSupabaseConfigured || !supabase) {
    localStorage.removeItem(DEMO_SESSION_KEY);
    window.location.replace(memberPath('/member/login/'));
    return;
  }

  await supabase.auth.signOut();
  window.location.replace(memberPath('/member/login/'));
}

export async function updateCurrentMemberProfile(payload: Partial<MemberProfile>) {
  const member = await getCurrentMember();
  if (!member.user || !member.profile) return { error: new Error('Member tidak ditemukan.') };

  if (!isSupabaseConfigured || !supabase) {
    const next = {
      ...member.profile,
      ...payload,
      user_id: member.profile.user_id,
      role: member.profile.role,
      verification_status: member.profile.verification_status,
      membership_status: member.profile.membership_status,
      updated_at: new Date().toISOString(),
    };
    setStoredDemoProfile(next);
    return { error: null, data: next };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('user_id', member.user.id)
    .select()
    .single();

  return { data: data as MemberProfile | null, error };
}

export async function getMemberDirectory(filters: { search?: string; campus?: string; status?: string } = {}) {
  if (!isSupabaseConfigured || !supabase) {
    const search = (filters.search || '').toLowerCase();
    const profile = getStoredDemoProfile();
    const mine: DirectoryMember[] = profile?.verification_status === 'approved' && profile.directory_visible
      ? [{
          user_id: profile.user_id,
          full_name: profile.full_name,
          campus_slug: profile.campus_slug,
          program: profile.program,
          study_level: profile.study_level,
          field_of_study: profile.show_field_of_study ? profile.field_of_study : null,
          city: profile.show_city ? profile.city : null,
          instagram: profile.show_instagram ? profile.instagram : null,
          linkedin_url: profile.show_linkedin ? profile.linkedin_url : null,
          bio: profile.bio,
          membership_status: profile.membership_status,
        }]
      : [];

    const items = [...mine, ...demoDirectoryMembers].filter((item) => {
      const haystack = [item.full_name, item.program, item.field_of_study].filter(Boolean).join(' ').toLowerCase();
      const matchSearch = !search || haystack.includes(search);
      const matchCampus = !filters.campus || item.campus_slug === filters.campus;
      const matchStatus = !filters.status || item.membership_status === filters.status;
      return matchSearch && matchCampus && matchStatus;
    });

    return { data: items, error: null };
  }

  return supabase.rpc('get_member_directory', {
    search_query: filters.search || '',
    campus_filter: filters.campus || '',
    status_filter: filters.status || '',
  });
}

export async function getPendingMembers() {
  if (!isSupabaseConfigured || !supabase) {
    const reviewed = JSON.parse(localStorage.getItem('ppi-ishikawa-demo-reviewed') || '[]');
    const stored = localStorage.getItem(DEMO_PENDING_KEY);
    const localPending = stored ? [JSON.parse(stored)] : [];
    const items = [...localPending, ...demoPendingMembers].filter((item) => !reviewed.includes(item.user_id));
    return { data: items, error: null };
  }

  return supabase
    .from('profiles')
    .select('user_id,full_name,campus_slug,program,study_level,field_of_study,membership_status,created_at')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: true });
}

export async function reviewMembership(userId: string, decision: 'approved' | 'rejected', nextStatus: MembershipStatus) {
  if (!isSupabaseConfigured || !supabase) {
    const reviewed = JSON.parse(localStorage.getItem('ppi-ishikawa-demo-reviewed') || '[]');
    if (!reviewed.includes(userId)) reviewed.push(userId);
    localStorage.setItem('ppi-ishikawa-demo-reviewed', JSON.stringify(reviewed));

    const profile = getStoredDemoProfile();
    if (profile?.user_id === userId) {
      setStoredDemoProfile({
        ...profile,
        verification_status: decision,
        membership_status: nextStatus,
        updated_at: new Date().toISOString(),
      });
      localStorage.removeItem(DEMO_PENDING_KEY);
    }
    return { error: null };
  }

  return supabase.rpc('review_membership', {
    target_user_id: userId,
    decision,
    next_status: nextStatus,
  });
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
