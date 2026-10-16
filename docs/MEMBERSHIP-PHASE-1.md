# Membership Phase 1

Status: implemented in the Astro frontend and ready to connect to Supabase.

## Included

- Passwordless registration with an email magic link (one-time use)
- Passwordless email magic-link login (existing accounts only, no automatic signup on login)
- Optional legacy password login for existing members until email delivery is confirmed
- Email confirmation/login handled by the Supabase Auth link
- Logout and legacy password recovery
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
3. In Supabase Auth → URL Configuration, set **Site URL** to `https://ppi-ishikawa.org`
   and add the deployed member callbacks as allowed redirect URLs:
   - `https://ppi-ishikawa.org/member/login/` (magic-link login)
   - `https://ppi-ishikawa.org/member/login/?confirmed=1` (passwordless registration confirmation)
   - `https://ppi-ishikawa.org/member/reset-password/` (password recovery)
   - Keep the legacy GitHub Pages callbacks only temporarily if needed for older sent emails.
   Validate both flows on the custom domain before announcing them to members.
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

## Passwordless membership (Oct 2026)

**Experience:** Sign-in asks for email and sends a one-time link via `supabase.auth.signInWithOtp`. Login uses `shouldCreateUser:false`, so entering an unknown email cannot silently create a membership. Registration collects existing onboarding profile data and sends a signup link with `shouldCreateUser:true` and `options.data`. Database trigger `private.handle_new_user` maps metadata to `profiles`; its default status stays pending until an administrator verifies the member. No registration password is required.

**Safety:** Password sign-in for already existing accounts remains behind `Sudah punya password? Gunakan cara lama` on the login page. The feature registry keeps Area Anggota `hidden` from public navigation. Do not remove the fallback until a real user has successfully received and used a magic link. Existing sessions and admin roles are not migrated or changed. Signup and login return generic messages so unknown emails are not clearly enumerated. Supabase handles link expiration, single-use tokens, and rate limits.

**Production prerequisite — email delivery (mandatory):** Supabase's built-in Auth SMTP service is for testing and restricts recipients to pre-authorized project-team email addresses. To send links to actual PPI members, the Supabase project owner must configure a **custom SMTP provider** under Authentication → SMTP and verify sender authentication (SPF, DKIM, DMARC). A service with a free tier may be suitable, but free tier is provider-specific and not guaranteed. Never put SMTP passwords/API secrets in GitHub's public repository or frontend. Consider enabling Supabase Auth CAPTCHA and checking email rate limits before publicly promoting registration.

**Email template:** Under Authentication → Email Templates → Magic Link, ensure the template uses `{{ .ConfirmationURL }}`, *not only* `{{ .Token }}`. The same SDK method switches between one-click magic links and manual code OTP based on the template. This website implements the **link-click** flow. Ensure the **Site URL** and redirect allowlist include `https://ppi-ishikawa.org/member/login/` and the confirmation URL shown above. Test real emails and click-through on mobile and desktop before enabling public navigation.

**Smoke test:** Use the project's authorized test mailbox: request login link, check spam/email delivery, open link, verify active session `/member/`, sign out, register another authorized test mailbox with complete profile, confirm its status remains `pending`. Test wrong/expired/used link, rate limiting, and recovery. Do not send test emails to random users.

**No SQL schema changes needed:** This upgrade uses existing Supabase Auth and profile RLS.
