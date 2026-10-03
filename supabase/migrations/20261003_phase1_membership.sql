-- PPI Ishikawa Membership Phase 1
-- Run with Supabase migrations or once in the Supabase SQL editor.

create schema if not exists private;

do $$ begin
  create type public.membership_status as enum ('incoming', 'active', 'alumni', 'inactive');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.verification_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.member_role as enum ('member', 'staff', 'admin');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  campus_slug text,
  program text,
  study_level text,
  field_of_study text,
  city text,
  instagram text,
  linkedin_url text,
  bio text check (char_length(coalesce(bio, '')) <= 500),
  membership_status public.membership_status not null default 'incoming',
  verification_status public.verification_status not null default 'pending',
  role public.member_role not null default 'member',
  directory_visible boolean not null default true,
  show_instagram boolean not null default false,
  show_linkedin boolean not null default true,
  show_city boolean not null default false,
  show_field_of_study boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    user_id,
    full_name,
    campus_slug,
    program,
    study_level,
    field_of_study,
    city,
    instagram,
    linkedin_url
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'campus_slug', ''),
    nullif(new.raw_user_meta_data ->> 'program', ''),
    nullif(new.raw_user_meta_data ->> 'study_level', ''),
    nullif(new.raw_user_meta_data ->> 'field_of_study', ''),
    nullif(new.raw_user_meta_data ->> 'city', ''),
    nullif(new.raw_user_meta_data ->> 'instagram', ''),
    nullif(new.raw_user_meta_data ->> 'linkedin_url', '')
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create or replace function private.touch_profile()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function private.touch_profile();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = (select auth.uid())
      and p.role = 'admin'
      and p.verification_status = 'approved'
  );
$$;

drop policy if exists "Members can read own profile; admins can read all" on public.profiles;
create policy "Members can read own profile; admins can read all"
on public.profiles
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select private.is_admin())
);

drop policy if exists "Members can update own profile" on public.profiles;
create policy "Members can update own profile"
on public.profiles
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (
  full_name,
  campus_slug,
  program,
  study_level,
  field_of_study,
  city,
  instagram,
  linkedin_url,
  bio,
  directory_visible,
  show_instagram,
  show_linkedin,
  show_city,
  show_field_of_study
) on table public.profiles to authenticated;

create or replace function private.get_member_directory_impl(
  search_query text default null,
  campus_filter text default null,
  status_filter text default null
)
returns table (
  user_id uuid,
  full_name text,
  campus_slug text,
  program text,
  study_level text,
  field_of_study text,
  city text,
  instagram text,
  linkedin_url text,
  bio text,
  membership_status text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.profiles me
    where me.user_id = (select auth.uid())
      and me.verification_status = 'approved'
      and me.membership_status in ('incoming', 'active', 'alumni')
  ) then
    raise exception 'Verified membership required';
  end if;

  return query
  select
    p.user_id,
    p.full_name,
    p.campus_slug,
    p.program,
    p.study_level,
    case when p.show_field_of_study then p.field_of_study else null end,
    case when p.show_city then p.city else null end,
    case when p.show_instagram then p.instagram else null end,
    case when p.show_linkedin then p.linkedin_url else null end,
    p.bio,
    p.membership_status::text
  from public.profiles p
  where p.verification_status = 'approved'
    and p.membership_status in ('incoming', 'active', 'alumni')
    and p.directory_visible = true
    and (campus_filter is null or campus_filter = '' or p.campus_slug = campus_filter)
    and (status_filter is null or status_filter = '' or p.membership_status::text = status_filter)
    and (
      search_query is null
      or search_query = ''
      or p.full_name ilike '%' || search_query || '%'
      or coalesce(p.program, '') ilike '%' || search_query || '%'
      or coalesce(p.field_of_study, '') ilike '%' || search_query || '%'
    )
  order by p.full_name;
end;
$$;

create or replace function public.get_member_directory(
  search_query text default null,
  campus_filter text default null,
  status_filter text default null
)
returns table (
  user_id uuid,
  full_name text,
  campus_slug text,
  program text,
  study_level text,
  field_of_study text,
  city text,
  instagram text,
  linkedin_url text,
  bio text,
  membership_status text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_member_directory_impl(search_query, campus_filter, status_filter);
$$;

create or replace function private.review_membership_impl(
  target_user_id uuid,
  decision text,
  next_status text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'Admin access required';
  end if;

  if decision not in ('approved', 'rejected') then
    raise exception 'Invalid verification decision';
  end if;

  if next_status is not null and next_status not in ('incoming', 'active', 'alumni', 'inactive') then
    raise exception 'Invalid membership status';
  end if;

  update public.profiles
  set
    verification_status = decision::public.verification_status,
    membership_status = coalesce(next_status::public.membership_status, membership_status)
  where user_id = target_user_id;

  if not found then
    raise exception 'Member not found';
  end if;

  return true;
end;
$$;

create or replace function public.review_membership(
  target_user_id uuid,
  decision text,
  next_status text default null
)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select private.review_membership_impl(target_user_id, decision, next_status);
$$;

revoke all on function public.get_member_directory(text, text, text) from public;
revoke all on function public.review_membership(uuid, text, text) from public;

grant usage on schema private to authenticated;
grant execute on function private.get_member_directory_impl(text, text, text) to authenticated;
grant execute on function private.review_membership_impl(uuid, text, text) to authenticated;
grant execute on function public.get_member_directory(text, text, text) to authenticated;
grant execute on function public.review_membership(uuid, text, text) to authenticated;

-- Bootstrap the first administrator after that person has registered:
-- update public.profiles p
-- set role = 'admin', verification_status = 'approved', membership_status = 'active'
-- from auth.users u
-- where p.user_id = u.id and u.email = 'ADMIN_EMAIL_HERE';
