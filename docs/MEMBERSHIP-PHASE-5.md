# Membership Phase 5 — Advanced Core

Status: implemented on the live Supabase backend and integrated into the member area.

## Scope

Phase 5 intentionally focuses on advanced capabilities that improve verification, event operations, member access, and organizational reporting without introducing unnecessary sensitive data.

Included:

- digital membership card
- public membership-card verification
- QR event check-in sessions
- member self check-in
- verifiable certificates
- public certificate verification
- private member document storage
- admin membership analytics

Not included yet:

- finance / reimbursement
- payment collection
- push notifications
- native mobile application
- complex member scoring or ranking

Finance is deliberately deferred because it introduces more sensitive data and requires a separate privacy/access model.

## Digital membership card

Each verified member can generate one digital membership card.

Table:

- `membership_cards`

The card contains:

- opaque verification token
- human-readable card number
- issued timestamp
- optional revoked timestamp

Member functions:

- `ensure_my_membership_card`
- `rotate_my_membership_card`

Rotating the card replaces the token and card number, immediately making the old QR unusable.

Public verification:

- `verify_membership_card`

The verification endpoint returns only:

- validity
- card number
- member name
- campus
- membership status
- issued date

It does not expose email, phone, social account, bio, or other private profile fields.

Routes:

- `/member/card/`
- `/verify/member/`

## QR event check-in

Admins create a check-in session for an existing event.

Table:

- `event_checkin_sessions`

A session contains:

- opaque check-in token
- opening time
- optional closing time
- active/inactive state

The QR points to:

- `/member/checkin/?token=...`

Security requirements for successful self check-in:

1. member is logged in
2. membership is verified
3. QR session is active
4. current time is within the session window
5. member already has an RSVP with `attending = true`

RPC:

- `check_in_with_event_token`

The QR token alone is therefore insufficient to record attendance.

Admin route:

- `/member/admin/checkin-qr/`

Existing manual attendance remains available as a fallback.

## Verifiable certificates

Table:

- `member_certificates`

A certificate contains:

- member
- optional event
- unique certificate number
- opaque verification token
- title / description
- issued timestamp
- optional revocation timestamp

A unique partial index prevents more than one certificate for the same member/event pair.

Member route:

- `/member/certificates/`

Public verification:

- `/verify/certificate/`
- RPC `verify_certificate`

Admin route:

- `/member/admin/certificates/`

Event certificate issuance is limited to members who actually checked in.

Certificates can be revoked and later reactivated.

## Private member documents

Metadata table:

- `member_documents`

Private Supabase Storage bucket:

- `member-documents`

Supported audience levels:

- `verified` — all verified members
- `officers` — staff/admin or members holding organization assignments
- `alumni` — verified alumni

The bucket is private.

Members receive signed download URLs valid for 10 minutes. The object itself is not made public.

Routes:

- `/member/documents/`
- `/member/admin/documents/`

The admin UI currently enforces a 10 MB file limit.

## Membership analytics

RPC:

- `get_membership_analytics`

Admin route:

- `/member/admin/analytics/`

Current aggregate indicators include:

- total members
- verified members
- pending verification
- active / incoming / alumni counts
- published events
- RSVP attendance
- actual check-ins
- programs
- open volunteer opportunities
- available mentors
- story submissions
- active certificates
- verified members by campus

The dashboard intentionally avoids:

- member ranking
- individual performance scores
- individual attendance scoring
- public member-level analytics

## QR implementation

QR codes are generated locally in the browser using:

- `qrcode 1.5.4`
- `@types/qrcode 1.5.6`

No third-party QR generation API receives membership or event tokens.

## Security model

All Phase 5 public tables have RLS enabled.

Public verification uses opaque UUID tokens and restricted RPCs implemented through private-schema functions.

The public verification flows reveal only the minimum information needed to verify a card or certificate.

Private document access combines:

- metadata RLS
- Storage object RLS
- private bucket
- short-lived signed URLs

The Supabase publishable key remains the only frontend API key. No service-role or secret key is exposed.

## Migrations

- `supabase/migrations/20261005_phase5_advanced_core.sql`
- `supabase/migrations/20261005_phase5_certificate_uniqueness.sql`

## Remaining Supabase Auth hardening

Security Advisor continues to report:

`Leaked Password Protection Disabled`

This is an Auth project setting, not a database/RLS problem. Enable it in Supabase Auth password-security settings when that project-level control is available.
