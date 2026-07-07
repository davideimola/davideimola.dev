# Brand

The personal mark for davideimola.dev. One concept, three lockups, all derived
from the site's design system (JetBrains Mono + Akane Red on near-black).

## Concept

The mark is the end state of the homepage hero typing animation: the name has
just been typed, the red cursor is still there. `di` + cursor reads as "just
typed, still writing".

## Assets

All assets live in `public/brand/` as outlined SVG paths — no font dependency,
safe to use anywhere (READMEs, stickers, external tools).

| Asset | File | Use |
|-------|------|-----|
| Mark, dark tile | `mark.svg` | Avatars, stickers, app icons |
| Mark, light tile | `mark-light.svg` | Light surfaces |
| Mark, mono | `mark-mono.svg` | Single-color contexts — inherits `currentColor` |
| Wordmark | `wordmark.svg` | `davide imola` + cursor, light ink for dark surfaces |
| Wordmark, dark ink | `wordmark-dark.svg` | Same, for light surfaces |
| Domain lockup | `domain.svg` | `davideimola` + red `.dev`, light ink for dark surfaces |
| Domain lockup, dark ink | `domain-dark.svg` | Same, for light surfaces |

Regenerate the SVGs with `python3 scripts/generate-brand.py` (requires
`fonttools`: `python3 -m venv .venv && .venv/bin/pip install fonttools`),
then the PNG exports (`mark-512/1024.png`, `wordmark-1200.png`, …) with
`pnpm brand:png`.

The assets are publicly downloadable at
[davideimola.dev/brand](https://davideimola.dev/brand) and licensed under
CC BY-ND 4.0 — see `public/brand/LICENSE.md`. The license covers the brand
assets only, not the site's source code.

## Construction

- Type: JetBrains Mono Bold, lowercase, 0.6 em monospace advance.
- Cursor bar: 0.14 em wide, 0.86 em tall, top at 0.78 em above the baseline
  (it slightly crosses it), 0.10 em gap after the last glyph. Always Akane Red.
- Mark tile: glyphs at ~34% of tile height, optically centered. The air is
  deliberate — circular avatar crops eat the edges.
- Favicon cut (`src/app/icon.svg`, `apple-icon.tsx`): same mark scaled to
  ~80% of the square's width. Favicons are never cropped, and at 16 px the
  tile's padding would make the glyphs illegible.
- Ink: `#EAE5DF` on `#080807` (dark), `#1A1816` on `#F0EDE9` (light).

## Rules

- The cursor is always `#C91F37` — never recolor it, never drop it.
- The cursor may blink in animated contexts (1.1s `step-end`, like the site);
  respect `prefers-reduced-motion`.
- Domain lockup: name in the context's ink (`#EAE5DF`, or `#9A948E` when the
  lockup must stay quiet), `.dev` always red.
- Don't prepend the old `~/` form to the mark or wordmark.
- Minimum sizes: mark 16 px (favicon), wordmark ~120 px wide.

## Where it's applied

- `src/app/icon.svg` — favicon (dark/light via `prefers-color-scheme`)
- `src/app/apple-icon.tsx` — iOS home-screen icon
- `src/app/og/route.tsx` — OG image footer signature (`davide imola` + cursor)
- `src/app/api/bluesky-cover/route.tsx`, `src/app/api/linkedin-cover/route.tsx`
  — social covers (domain lockup top-left, name + cursor as hero)
- `src/components/layout/NavBar.tsx` — wordmark form as site logo
  (`davideimola` + cursor, pairing with the mark)
- `src/app/brand/page.tsx` — public brand page with downloads and license
- `.claude/skills/social-post/SKILL.md` — carousel slide anatomy

The domain lockup is reserved for contexts where the address itself is the
signature: the OG image path, the social covers' top-left corner, and the
carousel slides. The brand signature everywhere else is the cursor.
