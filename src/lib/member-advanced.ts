import { supabase } from './supabase';

export interface MembershipCard {
  user_id: string;
  card_number: string;
  verification_token: string;
  issued_at: string;
  revoked_at: string | null;
}

export interface MembershipCardVerification {
  valid: boolean;
  card_number: string;
  full_name: string;
  campus_slug: string | null;
  membership_status: string;
  issued_at: string;
}

export interface EventCheckinSession {
  id: string;
  event_id: string;
  checkin_token: string;
  opens_at: string;
  closes_at: string | null;
  active: boolean;
  created_at: string;
  member_events?: {
    title: string;
    starts_at: string;
  } | null;
}

export interface MemberCertificate {
  id: string;
  user_id: string;
  event_id: string | null;
  certificate_number: string;
  verification_token: string;
  title: string;
  description: string;
  issued_at: string;
  issued_by: string | null;
  revoked_at: string | null;
  member_events?: { title: string } | null;
}

export interface CertificateVerification {
  valid: boolean;
  certificate_number: string;
  full_name: string;
  title: string;
  description: string;
  issued_at: string;
  event_title: string | null;
}

export interface MemberDocument {
  id: string;
  title: string;
  description: string;
  storage_path: string;
  audience: 'verified' | 'officers' | 'alumni';
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MembershipAnalytics {
  members_total: number;
  verified_members: number;
  pending_members: number;
  active_members: number;
  incoming_members: number;
  alumni: number;
  events: number;
  rsvp_attending: number;
  attendance_checked_in: number;
  programs: number;
  volunteer_open: number;
  mentor_available: number;
  story_submissions: number;
  certificates: number;
  campuses: Record<string, number>;
}

function unavailable() {
  return { data: null, error: new Error('Supabase belum tersedia.') };
}

export async function ensureMembershipCard() {
  if (!supabase) return unavailable();
  return supabase.rpc('ensure_my_membership_card');
}

export async function rotateMembershipCard() {
  if (!supabase) return unavailable();
  return supabase.rpc('rotate_my_membership_card');
}

export async function verifyMembershipCard(token: string) {
  if (!supabase) return unavailable();
  return supabase.rpc('verify_membership_card', { target_token: token });
}

export async function getCheckinSessions() {
  if (!supabase) return unavailable();
  return supabase
    .from('event_checkin_sessions')
    .select('*, member_events(title,starts_at)')
    .order('created_at', { ascending: false });
}

export async function createCheckinSession(input: {
  event_id: string;
  opens_at: string;
  closes_at: string | null;
}) {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();

  return supabase
    .from('event_checkin_sessions')
    .insert({
      ...input,
      active: true,
      created_by: userData.user.id,
    })
    .select('*, member_events(title,starts_at)')
    .single();
}

export async function setCheckinSessionActive(sessionId: string, active: boolean) {
  if (!supabase) return unavailable();
  return supabase
    .from('event_checkin_sessions')
    .update({ active })
    .eq('id', sessionId)
    .select('*, member_events(title,starts_at)')
    .single();
}

export async function checkInWithEventToken(token: string) {
  if (!supabase) return unavailable();
  return supabase.rpc('check_in_with_event_token', { target_token: token });
}

export async function getMyCertificates() {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();

  return supabase
    .from('member_certificates')
    .select('*, member_events(title)')
    .eq('user_id', userData.user.id)
    .order('issued_at', { ascending: false });
}

export async function getAllCertificates() {
  if (!supabase) return unavailable();
  return supabase
    .from('member_certificates')
    .select('*, member_events(title)')
    .order('issued_at', { ascending: false });
}

export async function issueCertificate(input: {
  user_id: string;
  event_id?: string | null;
  title: string;
  description: string;
}) {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();

  return supabase
    .from('member_certificates')
    .insert({
      user_id: input.user_id,
      event_id: input.event_id || null,
      title: input.title,
      description: input.description,
      issued_by: userData.user.id,
    })
    .select('*, member_events(title)')
    .single();
}

export async function setCertificateRevoked(certificateId: string, revoked: boolean) {
  if (!supabase) return unavailable();
  return supabase
    .from('member_certificates')
    .update({ revoked_at: revoked ? new Date().toISOString() : null })
    .eq('id', certificateId)
    .select('*, member_events(title)')
    .single();
}

export async function verifyCertificate(token: string) {
  if (!supabase) return unavailable();
  return supabase.rpc('verify_certificate', { target_token: token });
}

export async function getMembershipAnalytics() {
  if (!supabase) return unavailable();
  return supabase.rpc('get_membership_analytics');
}

export async function getMemberDocuments() {
  if (!supabase) return unavailable();
  return supabase
    .from('member_documents')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function uploadMemberDocument(input: {
  file: File;
  title: string;
  description: string;
  audience: MemberDocument['audience'];
}) {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();

  const cleanName = input.file.name
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(-120) || 'document';
  const storagePath = `${new Date().getFullYear()}/${crypto.randomUUID()}-${cleanName}`;

  const uploaded = await supabase.storage
    .from('member-documents')
    .upload(storagePath, input.file, {
      upsert: false,
      contentType: input.file.type || undefined,
    });

  if (uploaded.error) return { data: null, error: uploaded.error };

  const metadata = await supabase
    .from('member_documents')
    .insert({
      title: input.title,
      description: input.description,
      storage_path: storagePath,
      audience: input.audience,
      published: true,
      created_by: userData.user.id,
    })
    .select()
    .single();

  if (metadata.error) {
    await supabase.storage.from('member-documents').remove([storagePath]);
  }

  return metadata;
}

export async function deleteMemberDocument(document: MemberDocument) {
  if (!supabase) return unavailable();

  const metadataResult = await supabase
    .from('member_documents')
    .delete()
    .eq('id', document.id);

  if (metadataResult.error) return { data: null, error: metadataResult.error };

  const storageResult = await supabase.storage
    .from('member-documents')
    .remove([document.storage_path]);

  if (storageResult.error) {
    return {
      data: null,
      error: new Error('Metadata terhapus, tetapi file storage perlu dibersihkan manual oleh admin.'),
    };
  }

  return metadataResult;
}

export async function getDocumentDownloadUrl(storagePath: string) {
  if (!supabase) return unavailable();
  return supabase.storage
    .from('member-documents')
    .createSignedUrl(storagePath, 600, { download: true });
}
