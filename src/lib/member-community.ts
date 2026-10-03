import { isSupabaseConfigured, supabase } from './supabase';
import {
  demoAdminAspirations,
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
const EVENTS_KEY = 'ppi-ishikawa-demo-events';
const ANNOUNCEMENTS_KEY = 'ppi-ishikawa-demo-announcements';
const ASPIRATION_STATUS_KEY = 'ppi-ishikawa-demo-aspiration-status';
const ATTENDANCE_KEY = 'ppi-ishikawa-demo-attendance';

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
    return { data: readJson<MemberEvent[]>(EVENTS_KEY, demoMemberEvents), error: null };
  }

  return supabase
    .from('member_events')
    .select('id,title,description,category,starts_at,ends_at,location,mode,capacity,registration_deadline')
    .order('starts_at', { ascending: true });
}

export async function getAnnouncements() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: readJson<MemberAnnouncement[]>(ANNOUNCEMENTS_KEY, demoAnnouncements), error: null };
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


export async function saveEvent(input: Omit<MemberEvent, 'id'> & { id?: string }) {
  if (!isSupabaseConfigured || !supabase) {
    const events = readJson<MemberEvent[]>(EVENTS_KEY, demoMemberEvents);
    const item: MemberEvent = {
      ...input,
      id: input.id || `demo-event-${Date.now()}`,
    };
    const next = input.id
      ? events.map((event) => event.id === input.id ? item : event)
      : [item, ...events];
    writeJson(EVENTS_KEY, next);
    return { data: item, error: null };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { data: null, error: new Error('Admin belum login.') };

  const payload = {
    ...input,
    created_by: userData.user.id,
    published: true,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    return supabase.from('member_events').update(payload).eq('id', input.id).select().single();
  }

  return supabase.from('member_events').insert(payload).select().single();
}

export async function deleteEvent(eventId: string) {
  if (!isSupabaseConfigured || !supabase) {
    const events = readJson<MemberEvent[]>(EVENTS_KEY, demoMemberEvents);
    writeJson(EVENTS_KEY, events.filter((event) => event.id !== eventId));
    return { error: null };
  }

  return supabase.from('member_events').delete().eq('id', eventId);
}

export async function saveAnnouncement(input: Omit<MemberAnnouncement, 'id'> & { id?: string }) {
  if (!isSupabaseConfigured || !supabase) {
    const items = readJson<MemberAnnouncement[]>(ANNOUNCEMENTS_KEY, demoAnnouncements);
    const item: MemberAnnouncement = {
      ...input,
      id: input.id || `demo-announcement-${Date.now()}`,
    };
    const next = input.id
      ? items.map((announcement) => announcement.id === input.id ? item : announcement)
      : [item, ...items];
    writeJson(ANNOUNCEMENTS_KEY, next);
    return { data: item, error: null };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { data: null, error: new Error('Admin belum login.') };

  const payload = {
    ...input,
    created_by: userData.user.id,
    published: true,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    return supabase.from('member_announcements').update(payload).eq('id', input.id).select().single();
  }

  return supabase.from('member_announcements').insert(payload).select().single();
}

export async function deleteAnnouncement(announcementId: string) {
  if (!isSupabaseConfigured || !supabase) {
    const items = readJson<MemberAnnouncement[]>(ANNOUNCEMENTS_KEY, demoAnnouncements);
    writeJson(ANNOUNCEMENTS_KEY, items.filter((item) => item.id !== announcementId));
    return { error: null };
  }

  return supabase.from('member_announcements').delete().eq('id', announcementId);
}

export async function getAdminAspirations() {
  if (!isSupabaseConfigured || !supabase) {
    const own = readJson<MemberAspiration[]>(ASPIRATION_KEY, []);
    const statusOverrides = readJson<Record<string, MemberAspiration['status']>>(ASPIRATION_STATUS_KEY, {});
    const localItems = own.map((item) => ({
      ...item,
      status: statusOverrides[item.id] || item.status,
      submitter_id: item.anonymous ? null : 'demo-member',
      submitter_name: item.anonymous ? null : 'Anggota Demo',
    }));
    const fixtures = demoAdminAspirations.map((item) => ({
      ...item,
      status: statusOverrides[item.id] || item.status,
    }));
    return { data: [...localItems, ...fixtures], error: null };
  }

  return supabase.rpc('get_admin_aspirations');
}

export async function updateAspirationStatus(aspirationId: string, nextStatus: MemberAspiration['status']) {
  if (!isSupabaseConfigured || !supabase) {
    const current = readJson<Record<string, MemberAspiration['status']>>(ASPIRATION_STATUS_KEY, {});
    current[aspirationId] = nextStatus;
    writeJson(ASPIRATION_STATUS_KEY, current);

    const own = readJson<MemberAspiration[]>(ASPIRATION_KEY, []);
    if (own.some((item) => item.id === aspirationId)) {
      writeJson(ASPIRATION_KEY, own.map((item) => item.id === aspirationId ? { ...item, status: nextStatus } : item));
    }
    return { error: null };
  }

  return supabase.rpc('update_aspiration_status', {
    aspiration_id: aspirationId,
    next_status: nextStatus,
  });
}


export interface EventAttendanceMember {
  user_id: string;
  full_name: string;
  attending: boolean;
  checked_in_at: string | null;
}

export async function getEventAttendance(eventId: string) {
  if (!isSupabaseConfigured || !supabase) {
    const overrides = readJson<Record<string, Record<string, string | null>>>(ATTENDANCE_KEY, {});
    const base: EventAttendanceMember[] = [
      { user_id: 'demo-directory-01', full_name: 'Contoh Anggota 01', attending: true, checked_in_at: null },
      { user_id: 'demo-directory-02', full_name: 'Contoh Anggota 02', attending: true, checked_in_at: null },
      { user_id: 'demo-member', full_name: 'Anggota Demo', attending: true, checked_in_at: null },
    ];
    return {
      data: base.map((item) => ({
        ...item,
        checked_in_at: overrides[eventId]?.[item.user_id] ?? item.checked_in_at,
      })),
      error: null,
    };
  }

  return supabase.rpc('get_event_attendance', { target_event_id: eventId });
}

export async function setEventCheckin(eventId: string, userId: string, checkedIn: boolean) {
  if (!isSupabaseConfigured || !supabase) {
    const current = readJson<Record<string, Record<string, string | null>>>(ATTENDANCE_KEY, {});
    current[eventId] ||= {};
    current[eventId][userId] = checkedIn ? new Date().toISOString() : null;
    writeJson(ATTENDANCE_KEY, current);
    return { error: null };
  }

  return supabase.rpc('set_event_checkin', {
    target_event_id: eventId,
    target_user_id: userId,
    checked_in: checkedIn,
  });
}
