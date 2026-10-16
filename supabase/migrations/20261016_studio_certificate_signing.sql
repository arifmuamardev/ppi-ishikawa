-- Authenticated QR-based organizational approval for any PPI Ishikawa event.
-- Not an X.509/PAdES cryptographic PDF signature.
-- All published verification data comes from a server-controlled registry.
--
-- CRITICAL: no general write grant on the authority table, no public SELECT
-- on certificate registry, no direct editing of identity/approval fields.

create table if not exists private.certificate_signing_authorities (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 90),
  role_title text not null check (char_length(role_title) between 2 and 90),
  active boolean not null default true,
  granted_at timestamptz not null default now()
);
alter table private.certificate_signing_authorities enable row level security;
revoke all on private.certificate_signing_authorities from public, anon, authenticated;

-- Appoint only the current approved chair. Never trust an editable browser field
-- or user-editable JWT metadata to grant signature authority.
insert into private.certificate_signing_authorities(user_id,display_name,role_title)
select p.user_id, 'Arif Mu''amar Wahid', 'Ketua PPI Ishikawa'
from public.profiles p
where p.role = 'admin'
  and p.verification_status = 'approved'
  and p.full_name = 'Arif Mu''amar Wahid'
on conflict (user_id) do nothing;

create or replace function private.is_studio_signer()
returns boolean
language sql stable security definer set search_path = ''
as $fn$
  select (select private.is_admin())
    and exists (
      select 1 from private.certificate_signing_authorities a
      where a.user_id = (select auth.uid()) and a.active = true
    );
$fn$;

revoke all on function private.is_studio_signer() from public, anon, authenticated;
grant usage on schema private to authenticated, anon;
grant execute on function private.is_studio_signer() to authenticated;

create table if not exists public.studio_certificates (
  id uuid primary key default gen_random_uuid(),
  serial_no bigint generated always as identity unique,
  certificate_number text generated always as ('PPI-ISH-' || lpad(serial_no::text, 8, '0')) stored,
  verification_token uuid not null default gen_random_uuid() unique,
  batch_id uuid not null,
  recipient_position smallint not null check (recipient_position between 1 and 200),
  recipient_name text not null check (char_length(btrim(recipient_name)) between 2 and 120),
  recipient_role text not null check (char_length(btrim(recipient_role)) between 2 and 60),
  event_title text not null check (char_length(btrim(event_title)) between 2 and 160),
  event_date date not null,
  organizer text not null check (char_length(btrim(organizer)) between 2 and 120),
  approved_by uuid not null references auth.users(id),
  signer_name text not null,
  signer_role text not null,
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id),
  unique (batch_id, recipient_position)
);
create index if not exists studio_certificates_approval_idx
on public.studio_certificates(approved_by, issued_at desc);
create unique index if not exists studio_certificates_batch_name_unique
on public.studio_certificates(batch_id, lower(btrim(recipient_name)));

alter table public.studio_certificates enable row level security;
revoke all on public.studio_certificates from public, anon, authenticated;
grant select, insert on public.studio_certificates to authenticated;
grant update(revoked_at) on public.studio_certificates to authenticated;

create policy "Authorized chair can read studio certificates"
on public.studio_certificates for select to authenticated
using ((select private.is_studio_signer()) and approved_by = (select auth.uid()));

create policy "Authorized chair can issue studio certificates"
on public.studio_certificates for insert to authenticated
with check ((select private.is_studio_signer()) and approved_by = (select auth.uid()));

create policy "Authorized chair can revoke studio certificates"
on public.studio_certificates for update to authenticated
using ((select private.is_studio_signer()) and approved_by = (select auth.uid()))
with check ((select private.is_studio_signer()) and approved_by = (select auth.uid()));

-- Server-owned signer name, signer role, approval, token, ID, issuance timestamp.
-- Ignore anything a browser sends in these fields.
create or replace function private.studio_certificate_before_insert()
returns trigger
language plpgsql security definer set search_path = ''
as $fn$
declare
  v_authority private.certificate_signing_authorities%rowtype;
begin
  if not (select private.is_studio_signer()) then
    raise exception 'Akun tidak mempunyai kewenangan pengesahan sertifikat'
      using errcode = '42501';
  end if;
  select * into v_authority
  from private.certificate_signing_authorities
  where user_id = (select auth.uid()) and active = true;
  if not found then
    raise exception 'Penanda tangan tidak ditemukan' using errcode = '42501';
  end if;
  new.id := pg_catalog.gen_random_uuid();
  new.verification_token := pg_catalog.gen_random_uuid();
  new.approved_by := (select auth.uid());
  new.signer_name := v_authority.display_name;
  new.signer_role := v_authority.role_title;
  new.issued_at := pg_catalog.now();
  new.revoked_at := null;
  new.revoked_by := null;
  return new;
end;
$fn$;

create or replace function private.studio_certificate_before_update()
returns trigger
language plpgsql security definer set search_path = ''
as $fn$
begin
  if not (select private.is_studio_signer())
     or old.approved_by is distinct from (select auth.uid()) then
    raise exception 'Akun tidak mempunyai kewenangan mengubah status sertifikat'
      using errcode = '42501';
  end if;
  if (new.id, new.batch_id, new.recipient_position, new.recipient_name,
      new.recipient_role, new.event_title, new.event_date, new.organizer,
      new.approved_by, new.signer_name, new.signer_role,
      new.verification_token, new.issued_at)
     is distinct from
     (old.id, old.batch_id, old.recipient_position, old.recipient_name,
      old.recipient_role, old.event_title, old.event_date, old.organizer,
      old.approved_by, old.signer_name, old.signer_role,
      old.verification_token, old.issued_at) then
    raise exception 'Identitas dan isi sertifikat yang disahkan tidak dapat diubah';
  end if;
  new.revoked_at := case when new.revoked_at is null then null else pg_catalog.now() end;
  new.revoked_by := case when new.revoked_at is null then null else (select auth.uid()) end;
  return new;
end;
$fn$;

revoke all on function private.studio_certificate_before_insert() from public, anon, authenticated;
revoke all on function private.studio_certificate_before_update() from public, anon, authenticated;

create trigger studio_certificate_immutable_approval
before insert on public.studio_certificates
for each row execute function private.studio_certificate_before_insert();

create trigger studio_certificate_revocation_audit
before update on public.studio_certificates
for each row execute function private.studio_certificate_before_update();

-- Public token lookup uses a narrow security-definer helper in the private schema.
-- No anonymous direct table access. Tokens are random and unguessable UUIDs.
create or replace function private.verify_studio_certificate_impl(target_token uuid)
returns table (
  valid boolean,
  certificate_number text,
  recipient_name text,
  event_title text,
  event_date date,
  recipient_role text,
  organizer text,
  signer_name text,
  signer_role text,
  issued_at timestamptz,
  revoked_at timestamptz
)
language sql stable security definer set search_path = ''
as $fn$
  select c.revoked_at is null,
         c.certificate_number, c.recipient_name, c.event_title,
         c.event_date, c.recipient_role, c.organizer, c.signer_name,
         c.signer_role, c.issued_at, c.revoked_at
  from public.studio_certificates c
  where c.verification_token = target_token
  limit 1;
$fn$;

revoke all on function private.verify_studio_certificate_impl(uuid) from public, anon, authenticated;
grant execute on function private.verify_studio_certificate_impl(uuid) to anon, authenticated;

create or replace function public.verify_studio_certificate(target_token uuid)
returns table (
  valid boolean,
  certificate_number text,
  recipient_name text,
  event_title text,
  event_date date,
  recipient_role text,
  organizer text,
  signer_name text,
  signer_role text,
  issued_at timestamptz,
  revoked_at timestamptz
)
language sql stable security invoker set search_path = ''
as $fn$
  select * from private.verify_studio_certificate_impl(target_token);
$fn$;

revoke all on function public.verify_studio_certificate(uuid) from public, anon, authenticated;
grant execute on function public.verify_studio_certificate(uuid) to anon, authenticated;
