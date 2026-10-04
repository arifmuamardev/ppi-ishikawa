-- Phase 3 helper RPCs for member-facing organization views.

create or replace function private.get_organization_structure_impl(target_term_id uuid default null)
returns table (
  term_id uuid,
  term_label text,
  unit_id uuid,
  unit_slug text,
  unit_name text,
  unit_type text,
  unit_sort_order integer,
  position_id uuid,
  position_title text,
  position_sort_order integer,
  user_id uuid,
  full_name text,
  can_manage boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  resolved_term_id uuid;
begin
  if not private.is_verified_member() then
    raise exception 'Verified membership required';
  end if;

  select coalesce(
    target_term_id,
    (select t.id from public.organization_terms t where t.is_current = true limit 1)
  ) into resolved_term_id;

  return query
  select
    t.id,
    t.label,
    u.id,
    u.slug,
    u.name,
    u.unit_type,
    u.sort_order,
    p.id,
    p.title,
    p.sort_order,
    a.user_id,
    pr.full_name,
    coalesce(a.can_manage, false)
  from public.organization_terms t
  join public.organization_units u on u.term_id = t.id
  left join public.organization_positions p on p.unit_id = u.id
  left join public.organization_assignments a on a.position_id = p.id
  left join public.profiles pr on pr.user_id = a.user_id
  where t.id = resolved_term_id
  order by u.sort_order, p.sort_order, pr.full_name;
end;
$$;

create or replace function public.get_organization_structure(target_term_id uuid default null)
returns table (
  term_id uuid,
  term_label text,
  unit_id uuid,
  unit_slug text,
  unit_name text,
  unit_type text,
  unit_sort_order integer,
  position_id uuid,
  position_title text,
  position_sort_order integer,
  user_id uuid,
  full_name text,
  can_manage boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_organization_structure_impl(target_term_id);
$$;

create or replace function private.get_program_people_impl(target_program_id uuid)
returns table (
  user_id uuid,
  full_name text,
  role text
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

  if not exists (
    select 1
    from public.organization_programs pr
    where pr.id = target_program_id
      and (pr.visibility = 'members' or private.can_manage_program(pr.id))
  ) then
    raise exception 'Program not available';
  end if;

  return query
  select pp.user_id, p.full_name, pp.role
  from public.program_people pp
  join public.profiles p on p.user_id = pp.user_id
  where pp.program_id = target_program_id
  order by
    case pp.role when 'lead' then 1 when 'pic' then 2 else 3 end,
    p.full_name;
end;
$$;

create or replace function public.get_program_people(target_program_id uuid)
returns table (
  user_id uuid,
  full_name text,
  role text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_program_people_impl(target_program_id);
$$;

create or replace function private.get_volunteer_applications_impl(target_opportunity_id uuid)
returns table (
  user_id uuid,
  full_name text,
  message text,
  status text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.can_manage_opportunity(target_opportunity_id) then
    raise exception 'Manager access required';
  end if;

  return query
  select a.user_id, p.full_name, a.message, a.status, a.created_at
  from public.volunteer_applications a
  join public.profiles p on p.user_id = a.user_id
  where a.opportunity_id = target_opportunity_id
  order by a.created_at;
end;
$$;

create or replace function public.get_volunteer_applications(target_opportunity_id uuid)
returns table (
  user_id uuid,
  full_name text,
  message text,
  status text,
  created_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_volunteer_applications_impl(target_opportunity_id);
$$;

revoke all on function public.get_organization_structure(uuid) from public;
revoke all on function public.get_program_people(uuid) from public;
revoke all on function public.get_volunteer_applications(uuid) from public;

grant execute on function private.get_organization_structure_impl(uuid) to authenticated;
grant execute on function private.get_program_people_impl(uuid) to authenticated;
grant execute on function private.get_volunteer_applications_impl(uuid) to authenticated;
grant execute on function public.get_organization_structure(uuid) to authenticated;
grant execute on function public.get_program_people(uuid) to authenticated;
grant execute on function public.get_volunteer_applications(uuid) to authenticated;
