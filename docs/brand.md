# Brand

The brand is not defined here. Its single source of truth is the brand repository:
**[github.com/davideimola/brand](https://github.com/davideimola/brand)** (installed as
`@davideimola/brand`). Read its `docs/brand.md` before changing anything visual.
ADR-0004 records why.

What the brand repo owns:

- **Tokens:** `tokens/tokens.json`, built to `dist/css/tokens.css` (`--di-*` custom properties for light, dark and print) and `dist/css/tailwind.css` (the Tailwind v4 `@theme` mapping this site imports in `src/app/globals.css`).
- **The mark and the wordmark:** a `d` and an `i` drawn as a git graph, tied with a red knot, in three cuts (L from 96px, M from 40 to 95px, S below 40px) and three colourways; the wordmark in regular and bold; lockups; avatar; favicon.
- **The guidelines:** positioning and voice, colour, typography, the three graphic elements (marker, tape, rule), photography, site, slides and social cards.

## How this site uses it

| Where | What |
|-------|------|
| `src/app/globals.css` | Imports `@davideimola/brand/tailwind.css`; adds the next/font wiring, the type scale, the `dark:` variant, prose, Prism and print rules |
| `src/components/ui/brand-geometry.ts` | The mark and wordmark geometry, copied from the brand repo's `src/geometry.mjs` (the package does not export it) |
| `src/components/ui/BrandMark.tsx` | `Mark` and `Wordmark`, drawn inline so strokes follow the theme and the knot stays red |
| `src/components/ui/Tape.tsx`, `Marker.tsx` | The tape and the marker |
| `src/lib/og.tsx` | Satori versions of the tape, mark and wordmark for the image routes |
| `public/brand/` | Every SVG and PNG, served for download from the speaker kit (`/sharing#speaker-kit`; `/brand` redirects there) |
| `src/app/icon.svg`, `src/app/apple-icon.png` | Favicon and iOS icon |

## Updating

1. Change the brand repo, run its `pnpm build`, push.
2. Here: `pnpm update @davideimola/brand` (or re-add `github:davideimola/brand`), then `pnpm brand:sync` to copy the assets, favicon and apple icon.
3. If the mark geometry changed, copy the new numbers into `src/components/ui/brand-geometry.ts`.

## License

The assets are CC BY-ND 4.0, see `public/brand/LICENSE.md`. The license covers the brand assets only, not the site's source code.
