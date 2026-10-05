-- Phase 4 helper RPCs for mentoring and story administration.

create or replace function private.get_my_mentoring_requests_impl()
returns table (
  id uuid,
  requester_id uuid,
  requester_name text,
  mentor_id uuid,
  mentor_name text,
  topic text,
  message text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
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
    mr.id,
    mr.requester_id,
    requester.full_name,
    mr.mentor_id,
    mentor.full_name,
    mr.topic,
    mr.message,
    mr.status,
    mr.created_at,
    mr.updated_at
  from public.mentoring_requests mr
  join public.profiles requester on requester.user_id = mr.requester_id
  join public.profiles mentor on mentor.user_id = mr.mentor_id
  where mr.requester_id = (select auth.uid())
     or mr.mentor_id = (select auth.uid())
  order by mr.created_at desc;
end;
$$;

create or replace function public.get_my_mentoring_requests()
returns table (
  id uuid,
  requester_id uuid,
  requester_name text,
  mentor_id uuid,
  mentor_name text,
  topic text,
  message text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_my_mentoring_requests_impl();
$$;

create or replace function private.get_story_pipeline_impl()
returns table (
  id uuid,
  user_id uuid,
  full_name text,
  campus_slug text,
  membership_status text,
  topics text[],
  note text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'Admin access required';
  end if;

  return query
  select
    s.id,
    s.user_id,
    p.full_name,
    p.campus_slug,
    p.membership_status::text,
    s.topics,
    s.note,
    s.status,
    s.created_at,
    s.updated_at
  from public.story_submissions s
  join public.profiles p on p.user_id = s.user_id
  order by s.created_at desc;
end;
$$;

create or replace function public.get_story_pipeline()
returns table (
  id uuid,
  user_id uuid,
  full_name text,
  campus_slug text,
  membership_status text,
  topics text[],
  note text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_story_pipeline_impl();
$$;

revoke all on function public.get_my_mentoring_requests() from public;
revoke all on function public.get_story_pipeline() from public;
grant execute on function private.get_my_mentoring_requests_impl() to authenticated;
grant execute on function private.get_story_pipeline_impl() to authenticated;
grant execute on function public.get_my_mentoring_requests() to authenticated;
grant execute on function public.get_story_pipeline() to authenticated;
