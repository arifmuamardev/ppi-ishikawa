-- PPI Ishikawa Membership Phase 5 Core
-- Digital membership card, QR event check-in, certificates, private documents, and analytics.

create table if not exists public.membership_cards (
  user_id uuid primary key references auth.users(id) on delete cascade,
  verification_token uuid not null unique default gen_random_uuid(),
  card_number text not null unique default (
    'PPII-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))
  ),
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  updated_at timestamptz not null default now()
);

drop trigger if exists membership_cards_touch_updated_at on public.membership_cards;
create trigger membership_cards_touch_updated_at
before update on public.membership_cards
for each row execute function private.touch_updated_at();

alter table public.membership_cards enable row level security;

drop policy if exists "Members read own membership card" on public.membership_cards;
create policy "Members read own membership card"
on public.membership_cards for select to authenticated
using (user_id = (select auth.uid()) or private.is_admin());

drop policy if exists "Admins manage membership cards" on public.membership_cards;
create policy "Admins manage membership cards"
on public.membership_cards for all to authenticated
using (private.is_admin())
with check (private.is_admin());

create or replace function private.ensure_my_membership_card_impl()
returns table (
  user_id uuid,
  card_number text,
  verification_token uuid,
  issued_at timestamptz,
  revoked_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_verified_member() then
    raise exception 'Verified membership required';
  end if;

  insert into public.membership_cards (user_id)
  values ((select auth.uid()))
  on conflict (user_id) do nothing;

  return query
  select c.user_id, c.card_number, c.verification_token, c.issued_at, c.revoked_at
  from public.membership_cards c
  where c.user_id = (select auth.uid());
end;
$$;

create or replace function public.ensure_my_membership_card()
returns table (
  user_id uuid,
  card_number text,
  verification_token uuid,
  issued_at timestamptz,
  revoked_at timestamptz
)
language sql
security invoker
set search_path = ''
as $$
  select * from private.ensure_my_membership_card_impl();
$$;

create or replace function private.rotate_my_membership_card_impl()
returns table (
  user_id uuid,
  card_number text,
  verification_token uuid,
  issued_at timestamptz,
  revoked_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_verified_member() then
    raise exception 'Verified membership required';
  end if;

  insert into public.membership_cards (user_id)
  values ((select auth.uid()))
  on conflict (user_id) do update
  set verification_token = gen_random_uuid(),
      card_number = 'PPII-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
      issued_at = now(),
      revoked_at = null,
      updated_at = now();

  return query
  select c.user_id, c.card_number, c.verification_token, c.issued_at, c.revoked_at
  from public.membership_cards c
  where c.user_id = (select auth.uid());
end;
$$;

create or replace function public.rotate_my_membership_card()
returns table (
  user_id uuid,
  card_number text,
  verification_token uuid,
  issued_at timestamptz,
  revoked_at timestamptz
)
language sql
security invoker
set search_path = ''
as $$
  select * from private.rotate_my_membership_card_impl();
$$;

create or replace function private.verify_membership_card_impl(target_token uuid)
returns table (
  valid boolean,
  card_number text,
  full_name text,
  campus_slug text,
  membership_status text,
  issued_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (
      c.revoked_at is null
      and p.verification_status = 'approved'
      and p.membership_status in ('incoming','active','alumni')
    ) as valid,
    c.card_number,
    p.full_name,
    p.campus_slug,
    p.membership_status::text,
    c.issued_at
  from public.membership_cards c
  join public.profiles p on p.user_id = c.user_id
  where c.verification_token = target_token
  limit 1;
$$;

create or replace function public.verify_membership_card(target_token uuid)
returns table (
  valid boolean,
  card_number text,
  full_name text,
  campus_slug text,
  membership_status text,
  issued_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.verify_membership_card_impl(target_token);
$$;

create table if not exists public.event_checkin_sessions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.member_events(id) on delete cascade,
  checkin_token uuid not null unique default gen_random_uuid(),
  opens_at timestamptz not null default now(),
  closes_at timestamptz,
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (closes_at is null or closes_at > opens_at)
);

drop trigger if exists event_checkin_sessions_touch_updated_at on public.event_checkin_sessions;
create trigger event_checkin_sessions_touch_updated_at
before update on public.event_checkin_sessions
for each row execute function private.touch_updated_at();

alter table public.event_checkin_sessions enable row level security;

drop policy if exists "Admins manage event checkin sessions" on public.event_checkin_sessions;
create policy "Admins manage event checkin sessions"
on public.event_checkin_sessions for all to authenticated
using (private.is_admin())
with check (private.is_admin());

create or replace function private.check_in_with_event_token_impl(target_token uuid)
returns table (
  event_id uuid,
  event_title text,
  checked_in_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_event_id uuid;
  target_title text;
  current_checkin timestamptz;
begin
  if not private.is_verified_member() then
    raise exception 'Verified membership required';
  end if;

  select s.event_id, e.title
    into target_event_id, target_title
  from public.event_checkin_sessions s
  join public.member_events e on e.id = s.event_id
  where s.checkin_token = target_token
    and s.active = true
    and s.opens_at <= now()
    and (s.closes_at is null or s.closes_at >= now())
  limit 1;

  if target_event_id is null then
    raise exception 'Check-in session is not active';
  end if;

  select r.checked_in_at
    into current_checkin
  from public.event_rsvps r
  where r.event_id = target_event_id
    and r.user_id = (select auth.uid())
    and r.attending = true;

  if not found then
    raise exception 'RSVP attendance required before check-in';
  end if;

  if current_checkin is null then
    update public.event_rsvps
    set checked_in_at = now(),
        updated_at = now()
    where event_id = target_event_id
      and user_id = (select auth.uid())
    returning event_rsvps.checked_in_at into current_checkin;
  end if;

  return query select target_event_id, target_title, current_checkin;
end;
$$;

create or replace function public.check_in_with_event_token(target_token uuid)
returns table (
  event_id uuid,
  event_title text,
  checked_in_at timestamptz
)
language sql
security invoker
set search_path = ''
as $$
  select * from private.check_in_with_event_token_impl(target_token);
$$;

create table if not exists public.member_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid references public.member_events(id) on delete set null,
  certificate_number text not null unique default (
    'CERT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))
  ),
  verification_token uuid not null unique default gen_random_uuid(),
  title text not null,
  description text not null default '',
  issued_at timestamptz not null default now(),
  issued_by uuid references auth.users(id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.member_certificates enable row level security;

drop policy if exists "Members read own certificates" on public.member_certificates;
create policy "Members read own certificates"
on public.member_certificates for select to authenticated
using (user_id = (select auth.uid()) or private.is_admin());

drop policy if exists "Admins manage certificates" on public.member_certificates;
create policy "Admins manage certificates"
on public.member_certificates for all to authenticated
using (private.is_admin())
with check (private.is_admin());

create or replace function private.verify_certificate_impl(target_token uuid)
returns table (
  valid boolean,
  certificate_number text,
  full_name text,
  title text,
  description text,
  issued_at timestamptz,
  event_title text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (c.revoked_at is null) as valid,
    c.certificate_number,
    p.full_name,
    c.title,
    c.description,
    c.issued_at,
    e.title
  from public.member_certificates c
  join public.profiles p on p.user_id = c.user_id
  left join public.member_events e on e.id = c.event_id
  where c.verification_token = target_token
  limit 1;
$$;

create or replace function public.verify_certificate(target_token uuid)
returns table (
  valid boolean,
  certificate_number text,
  full_name text,
  title text,
  description text,
  issued_at timestamptz,
  event_title text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.verify_certificate_impl(target_token);
$$;

create table if not exists public.member_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  storage_path text not null unique,
  audience text not null default 'verified'
    check (audience in ('verified','officers','alumni')),
  published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists member_documents_touch_updated_at on public.member_documents;
create trigger member_documents_touch_updated_at
before update on public.member_documents
for each row execute function private.touch_updated_at();

alter table public.member_documents enable row level security;

create or replace function private.can_access_member_document(target_document_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.member_documents d
    where d.id = target_document_id
      and d.published = true
      and (
        (d.audience = 'verified' and private.is_verified_member())
        or (
          d.audience = 'alumni'
          and exists (
            select 1 from public.profiles p
            where p.user_id = (select auth.uid())
              and p.verification_status = 'approved'
              and p.membership_status = 'alumni'
          )
        )
        or (
          d.audience = 'officers'
          and (
            private.is_admin()
            or exists (
              select 1 from public.profiles p
              where p.user_id = (select auth.uid())
                and p.verification_status = 'approved'
                and p.role in ('staff','admin')
            )
            or exists (
              select 1 from public.organization_assignments a
              where a.user_id = (select auth.uid())
            )
          )
        )
      )
  );
$$;

drop policy if exists "Members read authorized documents" on public.member_documents;
create policy "Members read authorized documents"
on public.member_documents for select to authenticated
using (private.can_access_member_document(id));

drop policy if exists "Admins manage member documents" on public.member_documents;
create policy "Admins manage member documents"
on public.member_documents for all to authenticated
using (private.is_admin())
with check (private.is_admin());

insert into storage.buckets (id, name, public)
values ('member-documents', 'member-documents', false)
on conflict (id) do update set public = false;

drop policy if exists "Members download authorized member documents" on storage.objects;
create policy "Members download authorized member documents"
on storage.objects for select to authenticated
using (
  bucket_id = 'member-documents'
  and (
    private.is_admin()
    or exists (
      select 1
      from public.member_documents d
      where d.storage_path = name
        and private.can_access_member_document(d.id)
    )
  )
);

drop policy if exists "Admins upload member documents" on storage.objects;
create policy "Admins upload member documents"
on storage.objects for insert to authenticated
with check (bucket_id = 'member-documents' and private.is_admin());

drop policy if exists "Admins update member documents storage" on storage.objects;
create policy "Admins update member documents storage"
on storage.objects for update to authenticated
using (bucket_id = 'member-documents' and private.is_admin())
with check (bucket_id = 'member-documents' and private.is_admin());

drop policy if exists "Admins delete member documents storage" on storage.objects;
create policy "Admins delete member documents storage"
on storage.objects for delete to authenticated
using (bucket_id = 'member-documents' and private.is_admin());

create or replace function private.get_membership_analytics_impl()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  if not private.is_admin() then
    raise exception 'Admin access required';
  end if;

  select jsonb_build_object(
    'members_total', (select count(*) from public.profiles),
    'verified_members', (select count(*) from public.profiles where verification_status = 'approved'),
    'pending_members', (select count(*) from public.profiles where verification_status = 'pending'),
    'active_members', (select count(*) from public.profiles where membership_status = 'active'),
    'incoming_members', (select count(*) from public.profiles where membership_status = 'incoming'),
    'alumni', (select count(*) from public.profiles where membership_status = 'alumni'),
    'events', (select count(*) from public.member_events where published = true),
    'rsvp_attending', (select count(*) from public.event_rsvps where attending = true),
    'attendance_checked_in', (select count(*) from public.event_rsvps where checked_in_at is not null),
    'programs', (select count(*) from public.organization_programs),
    'volunteer_open', (select count(*) from public.volunteer_opportunities where status = 'open'),
    'mentor_available', (select count(*) from public.member_growth_preferences where mentor_available = true),
    'story_submissions', (select count(*) from public.story_submissions),
    'certificates', (select count(*) from public.member_certificates where revoked_at is null),
    'campuses', coalesce((
      select jsonb_object_agg(campus_key, campus_count)
      from (
        select coalesce(campus_slug, 'unknown') as campus_key, count(*) as campus_count
        from public.profiles
        where verification_status = 'approved'
        group by coalesce(campus_slug, 'unknown')
      ) x
    ), '{}'::jsonb)
  ) into result;

  return result;
end;
$$;

create or replace function public.get_membership_analytics()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select private.get_membership_analytics_impl();
$$;

revoke all on table public.membership_cards from anon, authenticated;
revoke all on table public.event_checkin_sessions from anon, authenticated;
revoke all on table public.member_certificates from anon, authenticated;
revoke all on table public.member_documents from anon, authenticated;

grant select on public.membership_cards to authenticated;
grant select, insert, update, delete on public.event_checkin_sessions to authenticated;
grant select, insert, update, delete on public.member_certificates to authenticated;
grant select, insert, update, delete on public.member_documents to authenticated;

grant usage on schema private to anon;

revoke all on function public.ensure_my_membership_card() from public;
revoke all on function public.rotate_my_membership_card() from public;
revoke all on function public.verify_membership_card(uuid) from public;
revoke all on function public.check_in_with_event_token(uuid) from public;
revoke all on function public.verify_certificate(uuid) from public;
revoke all on function public.get_membership_analytics() from public;

grant execute on function private.ensure_my_membership_card_impl() to authenticated;
grant execute on function private.rotate_my_membership_card_impl() to authenticated;
grant execute on function private.verify_membership_card_impl(uuid) to anon, authenticated;
grant execute on function private.check_in_with_event_token_impl(uuid) to authenticated;
grant execute on function private.verify_certificate_impl(uuid) to anon, authenticated;
grant execute on function private.can_access_member_document(uuid) to authenticated;
grant execute on function private.get_membership_analytics_impl() to authenticated;

grant execute on function public.ensure_my_membership_card() to authenticated;
grant execute on function public.rotate_my_membership_card() to authenticated;
grant execute on function public.verify_membership_card(uuid) to anon, authenticated;
grant execute on function public.check_in_with_event_token(uuid) to authenticated;
grant execute on function public.verify_certificate(uuid) to anon, authenticated;
grant execute on function public.get_membership_analytics() to authenticated;
