-- Harden volunteer application status transitions.

drop policy if exists "Members update own volunteer applications" on public.volunteer_applications;

create policy "Members update own volunteer applications"
on public.volunteer_applications for update to authenticated
using (
  user_id = (select auth.uid())
  and private.is_verified_member()
)
with check (
  user_id = (select auth.uid())
  and private.is_verified_member()
  and status in ('interested', 'withdrawn')
);

create policy "Opportunity managers update volunteer applications"
on public.volunteer_applications for update to authenticated
using (private.can_manage_opportunity(opportunity_id))
with check (private.can_manage_opportunity(opportunity_id));
