# Template C — Detail / Guide audit

**Audit date:** 10 October 2026  
**Repository:** `arifmuamardev/ppi-ishikawa`  
**Scope:** Public Detail/Guide pages (Template C), with the currently connected source code as the implementation baseline.  
**Authority:** [Design System & UI Governance](DESIGN-SYSTEM-GOVERNANCE.md).  
**Not a content-validity review:** source links' correctness, whether requirements changed after their verification dates, and completeness of Japanese administrative guidance require a separate editorial/source-verification review.

## 1. Inventory and primary tasks

| Route group | Count | Primary task | Page shell | Navigation model |
| --- | ---: | --- | --- | --- |
| Survival Guide SG01–SG07, SG09–SG13 (the 12 **linear** articles) | **12** | Follow one practical topic/sequence | `GuideHeader` | `GuideToc` → `OfficialSources` → **one `GuidePager`** |
| University and school-specific campus guides | **6** | Read information about one campus | `CampusGuideHeader` | `GuideToc` → `CampusOfficialSources` → **one `RelatedLinks`** |
| Family reference guides F01, F02, F03, F04, F05, F07 | **6** | Understand one family administrative/life topic | `FamilyGuidePage` using `FamilyGuideHeader` | Conditional `GuideToc` (≥4 sections) → `OfficialSources` → **return to Keluarga** |
| Family tools F08 Timeline and F10 Starter Pack | **2** | Use a family timeline/checklist | `FamilyGuideHeader` | `GuideToc` → `OfficialSources` → **return to Keluarga** |
| `/stories/[slug]/` | Dynamic, **zero published story pages** at audit | Read one published experience | Article-specific header | Related stories only when available; **story attribution is not an official administrative-source block** |

**Total inspected Template C structure: 26 currently defined guide pages** (12 + 6 + 6 + 2), plus one dynamic story route contract with no publicly rendered instances. This count excludes Landing `family-anak` and `community/kampus`, and Finder `places`, `municipality-guides`, `family/aktivitas`, `family/municipality`, which are **A/B**, not Detail C regardless of path nesting.

## 2. Current component-anatomy assessment

| Contract | Survival (12) | Campus (6) | Family (8) | Assessment |
| --- | --- | --- | --- | --- |
| Breadcrumb reflects parent → current detail | `GuideHeader` | `CampusGuideHeader` | `FamilyGuideHeader` | Present through one family-specific shared header each; test one breadcrumb with an `aria-current` element |
| One semantic `h1`, common display/lead scale | Shared | Shared plus institution logo/subtitle | Shared | Compatible with existing `type-display`, `type-lead`; campus identity remains intentionally specialized |
| Verification info | `GuideMeta` with audience, scope, verified date and registry | Header verification badge + source panel date | `familyLastVerified` in shared header | **Consistent intent, differentiated detail**; do not invent verification dates or claim freshly checked sources |
| Table of contents | `GuideToc` | `GuideToc` | Conditional for F01–F07; present on Timeline/Starter | Valid variation by guide length; when present, every fragment target must exist |
| Official sources | `OfficialSources`, visible | `CampusOfficialSources`, disclosure | `OfficialSources`, visible | Presentation differs intentionally; each has identifiable source block; expand campus disclosures manually when reviewing |
| Navigation after reading | Linear `GuidePager` | Non-linear `RelatedLinks` | Return to Keluarga | **Exactly one final navigation pattern** per page type; no pager-plus-related pair |
| Sources before navigation | **Pass** | **Previously inconsistent; fixed in this migration** | **Pass** | Campus `RelatedLinks` was before sources in all six routes; now sources precede next-topic links |

### Campus-specific defects and resolution

All six campus guide routes previously rendered their `RelatedLinks` section **before** `CampusOfficialSources`. This put the jump to other topics ahead of the evidence supporting the current page. In this PR, the two existing blocks are reordered (no source data, copy, link or section removed), yielding:

`CampusGuideHeader → campus content + TOC → CampusOfficialSources → RelatedLinks`.

The six routes are Kanazawa University, JAIST, Kanazawa Institute of Technology, Ishikawa Prefectural University, Kinjo University, and Alice Gakuen. Since the change is only a reordering, source link destinations remain unchanged.

### Accepted specialization, **not** inconsistency

- Campus detail retains institution mark, Japanese subtitle, campus/area metadata, quick links, and expandable sources. This serves a campus-specific user task and is not a fourth page template.
- `GuideMeta` is intentionally more detailed for Survival topics; Family and Campus use their own verified-date presentation. Avoid forcing exactly the same metadata fields on all categories.
- Family F01–F07 uses conditional TOC to avoid unnecessary controls on short articles; Timeline/Starter Pack are tools with interactive state, not purely linear chapters.
- Story author/interview metadata is **not** comparable to government-source verification. Do not add `OfficialSources` or a “last verified” date solely for decorative uniformity.

## 3. Guards and visual QA

Static checks in `scripts/check-ui-contracts.mjs` prevent:

- Campus navigation appearing before official sources, missing TOC, or accidental `GuidePager` alongside `RelatedLinks`.
- Survival losing source-before-pager order or gaining duplicate `RelatedLinks`.
- Family base component losing the source block and final return destination.
- Guide headers losing breadcrumb, heading, and lead typography; semantic role selectors disappearing.

Browser checks in `scripts/audit-responsive.mjs` run at **360, 390, 430, 768 and 1280 px**. Expand from 18 to **27 routes / 135 cases** by adding the other five campus guides, two linear Survival guides, and two family reference guides. For six campus pages plus representative Survival/Family pages, additional 390/1280 checks verify actual:

- One current-page breadcrumb and one `h1` (the global check also covers other routes).
- Verification text and one official-source block with independent links.
- TOC fragments resolve to existing element IDs (not just visually clickable links).
- The source block comes **before** exactly one appropriate pager/related navigation, or a Family return with no duplicate alternative.

The `data-ui-source-block` and `data-ui-next-navigation` attributes are **nonvisual test hooks** on existing shared components, not new templates.

## 4. Follow-up work (deliberately not changed here)

1. **Source freshness:** review last-verified dates and check university/municipal URLs with content maintainers; QA here checks presence, not substantive accuracy.
2. **Metadata presentation:** evaluate whether campus/family timestamps should visually reuse a compact metadata primitive. Revisit only with full-page visual comparisons; no false verification claims.
3. **Conditional Story detail:** run screenshot and accessibility checks when the first story is published. The dynamic route currently has no populated page.
4. **Long-form density & readability:** inspect subsection hierarchy and information load inside the longest campus guides, but preserve specialized modules and reading purpose.
5. **Legacy PR #10:** do not directly merge or overwrite its old nested-header code; consult [PR10-RECONCILIATION.md](PR10-RECONCILIATION.md).

## 5. Definition of Done

- No user-facing text, dates or underlying source arrays altered.
- Every campus guide ends with verified sources **then** related next topics.
- `npm run check:theme`, `npm run check:ui`, Astro build, internal/external link checks succeed.
- Responsive browser audit passes all **135** cases with no horizontal overflow, broken guide anchors or duplicate end navigation.
- Inspect desktop 1280px and mobile 390px on at least one campus guide before/after, and a representative Survival/Family guide for regressions.
