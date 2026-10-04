# Membership Phase 3 — Organization Management

Status: implemented on the live Supabase backend and integrated into the member area.

## Core model

Phase 3 uses a term-aware organization model:

`Term → Unit → Position → Assignment`

and an operational model:

`Program → Lead/PIC/Contributor → Progress Updates → Volunteer Opportunities → Applications`

This keeps member records persistent while organization structure and programs remain tied to a specific leadership period.

## Current seeded term

- Period: `2026/27`
- Start: 2026-10-01
- End: 2027-09-30
- Current: yes

Seeded units:

- Pengurus Inti
- Akademik
- Olahraga
- Kemahasiswaan
- Kekeluargaan / Internal
- Seni Budaya
- Media
- Humas / Eksternal

Seeded positions:

- Ketua
- Wakil Ketua I
- Wakil Ketua II
- Sekretaris
- Bendahara
- Kepala Departemen for each of the seven departments

No individual is automatically assigned to an organizational position.

## Member routes

- `/member/organization/`
- `/member/programs/`
- `/member/volunteer/`

Members can:

- view the active organization structure
- see organizational positions and current assignees
- view member-visible programs
- see program status and progress
- see Lead/PIC/Contributor assignments
- browse open volunteer opportunities
- express or withdraw volunteer interest
- see their own volunteer selection status

## Admin routes

- `/member/admin/organization/`
- `/member/admin/programs/`
- `/member/admin/volunteer/`

Admins can:

- create leadership periods
- select the current period
- add organization units
- add positions
- assign verified members to positions
- grant unit-management permission to selected assignments
- create/edit/delete programs
- assign Lead, PIC, and Contributors
- record progress updates
- create/edit/delete volunteer opportunities
- review volunteer applications
- update volunteer application status

## Tables

- `organization_terms`
- `organization_units`
- `organization_positions`
- `organization_assignments`
- `organization_programs`
- `program_people`
- `program_updates`
- `volunteer_opportunities`
- `volunteer_applications`

## Authorization model

Global system roles remain:

- member
- staff
- admin

Organization-level management is separate from the global role.

An assignment can set:

`can_manage = true`

This grants management capability for that unit without making the person a global administrator.

Program management is allowed to:

- global admins
- managers of the program's unit
- program Lead/PIC

Volunteer opportunity management follows the unit/program management relationship.

Changing organizational assignments remains admin-only because `can_manage` is an authorization capability.

## Privacy

Organization structure is visible only to verified members.

Program people names are returned through a restricted RPC after membership verification.

Volunteer applications are visible only to:

- the applicant themselves
- authorized managers of the relevant opportunity

## Helper RPCs

- `get_organization_structure`
- `get_program_people`
- `get_volunteer_applications`

Helper implementations live in the private schema and validate the caller before reading member profile names.

## Migrations

- `supabase/migrations/20261004_phase3_organization.sql`
- `supabase/migrations/20261004_phase3_helper_rpcs.sql`

## Future term workflow

At the end of a period:

1. Keep the existing term and its programs unchanged as history.
2. Create the next term.
3. Mark the next term as current.
4. Add/copy the required units and positions.
5. Assign the new officers.
6. Create the new term's programs.

Member accounts do not need to be recreated.

## Deliberately not included

Phase 3 does not attempt to replace a full project-management application. It does not include:

- kanban boards
- file attachments per task
- internal chat
- time tracking
- individual performance scores
- member rankings

The purpose is organizational continuity, accountability, program ownership, volunteer matching, and period-to-period handover.
