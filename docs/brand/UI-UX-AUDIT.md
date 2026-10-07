# UI/UX Audit — Critique, Hierarchy, Arrange

Date: 2026-10-06

Method: source-level review using the Better Web UI `frontend-design`, `critique`, `hierarchy`, and `arrange` principles. The deployed GitHub Pages artifact was also inspected structurally. This pass intentionally does not add content.

## Executive finding

The site has a solid foundation: clear information architecture, semantic color tokens, Plus Jakarta Sans, consistent max-widths, good dark-mode support, and generally sensible mobile breakpoints.

The main design weakness is not lack of polish. It is **over-structuring**: too many sections are expressed as rounded bordered cards, many repeated items use the same visual weight, and several pages repeat eyebrow + large heading + card grid patterns. This reduces hierarchy because everything looks important in the same way.

## Evidence

Repository-wide code search shows:
- `rounded-3xl`: 74 code matches
- `border-slate-200`: 98 code matches
- `shadow-sm`: 48 code matches
- `hover:-translate-y-0.5`: 11 code matches
- legacy/raw uppercase-tracked labels remain widely used across content-heavy pages

Dense surfaces are especially visible in:
- Scholarship Finder
- Career
- Family Hub
- Member Dashboard
- Campus comparison

## P1 — Surface hierarchy

### Problem
Standard information, navigation choices, results, callouts, and feature panels frequently share the same formula: white background + border + large radius + optional shadow.

### Effect
In grayscale, users receive fewer structural cues about which objects are major sections, actionable cards, repeated rows, or supporting notes.

### Direction
Use four distinct levels:
1. **Feature panel** — rare, high emphasis; large radius and strong background.
2. **Standard card** — independently actionable object; border, medium radius, no default shadow.
3. **Soft group** — supporting content; background shift without border/elevation.
4. **List row** — repeated results; restrained separator/border, smaller radius.

Shadows and hover lift should be reserved for a small subset of feature/navigation cards.

## P1 — Action hierarchy

### Problem
Repeated result cards and resource items sometimes use filled or high-emphasis actions. When many such items are visible, every action competes as if it were the main CTA.

### Direction
- Primary filled action: one major next step in a section/viewport.
- Secondary outline action: alternative path.
- Repeated result action: text action or restrained outline.
- Whole-card click targets are acceptable for simple navigation cards, but avoid adding a second equally strong button inside the same card.

## P1 — Repeated visual grammar

### Problem
Many sections use the same sequence:
`EYEBROW → large heading → description → card grid`.

### Effect
Long pages become visually predictable and monotonous; hierarchy between sections weakens.

### Direction
Vary composition based on function:
- search/filter sections: controls first, results second
- comparison sections: table/list structure
- guidance sections: split layout or ordered steps
- supporting notices: inline/soft panels
- destination hubs: cards only when each destination is independently actionable

Do not remove useful content; change its visual container.

## P2 — Spacing rhythm

### Problem
Section padding uses many one-off combinations (`py-6`, `py-8`, `py-10`, `py-14`, `py-16`, plus separate `pt`/`pb` values).

### Direction
Use a small rhythm:
- compact separation: 24–32 px
- standard section: 48 px mobile / 64 px desktop
- major chapter break: 64 px mobile / 80 px desktop

Internal group gaps should always be smaller than the space separating groups.

## P2 — Radius hierarchy

### Problem
`rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-[2rem]`, and `rounded-full` are all common.

### Direction
- controls/buttons: xl
- standard cards/list items: 2xl
- feature/hero panels: 3xl / 2rem
- pills: full only for compact tags/filters/status

## P2 — Eyebrow restraint

### Problem
Uppercase/tracked labels appear above many headings and inside many cards.

### Direction
Use eyebrows for context shifts, not as a mandatory decoration. Repeated cards should generally rely on title + metadata rather than another uppercase label.

## P2 — Hover behavior

### Problem
Hover lift is used across several grids.

### Direction
Use border/background/color changes for ordinary cards. Reserve physical lift/shadow for a small number of high-value promotional/navigation surfaces. Keep reduced-motion support.

## P3 — Member Area density

The dashboard has many similarly styled cards and quick links. Functionally it is strong, but visually it needs stronger grouping and fewer elevated containers. The member area should feel operational and calm rather than promotional.

## P3 — Mobile follow-up

After the surface/action refactor, perform a dedicated responsive pass for:
- horizontal filter density
- long title wrapping
- mobile menu and touch targets
- result cards with many badges
- tables/comparison fallbacks
- member navigation
- 360 px width stress test

## Implementation order

1. Establish design context and semantic surface/action patterns.
2. Reduce card/lift/shadow repetition on Home, Scholarship, Career, Family, Campus, Member.
3. Normalize section rhythm and radii.
4. Run responsive pass.
5. Run accessibility pass.
6. Polish only after the above are stable.


## Implementation status

### Pass 1 — Surface hierarchy
Implemented in PR #6:
- standard repeated cards use calmer radii and hover feedback
- routine card shadows/lift were substantially reduced
- Family Guide content sections were consolidated into one grouped surface
- repeated Career result actions were demoted from primary-filled treatment
- Member Dashboard surface competition was reduced

### Pass 2 — Layout rhythm
Implemented in this follow-up:
- added fluid `ui-section-space-compact`, `ui-section-space`, and `ui-section-space-major` utilities
- normalized vertical rhythm across Scholarship, Career, Campus Hub, Family Hub, and Survival Guide
- normalized section-level eyebrow labels to the semantic `type-eyebrow` role
- aligned custom Survival Guide and Family Hub page titles with the standard display-title role

Remaining: dedicated responsive stress test, accessibility audit, then polish.


## Page archetype follow-up

The public information architecture has now been classified across all 43 public routes.

See `docs/brand/PUBLIC-PAGE-ARCHETYPES.md` for:
- the canonical page archetypes
- breadcrumb/header/TOC/source/end-navigation rules
- the 43-route target matrix
- the migration order for standardizing shells without reducing useful information


### Pass 3 — Guide archetype
Implemented in the shared Survival Guide shell:
- centralized guide header, breadcrumb, and metadata
- reduced metadata pill density through progressive disclosure
- centralized official-source treatment
- removed duplicate Related + Pager end navigation
- limited sequential pager to actual linear guide articles
