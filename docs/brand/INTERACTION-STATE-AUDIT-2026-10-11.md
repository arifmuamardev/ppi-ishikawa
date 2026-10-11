# Interaction-State Compliance Audit — 11 Oktober 2026

**Scope:** PPI Ishikawa website, `main` at `7196c53c33acdcfae7aafc31429a7eb0fa11e285` (after merged PR #79 and #80).  
**Status:** Source-level inventory complete; production browser / authenticated-transaction verification **not yet performed**.  
**Policy:** [DESIGN-SYSTEM-GOVERNANCE.md](./DESIGN-SYSTEM-GOVERNANCE.md), especially approved Standard Motion and the rule that target-state and implementation-state must remain separate.  
**Review boundary:** This document and the accompanying non-blocking script do **not** modify deployed form behavior, authentication, database requests, page copy or visual styling.

## 1. How the audit was conducted

- Inspected all **83 `src/pages/**/*.astro` source files** (44 public/utility including 404 and dynamic story source, 37 Member/Admin including Auth, 2 verification).
- Inspected all **44 `src/components/**/*.astro` files** plus shared `BaseLayout`, `MemberLayout`, `src/styles/global.css`, design governance and existing audit scripts.
- Examined actual submit and click handler excerpts for member login/registration, check-in, member/profile flows and selected Admin write/delete flows; inspected interaction semantics on representative public finders and verification pages.
- Reviewed existing `scripts/audit-responsive.mjs` (27 routes × five widths) and Design Lab test scope. These existing tests do **not** exercise every authenticated route or every backend-dependent interaction.
- Added `scripts/audit-interaction-inventory.mjs` as a **non-blocking** source census for reruns: `node scripts/audit-interaction-inventory.mjs` or `--json`. It deliberately emits evidence, not a pass/fail score.

**Methodological limitation:** Counting markup strings cannot establish WCAG compliance, keyboard behavior, visual consistency, API outcomes, double-submit prevention, dynamically generated controls, or a correct ARIA announcement. Some `role=status` counters belong to lists and are *not* form submission feedback. Do not interpret missing tokens as a verified runtime failure, or existing tokens as verified accessible behavior.

## 2. What is already established

| Surface | Source evidence | Assessment |
| --- | --- | --- |
| Standard motion | `src/styles/global.css` declares 160 ms / -2 px and reduced-motion behavior; `NavigationCard`, `ResultCard`, `ThemeToggle` use appropriate utilities | Approved role-specific implementation found; wider interaction review still necessary |
| Shared visual shell | `BaseLayout`, `MemberLayout`, `AppPageHeader`, `AuthShell` and `ui-field`/`ui-action-*` patterns | Reuse baseline exists; not proof that all downstream modules match |
| Public finder results | `beasiswa.astro`, `career.astro`, `places.astro`, `stories.astro` expose count / empty-result live regions | Positive examples to preserve; test dynamic filtering with keyboard |
| Member empty results | `member/directory.astro`, `member/events.astro`, `member/programs.astro`, `member/calendar.astro` and several others expose list status regions | Useful implemented patterns; check reset, loading, genuine no-result distinction |
| Verification | `verify/member.astro`, `verify/certificate.astro` use explicit loading status, invalid alert and result region | Positive semantic examples; runtime validity and theme testing outstanding |
| Check-in | `member/checkin.astro` has `role=status`, `aria-live=polite`, disables button while checking in and offers retry | Preserve real-operation semantics; test failure and success paths |
| Interaction-State Lab | `public/design-lab/unnes-inspired/index.html`; PR #80 | Six states tested as **local simulation only**; not a production roll-out |

## 3. Static form census

**21 literal `<form>` declarations across 18 page source files**; no `aria-busy` declaration was found in those source files. Several buttons are disabled using JavaScript during selected requests, which is useful but not a unified form state contract. Form-specific, reliably announced success/error feedback is not yet standardized.

### Member / authentication (11 forms)

| File | Primary operation | Candidate gap / follow-up |
| --- | --- | --- |
| `member/login.astro` | Sign in | Visible `login-message`; no accessible result region; submit does disable during Supabase call |
| `member/register.astro` | Registration | Visible `register-message`; submit disabled in configured backend path; announce validation / server feedback |
| `member/forgot-password.astro` | Email recovery | Review pending/error/success announcements and duplicate request protection |
| `member/reset-password.astro` | New password | Review validation, request lock and feedback semantics |
| `member/profile.astro` | Profile updates | Local `profile-message`; harmonize save states |
| `member/aspirations.astro` | Submit aspiration | Local response message; review true operation states |
| `member/interests.astro` | Save interests | Review save feedback and keyboard focus |
| `member/alumni.astro` | Save alumni profile | Local message and network write; review pending state |
| `member/mentoring.astro` | Save preferences | List has accessible empty state, but that is **not** the form submission feedback; also multiple action buttons |
| `member/opportunities.astro` | Save career interests | Review form state and feedback |
| `member/stories.astro` | Save story interest | Review form state and feedback |

### Admin (10 forms on 7 routes)

| File | Forms | Candidate gap / follow-up |
| --- | ---: | --- |
| `member/admin/announcements.astro` | 1 | Save/delete, error vs success announcement; no consistent pending lock in inspected handler |
| `member/admin/checkin-qr.astro` | 1 | Create QR session; review pending lock, status changes and copy action |
| `member/admin/documents.astro` | 1 | **Already disables upload submit during request**; preserve this; add clear accessible feedback and error recovery |
| `member/admin/events.astro` | 1 | Save/delete operations; no consistent pending lock in inspected handlers |
| `member/admin/organization.astro` | 4 | Term, unit, position, assignment forms; shared messages and multiple independent writes |
| `member/admin/programs.astro` | 1 | Program save/delete plus independently generated PIC/progress controls |
| `member/admin/volunteer.astro` | 1 | Opportunity save/delete and dynamic application-status selection |

The absence of an `aria-busy` attribute from these files is a **static indicator**, not proof that every operation can be double-submitted. Generated buttons, disabled properties and code imported from `src/lib/` must be tested with controlled network responses.

## 4. Prioritized migration queue

| Phase | Priority | Bounded work | Acceptance gate |
| --- | --- | --- | --- |
| 1 | P1 | Define a *small shared feedback contract* (style tokens + announcement pattern + pending lifecycle). Apply to login, registration, forgotten/reset password first | Real pending lock; no fake success; status/alert announced; field errors linked where applicable; demo wording remains honest |
| 2 | P1 | Profile, aspirations, interests and other member forms in individually reviewable PRs | No duplicate submit; retry works; no lost input on failure; proper `finally` cleanup |
| 3 | P1 | Admin events, announcements, organization and QR-session creation; then programs and volunteer | Distinct create/edit/delete statuses; destructive operations retain confirmation; busy state scoped to active action |
| 4 | P2 | Upload documents, mentoring actions, dynamic status controls, RSVP/check-in and verification regressions | Preserve existing correct disabled/empty/retry behavior; test responses under delayed/failing requests |
| 5 | P2 | Extend browser coverage to authentic Member/Admin tasks and add targeted contract assertions | Existing public 27×5 responsive suite still passes; status tests at 360, 390, 768, 1280; keyboard, dark and reduced-motion scenarios |

**Do not mechanically add all six states to every page.** For a finder, "empty" means zero matches; for a form, empty state is usually inapplicable. "Disabled" must have a real condition and visible reason. A failure must not be styled or announced as success. Native form validation should remain available.

## 5. Production interaction contract proposed for phase 1

1. **Idle:** action enabled when prerequisites are met, obvious label, no obsolete error.
2. **Loading:** set `aria-busy=true` on an appropriate form/container, disable just the active submit/control, announce progress when necessary; enforce an actual in-flight guard (not only visual button text).
3. **Success:** announce genuine confirmed response with `role=status` or `aria-live=polite`; retain form values or navigate according to the existing flow. Do not claim a server write in demo mode.
4. **Error:** `role=alert` for important failures; field-specific errors get `aria-invalid=true` and `aria-describedby`; preserve the user's entered values and expose actionable recovery.
5. **Empty:** use on result/list surfaces only, with a relevant reset or next step.
6. **Disabled:** true disabled semantics plus nearby explanation when a prerequisite is missing; disabled for pending request differs from disabled by permissions.
7. **Motion/accessibility:** Standard 160 ms color and border, navigation-only 2 px lift, no button movement, no forced animations, honor `prefers-reduced-motion` and accessible focus.
8. **Lifecycle:** `try/catch/finally` or equivalent must resolve pending state even on failure; no arbitrary timers to simulate requests; repeat submissions and out-of-order callbacks need a deterministic policy.

**Implementation approach:** introduce one reusable notice/pending treatment or utility, rather than replacing `AuthShell`/`MemberLayout` or creating another page-template family. Prefer a small, reviewed reference implementation before rolling out broadly. Do **not** refactor authentication, Supabase queries, domain logic or prose as part of a styling PR.

## 6. Required verification and limitations

- **Static checks:** existing `npm run check:theme`, `npm run check:ui`, `npm run build`, link check. The new census is intentionally non-blocking until the feedback contract is actually adopted.
- **Browser checks:** public responsive audit currently enumerates **27 routes × 5 viewport widths** (360, 390, 430, 768, 1280). Broaden coverage without conflating screenshot smoke tests with interactive acceptance.
- **Dynamic checks:** test keyboard traversal, announced pending/success/failure, focus restoration, disabled reason, empty/reset, dark mode, reduced motion and delayed/rejected network requests. For authenticated pages use test fixtures/mocks or a dedicated test environment, not real member/admin production records.
- **Safeguards:** never publish email/password/member data, tokens or API secrets. Keep PR #10 (nested landing headers) separate. No automatic merge of other agents' work.
- **Gate for each migration PR:** note task and app exception, changed routes, reused shared components, no-regression screenshots at 390/1280 and stress at 360/768, keyboard and error-state evidence, and any known incomplete scenarios.

**Decision after this audit:** proceed to a narrowly scoped phase-1 implementation PR. The audit alone does **not** justify declaring production interaction-state compliance or modifying live flows.
