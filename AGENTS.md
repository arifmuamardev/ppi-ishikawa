# PPI Ishikawa — Repository Agent Instructions

These instructions apply to every agent/contributor working in this repository.
Before changing public website UI, **read** `docs/brand/DESIGN-SYSTEM-GOVERNANCE.md`. That is the **normative UI/UX policy**. `docs/brand/PUBLIC-PAGE-ARCHETYPES.md` and `docs/brand/UI-UX-AUDIT.md` are supporting inventories and historical audits, not competing sources of truth.

## Public page contract

- Pick one primary user task and **one** template: **A (Landing/Directory), B (Finder/Explorer), C (Detail/Guide)**. Home, application, authentication, verification, and 404 pages are explicit exceptions.
- Top-level navigation comes from `src/data/site.ts`. Navigation level **must not** be inferred from URL nesting: Kampus is a top-level menu destination despite `/community/kampus/`.
- Reuse the existing shared header and layout components. Do **not** invent another header, breadcrumb, generic card, design-token set, page archetype, or navigation style for one-off cosmetic reasons.
- `BaseLayout` owns header/footer/main for public pages. Brand colors are centralized in `src/data/brand.ts`; fonts and semantic utilities in `src/styles/global.css`. Do not hardcode period palettes or duplicate `main`.
- Existing `LandingHeader`, `NestedLandingHeader`, `FinderHeader` and guide-family headers are in active use; they are **not** evidence that all pages are visually harmonized. Do not introduce the legacy `PageIntro` element forbidden by `check:ui`.
- User-facing “Hub” labels are deprecated. For linear guides use a pager; for non-linear reference pages use related links; never insert both automatically.
- Primary user action must precede heavy secondary content. Landing: pathways; Finder: filters/results; Guide: reading/steps/sources. Check desktop **and** mobile composition, not only horizontal overflow.

## Safe change workflow

1. Inspect latest `main` and open PRs before editing. Other agents may be working simultaneously; use a fresh isolated branch. Do not overwrite or merge another agent's PR.
2. In the PR record: user task, A/B/C template (or approved exception), navigation level, shared components reused, page-anatomy order, visual reference, screenshot evidence or reason not applicable.
3. Keep the change narrow; do **not** quietly refactor content while working on UI layout.
4. For UI changes compare at least 390px and 1280px screenshots against another page with the same template, stress check 360px/768px, and test interactive states/keyboards where relevant.
5. Run `npm run check:theme`, `npm run check:ui`, `npm run build`, link checks, and responsive visual audit as appropriate. Green CI **does not** substitute for human visual review.
6. Explain deviations/temporary exceptions explicitly in the PR, and include when/how they will be reviewed. Follow `.github/PULL_REQUEST_TEMPLATE.md`.

## Current known design debt

- Kampus remains a top-level main-menu route despite the nested URL. `NestedLandingHeader` delegates to shared `PublicPageHeader` and omits breadcrumb when its route is in `src/data/site.ts`. Nested Keluarga retains breadcrumb. Do not reintroduce URL-depth breadcrumb logic.
- All six main-menu destinations now use shared Page Intro geometry, but their downstream modules are intentionally specialized. Do not claim every section/card layout is identical; inspect screenshots.
- Do not copy the independent layout structure of one page into a new route without checking the standard and an appropriate reference.

Never commit personal/member data, credentials, tokens, or secrets to this public repository.
