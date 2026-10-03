# Membership Phase 2

Status: implemented in Demo Mode and prepared for Supabase activation.

## Member features

- Agenda kegiatan
- RSVP hadir / batal
- Add to Google Calendar
- Monthly calendar view
- Member announcements
- Interests and skills profile
- Volunteer availability preference
- Aspirations / suggestions
- Anonymous aspiration option
- Personal aspiration history and status

## Admin features

- Manage events
- Edit and delete events
- Manage announcements
- Edit and delete announcements
- Review aspirations
- Update aspiration status
- Event attendance / check-in
- Existing Phase 1 membership verification remains available

## Demo mode

Without Supabase configuration, Phase 2 uses browser localStorage.

Demo fixtures are clearly labelled with `Demo ·` or example names. Demo data is not official membership data.

State that persists locally includes:

- RSVP selections
- custom demo events
- custom demo announcements
- member interests and skills
- volunteer availability
- submitted aspirations
- aspiration workflow status
- attendance/check-in

## Backend preparation

The migration file:

`supabase/migrations/20261004_phase2_community.sql`

adds:

- `member_events`
- `event_rsvps`
- `member_announcements`
- `member_preferences`
- `member_aspirations`

It also adds restricted RPC functions for:

- admin aspiration reading with anonymous identity masking
- aspiration status updates
- attendance lookup
- attendance check-in

## Security notes

- Only verified members can read published member events and announcements.
- Members can only manage their own RSVP and preferences.
- Members cannot modify `checked_in_at`; event check-in is performed through an admin-only RPC.
- Members can only read their own aspirations.
- Anonymous aspiration identities are masked before they are returned to the admin interface.
- Event and announcement write operations are admin-only under RLS.
- Phase 2 does not put member records in the GitHub repository.

## Routes

Member:

- `/member/events/`
- `/member/calendar/`
- `/member/announcements/`
- `/member/interests/`
- `/member/aspirations/`

Admin:

- `/member/admin/events/`
- `/member/admin/attendance/`
- `/member/admin/announcements/`
- `/member/admin/aspirations/`

## Not included yet

These remain later-stage work:

- email/push notifications
- QR attendance
- automatic audience targeting rules
- capacity enforcement / waitlists
- event feedback surveys
- volunteer opportunity management
- program/proker management
- analytics dashboards
