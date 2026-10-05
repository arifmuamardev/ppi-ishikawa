# Membership Phase 4 — Alumni & Opportunities

Status: implemented on the live Supabase backend and integrated into the member area.

## Member features

- Alumni profile with opt-in directory visibility
- Alumni Network for verified members
- Mentoring preferences
- Mentor directory
- Mentoring request workflow
- Personalized career source recommendations
- Personalized scholarship candidate recommendations
- Campus career support recommendation
- Story contribution opt-in
- Story contribution status tracking

## Admin features

- Alumni / mentoring / story participation summary
- Story editorial pipeline
- Story status workflow:
  - proposed
  - contacted
  - draft
  - published
  - declined

## Personalization principles

Career and scholarship suggestions are not eligibility decisions.

Recommendations use a limited set of existing profile signals:

- campus
- study level
- membership status
- career interests

The UI explicitly tells members to verify official eligibility and current requirements before acting.

Public career and scholarship datasets remain the source of recommendation cards. Member data is not copied into those public datasets.

## Alumni privacy

Alumni profiles are opt-in.

A profile appears in Alumni Network only when:

1. the membership status is `alumni`
2. the alumni profile has `directory_visible = true`

Optional alumni fields include:

- graduation year
- current country / city
- organization
- role title
- sector
- willingness to be contacted
- willingness to speak

LinkedIn visibility still follows the existing profile privacy setting.

## Mentoring privacy

Members explicitly choose whether they are available as mentors.

Mentor directory entries expose:

- name
- campus / program
- optionally visible field of study
- selected mentoring topics
- optional alumni organization / role

Email addresses are not exposed.

Mentoring requests happen inside the membership system and contain:

- requester
- mentor
- topic
- optional message
- request status

## Story integration

The public `Cerita PPI Ishikawa` collection remains editorially controlled.

A member can indicate willingness to contribute and submit:

- topics
- short editorial note

Submission does not automatically create a public story.

Admin can move a submission through the editorial pipeline. Publishing the final story content remains a deliberate editorial action in the public stories collection.

## Tables

- `alumni_profiles`
- `member_growth_preferences`
- `mentoring_requests`
- `story_submissions`

## Helper RPCs

- `get_alumni_directory`
- `get_mentor_directory`
- `get_my_mentoring_requests`
- `get_story_pipeline`

RPC implementations live in the private schema and validate the caller before returning member names.

## Security hardening

- members cannot publish their own story submission directly
- new member story submissions must start as `proposed`
- mentoring request updates are limited to the `status` column
- requesters may close their own requests
- mentors may accept, decline, or close requests
- alumni and mentoring directories require verified membership
- public contact email is never exposed

## Routes

Member:

- `/member/alumni/`
- `/member/mentoring/`
- `/member/opportunities/`
- `/member/stories/`

Admin:

- `/member/admin/growth/`

## Migrations

- `supabase/migrations/20261005_phase4_alumni_opportunities.sql`
- `supabase/migrations/20261005_phase4_helper_rpcs.sql`
- `supabase/migrations/20261005_phase4_write_hardening.sql`

## Auth hardening note

Supabase Security Advisor currently reports only one remaining warning:

`Leaked Password Protection Disabled`

This is a project-level Supabase Auth setting rather than a database migration. Enable leaked-password protection in Supabase Auth password-security settings when available for the project plan/configuration.
