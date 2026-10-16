import { supabase } from './supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export interface IssuedStudioCertificate {
  id: string;
  batch_id: string;
  recipient_position: number;
  recipient_name: string;
  recipient_role: string;
  event_title: string;
  event_date: string;
  organizer: string;
  certificate_number: string;
  verification_token: string;
  signer_name: string;
  signer_role: string;
  issued_at: string;
  revoked_at: string | null;
}

export function studioVerifyUrl(token: string) {
  return `https://ppi-ishikawa.org/verify/studio-certificate/?token=${encodeURIComponent(token)}`;
}

export async function issueStudioCertificates(
  batchId: string,
  input: { event: string; date: string; role: string; organizer: string; names: string[] }
): Promise<{ data: IssuedStudioCertificate[]; error: PostgrestError | Error | null }> {
  if (!supabase) return { data: [], error: new Error('Database tidak tersedia. Sertifikat resmi tidak dapat diterbitkan.') };
  const rows = input.names.map((name, index) => ({
    batch_id: batchId,
    recipient_position: index + 1,
    recipient_name: name,
    recipient_role: input.role,
    event_title: input.event,
    event_date: input.date,
    organizer: input.organizer,
  }));
  // Only registered authorities can insert. Server triggers override identity,
  // signer metadata and issuance timestamps.
  const { data, error } = await supabase.from('studio_certificates')
    .insert(rows).select('*');
  if (!error) return { data: (data || []) as IssuedStudioCertificate[], error: null };
  // An interrupted retry must never make new certificates for this batch.
  if (error.code === '23505') {
    const existing = await supabase.from('studio_certificates')
      .select('*').eq('batch_id', batchId).order('recipient_position');
    if (existing.error) return { data: [], error: existing.error };
    const certificates = (existing.data || []) as IssuedStudioCertificate[];
    const matching = certificates.length === input.names.length &&
      certificates.every((cert, i) => cert.recipient_position === i + 1 &&
        cert.recipient_name === input.names[i] && cert.event_title === input.event &&
        cert.event_date === input.date && cert.recipient_role === input.role && cert.organizer === input.organizer);
    if (!matching) return { data: [], error: new Error('Batch sudah diterbitkan dengan data berbeda. Muat ulang Studio sebelum mengulangi.') };
    return { data: certificates, error: null };
  }
  return { data: [], error };
}

export async function listStudioCertificates() {
  if (!supabase) return { data: [], error: new Error('Database tidak tersedia.') };
  return supabase.from('studio_certificates').select('*').order('issued_at', { ascending: false }).limit(500);
}

export async function setStudioCertificateRevoked(id: string, revoke: boolean) {
  if (!supabase) return { data: null, error: new Error('Database tidak tersedia.') };
  return supabase.from('studio_certificates')
    .update({ revoked_at: revoke ? new Date().toISOString() : null })
    .eq('id', id).select('*').single();
}

export async function verifyStudioCertificate(token: string) {
  if (!supabase) return { data: null, error: new Error('Verifikasi belum tersedia.') };
  return supabase.rpc('verify_studio_certificate', { target_token: token });
}
