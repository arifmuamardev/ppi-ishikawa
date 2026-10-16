-- Unified email Magic Link flow: auto-created accounts complete a consented
-- member profile AFTER email verification. Approval remains strictly separate.
alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;

-- Existing complete profiles remain usable (one approved administrator at rollout).
update public.profiles set onboarding_completed_at = now()
where onboarding_completed_at is null
  and verification_status = 'approved'
  and length(btrim(full_name)) >= 2
  and nullif(btrim(coalesce(campus_slug,'')),'') is not null
  and nullif(btrim(coalesce(program,'')),'') is not null
  and nullif(btrim(coalesce(study_level,'')),'') is not null;

revoke update(onboarding_completed_at) on public.profiles from authenticated;

-- The invoker has only the current member's RLS-permitted UPDATE rights;
-- this function cannot grant approval or change roles.
create or replace function public.complete_member_onboarding(
  input_name text,
  input_campus text,
  input_program text,
  input_study_level text,
  consent_accepted boolean
)
returns boolean
language plpgsql security invoker set search_path = ''
as $fn$
begin
  if (select auth.uid()) is null then
    raise exception 'Sign-in required' using errcode='42501';
  end if;
  if consent_accepted is distinct from true then
    raise exception 'Consent required' using errcode='22023';
  end if;
  if length(btrim(coalesce(input_name,''))) not between 2 and 120
    or length(btrim(coalesce(input_campus,''))) not between 2 and 100
    or length(btrim(coalesce(input_program,''))) not between 2 and 160
    or input_study_level not in (
      'language','vocational','undergraduate','master','doctoral','research','exchange','other'
    ) then
    raise exception 'Complete all required member fields' using errcode='22023';
  end if;

  update public.profiles
  set full_name = btrim(input_name),
      campus_slug = btrim(input_campus),
      program = btrim(input_program),
      study_level = input_study_level,
      onboarding_completed_at = coalesce(onboarding_completed_at, now()),
      updated_at = now()
  where user_id = (select auth.uid())
    and onboarding_completed_at is null
    and verification_status = 'pending';

  if not found then
    raise exception 'Onboarding unavailable or already completed' using errcode='42501';
  end if;
  return true;
end;
$fn$;
revoke all on function public.complete_member_onboarding(text,text,text,text,boolean) from public,anon,authenticated;
grant execute on function public.complete_member_onboarding(text,text,text,text,boolean) to authenticated;

-- An unconsented, newly auto-created account must NOT enter the approval queue.
create or replace function private.review_membership_impl(
  target_user_id uuid, decision text, next_status text default null
)
returns boolean
language plpgsql security definer set search_path = ''
as $fn$
begin
  if not private.is_admin() then
    raise exception 'Admin access required' using errcode='42501';
  end if;
  if decision not in ('approved','rejected') then
    raise exception 'Invalid verification decision' using errcode='22023';
  end if;
  if next_status is not null and next_status not in ('incoming','active','alumni','inactive') then
    raise exception 'Invalid membership status' using errcode='22023';
  end if;
  if decision = 'approved' and not exists (
    select 1 from public.profiles p
    where p.user_id = target_user_id
      and p.onboarding_completed_at is not null
      and length(btrim(p.full_name)) >= 2
      and nullif(btrim(coalesce(p.campus_slug,'')),'') is not null
      and nullif(btrim(coalesce(p.program,'')),'') is not null
      and nullif(btrim(coalesce(p.study_level,'')),'') is not null
  ) then
    raise exception 'Profile and consent must be completed before approval' using errcode='23514';
  end if;
  update public.profiles
  set verification_status = decision::public.verification_status,
      membership_status = coalesce(next_status::public.membership_status, membership_status)
  where user_id = target_user_id;
  if not found then raise exception 'Member not found'; end if;
  return true;
end;
$fn$;
