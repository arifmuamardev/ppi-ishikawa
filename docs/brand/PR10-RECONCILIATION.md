# PR #10 reconciliation against current main

**Reviewed:** 10 October 2026  
**Legacy branch:** PR [#10](https://github.com/arifmuamardev/ppi-ishikawa/pull/10), `refactor: standardize nested landing headers`  
**Status at review:** OPEN, **not mergeable**, 26 changed files.  
**Decision:** **Do not merge PR #10 wholesale** or force-update its branch. Use `main` plus the normative [Design System Governance](./DESIGN-SYSTEM-GOVERNANCE.md) as authority and carry forward missing behavior in narrowly scoped PRs.

## File-by-file disposition

| PR #10 files | Scope / intent | Disposition |
| --- | --- | --- |
| `src/components/PageHeader.astro`, `src/components/PageIntro.astro` | Legacy shared heading and wrapper | **Superseded.** Current source uses `PublicPageHeader`, `LandingHeader`, `FinderHeader`, `NestedLandingHeader`. Reintroducing these would violate `check:ui`. |
| `src/pages/community/kampus/index.astro`, `src/pages/life-in-ishikawa/family-anak.astro` | Shared nested intro | **Superseded structurally.** `NestedLandingHeader` delegates to `PublicPageHeader`. Top-level Kampus has **no breadcrumb**, nested Keluarga keeps its breadcrumb, unlike the old PR. |
| `src/components/FamilyGuidePage.astro` and 6 routes `family/{datang-bersama-keluarga,kehamilan-kelahiran,childcare,sekolah-anak,benefit-kesehatan,faq}.astro` | Indonesian Family breadcrumb and guide codes | **Superseded by current Family Guide contract.** Pages use `FamilyGuidePage code="Fxx"`; do **not** restore `kicker="Keluarga · Fxx"` or `PageHeader`. |
| `src/pages/beasiswa.astro`, `src/pages/career.astro` | Replace Hub titles and nav label | **Already handled in current architecture.** Beasiswa uses `FinderHeader title="Beasiswa"` and Karier uses `ScrollPillNav ariaLabel="Navigasi Karier"`. PR #10's obsolete `PageIntro` and navigation markup must not be cherry-picked. |
| `src/pages/index.astro`, `src/pages/life-in-ishikawa.astro`, `src/data/survival.ts`, `src/pages/member/opportunities.astro` | Naming and navigation copy | **Substantially incorporated.** Current pages use Keluarga, Beasiswa, Karier, and updated guide titles rather than old Hub labels. Recheck copy individually only during dedicated content QA. |
| `src/pages/life-in-ishikawa/family/{aktivitas,municipality,starter-pack,timeline}.astro`, `src/pages/member/index.astro` | Navigational link labels | **Review case-by-case.** Main no longer contains the exact obsolete strings in PR #10, but markup changed. Do not reapply old HTML/class markup. |
| `src/data/places.ts`, `src/pages/contact.astro` | Replace Hub terminology in descriptive copy | **Copy review pending.** Some wording differs from both versions. Preserve current route descriptions until a separate content-only pass; no functional blocker to UI migration. |
| `docs/brand/PUBLIC-PAGE-ARCHETYPES.md`, `docs/brand/UI-UX-AUDIT.md` | Record header consolidation | **Historical only.** The modern governance document, agent instructions, and CI contracts now describe the canonical Page Intro. Do not reintroduce the obsolete `PageHeader` documentation. |

All **26 paths** are covered by the groupings above. Classification is based on the PR #10 diff and live `main` source; a missing exact line from the old patch **does not imply a missing feature**.

## Implementation after review

- Keep the old PR open for its author until separately discussed; do **not** overwrite its branch or represent it as already merged.
- Implement shared `ResultCard` for active Beasiswa/Karier directly from `main` in a new PR. Forward the original filtering `data-*` attributes, keep scholarship show-more/reset, career category/reset, and retain independent source links.
- Maintain both structural checks and actual Chromium checks at 390px and 1280px. This is a UI-only refactor; no changes to scholarship/career datasets, routing or eligibility.

## Remaining decision

PR #10's author or project owner can explicitly close the now-obsolete branch once any remaining copy changes have been reviewed. No automatic merge, closure, or force push is authorized by this reconciliation.
