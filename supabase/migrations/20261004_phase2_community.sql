-- PPI Ishikawa Membership Phase 2
-- Community operations: events, RSVP, announcements, member interests/skills, aspirations.

create or replace function private.is_verified_member()
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
      and p.verification_status = 'approved'
      and p.membership_status in ('incoming', 'active', 'alumni')
  );
$$;

grant execute on function private.is_verified_member() to authenticated;

create table if not exists public.member_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text not null default '',
  mode text not null default 'onsite' check (mode in ('onsite', 'online', 'hybrid')),
  capacity integer check (capacity is null or capacity > 0),
  registration_deadline timestamptz,
  published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.event_rsvps (
  event_id uuid not null references public.member_events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  attending boolean not null default true,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists public.member_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category text not null,
  audience text not null default 'Semua anggota',
  important boolean not null default false,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.member_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  interests text[] not null default '{}',
  skills text[] not null default '{}',
  volunteer_available boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.member_aspirations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null check (char_length(subject) <= 120),
  message text not null check (char_length(message) <= 1500),
  category text not null,
  anonymous boolean not null default false,
  status text not null default 'received' check (status in ('received', 'reviewed', 'planned', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.member_events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.member_announcements enable row level security;
alter table public.member_preferences enable row level security;
alter table public.member_aspirations enable row level security;

drop policy if exists "Verified members can read published events" on public.member_events;
create policy "Verified members can read published events"
on public.member_events for select to authenticated
using (published = true and private.is_verified_member());

drop policy if exists "Admins can manage events" on public.member_events;
create policy "Admins can manage events"
on public.member_events for all to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Members manage own RSVP" on public.event_rsvps;
create policy "Members manage own RSVP"
on public.event_rsvps for all to authenticated
using (user_id = (select auth.uid()) and private.is_verified_member())
with check (user_id = (select auth.uid()) and private.is_verified_member());

drop policy if exists "Admins can read RSVP" on public.event_rsvps;
create policy "Admins can read RSVP"
on public.event_rsvps for select to authenticated
using (private.is_admin());

drop policy if exists "Verified members can read announcements" on public.member_announcements;
create policy "Verified members can read announcements"
on public.member_announcements for select to authenticated
using (published = true and private.is_verified_member());

drop policy if exists "Admins can manage announcements" on public.member_announcements;
create policy "Admins can manage announcements"
on public.member_announcements for all to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Members manage own preferences" on public.member_preferences;
create policy "Members manage own preferences"
on public.member_preferences for all to authenticated
using (user_id = (select auth.uid()) and private.is_verified_member())
with check (user_id = (select auth.uid()) and private.is_verified_member());

drop policy if exists "Members insert own aspirations" on public.member_aspirations;
create policy "Members insert own aspirations"
on public.member_aspirations for insert to authenticated
with check (user_id = (select auth.uid()) and private.is_verified_member());

drop policy if exists "Members read own aspirations" on public.member_aspirations;
create policy "Members read own aspirations"
on public.member_aspirations for select to authenticated
using (user_id = (select auth.uid()) and private.is_verified_member());

create or replace function private.get_admin_aspirations_impl()
returns table (
  id uuid,
  subject text,
  message text,
  category text,
  anonymous boolean,
  status text,
  created_at timestamptz,
  submitter_id uuid,
  submitter_name text
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
    a.id,
    a.subject,
    a.message,
    a.category,
    a.anonymous,
    a.status,
    a.created_at,
    case when a.anonymous then null else a.user_id end,
    case when a.anonymous then null else p.full_name end
  from public.member_aspirations a
  left join public.profiles p on p.user_id = a.user_id
  order by a.created_at desc;
end;
$$;

create or replace function public.get_admin_aspirations()
returns table (
  id uuid,
  subject text,
  message text,
  category text,
  anonymous boolean,
  status text,
  created_at timestamptz,
  submitter_id uuid,
  submitter_name text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_admin_aspirations_impl();
$$;

create or replace function private.update_aspiration_status_impl(
  aspiration_id uuid,
  next_status text
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

  if next_status not in ('received', 'reviewed', 'planned', 'completed') then
    raise exception 'Invalid aspiration status';
  end if;

  update public.member_aspirations
  set status = next_status,
      updated_at = now()
  where id = aspiration_id;

  if not found then
    raise exception 'Aspiration not found';
  end if;

  return true;
end;
$$;

create or replace function public.update_aspiration_status(
  aspiration_id uuid,
  next_status text
)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select private.update_aspiration_status_impl(aspiration_id, next_status);
$$;

revoke all on table public.member_events from anon, authenticated;
revoke all on table public.event_rsvps from anon, authenticated;
revoke all on table public.member_announcements from anon, authenticated;
revoke all on table public.member_preferences from anon, authenticated;
revoke all on table public.member_aspirations from anon, authenticated;

grant select, insert, update, delete on public.member_events to authenticated;
grant select, insert, update, delete on public.event_rsvps to authenticated;
grant select, insert, update, delete on public.member_announcements to authenticated;
grant select, insert, update, delete on public.member_preferences to authenticated;
grant select, insert on public.member_aspirations to authenticated;

revoke all on function public.get_admin_aspirations() from public;
revoke all on function public.update_aspiration_status(uuid, text) from public;
grant execute on function private.get_admin_aspirations_impl() to authenticated;
grant execute on function private.update_aspiration_status_impl(uuid, text) to authenticated;
grant execute on function public.get_admin_aspirations() to authenticated;
grant execute on function public.update_aspiration_status(uuid, text) to authenticated;
