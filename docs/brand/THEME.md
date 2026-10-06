# PPI Ishikawa — Period Theme

Brand colors are configured in one place:

`src/data/brand.ts`

For the 2026/27 period:

| Role | Color |
| --- | --- |
| Primary | `#B3263E` |
| Secondary | `#176B6A` |
| Accent | `#5BA8A6` |
| Surface | `#F7FAF9` |
| Ink | `#23282A` |

## Changing the theme for a new period

Update only `src/data/brand.ts`:

```ts
export const brandTheme = {
  period: '2027/28',
  name: 'New theme name',
  colors: {
    primary: '#...',
    secondary: '#...',
    accent: '#...',
    surface: '#...',
    ink: '#...'
  }
} as const;
```

The period is also consumed by `site.ts`, so the visible period label changes from the same source.

## Semantic color roles

Components should use semantic Tailwind utilities instead of period-specific color names:

- `brand` — primary identity and primary CTA
- `secondary` — supporting identity / informational emphasis
- `accent` — highlights, chips, borders, hover surfaces
- `ink` — dark surfaces and strongest text
- `paper` — page surface

Derived utilities such as `brand-dark`, `brand-soft`, `secondary-dark`,
`secondary-soft`, `accent-dark`, and `accent-soft` are generated from the
five source colors in `global.css`.

Examples:

```html
<a class="bg-brand text-white hover:bg-brand-dark">...</a>
<p class="text-secondary">...</p>
<div class="border-accent/35 bg-accent/10">...</div>
<section class="bg-ink text-white">...</section>
```

## Do not hardcode period colors

Do not add the five period hex values directly to Astro components, page files, or
JavaScript. They belong only in `src/data/brand.ts`.

Status colors may remain semantic system colors when they communicate meaning
rather than branding, for example red for errors and green for success.

## Dark mode

Dark-mode brand colors are derived automatically from the same five source
colors. Theme-color metadata is also sourced from `brand.ts`, so no duplicate
hex values are required in the layout or theme toggle.


## Automated guard

Run `npm run check:theme` before merging theme-related changes. CI runs the same check.

The guard rejects:
- the active period string hardcoded anywhere under `src/` outside `src/data/brand.ts`
- any of the five active palette hex values hardcoded outside `brand.ts`
- legacy Tailwind `amber-*` utilities used as decorative brand colors

Use `site.period`, `brandTheme.period`, and semantic tokens such as `brand`, `secondary`, `accent`, `ink`, and `paper` instead.


## Typography is separate from the period theme

The active-period palette lives here, but typography is treated as a longer-lived part of the PPI Ishikawa visual identity.

See `docs/brand/TYPOGRAPHY.md` for the font family, Japanese fallbacks, and semantic typography tokens.
