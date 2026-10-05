-- PPI Ishikawa Membership Phase 4
-- Alumni, mentoring, opportunity preferences, and story contribution pipeline.

create table if not exists public.alumni_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  graduation_year integer check (graduation_year is null or graduation_year between 2000 and 2100),
  current_country text,
  current_city text,
  organization text,
  role_title text,
  sector text,
  directory_visible boolean not null default false,
  willing_to_be_contacted boolean not null default false,
  speaking_available boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.member_growth_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  career_interests text[] not null default '{}',
  mentor_available boolean not null default false,
  mentor_topics text[] not null default '{}',
  seeking_mentor boolean not null default false,
  mentee_topics text[] not null default '{}',
  story_willing boolean not null default false,
  story_topics text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.mentoring_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  mentor_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  message text not null default '' check (char_length(message) <= 1000),
  status text not null default 'pending'
    check (status in ('pending','accepted','declined','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requester_id <> mentor_id)
);

create table if not exists public.story_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topics text[] not null default '{}',
  note text not null default '' check (char_length(note) <= 1500),
  status text not null default 'proposed'
    check (status in ('proposed','contacted','draft','published','declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists alumni_profiles_touch_updated_at on public.alumni_profiles;
create trigger alumni_profiles_touch_updated_at
before update on public.alumni_profiles
for each row execute function private.touch_updated_at();

drop trigger if exists member_growth_preferences_touch_updated_at on public.member_growth_preferences;
create trigger member_growth_preferences_touch_updated_at
before update on public.member_growth_preferences
for each row execute function private.touch_updated_at();

drop trigger if exists mentoring_requests_touch_updated_at on public.mentoring_requests;
create trigger mentoring_requests_touch_updated_at
before update on public.mentoring_requests
for each row execute function private.touch_updated_at();

drop trigger if exists story_submissions_touch_updated_at on public.story_submissions;
create trigger story_submissions_touch_updated_at
before update on public.story_submissions
for each row execute function private.touch_updated_at();

alter table public.alumni_profiles enable row level security;
alter table public.member_growth_preferences enable row level security;
alter table public.mentoring_requests enable row level security;
alter table public.story_submissions enable row level security;

create policy "Members manage own alumni profile"
on public.alumni_profiles for all to authenticated
using (user_id = (select auth.uid()) and private.is_verified_member())
with check (user_id = (select auth.uid()) and private.is_verified_member());

create policy "Admins read alumni profiles"
on public.alumni_profiles for select to authenticated
using (private.is_admin());

create policy "Members manage own growth preferences"
on public.member_growth_preferences for all to authenticated
using (user_id = (select auth.uid()) and private.is_verified_member())
with check (user_id = (select auth.uid()) and private.is_verified_member());

create policy "Admins read growth preferences"
on public.member_growth_preferences for select to authenticated
using (private.is_admin());

create policy "Mentoring participants read requests"
on public.mentoring_requests for select to authenticated
using (
  private.is_verified_member()
  and (
    requester_id = (select auth.uid())
    or mentor_id = (select auth.uid())
    or private.is_admin()
  )
);

create policy "Members create mentoring requests"
on public.mentoring_requests for insert to authenticated
with check (
  requester_id = (select auth.uid())
  and private.is_verified_member()
  and exists (
    select 1
    from public.member_growth_preferences mgp
    where mgp.user_id = mentor_id
      and mgp.mentor_available = true
  )
);

create policy "Requester may close own mentoring request"
on public.mentoring_requests for update to authenticated
using (
  requester_id = (select auth.uid())
  and private.is_verified_member()
)
with check (
  requester_id = (select auth.uid())
  and status = 'closed'
);

create policy "Mentor manages request response"
on public.mentoring_requests for update to authenticated
using (
  mentor_id = (select auth.uid())
  and private.is_verified_member()
)
with check (
  mentor_id = (select auth.uid())
  and status in ('accepted','declined','closed')
);

create policy "Members create own story submissions"
on public.story_submissions for insert to authenticated
with check (user_id = (select auth.uid()) and private.is_verified_member());

create policy "Members read own story submissions"
on public.story_submissions for select to authenticated
using (user_id = (select auth.uid()) or private.is_admin());

create policy "Members edit proposed story submissions"
on public.story_submissions for update to authenticated
using (
  user_id = (select auth.uid())
  and status = 'proposed'
  and private.is_verified_member()
)
with check (
  user_id = (select auth.uid())
  and status = 'proposed'
);

create policy "Admins manage story submissions"
on public.story_submissions for all to authenticated
using (private.is_admin())
with check (private.is_admin());

create or replace function private.get_alumni_directory_impl()
returns table (
  user_id uuid,
  full_name text,
  campus_slug text,
  program text,
  graduation_year integer,
  current_country text,
  current_city text,
  organization text,
  role_title text,
  sector text,
  linkedin_url text,
  willing_to_be_contacted boolean,
  speaking_available boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_verified_member() then
    raise exception 'Verified membership required';
  end if;

  return query
  select
    p.user_id,
    p.full_name,
    p.campus_slug,
    p.program,
    a.graduation_year,
    a.current_country,
    a.current_city,
    a.organization,
    a.role_title,
    a.sector,
    case when p.show_linkedin then p.linkedin_url else null end,
    a.willing_to_be_contacted,
    a.speaking_available
  from public.profiles p
  join public.alumni_profiles a on a.user_id = p.user_id
  where p.verification_status = 'approved'
    and p.membership_status = 'alumni'
    and a.directory_visible = true
  order by p.full_name;
end;
$$;

create or replace function public.get_alumni_directory()
returns table (
  user_id uuid,
  full_name text,
  campus_slug text,
  program text,
  graduation_year integer,
  current_country text,
  current_city text,
  organization text,
  role_title text,
  sector text,
  linkedin_url text,
  willing_to_be_contacted boolean,
  speaking_available boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_alumni_directory_impl();
$$;

create or replace function private.get_mentor_directory_impl()
returns table (
  user_id uuid,
  full_name text,
  campus_slug text,
  program text,
  membership_status text,
  field_of_study text,
  mentor_topics text[],
  organization text,
  role_title text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_verified_member() then
    raise exception 'Verified membership required';
  end if;

  return query
  select
    p.user_id,
    p.full_name,
    p.campus_slug,
    p.program,
    p.membership_status::text,
    case when p.show_field_of_study then p.field_of_study else null end,
    g.mentor_topics,
    a.organization,
    a.role_title
  from public.profiles p
  join public.member_growth_preferences g on g.user_id = p.user_id
  left join public.alumni_profiles a on a.user_id = p.user_id
  where p.verification_status = 'approved'
    and p.membership_status in ('active','alumni')
    and g.mentor_available = true
  order by p.full_name;
end;
$$;

create or replace function public.get_mentor_directory()
returns table (
  user_id uuid,
  full_name text,
  campus_slug text,
  program text,
  membership_status text,
  field_of_study text,
  mentor_topics text[],
  organization text,
  role_title text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_mentor_directory_impl();
$$;

revoke all on table public.alumni_profiles from anon, authenticated;
revoke all on table public.member_growth_preferences from anon, authenticated;
revoke all on table public.mentoring_requests from anon, authenticated;
revoke all on table public.story_submissions from anon, authenticated;

grant select, insert, update, delete on public.alumni_profiles to authenticated;
grant select, insert, update, delete on public.member_growth_preferences to authenticated;
grant select, insert, update on public.mentoring_requests to authenticated;
grant select, insert, update, delete on public.story_submissions to authenticated;

revoke all on function public.get_alumni_directory() from public;
revoke all on function public.get_mentor_directory() from public;
grant execute on function private.get_alumni_directory_impl() to authenticated;
grant execute on function private.get_mentor_directory_impl() to authenticated;
grant execute on function public.get_alumni_directory() to authenticated;
grant execute on function public.get_mentor_directory() to authenticated;
