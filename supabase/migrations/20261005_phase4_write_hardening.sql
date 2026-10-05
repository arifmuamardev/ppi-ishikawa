-- Harden Phase 4 member-write permissions.

drop policy if exists "Members create own story submissions" on public.story_submissions;
create policy "Members create own story submissions"
on public.story_submissions for insert to authenticated
with check (
  user_id = (select auth.uid())
  and private.is_verified_member()
  and status = 'proposed'
);

revoke all on table public.mentoring_requests from authenticated;
grant select on table public.mentoring_requests to authenticated;
grant insert (requester_id, mentor_id, topic, message) on table public.mentoring_requests to authenticated;
grant update (status) on table public.mentoring_requests to authenticated;

revoke all on table public.story_submissions from authenticated;
grant select on table public.story_submissions to authenticated;
grant insert (user_id, topics, note) on table public.story_submissions to authenticated;
grant update (topics, note, status) on table public.story_submissions to authenticated;
grant delete on table public.story_submissions to authenticated;
