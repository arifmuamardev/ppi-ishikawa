-- PPI Ishikawa Membership Phase 3
-- Organization management: terms, units, positions, assignments, programs, progress, and volunteering.

create table if not exists public.organization_terms (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  starts_on date not null,
  ends_on date not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_on >= starts_on)
);

create unique index if not exists organization_terms_one_current_idx
  on public.organization_terms ((is_current))
  where is_current = true;

create table if not exists public.organization_units (
  id uuid primary key default gen_random_uuid(),
  term_id uuid not null references public.organization_terms(id) on delete cascade,
  slug text not null,
  name text not null,
  description text not null default '',
  unit_type text not null default 'department'
    check (unit_type in ('leadership', 'department', 'committee', 'other')),
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (term_id, slug)
);

create table if not exists public.organization_positions (
  id uuid primary key default gen_random_uuid(),
  term_id uuid not null references public.organization_terms(id) on delete cascade,
  unit_id uuid not null references public.organization_units(id) on delete cascade,
  slug text not null,
  title text not null,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (term_id, slug)
);

create table if not exists public.organization_assignments (
  id uuid primary key default gen_random_uuid(),
  term_id uuid not null references public.organization_terms(id) on delete cascade,
  position_id uuid not null references public.organization_positions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  can_manage boolean not null default false,
  starts_on date,
  ends_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (position_id, user_id)
);

create table if not exists public.organization_programs (
  id uuid primary key default gen_random_uuid(),
  term_id uuid not null references public.organization_terms(id) on delete cascade,
  unit_id uuid not null references public.organization_units(id) on delete restrict,
  title text not null,
  summary text not null default '',
  objective text not null default '',
  status text not null default 'planned'
    check (status in ('planned', 'active', 'on_hold', 'completed', 'cancelled')),
  starts_on date,
  ends_on date,
  visibility text not null default 'members'
    check (visibility in ('members', 'internal')),
  progress_percent integer not null default 0
    check (progress_percent between 0 and 100),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create table if not exists public.program_people (
  program_id uuid not null references public.organization_programs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'contributor'
    check (role in ('lead', 'pic', 'contributor')),
  created_at timestamptz not null default now(),
  primary key (program_id, user_id)
);

create table if not exists public.program_updates (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.organization_programs(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  progress_percent integer not null check (progress_percent between 0 and 100),
  status text not null
    check (status in ('planned', 'active', 'on_hold', 'completed', 'cancelled')),
  note text not null default '' check (char_length(note) <= 1500),
  created_at timestamptz not null default now()
);

create table if not exists public.volunteer_opportunities (
  id uuid primary key default gen_random_uuid(),
  term_id uuid not null references public.organization_terms(id) on delete cascade,
  unit_id uuid not null references public.organization_units(id) on delete restrict,
  program_id uuid references public.organization_programs(id) on delete set null,
  title text not null,
  description text not null default '',
  interests text[] not null default '{}',
  skills text[] not null default '{}',
  slots integer check (slots is null or slots > 0),
  deadline timestamptz,
  status text not null default 'open'
    check (status in ('draft', 'open', 'closed', 'filled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.volunteer_applications (
  opportunity_id uuid not null references public.volunteer_opportunities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null default '' check (char_length(message) <= 800),
  status text not null default 'interested'
    check (status in ('interested', 'selected', 'not_selected', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (opportunity_id, user_id)
);

create or replace function private.touch_updated_at()
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

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'organization_terms',
    'organization_units',
    'organization_positions',
    'organization_assignments',
    'organization_programs',
    'volunteer_opportunities',
    'volunteer_applications'
  ]
  loop
    execute format('drop trigger if exists %I_touch_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger %I_touch_updated_at before update on public.%I for each row execute function private.touch_updated_at()',
      table_name,
      table_name
    );
  end loop;
end;
$$;

create or replace function private.can_manage_unit(target_unit_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin()
    or exists (
      select 1
      from public.organization_assignments a
      join public.organization_positions p on p.id = a.position_id
      where a.user_id = (select auth.uid())
        and a.can_manage = true
        and p.unit_id = target_unit_id
        and (a.starts_on is null or a.starts_on <= current_date)
        and (a.ends_on is null or a.ends_on >= current_date)
    );
$$;

create or replace function private.can_manage_program(target_program_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin()
    or exists (
      select 1
      from public.organization_programs pr
      where pr.id = target_program_id
        and private.can_manage_unit(pr.unit_id)
    )
    or exists (
      select 1
      from public.program_people pp
      where pp.program_id = target_program_id
        and pp.user_id = (select auth.uid())
        and pp.role in ('lead', 'pic')
    );
$$;

create or replace function private.can_manage_opportunity(target_opportunity_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin()
    or exists (
      select 1
      from public.volunteer_opportunities vo
      where vo.id = target_opportunity_id
        and private.can_manage_unit(vo.unit_id)
    )
    or exists (
      select 1
      from public.volunteer_opportunities vo
      where vo.id = target_opportunity_id
        and vo.program_id is not null
        and private.can_manage_program(vo.program_id)
    );
$$;

alter table public.organization_terms enable row level security;
alter table public.organization_units enable row level security;
alter table public.organization_positions enable row level security;
alter table public.organization_assignments enable row level security;
alter table public.organization_programs enable row level security;
alter table public.program_people enable row level security;
alter table public.program_updates enable row level security;
alter table public.volunteer_opportunities enable row level security;
alter table public.volunteer_applications enable row level security;

create policy "Verified members read organization terms"
on public.organization_terms for select to authenticated
using (private.is_verified_member());

create policy "Admins manage organization terms"
on public.organization_terms for all to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Verified members read organization units"
on public.organization_units for select to authenticated
using (private.is_verified_member());

create policy "Admins manage organization units"
on public.organization_units for all to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Verified members read organization positions"
on public.organization_positions for select to authenticated
using (private.is_verified_member());

create policy "Admins manage organization positions"
on public.organization_positions for all to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Verified members read organization assignments"
on public.organization_assignments for select to authenticated
using (private.is_verified_member());

create policy "Admins manage organization assignments"
on public.organization_assignments for all to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Members read organization programs"
on public.organization_programs for select to authenticated
using (
  private.is_verified_member()
  and (
    visibility = 'members'
    or private.can_manage_program(id)
  )
);

create policy "Unit managers manage organization programs"
on public.organization_programs for all to authenticated
using (private.can_manage_unit(unit_id))
with check (private.can_manage_unit(unit_id));

create policy "Members read program people"
on public.program_people for select to authenticated
using (private.is_verified_member());

create policy "Program managers manage program people"
on public.program_people for all to authenticated
using (private.can_manage_program(program_id))
with check (private.can_manage_program(program_id));

create policy "Members read program updates"
on public.program_updates for select to authenticated
using (
  private.is_verified_member()
  and exists (
    select 1 from public.organization_programs pr
    where pr.id = program_id
      and (pr.visibility = 'members' or private.can_manage_program(pr.id))
  )
);

create policy "Program managers add updates"
on public.program_updates for insert to authenticated
with check (private.can_manage_program(program_id));

create policy "Members read open volunteer opportunities"
on public.volunteer_opportunities for select to authenticated
using (
  private.is_verified_member()
  and (
    status in ('open', 'closed', 'filled')
    or private.can_manage_opportunity(id)
  )
);

create policy "Unit managers manage volunteer opportunities"
on public.volunteer_opportunities for all to authenticated
using (private.can_manage_unit(unit_id))
with check (private.can_manage_unit(unit_id));

create policy "Members read own volunteer applications"
on public.volunteer_applications for select to authenticated
using (
  user_id = (select auth.uid())
  or private.can_manage_opportunity(opportunity_id)
);

create policy "Members create own volunteer applications"
on public.volunteer_applications for insert to authenticated
with check (
  user_id = (select auth.uid())
  and private.is_verified_member()
  and exists (
    select 1 from public.volunteer_opportunities vo
    where vo.id = opportunity_id and vo.status = 'open'
  )
);

create policy "Members update own volunteer applications"
on public.volunteer_applications for update to authenticated
using (
  user_id = (select auth.uid())
  or private.can_manage_opportunity(opportunity_id)
)
with check (
  user_id = (select auth.uid())
  or private.can_manage_opportunity(opportunity_id)
);

revoke all on table public.organization_terms from anon, authenticated;
revoke all on table public.organization_units from anon, authenticated;
revoke all on table public.organization_positions from anon, authenticated;
revoke all on table public.organization_assignments from anon, authenticated;
revoke all on table public.organization_programs from anon, authenticated;
revoke all on table public.program_people from anon, authenticated;
revoke all on table public.program_updates from anon, authenticated;
revoke all on table public.volunteer_opportunities from anon, authenticated;
revoke all on table public.volunteer_applications from anon, authenticated;

grant select, insert, update, delete on public.organization_terms to authenticated;
grant select, insert, update, delete on public.organization_units to authenticated;
grant select, insert, update, delete on public.organization_positions to authenticated;
grant select, insert, update, delete on public.organization_assignments to authenticated;
grant select, insert, update, delete on public.organization_programs to authenticated;
grant select, insert, update, delete on public.program_people to authenticated;
grant select, insert on public.program_updates to authenticated;
grant select, insert, update, delete on public.volunteer_opportunities to authenticated;
grant select, insert, update on public.volunteer_applications to authenticated;

grant execute on function private.can_manage_unit(uuid) to authenticated;
grant execute on function private.can_manage_program(uuid) to authenticated;
grant execute on function private.can_manage_opportunity(uuid) to authenticated;

-- Seed the current term and organizational skeleton.
insert into public.organization_terms (label, starts_on, ends_on, is_current)
values ('2026/27', '2026-10-01', '2027-09-30', true)
on conflict (label) do update
set starts_on = excluded.starts_on,
    ends_on = excluded.ends_on,
    is_current = excluded.is_current;

with current_term as (
  select id from public.organization_terms where label = '2026/27'
)
insert into public.organization_units (term_id, slug, name, description, unit_type, sort_order)
select current_term.id, seed.slug, seed.name, seed.description, seed.unit_type, seed.sort_order
from current_term
cross join (
  values
    ('pengurus-inti', 'Pengurus Inti', 'Koordinasi umum, administrasi, dan tata kelola organisasi.', 'leadership', 0),
    ('akademik', 'Akademik', 'Kegiatan akademik, riset, pengembangan kapasitas, dan berbagi pengetahuan.', 'department', 10),
    ('olahraga', 'Olahraga', 'Aktivitas olahraga, kebugaran, dan ruang interaksi anggota melalui kegiatan fisik.', 'department', 20),
    ('kemahasiswaan', 'Kemahasiswaan', 'Dukungan kebutuhan mahasiswa, pendatang baru, kesejahteraan, dan akses informasi.', 'department', 30),
    ('kekeluargaan-internal', 'Kekeluargaan / Internal', 'Kebersamaan anggota, komunikasi internal, keterlibatan keluarga, dan rasa memiliki terhadap komunitas.', 'department', 40),
    ('seni-budaya', 'Seni Budaya', 'Kegiatan seni, budaya Indonesia, ekspresi kreatif, dan representasi budaya di Ishikawa.', 'department', 50),
    ('media', 'Media', 'Informasi publik, dokumentasi, desain, konten, dan pengelolaan kanal digital organisasi.', 'department', 60),
    ('humas-eksternal', 'Humas / Eksternal', 'Hubungan dengan mitra, institusi, komunitas, media, dan jejaring di luar organisasi.', 'department', 70)
) as seed(slug, name, description, unit_type, sort_order)
on conflict (term_id, slug) do update
set name = excluded.name,
    description = excluded.description,
    unit_type = excluded.unit_type,
    sort_order = excluded.sort_order;

with current_term as (
  select id from public.organization_terms where label = '2026/27'
),
core as (
  select u.id as unit_id, current_term.id as term_id
  from current_term
  join public.organization_units u on u.term_id = current_term.id and u.slug = 'pengurus-inti'
)
insert into public.organization_positions (term_id, unit_id, slug, title, sort_order)
select term_id, unit_id, seed.slug, seed.title, seed.sort_order
from core
cross join (
  values
    ('ketua', 'Ketua', 10),
    ('wakil-ketua-1', 'Wakil Ketua I', 20),
    ('wakil-ketua-2', 'Wakil Ketua II', 30),
    ('sekretaris', 'Sekretaris', 40),
    ('bendahara', 'Bendahara', 50)
) as seed(slug, title, sort_order)
on conflict (term_id, slug) do update
set title = excluded.title,
    sort_order = excluded.sort_order;

with current_term as (
  select id from public.organization_terms where label = '2026/27'
),
departments as (
  select u.id as unit_id, u.slug, u.name, current_term.id as term_id, u.sort_order
  from current_term
  join public.organization_units u on u.term_id = current_term.id
  where u.unit_type = 'department'
)
insert into public.organization_positions (term_id, unit_id, slug, title, sort_order)
select
  term_id,
  unit_id,
  'kepala-' || slug,
  'Kepala Departemen ' || name,
  sort_order
from departments
on conflict (term_id, slug) do update
set title = excluded.title,
    sort_order = excluded.sort_order;
