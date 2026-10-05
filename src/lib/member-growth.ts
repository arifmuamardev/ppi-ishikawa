import { supabase } from './supabase';
import { getCurrentMember, type MemberProfile } from './member';
import {
  careerSources,
  campusCareerProfiles,
  type CareerAudience,
  type CareerOpportunityType,
} from '../data/career';
import {
  scholarships,
  type ScholarshipStudyLevel,
} from '../data/scholarships';
import type { StoryTopic } from '../data/stories';

export const mentoringTopics = [
  'Studi & adaptasi kampus',
  'Riset',
  'Academic writing',
  'Beasiswa',
  'Internship',
  'Job hunting di Jepang',
  'Karier akademik',
  'Karier industri',
  'Bahasa Jepang',
  'Kehidupan di Ishikawa',
] as const;

export const careerInterestOptions: { value: CareerOpportunityType; label: string }[] = [
  { value: 'job', label: 'Pekerjaan' },
  { value: 'internship', label: 'Internship' },
  { value: 'postdoc', label: 'Postdoc' },
  { value: 'research', label: 'Researcher' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'fellowship', label: 'Fellowship' },
];

export const storyTopicOptions: { value: StoryTopic; label: string }[] = [
  { value: 'study', label: 'Studi' },
  { value: 'research', label: 'Riset' },
  { value: 'career', label: 'Karier' },
  { value: 'scholarship', label: 'Beasiswa' },
  { value: 'family', label: 'Keluarga' },
  { value: 'community', label: 'Komunitas' },
  { value: 'life', label: 'Kehidupan di Ishikawa' },
];

export interface AlumniProfile {
  user_id: string;
  graduation_year: number | null;
  current_country: string | null;
  current_city: string | null;
  organization: string | null;
  role_title: string | null;
  sector: string | null;
  directory_visible: boolean;
  willing_to_be_contacted: boolean;
  speaking_available: boolean;
  updated_at: string;
}

export interface GrowthPreferences {
  user_id: string;
  career_interests: CareerOpportunityType[];
  mentor_available: boolean;
  mentor_topics: string[];
  seeking_mentor: boolean;
  mentee_topics: string[];
  story_willing: boolean;
  story_topics: StoryTopic[];
  updated_at: string;
}

export interface AlumniDirectoryEntry {
  user_id: string;
  full_name: string;
  campus_slug: string | null;
  program: string | null;
  graduation_year: number | null;
  current_country: string | null;
  current_city: string | null;
  organization: string | null;
  role_title: string | null;
  sector: string | null;
  linkedin_url: string | null;
  willing_to_be_contacted: boolean;
  speaking_available: boolean;
}

export interface MentorDirectoryEntry {
  user_id: string;
  full_name: string;
  campus_slug: string | null;
  program: string | null;
  membership_status: string;
  field_of_study: string | null;
  mentor_topics: string[];
  organization: string | null;
  role_title: string | null;
}

export interface MentoringRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  mentor_id: string;
  mentor_name: string;
  topic: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface StorySubmission {
  id: string;
  user_id: string;
  topics: StoryTopic[];
  note: string;
  status: 'proposed' | 'contacted' | 'draft' | 'published' | 'declined';
  created_at: string;
  updated_at: string;
}

export interface StoryPipelineEntry extends StorySubmission {
  full_name: string;
  campus_slug: string | null;
  membership_status: string;
}

function unavailable() {
  return { data: null, error: new Error('Supabase belum tersedia.') };
}

export async function getAlumniProfile() {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();

  return supabase
    .from('alumni_profiles')
    .select('*')
    .eq('user_id', userData.user.id)
    .maybeSingle();
}

export async function saveAlumniProfile(input: Omit<AlumniProfile, 'user_id' | 'updated_at'>) {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();

  return supabase
    .from('alumni_profiles')
    .upsert({
      user_id: userData.user.id,
      ...input,
    }, { onConflict: 'user_id' })
    .select()
    .single();
}

export async function getGrowthPreferences() {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();

  return supabase
    .from('member_growth_preferences')
    .select('*')
    .eq('user_id', userData.user.id)
    .maybeSingle();
}

export async function saveGrowthPreferences(input: Omit<GrowthPreferences, 'user_id' | 'updated_at'>) {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();

  return supabase
    .from('member_growth_preferences')
    .upsert({
      user_id: userData.user.id,
      ...input,
    }, { onConflict: 'user_id' })
    .select()
    .single();
}

export async function getAlumniDirectory() {
  if (!supabase) return unavailable();
  return supabase.rpc('get_alumni_directory');
}

export async function getMentorDirectory() {
  if (!supabase) return unavailable();
  return supabase.rpc('get_mentor_directory');
}

export async function createMentoringRequest(mentorId: string, topic: string, message: string) {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();

  return supabase
    .from('mentoring_requests')
    .insert({
      requester_id: userData.user.id,
      mentor_id: mentorId,
      topic,
      message,
    })
    .select()
    .single();
}

export async function getMyMentoringRequests() {
  if (!supabase) return unavailable();
  return supabase.rpc('get_my_mentoring_requests');
}

export async function updateMentoringRequestStatus(
  requestId: string,
  status: MentoringRequest['status'],
) {
  if (!supabase) return unavailable();

  return supabase
    .from('mentoring_requests')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single();
}

export async function getMyStorySubmissions() {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();

  return supabase
    .from('story_submissions')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });
}

export async function submitStoryInterest(topics: StoryTopic[], note: string) {
  if (!supabase) return unavailable();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return unavailable();

  return supabase
    .from('story_submissions')
    .insert({
      user_id: userData.user.id,
      topics,
      note,
      status: 'proposed',
    })
    .select()
    .single();
}

export async function getStoryPipeline() {
  if (!supabase) return unavailable();
  return supabase.rpc('get_story_pipeline');
}

export async function updateStorySubmissionStatus(
  submissionId: string,
  status: StorySubmission['status'],
) {
  if (!supabase) return unavailable();

  return supabase
    .from('story_submissions')
    .update({ status })
    .eq('id', submissionId)
    .select()
    .single();
}

function scholarshipLevelFor(profile: MemberProfile): ScholarshipStudyLevel | null {
  const map: Record<string, ScholarshipStudyLevel> = {
    language: 'JL',
    vocational: 'ST',
    undergraduate: 'U',
    research: 'R',
    master: 'M',
    doctoral: 'D',
    exchange: 'Exchange',
  };
  return profile.study_level ? map[profile.study_level] || null : null;
}

function careerAudiencesFor(profile: MemberProfile): CareerAudience[] {
  const audiences = new Set<CareerAudience>();
  if (profile.membership_status === 'alumni') {
    audiences.add('alumni');
    audiences.add('graduate');
  } else {
    audiences.add('student');
  }
  if (profile.study_level === 'doctoral') audiences.add('doctoral');
  return [...audiences];
}

export async function getPersonalizedOpportunities() {
  const member = await getCurrentMember();
  if (!member.profile) {
    return {
      career: [],
      scholarships: [],
      campusCareer: null,
      reasons: [],
    };
  }

  const profile = member.profile;
  const prefResult = await getGrowthPreferences();
  const preferences = (prefResult.data as GrowthPreferences | null) || null;
  const audiences = careerAudiencesFor(profile);
  const interests = preferences?.career_interests || [];

  const career = careerSources
    .map((source) => {
      let score = source.audiences.some((audience) => audiences.includes(audience)) ? 3 : 0;
      if (interests.length && source.types.some((type) => interests.includes(type))) score += 3;
      if (source.locations.includes('ishikawa')) score += 2;
      if (source.featured) score += 1;
      return { ...source, score };
    })
    .filter((source) => source.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const scholarshipLevel = scholarshipLevelFor(profile);
  const scholarshipMatches = profile.membership_status === 'alumni'
    ? []
    : scholarships
      .map((item) => {
        let score = 0;
        if (scholarshipLevel && item.studyLevels.includes(scholarshipLevel)) score += 4;
        if (profile.campus_slug && item.campusSlugs.includes(profile.campus_slug)) score += 3;
        if (item.campusScope === 'all-japan') score += 1;
        if (item.stages.includes('after-enrollment') || item.stages.includes('both')) score += 1;
        if (item.featured) score += 1;
        return { ...item, score };
      })
      .filter((item) => item.score >= 5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

  const reasons: string[] = [];
  if (profile.campus_slug) reasons.push('kampus');
  if (profile.study_level) reasons.push('jenjang studi');
  if (profile.membership_status) reasons.push('status membership');
  if (interests.length) reasons.push('minat karier');

  return {
    career,
    scholarships: scholarshipMatches,
    campusCareer: profile.campus_slug ? campusCareerProfiles[profile.campus_slug] || null : null,
    reasons,
  };
}


export async function getGrowthAdminSummary() {
  if (!supabase) return {
    alumniProfiles: 0,
    mentors: 0,
    seekingMentors: 0,
    storyWilling: 0,
    storySubmissions: 0,
  };

  const [
    alumni,
    mentors,
    seekers,
    storyWilling,
    submissions,
  ] = await Promise.all([
    supabase.from('alumni_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('member_growth_preferences').select('*', { count: 'exact', head: true }).eq('mentor_available', true),
    supabase.from('member_growth_preferences').select('*', { count: 'exact', head: true }).eq('seeking_mentor', true),
    supabase.from('member_growth_preferences').select('*', { count: 'exact', head: true }).eq('story_willing', true),
    supabase.from('story_submissions').select('*', { count: 'exact', head: true }),
  ]);

  return {
    alumniProfiles: alumni.count || 0,
    mentors: mentors.count || 0,
    seekingMentors: seekers.count || 0,
    storyWilling: storyWilling.count || 0,
    storySubmissions: submissions.count || 0,
  };
}
