-- Fix ambiguous PL/pgSQL identifiers in QR self check-in.

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
  v_event_id uuid;
  v_event_title text;
  v_checked_in_at timestamptz;
begin
  if not private.is_verified_member() then
    raise exception 'Verified membership required';
  end if;

  select s.event_id, e.title
    into v_event_id, v_event_title
  from public.event_checkin_sessions s
  join public.member_events e on e.id = s.event_id
  where s.checkin_token = target_token
    and s.active = true
    and s.opens_at <= now()
    and (s.closes_at is null or s.closes_at >= now())
  limit 1;

  if v_event_id is null then
    raise exception 'Check-in session is not active';
  end if;

  select r.checked_in_at
    into v_checked_in_at
  from public.event_rsvps r
  where r.event_id = v_event_id
    and r.user_id = (select auth.uid())
    and r.attending = true;

  if not found then
    raise exception 'RSVP attendance required before check-in';
  end if;

  if v_checked_in_at is null then
    update public.event_rsvps r
    set checked_in_at = now(),
        updated_at = now()
    where r.event_id = v_event_id
      and r.user_id = (select auth.uid())
    returning r.checked_in_at into v_checked_in_at;
  end if;

  return query
  select v_event_id, v_event_title, v_checked_in_at;
end;
$$;
