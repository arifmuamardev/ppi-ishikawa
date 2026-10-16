# PPI Ishikawa membership launch readiness · 16 Oct 2026

Status: **private test phase**. Public navigation must remain hidden until real new-member registration and admin approval pass.

## Verified

- Existing administrator signed in through Supabase email Magic Link at the production domain (user-confirmed).
- Auth email SMTP and redirect configuration were corrected (user-confirmed).
- Supabase profile model stores a new account as `verification_status=pending`; role and verification state are server-owned.
- Ordinary members can update only explicitly granted profile columns, not role, verification, or membership status.
- Directory RPC requires an approved, eligible member; includes only opt-in profiles.
- Directory query must not search hidden optional fields. Applied database privacy migration `20261016_membership_directory_privacy.sql`.
- Anonymous role has no EXECUTE privilege on directory and approval RPCs.
- Follow-up/rejected applications remain in the administrator queue for later approval.
- Browser acceptance tests simulate pending, approved, inactive and admin states with all Supabase traffic intercepted.

## Still required before public launch

1. Register a **genuine volunteer/test member** through `/member/register/`. Use a consenting participant, not another person's email without permission.
2. Open Magic Link in the same browser session; check new profile is `pending` and information is correct.
3. Verify pending account cannot view `/member/directory/`, member documents or other approved-only data. A pending account may access its own dashboard and edit profile.
4. Open `/member/admin/verification/` as the administrator. Check the pending profile and approve it as `active`.
5. Verify the newly approved member can view permitted member services and sees no other members' private data.
6. Opt into directory visibility on the member profile, test visibility with an approved second account; opt out and confirm removal from directory. Test optional city/field/social-link toggles.
7. Test the rejected/follow-up → profile correction → administrator re-approval path.
8. Test sign-out, expired/reused Magic Link, mobile layout, and the resend-rate-limit message.
9. Review member privacy notice/consent and handover procedure for incoming officials. Consider MFA for admin and CAPTCHA to prevent automated signup abuse.
10. Keep `membership: 'hidden'` in `src/config/features.mjs` until administrator authorizes public launch after checks.

## Operations

- Admin approval: `https://ppi-ishikawa.org/member/admin/verification/`.
- Auth settings: `https://supabase.com/dashboard/project/hdeepkpiacfjdrlydemc/auth/url-configuration`.
- SMTP settings: `https://supabase.com/dashboard/project/hdeepkpiacfjdrlydemc/auth/smtp`.
- Never share access tokens, refresh tokens, Resend keys or SMTP passwords.
- Auth tests use mocked requests only and must not send real emails.
- Privacy migration is already applied on the connected production Supabase project.
- No sample user, test certificate or member record was created in production by the audit.

## Known limitations

- Admin follow-up decisions do not yet record a reason or send an automatic notification. Contact the applicant separately.
- No real second-user round-trip was performed during this code audit.
- Public URL existence does not itself authorize access: Supabase RLS and RPC checks are authoritative. The member navigation remains hidden publicly.
