# PPI Ishikawa — Typography

Typography is part of the long-term visual identity, not the annual period theme.

## Primary typeface

**Plus Jakarta Sans Variable**

The site self-hosts the font through `@fontsource-variable/plus-jakarta-sans`.

Primary stack:

```css
"Plus Jakarta Sans Variable",
"Hiragino Sans",
"Yu Gothic",
Meiryo,
ui-sans-serif,
system-ui,
sans-serif
```

Japanese glyphs fall back to the installed Japanese system fonts so the site does not need to ship a large Japanese webfont by default.

## Semantic font tokens

Defined in `src/styles/global.css`:

- `font-brand` — visual identity
- `font-heading` — headings
- `font-body` — long-form text
- `font-ui` — controls and interface text
- `font-sans` — compatibility/default alias

They currently all point to the same family. Components should not hardcode font-family declarations.

## Usage

For now, most components can continue using `font-sans` inherited from the page body. Use semantic font utilities only when a component genuinely needs an explicit role.

Typography should remain stable across committee periods unless the organization intentionally refreshes its long-term visual identity.
