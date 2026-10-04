import { supabase } from './supabase';

export type ProgramStatus = 'planned' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type VolunteerStatus = 'draft' | 'open' | 'closed' | 'filled';
export type VolunteerApplicationStatus = 'interested' | 'selected' | 'not_selected' | 'withdrawn';

export interface OrganizationTerm {
  id: string;
  label: string;
  starts_on: string;
  ends_on: string;
  is_current: boolean;
}

export interface OrganizationUnit {
  id: string;
  term_id: string;
  slug: string;
  name: string;
  description: string;
  unit_type: string;
  sort_order: number;
}

export interface OrganizationPosition {
  id: string;
  term_id: string;
  unit_id: string;
  slug: string;
  title: string;
  sort_order: number;
}

export interface OrganizationStructureRow {
  term_id: string;
  term_label: string;
  unit_id: string;
  unit_slug: string;
  unit_name: string;
  unit_type: string;
  unit_sort_order: number;
  position_id: string | null;
  position_title: string | null;
  position_sort_order: number | null;
  user_id: string | null;
  full_name: string | null;
  can_manage: boolean;
}

export interface OrganizationProgram {
  id: string;
  term_id: string;
  unit_id: string;
  title: string;
  summary: string;
  objective: string;
  status: ProgramStatus;
  starts_on: string | null;
  ends_on: string | null;
  visibility: 'members' | 'internal';
  progress_percent: number;
  created_at: string;
  updated_at: string;
  organization_units?: { name: string; slug: string } | null;
}

export interface ProgramPerson {
  user_id: string;
  full_name: string;
  role: 'lead' | 'pic' | 'contributor';
}

export interface ProgramUpdate {
  id: string;
  program_id: string;
  progress_percent: number;
  status: ProgramStatus;
  note: string;
  created_at: string;
}

export interface VolunteerOpportunity {
  id: string;
  term_id: string;
  unit_id: string;
  program_id: string | null;
  title: string;
  description: string;
  interests: string[];
  skills: string[];
  slots: number | null;
  deadline: string | null;
  status: VolunteerStatus;
  created_at: string;
  updated_at: string;
  organization_units?: { name: string; slug: string } | null;
  organization_programs?: { title: string } | null;
}

export interface VolunteerApplication {
  opportunity_id?: string;
  user_id: string;
  full_name?: string;
  message: string;
  status: VolunteerApplicationStatus;
  created_at: string;
}

function unavailable() {
  return { data: null, error: new Error('Supabase belum tersedia.') };
}

export async function getCurrentTerm() {
  if (!supabase) return unavailable();
  return supabase
    .from('organization_terms')
    .select('*')
    .eq('is_current', true)
    .single();
}

export async function getOrganizationTerms() {
  if (!supabase) return unavailable();
  return supabase
    .from('organization_terms')
    .select('*')
    .order('starts_on', { ascending: false });
}

export async function saveOrganizationTerm(input: Partial<OrganizationTerm> & {
  label: string;
  starts_on: string;
  ends_on: string;
  is_current: boolean;
}) {
  if (!supabase) return unavailable();

  if (input.is_current) {
    const reset = await supabase
      .from('organization_terms')
      .update({ is_current: false })
      .neq('id', input.id || '00000000-0000-0000-0000-000000000000');
    if (reset.error) return reset;
  }

  const payload = {
    label: input.label,
    starts_on: input.starts_on,
    ends_on: input.ends_on,
    is_current: input.is_current,
  };

  if (input.id) {
    return supabase
      .from('organization_terms')
      .update(payload)
      .eq('id', input.id)
      .select()
      .single();
  }

  return supabase
    .from('organization_terms')
    .insert(payload)
    .select()
    .single();
}

export async function saveOrganizationUnit(input: Partial<OrganizationUnit> & {
  term_id: string;
  slug: string;
  name: string;
}) {
  if (!supabase) return unavailable();
  const payload = {
    term_id: input.term_id,
    slug: input.slug,
    name: input.name,
    description: input.description || '',
    unit_type: input.unit_type || 'department',
    sort_order: input.sort_order ?? 100,
  };

  if (input.id) {
    return supabase
      .from('organization_units')
      .update(payload)
      .eq('id', input.id)
      .select()
      .single();
  }

  return supabase
    .from('organization_units')
    .insert(payload)
    .select()
    .single();
}

export async function saveOrganizationPosition(input: Partial<OrganizationPosition> & {
  term_id: string;
  unit_id: string;
  slug: string;
  title: string;
}) {
  if (!supabase) return unavailable();
  const payload = {
    term_id: input.term_id,
    unit_id: input.unit_id,
    slug: input.slug,
    title: input.title,
    sort_order: input.sort_order ?? 100,
  };

  if (input.id) {
    return supabase
      .from('organization_positions')
      .update(payload)
      .eq('id', input.id)
      .select()
      .single();
  }

  return supabase
    .from('organization_positions')
    .insert(payload)
    .select()
    .single();
}

export async function getOrganizationUnits(termId?: string) {
  if (!supabase) return unavailable();
  let query = supabase
    .from('organization_units')
    .select('*')
    .order('sort_order', { ascending: true });
  if (termId) query = query.eq('term_id', termId);
  return query;
}

export async function getOrganizationPositions(termId?: string) {
  if (!supabase) return unavailable();
  let query = supabase
    .from('organization_positions')
    .select('*')
    .order('sort_order', { ascending: true });
  if (termId) query = query.eq('term_id', termId);
  return query;
}

export async function getOrganizationStructure(termId?: string) {
  if (!supabase) return unavailable();
  return supabase.rpc('get_organization_structure', {
    target_term_id: termId || null,
  });
}

export async function getAssignableMembers() {
  if (!supabase) return unavailable();
  return supabase
    .from('profiles')
    .select('user_id,full_name,campus_slug,membership_status,verification_status')
    .eq('verification_status', 'approved')
    .order('full_name');
}

export async function getOrganizationAssignments(termId?: string) {
  if (!supabase) return unavailable();
  let query = supabase
    .from('organization_assignments')
    .select('*')
    .order('created_at');
  if (termId) query = query.eq('term_id', termId);
  return query;
}

export async function saveOrganizationAssignment(input: {
  term_id: string;
  position_id: string;
  user_id: string;
  can_manage: boolean;
}) {
  if (!supabase) return unavailable();
  return supabase
    .from('organization_assignments')
    .upsert(input, { onConflict: 'position_id,user_id' })
    .select()
    .single();
}

export async function removeOrganizationAssignment(assignmentId: string) {
  if (!supabase) return unavailable();
  return supabase
    .from('organization_assignments')
    .delete()
    .eq('id', assignmentId);
}

export async function getPrograms(filters: { termId?: string; unitId?: string; status?: string } = {}) {
  if (!supabase) return unavailable();
  let query = supabase
    .from('organization_programs')
    .select('*, organization_units(name,slug)')
    .order('created_at', { ascending: false });
  if (filters.termId) query = query.eq('term_id', filters.termId);
  if (filters.unitId) query = query.eq('unit_id', filters.unitId);
  if (filters.status) query = query.eq('status', filters.status);
  return query;
}

export async function saveProgram(input: Partial<OrganizationProgram> & {
  term_id: string;
  unit_id: string;
  title: string;
}) {
  if (!supabase) return unavailable();
  const payload = {
    term_id: input.term_id,
    unit_id: input.unit_id,
    title: input.title,
    summary: input.summary || '',
    objective: input.objective || '',
    status: input.status || 'planned',
    starts_on: input.starts_on || null,
    ends_on: input.ends_on || null,
    visibility: input.visibility || 'members',
    progress_percent: input.progress_percent ?? 0,
  };

  if (input.id) {
    return supabase
      .from('organization_programs')
      .update(payload)
      .eq('id', input.id)
      .select()
      .single();
  }

  const { data: userData } = await supabase.auth.getUser();
  return supabase
    .from('organization_programs')
    .insert({ ...payload, created_by: userData.user?.id || null })
    .select()
    .single();
}

export async function deleteProgram(programId: string) {
  if (!supabase) return unavailable();
  return supabase.from('organization_programs').delete().eq('id', programId);
}

export async function getProgramPeople(programId: string) {
  if (!supabase) return unavailable();
  return supabase.rpc('get_program_people', { target_program_id: programId });
}

export async function saveProgramPerson(programId: string, userId: string, role: ProgramPerson['role']) {
  if (!supabase) return unavailable();
  return supabase
    .from('program_people')
    .upsert({ program_id: programId, user_id: userId, role }, { onConflict: 'program_id,user_id' })
    .select()
    .single();
}

export async function removeProgramPerson(programId: string, userId: string) {
  if (!supabase) return unavailable();
  return supabase
    .from('program_people')
    .delete()
    .eq('program_id', programId)
    .eq('user_id', userId);
}

export async function getProgramUpdates(programId: string) {
  if (!supabase) return unavailable();
  return supabase
    .from('program_updates')
    .select('*')
    .eq('program_id', programId)
    .order('created_at', { ascending: false });
}

export async function addProgramUpdate(input: {
  program_id: string;
  progress_percent: number;
  status: ProgramStatus;
  note: string;
}) {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  const result = await supabase
    .from('program_updates')
    .insert({ ...input, author_id: userData.user?.id || null })
    .select()
    .single();

  if (!result.error) {
    await supabase
      .from('organization_programs')
      .update({
        progress_percent: input.progress_percent,
        status: input.status,
      })
      .eq('id', input.program_id);
  }

  return result;
}

export async function getVolunteerOpportunities(filters: { termId?: string; unitId?: string; status?: string } = {}) {
  if (!supabase) return unavailable();
  let query = supabase
    .from('volunteer_opportunities')
    .select('*, organization_units(name,slug), organization_programs(title)')
    .order('created_at', { ascending: false });
  if (filters.termId) query = query.eq('term_id', filters.termId);
  if (filters.unitId) query = query.eq('unit_id', filters.unitId);
  if (filters.status) query = query.eq('status', filters.status);
  return query;
}

export async function saveVolunteerOpportunity(input: Partial<VolunteerOpportunity> & {
  term_id: string;
  unit_id: string;
  title: string;
}) {
  if (!supabase) return unavailable();
  const payload = {
    term_id: input.term_id,
    unit_id: input.unit_id,
    program_id: input.program_id || null,
    title: input.title,
    description: input.description || '',
    interests: input.interests || [],
    skills: input.skills || [],
    slots: input.slots ?? null,
    deadline: input.deadline || null,
    status: input.status || 'open',
  };

  if (input.id) {
    return supabase
      .from('volunteer_opportunities')
      .update(payload)
      .eq('id', input.id)
      .select()
      .single();
  }

  const { data: userData } = await supabase.auth.getUser();
  return supabase
    .from('volunteer_opportunities')
    .insert({ ...payload, created_by: userData.user?.id || null })
    .select()
    .single();
}

export async function deleteVolunteerOpportunity(opportunityId: string) {
  if (!supabase) return unavailable();
  return supabase.from('volunteer_opportunities').delete().eq('id', opportunityId);
}

export async function getMyVolunteerApplications() {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();
  return supabase
    .from('volunteer_applications')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });
}

export async function applyForVolunteer(opportunityId: string, message: string) {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();
  return supabase
    .from('volunteer_applications')
    .upsert({
      opportunity_id: opportunityId,
      user_id: userData.user.id,
      message,
      status: 'interested',
    }, { onConflict: 'opportunity_id,user_id' })
    .select()
    .single();
}

export async function withdrawVolunteerApplication(opportunityId: string) {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();
  return supabase
    .from('volunteer_applications')
    .update({ status: 'withdrawn' })
    .eq('opportunity_id', opportunityId)
    .eq('user_id', userData.user.id);
}

export async function getVolunteerApplications(opportunityId: string) {
  if (!supabase) return unavailable();
  return supabase.rpc('get_volunteer_applications', {
    target_opportunity_id: opportunityId,
  });
}

export async function updateVolunteerApplicationStatus(
  opportunityId: string,
  userId: string,
  status: VolunteerApplicationStatus,
) {
  if (!supabase) return unavailable();
  return supabase
    .from('volunteer_applications')
    .update({ status })
    .eq('opportunity_id', opportunityId)
    .eq('user_id', userId);
}
