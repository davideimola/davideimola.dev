# CLAUDE.md — davideimola.dev

AI context for Claude Code and other AI assistants working on this codebase.

## Editorial home: content-os

Editorial planning (ideas, the Pipeline, channel decisions, lifecycle) lives on **[`davideimola/content-os`](https://github.com/davideimola/content-os)**, not here. This repo is the **blog Factory**: it holds **artifacts** (the posts in `src/content/blog/`, the blog PRs) that reference the owning **content-os Pipeline Piece** — a Supabase record reached through the **`content-os-capture` MCP server**, no longer a GitHub issue (ADR-0014). An accepted Idea spawns one **Piece** per channel (ADR-0011); this repo produces the blog Piece's artifact, and the content-os Pipeline Piece stays the single source of truth every editorial-lifecycle skill reads context from and writes outcomes to (ADR-0012, ADR-0015). The writing skills here (`write-blog-post`, `social-post`) read and write those Pipeline Pieces through the MCP server (never `gh` against content-os); a blog PR lives here but carries its content-os Piece id and is handed back with `set_piece_artifact`. **Do not open editorial or content-planning issues on this repo**: capture them on content-os with the `/idea` skill (or the `capture_idea` MCP tool).

## Agent skills

### Issue tracker

Engineering issues (site code, bugs, features) live on GitHub Issues at `davideimola/davideimola.dev` via the `gh` CLI. Editorial / content-planning issues go to `content-os`, not here. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical roles: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Stack

- **Framework:** Next.js 16 (App Router), TypeScript strict
- **Styling:** Tailwind CSS v4 (CSS-first config in `src/app/globals.css`)
- **Animations:** `motion/react` (the new name for framer-motion v12) — import from `"motion/react"`, never from `"framer-motion"`
- **Components:** Custom design system + shadcn/ui where appropriate
- **Typography:** `@tailwindcss/typography` — use `prose` class for all long-form/MDX content
- **Linting/Formatting:** Biome (`biome.json`) — no ESLint, no Prettier
- **Testing:** Vitest + Testing Library + jsdom
- **Storybook:** `@storybook/nextjs-vite` (Vite builder)
- **Package manager:** pnpm (never npm or yarn)
- **Tooling:** mise (`.mise.toml`) — Node 22, pnpm 10.32.1

## Commands

```bash
pnpm dev           # Start Next.js dev server (Turbopack)
pnpm build         # Production build (TypeScript errors are fatal)
pnpm start         # Run production server
pnpm lint          # Biome check (lint + format)
pnpm lint:fix      # Biome check with auto-fix
pnpm format        # Biome format only
pnpm test          # Vitest run (single run)
pnpm test:watch    # Vitest in watch mode
pnpm test:coverage # Vitest with coverage report
pnpm storybook     # Storybook dev server on port 6006
pnpm build:storybook # Build Storybook static output
pnpm cv:pdf        # Regenerate public/cv.pdf from the real /cv page (never part of pnpm build)
pnpm shelf:snapshot # Refresh src/content/shelf.fallback.json from the live tsundoku library (never part of pnpm build)
```

## Design Tokens

All tokens are CSS custom properties in `src/app/globals.css`. Use them via Tailwind classes:

| Token | Value | Tailwind class |
|-------|-------|----------------|
| `--bg` | `#080807` | `bg-bg` |
| `--bg-card` | `#0F0E0D` | `bg-bg-card` |
| `--bg-hover` | `#141311` | `bg-bg-hover` |
| `--border` | `#1C1A18` | `border-border` |
| `--border-mid` | `#252220` | `border-border-mid` |
| `--border-hover` | `rgba(201,31,55,0.30)` | `border-border-hover` |
| `--text-1` | `#EAE5DF` | `text-text-1` |
| `--text-2` | `#9A948E` | `text-text-2` |
| `--text-3` | `#7E7874` | `text-text-3` |
| `--accent` | `#C91F37` (Akane Red) | `text-accent`, `bg-accent` |
| `--accent-hover` | `#a8192e` | `bg-accent-hover` |
| `--accent-glow` | `rgba(201,31,55,0.12)` | `bg-accent-glow` |

## Typography

- **`font-mono`** → JetBrains Mono — use for headings, UI elements, labels, code
- **`font-sans`** → IBM Plex Sans — use for body text, descriptions

Apply with Tailwind: `font-mono`, `font-sans`

## Print Rendering

`/cv` prints straight from the browser, and the printed page is the **same markup** as the screen page: no second layout, no `PrintCv` clone. Only the ground inverts; the Akane Red accent and both brand fonts survive onto paper.

- **Palette:** `print:light-ground` on `<body>` (`src/app/layout.tsx`) redefines the ground tokens for print media. The `@utility light-ground` that holds them lives in `globals.css` next to the dark ones. Because tokens are declared with `@theme inline`, every `bg-bg` / `text-text-1` / `border-border` utility re-themes at once. It has to sit on `<body>`, not `<html>`: utilities are in the `utilities` cascade layer, so the unlayered `:root` block would win on the same element.
- **Chrome:** anything screen-only carries `data-print-hide`. `Button` and `ButtonLink` both set it, so a control built the repo's way needs no rule of its own; the NavBar and Footer set it too. Raw `<button>` elements are dropped as well. Both rules live in the `@media print` block in `globals.css`.
- **Layout:** paper keeps the two rails. The sheet is narrower than `lg`, so the desktop grid does not reach it and the print variant states its own track (`print:grid print:grid-cols-[1fr_288px]`). The grid sits on the **outer** wrapper with `print:contents` on the inner one, so the hero is a cell of it and the aside starts level with the name: nested under the hero, Chromium pushed the whole row to sheet two and left sheet one holding just the name.
- **Column split:** the left rail is the **paid** history and nothing else (Experience, Freelance work). Everything else lives in the **right** column, in this order: the aside card, Selected talks, Events organised, Community & projects. One structure for both media on purpose: moving a section for print only would mean coordinating grid rows by hand, and that breaks as soon as an engagement type empties out and its section renders nothing.
- **The print track width is what balances the columns**, not the type size. The right column carries four blocks, so at the screen's proportions it ran past the fold while the left rail stopped two thirds down the sheet with nothing in it. Trading the width the left rail was not using is what fits the sheet at full 6.4pt: measured, 190px, 205px and 220px of aside all spill, 240px lands it.
- **`print:grid-rows-[auto_1fr]` is load-bearing.** The right column spans both rows, and Chromium grows *every* row a spanning item crosses when the item is taller than they are. With implicit rows that pushed ~87px into the hero's row and opened a band of blank paper between the headline and the summary. Sizing row one to its content sends the excess under the history where it belongs.
- **`/cv` fits one A4 sheet, and it is at the boundary.** Density is one knob, `print:[zoom:0.66]` on the grid, which puts the body at 6.4pt; 0.68 spills onto a second sheet. `zoom` affects layout rather than rasterising, so the text stays selectable, and an aside track has to be stated pre-zoom (288 x 0.66 = 190px on paper). When the Record outgrows the sheet, trim what the sheet says rather than shrinking the type: under about 6pt it stops being readable. `pnpm cv:pdf` prints the page count, so measure rather than guess.
- **ATS constraints on `/cv`:** no tables, no images, and no text in page headers or footers, asserted by `pnpm cv:pdf`. Single column is **not** one of them: ADR-0003 trades it away for a readable sheet, so user story 18 of issue #98 is knowingly unmet.

## Responsive Design

**Responsiveness is a cardinal requirement.** This is a portfolio/showcase site visited on any device. Every component and section must work correctly at all breakpoints.

### Breakpoints (Tailwind defaults)
- Mobile-first: base styles target mobile (`< 640px`)
- `sm:` — 640px+ (large phones, small tablets)
- `md:` — 768px+ (tablets, used for desktop nav)
- `lg:` — 1024px+ (desktops)

### Rules
- Always design mobile-first: write base styles for mobile, then add `sm:`/`md:`/`lg:` overrides
- A component is NOT done until its responsive behavior has been considered and implemented
- Use `px-4 sm:px-8` for horizontal padding (not a fixed `px-8`)
- Navigation: hamburger menu on mobile (`md:hidden` / `hidden md:flex` pattern)
- Multi-column layouts: stack to single column on mobile (`flex-col sm:flex-row`, `grid-cols-1 md:grid-cols-2`)
- Do NOT use fixed pixel widths that could overflow on small screens

## Component Patterns

### File location
- `src/components/ui/` — atomic UI components (Button, Badge, Card, SectionHeader, PageHero, ScrollReveal, JsonLd, …)
- `src/components/layout/` — layout components (NavBar, Footer, SiteShell, CommandPalette)
- `src/components/sections/` — page-level section components
- `src/stories/` — Storybook stories (one file per component)

### Key components

**`PageHero`** — reusable hero header used on every page. Props: `command`, `title`, `description`, optional `children`, `className`.
```tsx
<PageHero command="ls ./projects" title="Projects" description="…" />
```

**`ScrollReveal`** — wraps content in a `motion.div` that fades+slides up when scrolled into view. Detects browser back/forward navigation via a module-level `popstate` listener and skips animations (`initial={false}`) in that case to avoid content being stuck at opacity:0.

**`SiteShell`** — client-side layout wrapper. Renders NavBar + CommandPalette (⌘K) + children. Used by the `(site)` route group layout, which also renders the Footer; standalone routes (e.g. `/links`) live outside the group and get no site chrome. Does NOT use AnimatePresence — wrapping Next.js App Router children in AnimatePresence with `mode="wait"` breaks page rendering.

**`JsonLd`** — injects `<script type="application/ld+json">` for structured data.

### Terminal command theme
Every page uses a terminal-style command as its hero label. Follow this pattern:
- Home: `❯ whoami`
- About: `❯ whoami`. **The trajectory is the whole page.** The `trajectory` phases in `src/content/cv.json`, resolved by `getTrajectory()`, are the narrative Register of the CV Record: a phase references the engagements it covers by slug and derives its period from them, so nothing about the professional history is hardcoded here and companies are named inside the prose. The dated list and the education live on `/cv`, linked from here exactly once.
  - **Stack, Community and What I'm exploring are gone as sections.** Their content is now each step's own: `tools` (names only, rendered as chips under the prose), `started` (engagement slugs the step set going, resolved loudly and deliberately *not* `covers`, which would drag the phase's period to today), `opened` (the current step's open questions), and `image`. The Record's `about` block holds the lead and the creed, which is the narrative Register's own content the way phase prose is.
  - **Two rails only where the second one has something.** A step carrying nothing but tools runs full width rather than sitting beside a blank column. Where the rail exists it holds what the step started or opened, never a photo as well: a place holds a photo or content, not both, and a photo is a full-width band belonging to its step.
  - Open Source Day and the talk total in "What it started" are **derived** (`getOrganisedEvents()` filtered to conference series, `getTotalTalkCount()`), so they cannot drift from `/sharing`. The meetups and the hackathon are deliberately left to `/cv`: here they would mix granularity in a three-item block.
  - Hobbies are the one thing not from the Record, and they close the page **outside** the story on purpose, which is what stopped them reading as bolted on. `/cv`, `/uses`, `/now` and `/shelf` are each linked exactly once, where the reader is already thinking about that thing: `/shelf` hangs off the hobbies, because that is where the reader is already thinking about what happens off the clock.
- Blog: `❯ ls ./blog`
- Projects: `❯ ls ./projects`
- Speaking: `❯ ls ./talks`
- Now: `❯ cat ./now.md`. Hand-written prose, plus one derived block: **On the shelf** (`ShelfNow` in `src/components/sections/`) reads the open passes through `getShowcase()` and groups them by the Type's `verbBase`, never by the slug. A verb with nothing open gets no band at all, so a month with five books and no game reads as deliberate; with nothing open anywhere the block renders nothing rather than an empty shell. It links `/shelf` once. The page is ISR hourly to match `/shelf`
- Uses: `❯ cat ./uses.md`
- Shelf: `❯ ls ./shelf`. Three blocks, in this order: what Davide is reading and playing, the verdicts on what he finished or put down, and the pile. The page holds **no facts of its own**: it renders the showcase document served by [tsundoku](https://github.com/davideimola/tsundoku) (`GET /api/showcase`, bearer token, optional `?types=`), read through the single seam in `src/lib/shelf.ts`, which stores the response `ETag` and sends `If-None-Match` so an unchanged revalidation costs a 304 and no body. Judgements first, the pile last. Which block a pass lands in comes from the Type's verbs and never from the slug: the Type carries both `verb` (the past participle, `played`) and `verbBase` (the bare verb, `play`), and the heading is built from `verbBase`, because *played* cannot be bent into *Playing*. `medium` is a `{ slug, label }` pair and only the label is ever printed. **A rating is a score and nothing else**: the owner's written review stays private in tsundoku and must never be rendered here, so the verdicts block carries weight through the score, the outcome and the dates alone, with an abandonment as its loudest row. **`finished` is a `{ count, recent }` block, shaped like `pile` and `shelf`**: `count` is every verdict in the library, `recent` the sample the page renders. tsundoku sends only the passes carrying a verdict (a `rating`, or an `outcome` of `given-up` even with no score, because an abandonment is a judgement without a number), capped at 12, most recent first and undated last. The page renders `recent` as it is sent and must never filter, sort or slice it for itself; the "Showing 3 of 41" line under the rows is the same line the wall carries, and it disappears entirely when the count equals the rows shown, because "3 of 3" is noise. The intro copy therefore no longer claims a number of its own: it says only the judged passes land here and that they run newest first *where a date was recorded*, which is the hedge the real library needs (about seven verdicts today, none of them dated). Every schema object here is non-strict, so a field tsundoku grows later is dropped rather than failing the document. `progress.unit` is the model's own word, `instalments`, which reads oddly in public, so the visible text is a bare ratio (`7 / 20`) and the full sentence lives in the accessible label. Covers are hotlinked 128px images rendered with a plain lazy `<img>`, never `next/image`, because the site does not pay to optimise images it does not own; where `cover.at` is present the tile **must** link to it (tsundoku's ADR-0013: the lookup provider asks for a prominent link back), and a cover-less entry draws its Series tint, one ready-to-use `oklch()` string fed straight to the tile. Nullability is ordinary, never an error: `startedAt` and `endedAt` can be null, and a shelf volume can have a null `type` (an uncatalogued object is a gap the library shows), which belongs to the wall's `All` filter and to no Type filter. `shelf.byType` lists every Type tsundoku knows, zero counts included, and **a zero-count Type gets no chip**: filtering on it would land on an empty wall. Videogames are always one of those zeros, structurally rather than by accident: the wall is the Collection, objects in the house, and in tsundoku's model a videogame carries no Volume (its ADR-0021). **The wall does not argue that case**: its one line names what the wall is ("Books on my shelf at home, one tile per volume.") and nothing more, because the reasoning about what does or does not earn a Volume means nothing to a visitor. **The pile, by contrast, does hold videogames**, so no copy anywhere may call it a stack of volumes. **Nor may any copy call it things bought and never started**, which is what it used to say and is wrong twice over: in tsundoku's model the Pile is *what to take on next*, two halves rather than one list. The head is what the owner pinned, in the order they pinned it; the reserve composes itself out of every Story still to read on an active Path, every open Want, every run with somewhere left to go, and the next missing Volume of every Series being collected. So it holds things the owner does **not** own (an open Want, a missing Volume) and things already **started** (a run mid-way). It is a queue, not a heap of unread purchases, and the copy on `/shelf`, the number's label (`queued`), the `pile` and `shelf` commands in `src/lib/terminal.ts` and the `/now` and `/links` blocks all say so. The word *tsundoku* stays in the copy exactly once, on `/shelf`, because it does mean the pile that keeps growing; it must not be used to claim anything was purchased. `pile.recent` is capped at 12 and `shelf.volumes` at 60 while `pile.count` and `shelf.total` are the real figures, so the page says `showing 60 of 412` out loud. **Every row that names a title carries `standsAt`**, `{ from, to, unit } | null` with `unit` one of `instalments` or `volumes`, on the entries of `now`, `finished.recent`, `pile.recent` and `shelf.volumes`. It is always a range: a single part arrives with both ends at the same value, an omnibus with the two it carries under one cover, and a standalone object (or a pass that went through no object) with `null`. The field is optional and `.catch(null)`, so the committed snapshot, which predates it, and a shape this site has never seen both parse. **It is data, and the site never composes it into display text.** Titles print exactly as the library sends them: the owner's titles already carry their numbers ("Slam Dunk 20"), appending would read "Slam Dunk 20 20", and the string match that avoided that held only until it met an odd title. `standsAt` stays in the contract because a number as data beats a number inside a string, and because an omnibus spans a range a title cannot express, but nothing renders it today. **A cover-less tile is labelled with the volume's title, never with the Series name ten objects share.** If a value from `src/lib/shelf.ts` is ever needed inside a client component, put it in a separate import-free module first: that module reads the filesystem for the snapshot, so importing a value from it drags `node:path` into the browser bundle (this is why `src/lib/shelf-label.ts` existed). Today every client reader of `shelf.ts` imports types only, which are erased. **The Type is named where a row would otherwise be anonymous**, per the Badge rule: a Badge pill under each of the twelve pile rows, but not on the wall, where sixty pills would drown the densest block on the site. There each tile carries a 9px mono Type line instead, which disappears under a filter because the chip above already says it, and an untyped volume reads "Uncatalogued". `wish` is tolerated by the schema and deliberately has no UI. ISR, hourly (`revalidate = 3600`). It is not the only reader of the library: `/now`, `/links` and `/terminal` each render a compact block out of the same `getShowcase()` seam, never a second fetch. **Degrades instead of failing:** a missing env var, an unreachable API, a non-2xx or a body that does not match the contract all fall back to the committed snapshot `src/content/shelf.fallback.json`, and the page says so in the header. That snapshot is a real capture of the library refreshed by hand with `pnpm shelf:snapshot`, so a cold build publishes the owner's actual shelf rather than plausible-looking fiction; the invented document is a test fixture in `src/test/shelf-fixture.ts` and the page has no way to reach it. **The cover wall is built and deliberately not rendered.** `ShelfWall` and `CoverTile`, their stories and `ShelfWall.test.tsx` all stay in the repo, tested, with `/shelf` importing only `CoverTile`; do not delete them and do not re-add the wall to the page on a whim. It came off because the block only pays for itself with a complete library and today the library is not one: about half the volumes have no cover, many carry no Type, and the filter is broken from the API side rather than this one, since the chips count the whole collection (`shelf.byType`, 102 volumes and up) while the wall is handed a 60-volume sample (`shelf.volumes`), so a Type holding one rare volume shows a chip reading 1 and filters to nothing. Three things have to be true before it returns: most volumes have covers, most have a Type, and tsundoku either sends the counts for the sample it actually sends or sends the whole collection
- CV: `❯ cat ./cv.md` — dense Rendering of the CV Record (`src/content/cv.json`, read through `src/lib/cv.ts`). Wide left rail: Experience, Freelance work, then Community & projects (the Volunteering engagements plus the projects the Record names by slug). Narrow right column: the contact/skills/education/open-source card, then Selected talks and Events organised. Every talk, project and organised event is referenced by slug and resolved from `talks.json` / `projects.json`, so nothing about them is restated here and an unknown slug throws at build time. Indexable and in `sitemap.ts`, deliberately absent from NavBar and Footer
- Contact: `❯ ping davideimola.dev`
- Newsletter: `❯ ls ./newsletter` (archive index + subscribe form); single issue `/newsletter/[slug]` uses `❯ cat` in a Breadcrumb; post-confirmation landing `/newsletter/confirmed` uses `❯ cat ./welcome.md`
- Links: multi-command terminal session (`❯ whoami`, `❯ ls -t ./blog | head -n 1`, `❯ ls ./talks --upcoming`, `❯ cal --book`, `❯ ls ./schrodinger-hat`, `❯ ls ./shelf --now`) — standalone link-in-bio page living outside the `(site)` route group, so it renders without NavBar/Footer even when reached via rewrite; `links.davideimola.dev` serves this page directly via a host-based rewrite in `next.config.ts` (deep paths on the subdomain redirect to the main site); revalidates hourly (ISR) so the time-based blocks turn over without a deploy. The shelf block caps each verb at three rows and disappears entirely when nothing is open. **`❯ rate --talk` is the conference-day block**: it renders only while a talk's rating window is open and sits **first on the page** while it does, above the latest post, because this page is what the closing slide's QR points at and nobody in the room scrolls
- Terminal: `❯ ssh guest@davideimola.dev` — a REAL interactive shell at `/terminal`: the visitor types commands and the site answers. Pure command engine in `src/lib/terminal.ts` (unit-tested, no React/browser APIs), client component `InteractiveTerminal` in `src/components/sections/`, data (posts/talks/projects/shelf) injected by the server page. The library adds `shelf`, `reading`, `playing` and `pile`, plus `ls ./shelf`, all fed by `getShowcase()` from the page; `TerminalData.shelf` is optional and when it is absent those commands are not registered at all (no help row, no `shelf/` in `ls`, no completion, and typing one answers "command not found"), because a shell that apologises is worse than one that never had the command. `rate` follows the same optional pattern through `TerminalData.ratings`: outside a rating window it is not a command at all. Includes easter eggs (`sudo`, `rm`, `nmap`, `argus`, `vim`, `ssh`, `ping`); an `ask` AI command (Gemini free tier) is planned but not built. Linked from footer and 404; revalidates hourly (ISR), following the library rather than the talks

### Rules
- Every component in `src/components/ui/` and `src/components/layout/` MUST have a Storybook story
- Use Tailwind utility classes directly — avoid custom CSS unless absolutely necessary
- Prefer `font-mono` for anything that looks like UI/terminal text
- Akane Red (`text-accent`, `bg-accent`) is for accents only: hover states, active badges, decorative elements, `//` prefixes. Never use as a background fill for large areas
- **Tags vs categories**: tags (`post.tags`, `project.tags`, `talk.tags`) are always rendered as `#xxx` in `font-mono text-[11px] text-text-3`. Badge pills are reserved for categories, status labels (Featured, Coming soon), and type classifications (Conference, Meetup). Never use Badge pills for tags.
- Dot grid background: defined in `globals.css` as `body::before`. Use `.dot-grid` utility class for other elements
- Card hover glow: `after:bg-accent-glow after:opacity-0 hover:after:opacity-100` pattern
- Blog post hero images: rendered at 60% desaturation with full-color reveal on hover (`grayscale-[0.6] transition-[filter] duration-500 hover:grayscale-0`). New hero images must look good both muted and in full color — dark scenes with Akane Red glow work best. Portraits (home, AuthorBio) stay full `grayscale` by design

### "use client" directive
Only add `"use client"` when the component needs interactivity (event handlers, hooks). Most layout and UI components do not need it.

## Animations

- Use `motion/react` (not `framer-motion`) for all animations
- `ScrollReveal` handles scroll-triggered fade+slide for section content
- `HeroSection` uses CSS `@keyframes fadeUp` directly (not ScrollReveal) with a module-level `hasAnimated` flag to skip on revisits
- `reactStrictMode` is set to `false` in `next.config.ts` — React's double-mount in dev mode resets framer-motion's IntersectionObserver state, causing a flash of invisible content
- Do NOT wrap Next.js App Router `children` in `AnimatePresence mode="wait"` — it blocks page rendering

## SEO & Metadata

- Dynamic OG images: `/og?title=…&category=…` via `src/app/og/route.tsx` (uses `ImageResponse`, requires TTF fonts in `public/fonts/`)
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`
- RSS feed: `src/app/rss.xml/route.ts`
- JSON-LD structured data via `<JsonLd>` component in each page
- LLM-ready (llms.txt convention, builders in `src/lib/llms.ts`): `/llms.txt` (index), `/llms-full.txt` (all posts inlined), and each post as raw Markdown at `/blog/[slug].md` — served by `src/app/blog-md/[slug]/route.ts` via an `afterFiles` rewrite in `next.config.ts`. Post pages advertise the Markdown version via `alternates.types`

## What NOT to do

- The newsletter is now built per ADR-0002 (hybrid model, Kit delivery, in-repo content): the `/newsletter` archive + subscribe form, the `SubscribeForm` component, the subscribe action, and the Kit client all exist. Do NOT reintroduce a "no newsletter UI" assumption. (Historically this repo banned newsletter UI; ADR-0002 lifted that.)
- Do NOT use tRPC — use Server Actions for mutations
- Do NOT set `ignoreBuildErrors: true` in `next.config.ts`
- Do NOT use npm or yarn — always pnpm
- Do NOT add inline styles when Tailwind classes exist
- Do NOT use ESLint or Prettier — Biome handles both
- Do NOT create new CSS files — extend `globals.css` or use Tailwind
- Do NOT use `@media (prefers-color-scheme: dark)` — the site is dark-only
- Do NOT use Geist fonts — use JetBrains Mono + IBM Plex Sans
- Do NOT import from `"framer-motion"` — use `"motion/react"`
- Do NOT wrap layout children in `AnimatePresence mode="wait"` — breaks Next.js App Router

## Environment Variables

```env
RESEND_API_KEY=                  # Resend API key for contact form
NEXT_PUBLIC_GISCUS_REPO_ID=      # from https://giscus.app
NEXT_PUBLIC_GISCUS_CATEGORY_ID=  # from https://giscus.app
NEXT_PUBLIC_UMAMI_WEBSITE_ID=    # from https://cloud.umami.is (Settings → Websites → Edit); empty = no analytics
TSUNDOKU_API_URL=                # origin of the tsundoku instance behind /shelf; empty = committed snapshot
TSUNDOKU_BEARER_TOKEN=           # tsundoku read-only API token; server-side only, never NEXT_PUBLIC_
                                 # both are also what `pnpm shelf:snapshot` reads to refresh the committed snapshot
```

## Analytics

Web analytics use **Umami Cloud** (free Hobby tier), not Vercel Web Analytics — see `docs/adr/0001-switch-analytics-to-umami-cloud.md`. The `UmamiAnalytics` component (`src/components/analytics/`) renders a cookieless tracker script in the root layout, proxied first-party (script **and** the `/api/send` collection endpoint) through the `/relay/*` rewrite in `next.config.ts` so ad blockers can't match `cloud.umami.is`. Keep the `/relay` path in sync between `UMAMI_PROXY_PATH`, the rewrite source, and the `redirects()` exclusion in `next.config.ts`. **Known trade-off:** because events reach Umami from the Vercel edge node, Umami geolocates every visitor's *country* to that region (e.g. Frankfurt), not the real visitor — an unavoidable limit of Umami Cloud behind a proxy (`umami#3478`); forwarding `X-Forwarded-For` from a route handler was tried and does not help (Cloud ignores it). Referrers and UTM params are unaffected (they travel in the event payload, not the IP). Vercel **Speed Insights** (`@vercel/speed-insights`) is a separate product and stays. Renders nothing when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is unset.

## Content sources

- Blog posts: `src/content/blog/` (MDX files)
- Talks: `src/content/talks/` (MDX or JSON). A talk may carry `feedback: { url, from?, until? }`, the audience rating link (emblema.live, or the conference's own tool: the URL is arbitrary and the visible hint is derived from its hostname, so a new provider is one URL and never a lookup table). **The window is the whole point: set it once and no surface is ever edited on the day.** It opens on the talk's date and closes `FEEDBACK_WINDOW_DAYS` (7) later, inclusive, unless `from` / `until` override it. The rule lives in `src/lib/talk-feedback.ts`, which is import-free on purpose so `TalksList` (a client component) can read it without dragging `node:path` into the browser bundle; `getFeedbackOpenTalks()` in `content.ts` is the server-side seam. Three surfaces read it and none has a date rule of its own: the `❯ rate --talk` block on `/links`, a "Rate this talk →" link on the `/sharing` card, and the `rate` command in `/terminal`
- Projects: `src/content/projects/` (MDX or JSON)
- CV Record: `src/content/cv.json` — the single source of truth for the professional history. Every Rendering (`/cv` today, the PDF later) derives from it through `src/lib/cv.ts` and holds no facts of its own. Public contact only: no phone number, no home address, no fiscal code, ever. `selectedTalks` holds slugs only: a talk is described once, in `talks.json`, and `getSelectedTalks()` throws on an unknown slug so a rename breaks the build instead of quietly emptying the section
- Shelf fallback: `src/content/shelf.fallback.json`, the committed snapshot `/shelf` renders when tsundoku is unreachable. **It is real data, never a fixture**: it is taken from the live library with `pnpm shelf:snapshot`, which validates the response through the same Zod schema the page reads with and refuses to write anything that does not validate or when the env is missing. That makes refreshing it a deliberate act, run by hand and committed like any other content change; no build, deploy or revalidation ever writes the file, exactly like `pnpm cv:pdf`. It carries the library as it is, sparse blocks included: never top it up, prettify it or invent rows, because a thin section on a cold build is information the owner wants. The invented document lives on the test side instead, in `src/test/shelf-fixture.ts`, where `readContentJson` cannot reach it: the tests and the Storybook stories are written against that fixture, and the page and `getShelfFallback()` only ever reach the real snapshot
- JSON content files are read through `readContentJson` in `src/lib/content-json.ts`

## Blog post categories

Use exactly these categories — do not invent new ones without updating this list:

| Category | When to use |
|----------|-------------|
| `Technical` | Engineering, code, tools, infrastructure, security, DevOps |
| `Personal` | Retrospectives, reflections, personal growth |
| `Leadership` | Tech lead, team culture, engineering management *(use when content exists)* |
| `Open Source` | Community building, OSS contributions, Schrodinger Hat *(use when content exists)* |

Start with `Technical` or `Personal` for new posts. Add `Leadership` or `Open Source` only when you have actual content for them.

## MDX content conventions

### Heading hierarchy

The blog post page template renders the post `title` as `<h1>`. Therefore, **MDX content must never use `#` (h1) headings**. Always start from `##` (h2) and go deeper:

- `##` → main sections
- `###` → subsections
- `####` → nested subsections (use sparingly)

This ensures correct document outline, accessibility (single h1 per page), and proper ToC generation.

## Blog post features

Each blog post page (`/blog/[slug]`) includes these features below the article content:

| Feature | Component | Type |
|---------|-----------|------|
| Author bio | `AuthorBio` | Server |
| Share buttons (BlueSky, LinkedIn, copy link) | `ShareButtons` | Client |
| Prev/next navigation | `PostNavigation` | Server |
| Related posts (by tags + category) | `RelatedPosts` | Server |
| GitHub Discussions comments | `GiscusComments` | Client |
| Back to top (floating, appears at 400px scroll) | `BackToTop` | Client |

### Giscus configuration

Comments use [giscus](https://giscus.app) backed by GitHub Discussions on `davideimola/davideimola.dev`. Configure via environment variables:

```env
NEXT_PUBLIC_GISCUS_REPO_ID=      # from https://giscus.app
NEXT_PUBLIC_GISCUS_CATEGORY_ID=  # from https://giscus.app
```

Set the Discussion category to **Announcements** and enable Discussions on the repo.

### Related posts algorithm

`getRelatedPosts(slug, count)` in `src/lib/content.ts` scores posts by:
- 2 points per shared tag
- 1 point for same category

Returns top `count` posts with score > 0, excluding the current post.
