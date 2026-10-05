-- Prevent duplicate event certificates for the same member.

create unique index if not exists member_certificates_user_event_unique
on public.member_certificates (user_id, event_id)
where event_id is not null;
