# Design System

The visual language comes from the brand repo ([davideimola/brand](https://github.com/davideimola/brand), see [brand.md](./brand.md) and ADR-0004). This file is how the site applies it.

## Philosophy

Light, human, precise. Two inks on a paper ground, plenty of white space, a hairline as the only divider. Three graphic elements and nothing else: **the marker** (one rough red stroke per page), **the tape** (label-maker tape for sections and content types) and **the rule** (an ink hairline). No terminal dressing.

## Themes

Light is the default. Dark follows `prefers-color-scheme`; `ThemeToggle` pins a choice per browser (`src/lib/theme.ts`, applied before first paint by an inline script). Print is always light.

## Tokens

All values come from `@davideimola/brand/tailwind.css`. Use the utilities, never hex values.

| Token | Light | Dark | Utilities |
|-------|-------|------|-----------|
| `bg` | paper `#F7F5F0` | night `#13151C` | `bg-bg` |
| `fg` | ink `#1C2233` | chalk `#ECE9E2` | `text-fg`, `bg-fg`, `border-fg` |
| `fg-body` | `#2A3042` | `#D6D3CC` | `text-fg-body` (long-form text) |
| `fg-muted` | `#3B4152` | `#B4B2AC` | `text-fg-muted` (secondary) |
| `fg-subtle` | `#5B6070` | `#8E8C86` | `text-fg-subtle` (meta) |
| `border` | `#DEDCD5` | `#2C3040` | `border-border` (hairlines) |
| `surface` | `#FFFFFF` | `#1B1E27` | `bg-surface` (cards, code) |
| `surface-inline` | `#EDEAE3` | `#262A35` | `bg-surface-inline` (inline code, pills) |
| `accent` | akane `#C91F37` | `#E0475C` | knot and marker only; `hover:text-accent` on links |
| `tape-bg` / `tape-fg` | ink / paper | chalk / night | the Tape component |

**The red rule.** Red belongs to the knot and the marker. Links may turn red on hover; code keywords may be red. No red buttons, tapes, badges, borders or backgrounds.

## Typography

| Family | Utility | Use |
|--------|---------|-----|
| Schibsted Grotesk | `font-sans` | Titles and all running text |
| IBM Plex Mono | `font-mono` | Code, dates, metadata, small labels |
| Barlow Condensed 700 | `font-label` | Tape labels only, uppercase |

Scale (as Tailwind text utilities in `globals.css`): `text-display` 80/0.98, `text-h1` 64/1.02, `text-h2` 32/1.15, `text-h3` 24/1.2, `text-lead` 22/1.5, `text-body` 19/1.7, `text-small` 15/1.5, `text-meta` 14/1.6, `text-label` 15. Display and h1 step up from a smaller size on phones (`text-[44px] sm:text-[64px] lg:text-display`).

## Components

- **Tape** (`ui/Tape.tsx`) — ink tape, flat, `tilt` 0/1/2 cycles -1deg, 1deg, -0.5deg. Alternate between neighbours; one tape per block; never stacked; never red. Use as a section heading via `as="h2"` (SectionHeader does this).
- **Marker** (`ui/Marker.tsx`) — wrap the one word that matters most. One per page. Draws once on first view, instant under reduced motion. On a card, set `[--marker-halo-color:var(--di-surface)]`.
- **Mark / Wordmark** (`ui/BrandMark.tsx`) — never typeset the name; switch cut instead of shrinking.
- **Button / ButtonLink** — `primary` (filled ink, at most one per view), `ghost` (outlined ink), `link` (underlined text, red on hover). Sizes `sm`, `md`, `lg`. Both set `data-print-hide`.
- **Card** — straight, `bg-surface` plus hairline, hover darkens the hairline. Optional `tape` on the top-left edge.
- **Badge** — status pills only (Coming soon, Conference, roles). Never for section labels (tape) or tags (`#tag` in mono).
- **SectionHeader** — tape plus an optional mono "see all" link.
- **PageHero** — tape `label`, h1, lead. Every page uses it.
- **NavBar** — sticky, S mark plus bold wordmark, four sans links (Writing, Built, Talks, About), current page in ink with a 2px underline, search, theme toggle, mobile menu behind a 44px ink-framed button.
- **Footer** — ink hairline, S mark with name and place, the personal pages (Now, Uses, Shelf, CV, Contact) and the profiles in mono, a quieter row of site links. No newsletter form.
- **PostCover** — a post's cover at 16:9 in a hairline frame, unfiltered; SVG covers skip the optimiser.
- **SubscribeForm** — `full` (the /newsletter hero), `inline` (joined field and button), `compact` (stacked).

## Article

`/blog/[slug]`: tape with the category, h1, lead (the excerpt), mono meta line, an ink hairline, then a 700px reading column with the ToC on the right. Prose (in `globals.css`): body 19/1.7 in `fg-body`, sans titles, ink links with red on hover, quotes set large with a small ink square instead of a side bar, inline code on `surface-inline`, code blocks on `surface` with a 1px border and a mono title bar. At most one marker in a whole piece.

## Photography and covers

Portraits and photos of people are black and white (`grayscale`). A tape may sit on a photo's edge; the mark never sits on a photo.

Blog covers are monoline ink illustrations on paper with exactly one red detail, shown as they are (see CLAUDE.md, Rules).

## Spacing and layout

- Container: `max-w-[1136px] mx-auto px-4 sm:px-8`
- Page top padding (under the sticky NavBar): `pt-12 md:pt-16`
- Section padding: `py-20`, separated by `border-t border-border`
- Mobile-first always: base styles for phones, then `sm:` / `md:` / `lg:`.

## Motion

- `motion/react` for scroll reveals; CSS transitions of 150ms for colour and border.
- The marker draws once (~500ms). Nothing blinks, nothing loops.
- `prefers-reduced-motion` collapses every animation and transition (`globals.css`).
- Never `transition-all`.
