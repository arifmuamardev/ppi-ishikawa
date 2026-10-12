# Admin Interaction-State Coverage & Remediation Audit — 12 October 2026

## Source and boundary

**Baseline:** `main` at `6655b3472cdf06b1a568d11d95c9e30e88dd1934`; inspected all 14 `src/pages/member/admin/*.astro` routes, their literal forms and DOM-generated mutation controls, plus connected `member`, `member-community`, `member-advanced`, and `member-organization` handlers. This is a **static code audit**, not evidence that any underlying production Supabase RLS or RPC is secure. Form counts alone are misleading because several admin routes mutate records through buttons or select `change` handlers.

**Policy:** `AGENTS.md`, `docs/brand/DESIGN-SYSTEM-GOVERNANCE.md`, shared `FormFeedback.astro` and `createFormFeedback`. Admin pages use the MemberLayout app exception; the public A/B/C archetypes are not modified.

## Coverage inventory

| Admin route | Primary mutations and evidence | Existing UI state at baseline | Priority / disposition |
| --- | --- | --- | --- |
| `events.astro` | Create/edit/delete events | FormFeedback, pending guard, confirmation, recovery and CI mock | Completed PR #86 |
| `announcements.astro` | Create/edit/delete announcements | FormFeedback, pending guard, confirmation, recovery and CI mock | Completed PR #87 |
| `organization.astro` | Four forms; assignment delete | Independent live regions; write/context lock; test suite | Completed PR #88; **backend active-term two-query atomicity requires separate review** |
| `checkin-qr.astro` | Create QR; toggle active; copy token URL | Live feedback, pending guard, confirmed deactivation, clipboard fallback, CI mock | Completed PR #89 |
| `verification.astro` | `reviewMembership` approval/rejection via generated buttons; `getPendingMembers` refresh | One visual-only message; no busy/double-click guard or confirmation; potential ambiguous write vs refresh failure | **P0 — first remediation in PR #90** |
| `attendance.astro` | `setEventCheckin` per participant; `getEventAttendance` | No per-row pending guard; changing event during awaited fetch can render stale results; cancellation deserves confirmation | **P0 — next** |
| `certificates.astro` | `issueCertificate`, `setCertificateRevoked` / restoration, event selection | Three generated mutation buttons with no request guard; revoke confirmation exists; loading errors not consistently surfaced | **P0** |
| `documents.astro` | `uploadMemberDocument` storage+metadata; `deleteMemberDocument` | Upload button already disabled while awaiting; preserve behavior but add exception-safe finally, live feedback and delete guard; check partial storage/DB outcomes separately | **P0** |
| `programs.astro` | Save/delete program; add/remove person; create progress update | Multiple independently generated write actions with no shared guard or accessible lifecycle | **P1 high complexity — split subflows** |
| `volunteer.astro` | Save/delete opportunity; change volunteer application status | Generated writes and status changes lack consistent feedback and double-action locks | **P1 high complexity — split subflows** |
| `aspirations.astro` | `updateAspirationStatus` on select change | No lock/rollback; on error newly selected status can misrepresent persisted value | **P1** |
| `growth.astro` | `updateStorySubmissionStatus` on select change | No lock/rollback; stale status risk on failure | **P1** |
| `analytics.astro` | Metrics/read-only fetch | No mutation form; audit loading, empty and error read states separately | **P2 read-only** |
| `index.astro` | Admin navigation/dashboard | No mutation form; verify navigation and empty states only | **P2 read-only** |

## Acceptance contract for each mutation surface

1. Reuse `FormFeedback` for a persistent `role=status` and `role=alert`; status is announced **after actual API outcome**, not after a timer or an optimistic assumption.
2. While a request is in flight, visibly indicate pending and enforce a **synchronous** duplicate-action guard; controls recover in `finally`, including thrown exceptions.
3. On failure, never discard unsaved input or silently show an unpersisted selection; permit retry. Confirm destructive or sensitive decisions and protect against subsequent double clicks.
4. If a write succeeds but reading back the list fails, say **write succeeded, refresh failed**, not “save failed”; avoid unnecessary repeated writes.
5. Use safe textContent to display member/user data; tests use synthetic user and intercepted API only, no production tokens or personal records.
6. Cross-check layouts at 360, 390, 768 and 1280px, light/dark, keyboard/field focus, appropriate reduced motion. Run `check:theme`, `check:ui`, `build`, link and responsive CI.
7. Keep separate PRs by domain, avoid new page templates/tokens and do not modify unrelated PR #10.

## Ordered execution

**3E Verification** → **3F Attendance** → **3G Certificates** → **3H Documents** → **3I Programs** (save/delete then people/progress) → **3J Volunteer** (opportunity then application review) → **3K Aspirations and Growth** (safe rollback and race handling) → **3L Read-only Admin states**. One independent PR and browser regression extension per small domain, merge only after green checks and visual inspection.

**Important caveat:** synthetic Supabase mocks validate frontend behavior, not production permissions, race guarantees or transactions. In particular, the organization active-term switch still calls two database writes and should receive a separate transactional backend review before sensitive production use.
