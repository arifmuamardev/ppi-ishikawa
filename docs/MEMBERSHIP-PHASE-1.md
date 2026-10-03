# Membership Phase 1

Status: implemented in the Astro frontend and ready to connect to Supabase.

## Included

- Email/password registration
- Email confirmation flow
- Login/logout
- Password recovery
- Member dashboard
- Membership verification states: pending, approved, rejected
- Membership states: incoming, active, alumni, inactive
- Member profile
- Privacy controls
- Opt-in member directory
- Admin verification queue
- Row Level Security and least-privilege column updates
- Safe directory RPC that exposes only permitted fields

## Public routes

- `/member/login/`
- `/member/register/`
- `/member/forgot-password/`
- `/member/reset-password/`

## Authenticated routes

- `/member/`
- `/member/profile/`
- `/member/directory/`
- `/member/admin/verification/` — admin only

## Demo mode without Supabase

When Supabase environment variables are absent, the member area automatically runs in demo mode.

Available demo flows:
- Sign in as a verified member
- Sign in as an administrator
- Register a local pending member
- View dashboard and membership status
- Edit profile and privacy preferences
- Search/filter the member directory
- Review the admin verification queue

Demo data is synthetic and stored only in the current browser via localStorage. It is not an official membership record and must not be used for real member administration.

When Supabase is later configured, the same routes and UI automatically use the Supabase-backed service instead of demo storage.

## Supabase activation

1. Create or connect a Supabase project.
2. Run `supabase/migrations/20261003_phase1_membership.sql`.
3. In Supabase Auth URL Configuration, add the deployed member URLs as allowed redirect URLs, including:
   - `https://arifmuamardev.github.io/ppi-ishikawa/member/login/`
   - `https://arifmuamardev.github.io/ppi-ishikawa/member/reset-password/`
   - the equivalent URLs on the production custom domain when it is active.
4. Set these GitHub Actions repository variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_PUBLISHABLE_KEY`
5. Re-run the Pages deployment.
6. Register the first administrator account.
7. In the Supabase SQL editor, bootstrap that account:

```sql
update public.profiles p
set role = 'admin',
    verification_status = 'approved',
    membership_status = 'active'
from auth.users u
where p.user_id = u.id
  and u.email = 'ADMIN_EMAIL_HERE';
```

## Privacy model

- New members are not listed in the directory by default.
- A member must explicitly enable directory visibility.
- Email is never returned by the directory RPC.
- Optional city, Instagram, LinkedIn and field-of-study visibility are controlled independently.
- Direct profile table reads are limited to the member's own row, except for approved admins.
- Members cannot update their own role, verification status or membership status.
- Directory lookup is available only to verified members.

## Deployment model

The public site remains static on GitHub Pages. Authentication and member data are handled in the browser by Supabase Auth and Postgres. Sensitive authorization is enforced in Postgres through RLS and restricted functions rather than by hiding static pages.

If the membership system later needs server-only workflows, document uploads, payment processing or privileged automation, move the member area to an Astro server runtime while keeping the public information site static.
