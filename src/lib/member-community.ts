import { isSupabaseConfigured, supabase } from './supabase';
import {
  demoAnnouncements,
  demoMemberEvents,
  memberInterestOptions,
  memberSkillOptions,
} from '../data/member-community-demo';

export interface MemberEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  starts_at: string;
  ends_at: string;
  location: string;
  mode: 'onsite' | 'online' | 'hybrid';
  capacity: number | null;
  registration_deadline: string | null;
}

export interface MemberAnnouncement {
  id: string;
  title: string;
  body: string;
  category: string;
  audience: string;
  published_at: string;
  important: boolean;
}

export interface MemberPreference {
  interests: string[];
  skills: string[];
  volunteer_available: boolean;
}

export interface MemberAspiration {
  id: string;
  subject: string;
  message: string;
  category: string;
  anonymous: boolean;
  status: 'received' | 'reviewed' | 'planned' | 'completed';
  created_at: string;
}

const RSVP_KEY = 'ppi-ishikawa-demo-rsvp';
const PREFERENCE_KEY = 'ppi-ishikawa-demo-preferences';
const ASPIRATION_KEY = 'ppi-ishikawa-demo-aspirations';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getInterestOptions() {
  return memberInterestOptions;
}

export function getSkillOptions() {
  return memberSkillOptions;
}

export async function getMemberEvents() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: demoMemberEvents, error: null };
  }

  return supabase
    .from('member_events')
    .select('id,title,description,category,starts_at,ends_at,location,mode,capacity,registration_deadline')
    .order('starts_at', { ascending: true });
}

export async function getAnnouncements() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: demoAnnouncements, error: null };
  }

  return supabase
    .from('member_announcements')
    .select('id,title,body,category,audience,published_at,important')
    .order('published_at', { ascending: false });
}

export async function getRsvps() {
  if (!isSupabaseConfigured || !supabase) {
    return readJson<Record<string, boolean>>(RSVP_KEY, {});
  }

  const { data, error } = await supabase
    .from('event_rsvps')
    .select('event_id,attending');

  if (error) return {};
  return Object.fromEntries((data || []).map((item) => [item.event_id, item.attending]));
}

export async function setRsvp(eventId: string, attending: boolean) {
  if (!isSupabaseConfigured || !supabase) {
    const current = readJson<Record<string, boolean>>(RSVP_KEY, {});
    current[eventId] = attending;
    writeJson(RSVP_KEY, current);
    return { error: null };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: new Error('Member belum login.') };

  return supabase
    .from('event_rsvps')
    .upsert({
      event_id: eventId,
      user_id: userData.user.id,
      attending,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'event_id,user_id' });
}

export async function getMemberPreferences(): Promise<MemberPreference> {
  if (!isSupabaseConfigured || !supabase) {
    return readJson<MemberPreference>(PREFERENCE_KEY, {
      interests: [],
      skills: [],
      volunteer_available: false,
    });
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { interests: [], skills: [], volunteer_available: false };

  const { data } = await supabase
    .from('member_preferences')
    .select('interests,skills,volunteer_available')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  return data || { interests: [], skills: [], volunteer_available: false };
}

export async function saveMemberPreferences(preferences: MemberPreference) {
  if (!isSupabaseConfigured || !supabase) {
    writeJson(PREFERENCE_KEY, preferences);
    return { error: null };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: new Error('Member belum login.') };

  return supabase
    .from('member_preferences')
    .upsert({
      user_id: userData.user.id,
      ...preferences,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
}

export async function getMyAspirations(): Promise<MemberAspiration[]> {
  if (!isSupabaseConfigured || !supabase) {
    return readJson<MemberAspiration[]>(ASPIRATION_KEY, []);
  }

  const { data, error } = await supabase
    .from('member_aspirations')
    .select('id,subject,message,category,anonymous,status,created_at')
    .order('created_at', { ascending: false });

  return error ? [] : (data || []);
}

export async function submitAspiration(input: {
  subject: string;
  message: string;
  category: string;
  anonymous: boolean;
}) {
  if (!isSupabaseConfigured || !supabase) {
    const current = readJson<MemberAspiration[]>(ASPIRATION_KEY, []);
    const item: MemberAspiration = {
      id: `demo-aspiration-${Date.now()}`,
      ...input,
      status: 'received',
      created_at: new Date().toISOString(),
    };
    writeJson(ASPIRATION_KEY, [item, ...current]);
    return { data: item, error: null };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { data: null, error: new Error('Member belum login.') };

  return supabase
    .from('member_aspirations')
    .insert({
      user_id: userData.user.id,
      ...input,
    })
    .select()
    .single();
}

export function googleCalendarUrl(event: MemberEvent) {
  const compact = (value: string) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.000Z$/, 'Z');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title.replace(/^Demo · /, ''),
    dates: `${compact(event.starts_at)}/${compact(event.ends_at)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
