# PPI Ishikawa Membership — Production Launch Checklist

Status: core platform is production-capable. Operational data still needs to be populated before broad member rollout.

## Launch gate

### Required before broad rollout

- [x] Supabase project connected and healthy
- [x] Phase 1–5 migrations applied
- [x] Email confirmation works
- [x] Login/session works from production deployment
- [x] First verified admin exists
- [x] Membership RLS and RPC security reviewed
- [x] Production QR check-in validated end-to-end
- [x] Certificate issuance and public verification validated
- [x] Test data cleaned after validation
- [x] Current organization term exists
- [x] Admin Center available
- [x] Member calendar starts from the current month
- [x] Registration and password recovery callbacks point to production
- [ ] Final 2026/27 officer assignments entered
- [ ] Member onboarding message prepared

## Recommended before member announcement

- [ ] Populate officer assignments after each person has a verified membership account
- [ ] Enter the first real announcement
- [ ] Enter upcoming events that members should RSVP to
- [ ] Enter confirmed 2026/27 programs
- [ ] Upload only the first documents that truly need restricted member access
- [ ] Review profile privacy defaults with the core committee
- [ ] Confirm who besides the system admin should receive admin/staff capabilities
- [ ] Test registration with one non-admin member account
- [ ] Test pending → approved verification workflow with that account
- [ ] Test directory opt-in/opt-out with two accounts
- [ ] Test mobile layout on iPhone/Android
- [ ] Test password recovery from the production domain

## 2026/27 structure source of truth

Latest reviewed source:

**Job Description PPI Ishikawa 2026/2027 — Revised**

Current terminology:

- Ketua
- Wakil Ketua I
- Wakil Ketua II
- Sekretaris
- Bendahara
- Divisi Akademik
- Divisi Olahraga
- Divisi Kemahasiswaan
- Divisi Kekeluargaan
- Divisi Seni Budaya
- Divisi Media
- Divisi Eksternal

Vice-chair portfolio:

- Wakil Ketua I: Divisi Kekeluargaan, Divisi Seni Budaya, Divisi Media
- Wakil Ketua II: Divisi Akademik, Divisi Kemahasiswaan, Divisi Olahraga, Divisi Eksternal

Database display labels have been aligned to this terminology. Internal slugs and the `department` enum value remain unchanged for referential stability.

## Current production data state

At launch-readiness audit:

- active verified admins: 1
- current organization terms: 1
- officer assignments: 0
- published events: 0
- published announcements: 0
- organization programs: 0
- published member documents: 0
- verified members: 1

This is expected for a newly initialized production system. Do not fill these with synthetic data.

## First real data sequence

Recommended order:

1. Ask core officers to register their own membership accounts.
2. Verify those accounts.
3. Assign organization positions.
4. Publish one onboarding announcement.
5. Add the next real event.
6. Add confirmed programs only after program ownership/PIC is clear.
7. Open volunteer opportunities only for real capacity gaps.
8. Upload restricted documents only when a real access need exists.

## Admin operating principle

Use **Admin Center** as the main administrative entry point rather than navigating directly to individual admin routes.

Keep system roles separate from organization roles:

- `admin` = system-wide administration
- `staff` = limited system role
- organization assignment = actual 2026/27 position
- `can_manage` = unit-level management capability

Do not make every officer a global admin.

## Remaining platform hardening

Supabase Security Advisor currently reports one project-level Auth warning:

**Leaked Password Protection Disabled**

Enable this in Supabase Auth password-security settings when available.

## Deferred scope

Do not add these until there is an explicit operational need:

- finance/reimbursement data
- payment gateway
- internal chat
- member ranking/gamification
- full project-management boards
- native mobile app
