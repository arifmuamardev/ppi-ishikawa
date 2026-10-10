# PPI Ishikawa — Typography

Typography is part of the long-term visual identity, not the annual period theme.

## Primary typeface

**Fira Sans**

Approved for the long-term PPI Ishikawa identity on 11 October 2026, after the Design Lab B — Solid Institutional study. The public website self-hosts Fira Sans via `@fontsource/fira-sans` (bundled by Astro), with no production dependency on Google Fonts.

Primary stack:

```css
"Fira Sans",
"Hiragino Sans",
"Yu Gothic",
Meiryo,
ui-sans-serif,
system-ui,
sans-serif
```

Japanese glyphs continue to fall back to Japanese system fonts; the Latin webfonts remain limited to their `latin-*` subsets to avoid unnecessarily shipping large CJK assets. Source font is licensed under the SIL Open Font License 1.1.

## Semantic font tokens

Defined in `src/styles/global.css`:

- `font-brand` — visual identity
- `font-heading` — headings
- `font-body` — long-form text
- `font-ui` — controls and interface text
- `font-sans` — compatibility/default alias

All semantic font tokens currently point to Fira Sans. Components should not hardcode font-family declarations. The experimental Design Lab uses Fira Sans from Google Fonts for its isolated prototype, whereas the production site self-hosts the same family.

## Usage

For now, most components can continue using `font-sans` inherited from the page body. Use semantic font utilities only when a component genuinely needs an explicit role.

Typography should remain stable across committee periods unless the organization intentionally refreshes its long-term visual identity.


## Hierarchy

Use the semantic roles below instead of inventing page-specific heading scales.

| Role | Class | Purpose |
| --- | --- | --- |
| Hero | `type-hero` | Homepage or rare campaign-level headline |
| Display | `type-display` | Page title / article title |
| Section | `type-section` | Major section heading |
| Card title | `type-card-title` | Card and compact content titles |
| Lead | `type-lead` | Introductory paragraph beneath a page title |
| Eyebrow | `type-eyebrow` | Short category or context label |
| UI | `type-ui` | Navigation, buttons, and controls |
| Meta | `type-meta` | Dates, status, attribution, and secondary metadata |

### Weight policy

- Body text: 400
- UI / navigation: 600
- **Hero** (one exceptional homepage or campaign headline): 900. Use only with the semantic `type-hero` class, not on every card.
- **Display** (primary page heading): 800. Use `type-display` for the shared Page Intro.
- **Section, card title, eyebrow**: 700 (keep ordinary page structure calm).
- Body: 400; lead body text inherits 400; UI/navigation: 600; metadata: 500.
- Strong weights are intentionally scarce: never set all headings/cards/eyebrows to 900 just because the Design Lab B example is expressive.
- Fira Sans weights are defined in `src/styles/global.css`; production still follows shared type roles rather than ad-hoc per-page `font-black` classes.

### Typography behavior

Display and section headings use tighter letter spacing and balanced wrapping. Lead text uses comfortable line height and pretty wrapping. Body copy should normally keep generous line height and a constrained reading width rather than increasing font weight.
