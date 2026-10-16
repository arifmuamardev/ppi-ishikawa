-- Security hardening for PPI Ishikawa membership directory.
-- Search must not infer opt-out fields; only authenticated members may call
-- directory and verification RPCs. No member profile data is modified.
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
language plpgsql stable security definer set search_path = ''
as $func$
begin
  if not exists (
    select 1 from public.profiles me
    where me.user_id = (select auth.uid())
      and me.verification_status = 'approved'
      and me.membership_status in ('incoming', 'active', 'alumni')
  ) then
    raise exception 'Verified membership required' using errcode = '42501';
  end if;

  return query
    select
      p.user_id, p.full_name, p.campus_slug, p.program, p.study_level,
      case when p.show_field_of_study then p.field_of_study else null end,
      case when p.show_city then p.city else null end,
      case when p.show_instagram then p.instagram else null end,
      case when p.show_linkedin then p.linkedin_url else null end,
      p.bio, p.membership_status::text
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
        -- A hidden field must never be usable as a search predicate either.
        or (p.show_field_of_study and coalesce(p.field_of_study, '') ilike '%' || search_query || '%')
      )
    order by p.full_name;
end;
$func$;

-- Private RPC implementations cannot be executed by anonymous callers.
revoke execute on function private.get_member_directory_impl(text,text,text) from public, anon;
revoke execute on function private.review_membership_impl(uuid,text,text) from public, anon;
grant execute on function private.get_member_directory_impl(text,text,text) to authenticated;
grant execute on function private.review_membership_impl(uuid,text,text) to authenticated;

-- Public RPCs remain exposed only to logged-in sessions. The private
-- implementation still enforces approval or admin role on the server.
revoke execute on function public.get_member_directory(text,text,text) from public, anon;
revoke execute on function public.review_membership(uuid,text,text) from public, anon;
grant execute on function public.get_member_directory(text,text,text) to authenticated;
grant execute on function public.review_membership(uuid,text,text) to authenticated;
