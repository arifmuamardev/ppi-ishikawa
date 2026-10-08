# Public Page Archetypes & Element Rules

Date: 2026-10-06  
Scope: all 43 public routes in `src/pages` (Member, Admin, Verify, and 404 excluded)

This document turns the current sitemap into a small set of page archetypes so UI/UX decisions are made by page type rather than page-by-page preference.

## Why this exists

The public site has grown into a strong information base, but page shells evolved unevenly. The problem is not simply that some pages have breadcrumbs and others do not. The deeper issue is that page type has not been explicit, so the same route can accidentally mix landing-page, guide, finder, and sequential-navigation patterns.

The goal is **consistency without forcing every page to contain the same elements**.

## Naming rule: stop exposing “Hub” as a page type

“Hub” should be an internal concept, not a required user-facing label.

Preferred visible names:

- Campus Hub → **Kampus**
- Family Hub → **Keluarga**
- Scholarship Hub → **Beasiswa**
- Career Hub → **Karier**

A page can function as a domain landing without calling itself a “Hub”.

## Canonical archetypes

### 1. Landing

Purpose: introduce a top-level domain and route users toward a small number of meaningful next steps.

Standard structure:

```
LandingHeader
Primary choices / key orientation
Major sections
Optional compact next-step block
```

Do not add breadcrumb to level-1 landing pages.

### 2. Nested Landing

Purpose: introduce a sub-domain such as Kampus or Keluarga.

Standard structure:

```
Breadcrumb
LandingHeader
Primary child choices
Supporting orientation
Sources if factual
```

Child choices already serve as navigation, so a second generic “Baca lagi” block is normally unnecessary.

### 3. Guide / Article

Purpose: explain one topic in depth.

Standard structure:

```
Breadcrumb
GuideHeader
GuideMeta where applicable
TOC when the page is long enough
Article sections
Official sources where factual
ONE end-navigation pattern
```

End-navigation rule:
- linear Survival Guide sequence → **Pager**
- non-linear guide/article → **Related**
- never show both merely because both components exist

### 4. Finder / Directory

Purpose: help users locate or filter an answer/resource.

Standard structure:

```
Breadcrumb when level 2+
FinderHeader
Filters / search / primary selectors
Results
Method/source note
```

Do not append generic RelatedLinks or Pager. The finder itself is the task.

### 5. Application

Purpose: task-based authenticated or transactional UI.

Application pages use app navigation rather than editorial breadcrumb/related conventions.

Canonical shell:

```
MemberLayout
├── desktop grouped sidebar
├── compact mobile menu
└── AppPageHeader
    └── task content
```

The member dashboard is the deliberate exception: its greeting/status summary acts as the dashboard header.

Auth entry pages use a separate compact `AuthShell`:
- login
- registration
- forgot password
- reset password

Application rules:
- no editorial breadcrumb, RelatedLinks, or guide pager
- mobile navigation is collapsed by default
- current route is visibly marked in app navigation
- page title/description use `AppPageHeader`
- ordinary form/data surfaces use standard `2xl` radius
- dynamic counts/statuses should expose live status semantics where useful

## Element rules

| Element | Rule |
| --- | --- |
| Breadcrumb | Required on public level 2+ pages; omitted on Home and level-1 destinations |
| Header/intro | Every non-Home page gets exactly one standardized header variant: LandingHeader, GuideHeader, or FinderHeader |
| GuideMeta | Guide-only; not a badge to add to landing pages |
| TOC | Conditional for guides; use when there are roughly 4+ meaningful sections or scanning cost is high |
| Official sources | Required for factual service, campus, scholarship, career, life, family, and directory information |
| Related | For non-linear guides/articles or selected institutional landings only |
| Pager | Only for a genuinely linear sequence |
| Related + Pager | **Never together by default** |
| “Baca lagi” | Not a universal page footer; treat it as the Related end-navigation mode |
| Child-card navigation | Counts as next-step navigation on nested landings; do not duplicate it at the bottom |

Legend: ✓ required, — not part of the standard shell, C conditional.

## 43-route target matrix

| Route | Archetype | Level | Breadcrumb | Header / Intro | TOC | Sources | Related | Pager | Audit note |
| --- | --- | ---: | :---: | --- | :---: | :---: | :---: | :---: | --- |
| / | Landing | 0 | — | Hero | — | — | — | — | Home is a unique entry page; do not force editorial elements. |
| /about/ | Landing | 1 | — | LandingHeader | — | — | ✓ | — | Mostly aligned; keep one compact next-step block. |
| /beasiswa/ | Finder / Directory | 1 | — | FinderHeader | — | ✓ | — | — | Currently mixes landing + finder and uses “Scholarship Hub”; standardize as Beasiswa finder. |
| /career/ | Finder / Directory | 1 | — | FinderHeader | — | ✓ | — | — | Currently mixes landing + finder; repeated result actions already being simplified. |
| /community/ | Landing | 1 | — | LandingHeader | — | — | ✓ | — | Use one compact next-step block, not another card grid. |
| /community/kampus/ | Nested Landing | 2 | ✓ | LandingHeader | — | ✓ | — | — | Good domain landing; child campus choices are already the next steps. |
| /community/kampus/alice-gakuen/ | Guide / Article | 3 | ✓ | GuideHeader | ✓ | ✓ | ✓ | — | Campus detail family is already one of the most consistent page groups. |
| /community/kampus/ishikawa-prefectural-university/ | Guide / Article | 3 | ✓ | GuideHeader | ✓ | ✓ | ✓ | — | Keep same campus-detail shell. |
| /community/kampus/jaist/ | Guide / Article | 3 | ✓ | GuideHeader | ✓ | ✓ | ✓ | — | Keep same campus-detail shell. |
| /community/kampus/kanazawa-institute-of-technology/ | Guide / Article | 3 | ✓ | GuideHeader | ✓ | ✓ | ✓ | — | Keep same campus-detail shell. |
| /community/kampus/kanazawa-university/ | Guide / Article | 3 | ✓ | GuideHeader | ✓ | ✓ | ✓ | — | Keep same campus-detail shell. |
| /community/kampus/kinjo-university/ | Guide / Article | 3 | ✓ | GuideHeader | ✓ | ✓ | ✓ | — | Keep same campus-detail shell. |
| /contact/ | Landing | 1 | — | LandingHeader | — | — | — | — | Contact methods are the task; generic related navigation is unnecessary. |
| /life-in-ishikawa/ | Landing | 1 | — | LandingHeader | — | ✓ | — | — | Currently behaves partly like a guide via GuideMeta; simplify to domain landing. |
| /life-in-ishikawa/administrasi/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /life-in-ishikawa/bank-money/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /life-in-ishikawa/disaster-emergency/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /life-in-ishikawa/family-anak/ | Nested Landing | 2 | ✓ | LandingHeader | — | ✓ | — | — | Currently mixes landing, GuideMeta, RelatedLinks and Pager; simplify heavily. |
| /life-in-ishikawa/family/aktivitas/ | Finder / Directory | 3 | ✓ | FinderHeader | — | ✓ | — | — | Keep filters/results as the primary interaction. |
| /life-in-ishikawa/family/benefit-kesehatan/ | Guide / Article | 3 | ✓ | GuideHeader | C | ✓ | ✓ | — | Shared FamilyGuidePage; add consistent guide header/end navigation. |
| /life-in-ishikawa/family/childcare/ | Guide / Article | 3 | ✓ | GuideHeader | C | ✓ | ✓ | — | Shared FamilyGuidePage; add TOC only if long enough. |
| /life-in-ishikawa/family/datang-bersama-keluarga/ | Guide / Article | 3 | ✓ | GuideHeader | C | ✓ | ✓ | — | Shared FamilyGuidePage; family branch is non-linear, so Related rather than Pager. |
| /life-in-ishikawa/family/faq/ | Guide / Article | 3 | ✓ | GuideHeader | C | ✓ | ✓ | — | Use guide shell; do not add sequential pager. |
| /life-in-ishikawa/family/kehamilan-kelahiran/ | Guide / Article | 3 | ✓ | GuideHeader | C | ✓ | ✓ | — | Shared FamilyGuidePage; standardize header and footer. |
| /life-in-ishikawa/family/municipality/ | Finder / Directory | 3 | ✓ | FinderHeader | — | ✓ | — | — | This is a service selector, not a guide. |
| /life-in-ishikawa/family/sekolah-anak/ | Guide / Article | 3 | ✓ | GuideHeader | C | ✓ | ✓ | — | Shared FamilyGuidePage; add TOC only when it improves scanning. |
| /life-in-ishikawa/family/starter-pack/ | Guide / Article | 3 | ✓ | GuideHeader | C | ✓ | ✓ | — | Currently custom long page with no common guide meta/end pattern. |
| /life-in-ishikawa/family/timeline/ | Guide / Article | 3 | ✓ | GuideHeader | C | ✓ | ✓ | — | Timeline is non-linear reference content; Related, not Pager. |
| /life-in-ishikawa/hari-pertama/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /life-in-ishikawa/japanese-support/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /life-in-ishikawa/kehidupan-sehari-hari/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /life-in-ishikawa/kesehatan/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /life-in-ishikawa/leaving/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /life-in-ishikawa/municipality-guides/ | Finder / Directory | 2 | ✓ | FinderHeader | — | ✓ | — | — | Currently styled as a sequential guide; reclassify as municipality directory. |
| /life-in-ishikawa/places/ | Finder / Directory | 2 | ✓ | FinderHeader | — | ✓ | — | — | Already task-oriented; standardize header only. |
| /life-in-ishikawa/sebelum-berangkat/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /life-in-ishikawa/tempat-tinggal/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /life-in-ishikawa/transportasi/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /life-in-ishikawa/winter/ | Guide / Article | 2 | ✓ | GuideHeader | ✓ | ✓ | — | ✓ | Currently has RelatedLinks + Pager; keep Pager only. |
| /programs/ | Landing | 1 | — | LandingHeader | — | — | ✓ | — | Mostly aligned; keep compact relationship to About/Contact. |
| /resources/ | Finder / Directory | 1 | — | FinderHeader | — | C | — | — | Resource index should stay task-oriented; no generic Baca lagi. |
| /stories/ | Finder / Directory | 1 | — | FinderHeader | — | — | — | — | Listing/filter experience; no generic footer navigation needed. |
| /stories/[slug]/ | Guide / Article | 2 | ✓ | GuideHeader | — | — | ✓ | — | Current custom related-stories block already fits the target pattern. |

## What the current audit shows

### Breadcrumbs are less inconsistent than they look

Effective breadcrumbs are already present across nearly all level-2+ content, including pages that receive them indirectly through shared templates. Top-level destinations such as About, Beasiswa, Karier, Community, Contact, Programs, Resources, and Stories correctly do not need breadcrumbs.

The real inconsistency is the **page shell around the breadcrumb**, not breadcrumb presence itself.

### The biggest duplication is at the end of Survival Guide pages

Twelve core Survival Guide articles currently use the combination:

```
GuideMeta
GuideToc
...
Official/source content
RelatedLinks
GuidePager
```

This is redundant. They are already a linear guide series, so the target is:

```
GuideHeader + GuideMeta
GuideToc
...
Official sources
GuidePager
```

Remove generic RelatedLinks from those sequential pages.

### Keluarga is currently the most mixed branch

The Family landing currently combines landing behavior with guide behavior: custom hero, GuideMeta, source content, RelatedLinks, and GuidePager.

Its child pages then split into three unrelated shell styles:
- six pages via `FamilyGuidePage`
- custom long-form Starter Pack / Timeline
- custom finder pages for Activity / Municipality

The target is to make the branch explicit:

```
Keluarga                      → Nested Landing
├── Starter Pack              → Guide
├── Datang bersama keluarga   → Guide
├── Kehamilan & kelahiran     → Guide
├── Childcare                 → Guide
├── Sekolah anak              → Guide
├── Benefit & kesehatan       → Guide
├── FAQ                       → Guide
├── Timeline                  → Guide
├── Aktivitas                 → Finder
└── Municipality              → Finder
```

### Campus pages are comparatively healthy

The six campus-detail pages already share a strong pattern: breadcrumb, structured profile/content, TOC, official sources, and related navigation without a sequential pager.

They should be used as a reference for how one route family can feel consistently related without making every page visually identical.

### Beasiswa and Karier are finders, not “hubs”

Both pages have introductory/landing content but their main user job is to locate relevant opportunities. Treating them as Finder pages clarifies priorities:
- concise header
- primary selector/filter
- results
- official source/method note

This also removes the need for “Hub” terminology.

### Municipality Guides should behave like a directory

`/life-in-ishikawa/municipality-guides/` currently carries sequential-guide mechanics even though the user task is to select a municipality/reference. It should move to Finder / Directory and lose generic Related + Pager treatment.

## Information-density guardrails

The site can keep a large information base without exposing all information at once.

1. **Home:** show only major domains and immediate high-value entry points.
2. **Landing:** show grouped routes, not every descendant.
3. **Nested Landing:** expose direct children only; deeper details belong one level down.
4. **Guide:** focus on one topic; sibling discovery belongs at the end.
5. **Finder:** filters and results dominate; explanatory material is supporting.
6. **End of page:** exactly one navigation pattern.
7. **Repeated cards:** do not use cards merely to make all links visible.
8. **Navigation:** the sitemap may be large; the global menu should not mirror it.

## Proposed reusable shells

Implementation should converge toward these building blocks:

- `PageHeader.astro`
  - variants: `landing`, `finder`
  - optional breadcrumb slot for nested pages
- `GuideHeader.astro`
  - breadcrumb
  - title / description
  - meta / verification
- `PageEndNav.astro`
  - mode: `related` | `pager` | `none`
  - prevents Related + Pager duplication
- `OfficialSources.astro`
  - one visual language for source blocks
- `FinderShell.astro`
  - consistent filter/result layout without forcing content into cards

Do not build all of these at once. Standardize one archetype at a time and migrate representative pages before bulk migration.

## Recommended migration order

1. **Guide / Article:** standard Survival Guide pages first because they are already structurally similar and expose the Related + Pager duplication.
2. **Nested Landing:** Keluarga, then Kampus.
3. **Finder / Directory:** Beasiswa, Karier, Places, Municipality, Activities, Resources, Stories.
4. **Landing:** Life in Ishikawa, Community, About, Programs, Contact.
5. **Application:** Member/Admin in a separate pass.

This order reduces inconsistency while minimizing simultaneous redesign risk.


## Implementation status

### Guide shell migration — implemented

The 12 linear Survival Guide articles now use one shared shell:

```
GuideHeader
  ├── Breadcrumb
  ├── SG identity
  ├── display title
  ├── lead
  └── progressive-disclosure GuideMeta

GuideToc
Article content
OfficialSources
GuidePager
```

Migrated routes:

- SG01 Sebelum Berangkat
- SG02 Hari Pertama
- SG03 Administrasi
- SG04 Tempat Tinggal
- SG05 Kehidupan Sehari-hari
- SG06 Transportasi
- SG07 Kesehatan
- SG09 Bank & Keuangan
- SG10 Bencana & Darurat
- SG11 Musim Dingin
- SG12 Bahasa Jepang & Dukungan
- SG13 Meninggalkan Ishikawa / Jepang

Changes implemented:
- breadcrumb/title/meta markup moved into `GuideHeader.astro`
- metadata was simplified visually; registry/change detail remains available via disclosure
- official-source rendering moved into `OfficialSources.astro`
- generic `RelatedLinks` was removed from the 12 linear guides
- `GuidePager` now moves only through the 12 actual linear articles
- SG08 Keluarga and SG14 Municipality Guides are no longer treated as sequential chapters

Next archetype migration: **Nested Landing**, starting with Keluarga.


### Nested Landing — Keluarga implemented

`/life-in-ishikawa/family-anak/` now follows the Nested Landing archetype:

```
Breadcrumb
NestedLandingHeader
Primary starting point
Primary child guides
Compact tools / shortcuts
Support routes
OfficialSources
```

Key changes:
- removed GuideMeta behavior from the landing page
- removed repeated navigation patterns; each Family destination is exposed once
- reduced the landing from eight visual sections to five
- grouped F01–F05 as primary guides
- grouped Activities, FAQ, Municipality, and Timeline as compact tools
- kept Starter Pack as the single high-emphasis starting point
- standardized visible naming to “Keluarga” / “Keluarga & Anak”; “Family Hub” remains only an internal/historical term where appropriate
- added reusable `NestedLandingHeader.astro` for later use by Kampus and other nested destinations

Next Nested Landing migration: **Kampus**.


### Nested Landing — Kampus implemented

`/community/kampus/` now shares the same `NestedLandingHeader` used by Keluarga.

The visible task flow is:

```
Breadcrumb
NestedLandingHeader
Campus summary
Choose institution
Understand area
Compare if needed
Supporting cross-domain links
```

Key changes:
- removed the separate breadcrumb + PageIntro combination
- standardized the visible parent path as Komunitas → Kampus
- replaced “Campus Pack” wording on the landing with the simpler “panduan kampus”
- reduced the summary block from a bordered card to a lighter metadata strip
- retained all institution, map, regional, and comparison information

Both public Nested Landing archetypes are now on a shared shell. Next migration: **Finder / Directory**.


### Finder / Directory shell — implemented

All eight public Finder / Directory routes now use `FinderHeader.astro`:

- Beasiswa
- Karier & Peluang
- Direktori Tempat
- Pemerintah Lokal
- Aktivitas Keluarga
- Layanan Keluarga berdasarkan Municipality
- Direktori
- Cerita PPI Ishikawa

`FinderHeader` supports both top-level finders and nested finders with breadcrumb context.

The effective shell is now:

```
FinderHeader
Filters / selectors / task entry
Results
Method / source context where needed
```

The Municipality Guides route no longer presents itself as a Survival Guide chapter via GuideMeta.

Next Finder work: reduce pre-filter information density on **Beasiswa** and **Karier**, the two heaviest finder pages.


### Landing shell — implemented

The five non-Home public Landing routes now use `LandingHeader.astro`:

- Hidup di Ishikawa
- Komunitas
- Tentang PPI Ishikawa
- Program & kegiatan
- Kontak

The Landing contract is now:

```
LandingHeader
Primary orientation / choices
Major sections
Optional compact related block
```

Key decisions:
- top-level landings do not use breadcrumbs
- `Hidup di Ishikawa` no longer uses GuideMeta as if it were a guide article
- journey priority steps on `Hidup di Ishikawa` use progressive disclosure
- the complete guide list remains available but is collapsed by default
- Contact uses its task routes as navigation and no longer appends generic RelatedLinks
- About and Programs retain compact RelatedLinks because they add a distinct organizational next step
- routine hover lift/shadow was removed from Community and Contact navigation cards

Home remains its own entry-page archetype rather than being forced into the standard Landing shell.


### Application shell — implemented

The Member/Admin application layer now has a consistent shell:
- desktop grouped sidebar remains visible and sticky
- mobile no longer renders the full sidebar before page content; navigation is collapsed into a compact disclosure menu
- active navigation items expose the current page
- member/admin navigation now shares one data-driven source inside `MemberLayout`
- repeated member/admin pages use `AppPageHeader`
- redundant dashboard navigation blocks were removed because the sidebar already provides those destinations
- Auth pages share `AuthShell`
- application result counts and empty states received the same interaction/accessibility treatment used by public finders

The member dashboard intentionally remains a summary dashboard rather than a standard task-page header.


### Family Guide shell — implemented

The eight Family guide/reference pages now share one consistent guide contract:

```
FamilyGuideHeader
GuideToc when useful
Guide content
OfficialSources
One return path to Keluarga
```

Implemented routes:
- F01 Datang bersama keluarga
- F02 Kehamilan & kelahiran
- F03 Childcare
- F04 Sekolah anak
- F05 Benefit & kesehatan
- F07 FAQ
- F09 Timeline
- F10 Starter Pack

Key changes:
- removed the repeated ten-item Family navigation grid from child guides
- standardized breadcrumb naming to **Keluarga**
- added shared `FamilyGuideHeader.astro`
- `FamilyGuidePage.astro` now owns the shared header, conditional TOC, source treatment, and return navigation for F01–F05/F07
- Starter Pack and Timeline use the same header/TOC/source language while preserving their specialized interactions
- removed the nested `<main>` landmark from Starter Pack
- ordinary guide cards use calmer standard-card surfaces rather than feature-level elevation


### Utility / verification shell — implemented

Utility routes that are not part of the 43-page public content matrix now follow explicit rules.

Verification pages:
- `/verify/member/`
- `/verify/certificate/`

Both use `VerificationShell` for a shared compact verification layout, consistent typography, standard card radius, and predictable loading/invalid/result states.

Additional edge-case rules:
- 404 remains a unique utility page but uses standard typography, control radius, and 44 px touch targets.
- Story detail remains an article page with its own content structure; its metadata and media treatment follow the shared typography/radius system.

These utility routes are intentionally not promoted into the global navigation.
