# CLAUDE.md — davideimola.dev

AI context for Claude Code and other AI assistants working on this codebase.

## Editorial home: Trilium

Editorial planning (ideas, content topics, talks, channel decisions, lifecycle) lives in Davide's **Trilium** (trilium.davideimola.dev), not here, read and written through the `trilium` MCP server. It moved there from content-os on 2026-10-09 and from the Obsidian vault on 2026-10-19. Both are retired: never use the content-os MCP server, and never read or write the old Obsidian vault.

- **Conventions:** the Trilium note "Convenzioni per Claude" (`kg6Nk6GFhfZK`, under Sistema) is the authoritative schema. Read it before creating or moving notes. Note bodies are in Italian unless already in English. Never delete a note: move it to Archivio.
- **Content note** (`#type=content`, relation `~template` = Content Item `HtMZvVGrddyG`): **one note per topic**, not per channel, in the Contenuti collection (`l78292msrPRH`), titled by the topic (no channel suffix). The body opens with the original spark verbatim.
  - `#status`: `idea → in-progress → published` (or `archived`).
  - `#flagSide`: `flag | side`.
  - `#channels`: one label per channel, `blog | linkedin | talk`. Per channel a date (`#blogDate`, `#linkedinDate`, `#talkDate`, ISO) and a published URL (`#blog`, `#linkedin`, `#talk`). **A channel is published when its URL is set.** A second output on the same channel becomes its own note.
  - `#queue`: position in the writing queue (1 = next). `#artifact`: links to drafts, PRs, carousels (one label each, multi-valued).
- **Ideas**: `/idea` captures a spark into the Inbox (`oI6dJqP0hGHG`) as a content note with `#status=idea`; it moves to Contenuti once triaged.
- **Metrics**: "Metriche contenuti" (`W2z88t8D6i5L`). Hub: "Pipeline contenuti" (`I78vgbZLZnde`, Flag/Side, cadence floor).
- **MCP gotchas:** `edit_note_content` does not work on text notes: to change a body, `get_note_content`, edit the Markdown, and write it back whole with `set_note_content`, preserving everything else (links included). `set_attribute` **overwrites** an existing attribute with the same name (verified 2026-10-20), so it cannot add a second value to a multi-valued label (`#artifact`, `#channels`). Check `get_note` first: if the label is absent, set it; if it already has a different value, never call `set_attribute` on it. For `#artifact`, add the link instead to a `## Artifact` list at the end of the body. For `#channels`, ask Davide to add the label by hand in Trilium. Either way, tell him the exact `label=value`. A link to a missing note becomes a dead link: link only to notes that exist.

This repo is the **blog Factory**: it holds the **artifacts** (posts in `src/content/blog/`, the blog PRs, the `.carousel/` social copy) and the owning content note links to them through `#artifact`. The writing skills (`write-blog-post`, `social-post`, `newsletter-digest`) read the content note for context and hand the artifact back by setting its attributes. **Do not open editorial or content-planning issues on this repo**: capture them in Trilium with the `/idea` skill.

## Agent skills

### Issue tracker

Engineering issues (site code, bugs, features) live on GitHub Issues at `davideimola/davideimola.dev` via the `gh` CLI. Editorial / content-planning work goes to Trilium (see above), not here. See `docs/agents/issue-tracker.md`.

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
- **Brand:** `@davideimola/brand` (tokens, mark, guidelines) from github.com/davideimola/brand
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
pnpm brand:sync    # Copy the brand assets, favicon and apple icon from @davideimola/brand
pnpm covers:dark   # Write the dark-theme twin (cover-dark.svg) of every blog cover
pnpm shelf:snapshot # Refresh src/content/shelf.fallback.json from the live tsundoku library (never part of pnpm build)
pnpm skills:snapshot # Refresh src/content/skills.fallback.json from the skills repos on GitHub (never part of pnpm build)
```

## Brand and design tokens

The brand lives in its own repo, **[davideimola/brand](https://github.com/davideimola/brand)**, installed as `@davideimola/brand` (ADR-0004). Read its `docs/brand.md` before any visual change; `docs/brand.md` and `docs/design-system.md` here say how the site applies it. Never restate a brand value in this repo: change the brand repo and bump the dependency (`pnpm brand:sync` copies the assets, favicon and apple icon).

`src/app/globals.css` imports `@davideimola/brand/tailwind.css`, which maps the `--di-*` tokens onto Tailwind utilities:

| Token | Light | Dark | Tailwind class |
|-------|-------|------|----------------|
| `bg` | paper `#F7F5F0` | night `#13151C` | `bg-bg` |
| `fg` | ink `#1C2233` | chalk `#ECE9E2` | `text-fg`, `bg-fg`, `border-fg` |
| `fg-body` | `#2A3042` | `#D6D3CC` | `text-fg-body` |
| `fg-muted` | `#3B4152` | `#B4B2AC` | `text-fg-muted` |
| `fg-subtle` | `#5B6070` | `#8E8C86` | `text-fg-subtle` |
| `border` | `#DEDCD5` | `#2C3040` | `border-border` |
| `rule` | pencil `#94969B` | `#757475` | `border-rule`, `bg-rule` |
| `surface` | `#FFFFFF` | `#1B1E27` | `bg-surface` |
| `surface-inline` | `#EDEAE3` | `#262A35` | `bg-surface-inline` |
| `accent` | akane `#C91F37` | `#E0475C` | `fill-accent`, `stroke-accent`, `hover:text-accent` |
| `tape-bg` / `tape-fg` | ink / paper | chalk / night | used by `Tape` |

**Themes:** light is the default; dark follows `prefers-color-scheme`, and `ThemeToggle` pins a choice per browser (`src/lib/theme.ts`, applied before first paint by an inline script in the root layout). A `dark:` variant exists for the rare asset that cannot use a token. Print is always light.

## Typography

- **`font-sans`** → Schibsted Grotesk: titles and all running text
- **`font-mono`** → IBM Plex Mono: code, dates, metadata, small labels
- **`font-label`** → Barlow Condensed 700: tape labels only, always uppercase (the `Tape` component)

Loaded with `next/font/google` in `src/app/layout.tsx`. Type scale utilities in `globals.css`: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lead`, `text-body`, `text-small`, `text-meta`, `text-label`. The image routes and the CV PDF read static TTFs from `public/fonts/` (OFL licences in `public/fonts/licenses/`).

## Print Rendering

`/cv` prints straight from the browser, and the printed page is the **same markup** as the screen page: no second layout, no `PrintCv` clone. Paper is always the light palette, whatever the screen theme, and the ground prints white: the sheet is the paper, so the paper tint is never printed on top of it.

- **Palette:** the brand's `tokens.css` resets the palette to light for print, and a print block in `globals.css` outranks the brand's system-preference block (which would otherwise print dark on a dark-mode OS). Because the brand tokens are declared with `@theme inline`, every `bg-bg` / `text-fg` / `border-border` utility re-themes at once.
- **Chrome:** anything screen-only carries `data-print-hide`. `Button` and `ButtonLink` both set it, so a control built the repo's way needs no rule of its own; the NavBar and Footer set it too. Raw `<button>` elements are dropped as well. Both rules live in the `@media print` block in `globals.css`.
- **Layout:** paper keeps the two rails. The sheet is narrower than `lg`, so the desktop grid does not reach it and the print variant states its own track (`print:grid print:grid-cols-[1fr_288px]`). The grid sits on the **outer** wrapper with `print:contents` on the inner one, so the hero is a cell of it and the aside starts level with the name: nested under the hero, Chromium pushed the whole row to sheet two and left sheet one holding just the name.
- **Column split:** the left rail is the **paid** history and nothing else (Experience, Freelance work). Everything else lives in the **right** column, in this order: the aside card, Selected talks, Events organised, Community & projects. One structure for both media on purpose: moving a section for print only would mean coordinating grid rows by hand, and that breaks as soon as an engagement type empties out and its section renders nothing.
- **The print track width is what balances the columns**, not the type size. The right column carries four blocks, so at the screen's proportions it ran past the fold while the left rail stopped two thirds down the sheet with nothing in it. Trading the width the left rail was not using is what fits the sheet at full 6.4pt: measured, 190px, 205px and 220px of aside all spill, 240px lands it.
- **`print:grid-rows-[auto_1fr]` is load-bearing.** The right column spans both rows, and Chromium grows *every* row a spanning item crosses when the item is taller than they are. With implicit rows that pushed ~87px into the hero's row and opened a band of blank paper between the headline and the summary. Sizing row one to its content sends the excess under the history where it belongs.
- **`/cv` fits one A4 sheet, and it is at the boundary.** Density is one knob, `print:[zoom:0.66]` on the grid, which puts the body at 6.4pt; 0.67 still fits and 0.68 spills onto a second sheet (checked on 2026-10-14 after the brand restyle). `zoom` affects layout rather than rasterising, so the text stays selectable, and an aside track has to be stated pre-zoom (288 x 0.66 = 190px on paper). When the Record outgrows the sheet, trim what the sheet says rather than shrinking the type: under about 6pt it stops being readable. `pnpm cv:pdf` prints the page count, so measure rather than guess. With the 2026 brand fonts it still lands on one sheet (checked on 2026-10-14).
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

**`PageHero`** — reusable hero header used on every page: a tape `label`, the h1 `title`, the lead `description`, optional `children`, `tilt`, `className`.
```tsx
<PageHero label="Built by me" title="Projects" description="…" />
```

**`Tape`**, **`Marker`**, **`Mark` / `Wordmark`** — the brand's graphic elements (see `docs/design-system.md`). One `Marker` per page at most; tapes are never red and never stacked, and neighbouring tapes alternate `tilt`.

**`ScrollReveal`** — wraps content in a `motion.div` that fades+slides up when scrolled into view. Detects browser back/forward navigation via a module-level `popstate` listener and skips animations (`initial={false}`) in that case to avoid content being stuck at opacity:0.

**`SiteShell`** — client-side layout wrapper. Renders NavBar + CommandPalette (⌘K) + children. Used by the `(site)` route group layout, which also renders the Footer; standalone routes (e.g. `/links`) live outside the group and get no site chrome. Does NOT use AnimatePresence — wrapping Next.js App Router children in AnimatePresence with `mode="wait"` breaks page rendering.

**`JsonLd`** — injects `<script type="application/ld+json">` for structured data.

### Pages
The main pages were each redesigned on the brand (2026-10) and open with their own header: a tape naming the page, a display title with the page's one `Marker`, a lead. The secondary pages (privacy, newsletter/confirmed) use the generic `PageHero`. No shell commands: the terminal aesthetic was dropped in ADR-0004.

**Navigation:** the NavBar carries Writing (`/blog`), Built (`/projects`), Talks (`/sharing`) and About. Now, Uses, Shelf, Skills, CV and Contact, the profiles and RSS live in the footer (`FOOTER_PAGES`); the newsletter form is on the pages, not in the footer.
- Home: one story, in order: who (hero), what I build (BUILDING), what I write (WRITING), where I say it out loud (ON STAGE), the community I run (COMMUNITY), one way to keep in touch (newsletter). The hero is the display headline with the page's one marker on "security", a lead naming the BUILDING project as the proof of the headline ("and in the open I build Argus", linked to its repo), one ink button and no second link (About is in the NavBar), the place in mono, the black-and-white portrait with its tape. The four bands open the same way through `HomeBand` (pencil rule, tape, title, one link to the full page), with modest spacing because the rule, tape and title already mark a block. BUILDING is `pickBuildingProject` (the active flagship first): description, its `highlights` from `projects.json`, the `quickstart`, the repo and "Why I built it" (the project's `post`, whose cover draws itself here through `DrawnCover`; an unknown `post` slug throws), then the active `personal` projects in one mono line. WRITING lists the latest four posts as the ruled rows of `/blog` (date, title, topic, reading time, cover thumbnail on wide screens), with the `topicCounts` links into `/blog?topic=` above them. ON STAGE is titled with the Record's creed (the stage is where the sharing happens): always three talk cards of one fixed shape (`pickStageTalks`: the next talks, marked Next, topped up with the latest given; the title always takes two lines, reserved or clamped), then `pickSpokenAt` and "Invite me to speak" to the speaker kit. COMMUNITY ("Open source, in person.") presents Schrodinger Hat, the association Davide co-founded and runs, with what it organises under it: the organised talks whose `host` is its slug, folded by `organisedByKind`, the conference linking to the project that is `partOf` it (Open Source Day is one of its events, not a community of its own; the AI for Security Hackathon was RedCarbon's and stays out), beside the Open Source Day photo. ISR hourly. How I Work, By Topic and the three cards under the hero were retired in October 2026, and the planned AI and security community stays off the site until it is more than a quiet Telegram group.
- About: tape `About`. **The trajectory is the whole page.** The `trajectory` phases in `src/content/cv.json`, resolved by `getTrajectory()`, are the narrative Register of the CV Record: a phase references the engagements it covers by slug and derives its period from them, so nothing about the professional history is hardcoded here and companies are named inside the prose. The dated list and the education live on `/cv`, linked from here exactly once.
  - **Stack, Community and What I'm exploring are gone as sections.** Their content is now each step's own: `tools` (names only, one mono line under the prose), `started` (engagement slugs the step set going, resolved loudly and deliberately *not* `covers`, which would drag the phase's period to today), `opened` (the current step's open questions), and `image`. The Record's `about` block holds the lead and the creed, which is the narrative Register's own content the way phase prose is.
  - **Two rails only where the second one has something.** A step carrying nothing but tools runs full width rather than sitting beside a blank column. Where the rail exists it holds what the step started or opened, never a photo as well: a place holds a photo or content, not both, and a photo is a full-width band belonging to its step.
  - Open Source Day and the talk total in "What it started" are **derived** (`getOrganisedEvents()` filtered to conference series, `getTotalTalkCount()`), so they cannot drift from `/sharing`. The meetups and the hackathon are deliberately left to `/cv`: here they would mix granularity in a three-item block.
  - Hobbies are the one thing not from the Record, and they close the page **outside** the story on purpose, which is what stopped them reading as bolted on. `/cv`, `/uses`, `/now` and `/shelf` are each linked exactly once, where the reader is already thinking about that thing: `/shelf` hangs off the hobbies, because that is where the reader is already thinking about what happens off the clock.
- Blog: `/blog`, titled Writing. One filter row: All plus the three editorial topics with counts (`topicCounts` in `src/lib/blog-index.ts`, `?topic=`), the same topics the home WRITING block links to. `?tag=` (from a post page's tags) and the old `?category=` still filter, and announce themselves on a line of their own with Show all rather than a second row of controls; unfiltered, the latest post is a feature and START HERE lists the hand-picked posts in `START_HERE` (resolved by slug, throws on an unknown one); the archive groups the three most recent years and folds the rest into Earlier. Every row carries the cover as a 160px thumbnail on wide screens (text only on phones). Each post names its `topic` in frontmatter (`ai-security`, `engineering`, `looking-back`), with a fallback rule on category and tags
- Projects: only what Davide builds, from `projects.json`: the `flagship` first (Argus, with its `quickstart` and the `post` that introduces it), then the rest of the `open` group under IN THE OPEN (Agent Skills, whose `url` is the site's own `/skills`: a row pointing at a page of this site opens in place, not in a new tab), then the `personal` group, then the upstream contributions. `note` is the short mono label at the end of a row. The day job is not a project (it lives on `/cv` and `/about`), and the `community` entries stay in `projects.json` only because the home IN PUBLIC block, `/sharing` and `/about` resolve them by slug; `/projects` does not render them. A project with no `url` or `github` (a private repo) renders as a plain row, not a link
- Talks (`/sharing`, the URL kept for old links): tape `Talks`, Talks in the nav. The four header numbers, the ruled index of stage sessions by year, the interviews and Organising (Schrodinger Hat with the Open Source Day photo, then the organised events folded by kind by `organisedByKind` / `describeKind`, conference first, with the full list by year behind a disclosure so it never becomes a second long index under On stage) are all derived from `talks.json` through `src/lib/sharing.ts`. The material column shows the date while a talk is upcoming, the rating link while its window is open, then slides and recording. Rows carry `id={slug}` so `/sharing#slug` links land on them. No itinerary line: the graph lives only in the mark. The speaker kit (`#speaker-kit`) closes the page: bios, topics, headshot and the logo downloads (lockup, on dark, mark, avatar from `public/brand/`, CC BY-ND 4.0). It absorbed the old `/brand` page, which now redirects there; the palette, type and usage rules live only in the brand repo
- Now: hand-written prose. At the owner's request the page opens with a plain paragraph (role, place, speaking, jobs) and a mono Updated line, not a definition row. Then AT WORK, COMMUNITY and OFF THE CLOCK bands; the reading strip in OFF THE CLOCK is derived: `ShelfNow` in `src/components/sections/` reads the open passes through `getShowcase()` and groups them by the Type's `verbBase`, never by the slug. A verb with nothing open gets no band at all, so a month with five books and no game reads as deliberate; with nothing open anywhere the block renders nothing rather than an empty shell. It shows covers and titles, links `/shelf` once. The page is ISR hourly to match `/shelf`
- Uses: tape `Uses`
- Shelf: tape `Shelf`. Three blocks, in this order: what Davide is reading and playing, the verdicts on what he finished or put down, and the pile. The page holds **no facts of its own**: it renders the showcase document served by [tsundoku](https://github.com/davideimola/tsundoku) (`GET /api/showcase`, bearer token, optional `?types=`), read through the single seam in `src/lib/shelf.ts`, which stores the response `ETag` and sends `If-None-Match` so an unchanged revalidation costs a 304 and no body. Judgements first, the pile last. Which block a pass lands in comes from the Type's verbs and never from the slug: the Type carries both `verb` (the past participle, `played`) and `verbBase` (the bare verb, `play`), and the heading is built from `verbBase`, because *played* cannot be bent into *Playing*. `medium` is a `{ slug, label }` pair and only the label is ever printed. **A rating is a score and nothing else**: the owner's written review stays private in tsundoku and must never be rendered here, so the verdicts block carries weight through the score, the outcome and the dates alone, with an abandonment as its loudest row. **`finished` is a `{ count, recent }` block, shaped like `pile` and `shelf`**: `count` is every verdict in the library, `recent` the sample the page renders. tsundoku sends only the passes carrying a verdict (a `rating`, or an `outcome` of `given-up` even with no score, because an abandonment is a judgement without a number), capped at 12, most recent first and undated last. The page renders `recent` as it is sent and must never filter, sort or slice it for itself; the "Showing 3 of 41" line under the rows is the same line the wall carries, and it disappears entirely when the count equals the rows shown, because "3 of 3" is noise. The intro copy therefore no longer claims a number of its own: it says only the judged passes land here and that they run newest first *where a date was recorded*, which is the hedge the real library needs (about seven verdicts today, none of them dated). Every schema object here is non-strict, so a field tsundoku grows later is dropped rather than failing the document. `progress.unit` is the model's own word, `instalments`, which reads oddly in public, so the visible text is a bare ratio (`7 / 20`) and the full sentence lives in the accessible label. Covers are hotlinked 128px images rendered with a plain lazy `<img>`, never `next/image`, because the site does not pay to optimise images it does not own; where `cover.at` is present the tile **must** link to it (tsundoku's ADR-0013: the lookup provider asks for a prominent link back), and a cover-less entry draws its Series tint, one ready-to-use `oklch()` string fed straight to the tile. Nullability is ordinary, never an error: `startedAt` and `endedAt` can be null, and a shelf volume can have a null `type` (an uncatalogued object is a gap the library shows), which belongs to the wall's `All` filter and to no Type filter. `shelf.byType` lists every Type tsundoku knows, zero counts included, and **a zero-count Type gets no chip**: filtering on it would land on an empty wall. Videogames are always one of those zeros, structurally rather than by accident: the wall is the Collection, objects in the house, and in tsundoku's model a videogame carries no Volume (its ADR-0021). **The wall does not argue that case**: its one line names what the wall is ("Books on my shelf at home, one tile per volume.") and nothing more, because the reasoning about what does or does not earn a Volume means nothing to a visitor. **The pile, by contrast, does hold videogames**, so no copy anywhere may call it a stack of volumes. **Nor may any copy call it things bought and never started**, which is what it used to say and is wrong twice over: in tsundoku's model the Pile is *what to take on next*, two halves rather than one list. The head is what the owner pinned, in the order they pinned it; the reserve composes itself out of every Story still to read on an active Path, every open Want, every run with somewhere left to go, and the next missing Volume of every Series being collected. So it holds things the owner does **not** own (an open Want, a missing Volume) and things already **started** (a run mid-way). It is not a heap of unread purchases, and it is not an ordered queue either: tsundoku keeps an order only for the pinned head, and the rows it sends (`pile.recent`) are the most recently added, not what comes next. So `/shelf` renders the pile as a number (labelled `waiting`, with the count per Type) and one paragraph saying what feeds it, and lists no rows: a dozen arbitrary titles under an "Up next" heading promised an order the library does not keep. If tsundoku ever publishes its Paths, a block of them is what takes this place. The word *tsundoku* stays in the copy exactly once, on `/shelf`, because it does mean the pile that keeps growing; it must not be used to claim anything was purchased. `pile.recent` is capped at 12 and `shelf.volumes` at 60 while `pile.count` and `shelf.total` are the real figures, so the page says `showing 60 of 412` out loud. **Every row that names a title carries `standsAt`**, `{ from, to, unit } | null` with `unit` one of `instalments` or `volumes`, on the entries of `now`, `finished.recent`, `pile.recent` and `shelf.volumes`. It is always a range: a single part arrives with both ends at the same value, an omnibus with the two it carries under one cover, and a standalone object (or a pass that went through no object) with `null`. The field is optional and `.catch(null)`, so the committed snapshot, which predates it, and a shape this site has never seen both parse. **It is data, and the site never composes it into display text.** Titles print exactly as the library sends them: the owner's titles already carry their numbers ("Slam Dunk 20"), appending would read "Slam Dunk 20 20", and the string match that avoided that held only until it met an odd title. `standsAt` stays in the contract because a number as data beats a number inside a string, and because an omnibus spans a range a title cannot express, but nothing renders it today. **A cover-less tile is labelled with the volume's title, never with the Series name ten objects share.** If a value from `src/lib/shelf.ts` is ever needed inside a client component, put it in a separate import-free module first: that module reads the filesystem for the snapshot, so importing a value from it drags `node:path` into the browser bundle (this is why `src/lib/shelf-label.ts` existed). Today every client reader of `shelf.ts` imports types only, which are erased. **The Type is named where a row would otherwise be anonymous**, per the Badge rule, but not on the wall, where sixty pills would drown the densest block on the site. There each tile carries a 9px mono Type line instead, which disappears under a filter because the chip above already says it, and an untyped volume reads "Uncatalogued". `wish` is tolerated by the schema and deliberately has no UI. ISR, hourly (`revalidate = 3600`). It is not the only reader of the library: `/now` renders a compact block out of the same `getShowcase()` seam, never a second fetch. **Degrades instead of failing:** a missing env var, an unreachable API, a non-2xx or a body that does not match the contract all fall back to the committed snapshot `src/content/shelf.fallback.json`, and the page says so in the header. That snapshot is a real capture of the library refreshed by hand with `pnpm shelf:snapshot`, so a cold build publishes the owner's actual shelf rather than plausible-looking fiction; the invented document is a test fixture in `src/test/shelf-fixture.ts` and the page has no way to reach it. **The cover wall is built and deliberately not rendered.** `ShelfWall` and `CoverTile`, their stories and `ShelfWall.test.tsx` all stay in the repo, tested, with `/shelf` importing only `CoverTile`; do not delete them and do not re-add the wall to the page on a whim. It came off because the block only pays for itself with a complete library and today the library is not one: about half the volumes have no cover, many carry no Type, and the filter is broken from the API side rather than this one, since the chips count the whole collection (`shelf.byType`, 102 volumes and up) while the wall is handed a 60-volume sample (`shelf.volumes`), so a Type holding one rare volume shows a chip reading 1 and filters to nothing. Three things have to be true before it returns: most volumes have covers, most have a Type, and tsundoku either sends the counts for the sample it actually sends or sends the whole collection
- Skills: tape `Skills`. The Agent Skills Davide publishes, one block per repo. The repos and their framing (tape, title, intro, optional `install` command, optional `talk` slug resolved loudly against `talks.json`) are editorial copy in `src/content/skills.json`; the skills themselves are **never written down here**: `src/lib/skills.ts` reads every `skills/<name>/SKILL.md` from each repo's default branch on GitHub (tree API, then the raw file, frontmatter through Zod), so a skill added upstream appears within the hour (ISR, `revalidate = 3600`). A row prints the skill's name and only the first half of its `description`: the part from "Use when" on is the trigger addressed to the agent, not the reader (`skillSummary`). Each block carries the repo's name as its `id`, and a talk named by a block gets a Skills link to it in the material column of `/sharing` (`talkSkillsLinks`), so the link is declared once, in `skills.json`. A single `SKILL.md` that does not parse (an unquoted `: ` inside a description is the usual culprit: agents tolerate it, YAML does not) is skipped with a warning, never taking its siblings down; `pnpm skills:snapshot` reads strictly and refuses to write. A repo GitHub will not serve falls back to the committed snapshot `src/content/skills.fallback.json`, refreshed by hand with `pnpm skills:snapshot`, and the header says so. Linked from the footer
- CV: its own header (tape `CV`, the name as a display h1, the headline as the lead; no PageHero). Dense Rendering of the CV Record. Every section is headed by an ink tape (size sm, tilts alternating, printed straight with 0.06em tracking so PDF extraction keeps the words whole), and its entries sit on a ruled list: ink rule on top, hairlines between (`src/content/cv.json`, read through `src/lib/cv.ts`). Wide left rail: Experience, Freelance work, then Community & projects (the Volunteering engagements plus the projects the Record names by slug). Narrow right column: the contact/skills/education/open-source card, then Selected talks and Events organised. Every talk, project and organised event is referenced by slug and resolved from `talks.json` / `projects.json`, so nothing about them is restated here and an unknown slug throws at build time. Indexable and in `sitemap.ts`, deliberately absent from NavBar and Footer
- Colophon: tape `Colophon`, linked from the footer's small row. How the site is made (mark, type, drawings, motion, code, privacy, machine-readable versions, paper), hand-written like `/uses`: every line is something the repo does, so change it when the stack changes
- 404: tape `404`, "This page came undone.", with its own cover (a thread on a nail, frayed, the knot on the floor) drawn by `DrawnCover`
- Contact: reached from the footer and from /about (no longer in the NavBar). "Say hello", the form (action, honeypot, timing field, Turnstile), and the direct ways: the email from the CV Record, a call, the speaker kit, the profiles
- Newsletter: tape `Newsletter` (archive index + subscribe form); single issue `/newsletter/[slug]` opens with a Breadcrumb; post-confirmation landing `/newsletter/confirmed` uses tape `Welcome`
- Links: the mobile-first link-in-bio, a standalone page outside the `(site)` route group, so it renders without NavBar/Footer even when reached via rewrite (its layout only adds the theme toggle); `links.davideimola.dev` serves this page directly via a host-based rewrite in `next.config.ts` (deep paths on the subdomain redirect to the main site), which is why every row links to the main site absolutely. Chosen from seven prototyped variants (branch `prototype/links`, variant G). The mark in an ink disc, the wordmark, then **the profiles as a row of icons** (the one exception to the icon rule below, because a link-in-bio is read that way), then the short line. **The conference-day card comes first under the header** while a talk's rating window is open, with Rate this talk and the slides, because this page is what the closing slide's QR points at and nobody in the room scrolls. Then the groups, each opening with a tape: NOW (the latest post and the flagship, each with its cover as a 112px thumbnail), HIRING AT REDCARBON while `src/content/hiring.json` has open roles (one row per role, UTM-tagged by `openHiring` in `src/lib/hiring.ts`; roles come off by hand when filled, and past `until` the group disappears on its own), ON STAGE (up to two next talks with a calendar leaf, skipping the one already on a rating card through `upcomingBesidesRated`, and always "Invite me to speak", so the group never empties), COMMUNITY (Schrodinger Hat with the Open Source Day photo, what it organises derived from the talks it `host`s) and KEEP IN TOUCH (the newsletter, a call). Revalidates hourly (ISR) so the time-based rows turn over without a deploy

### Rules
- Every component in `src/components/ui/` and `src/components/layout/` MUST have a Storybook story
- Use Tailwind utility classes directly — avoid custom CSS unless absolutely necessary
- Use the brand tokens (`text-fg`, `bg-surface`, …), never hex values; the only hex values in `src/` are in the satori image routes, read from `@davideimola/brand/tokens.json`
- **The red rule:** Akane red is for the mark's knot and the one `Marker` per page. Links may turn red on hover (`hover:text-accent`); code keywords may be red. No red buttons, tapes, badges, borders or backgrounds, nothing red at rest
- **Tapes** label sections and content types: ink, never red, never stacked, one per block, alternating tilt. Cards, photos and blocks are never rotated
- **No git-graph decorations:** the graph lives only in the mark
- **Tags vs categories**: tags (`post.tags`, `project.tags`, `talk.tags`) are always rendered as `#xxx` in `font-mono text-[12px] text-fg-subtle`. Badge pills are reserved for status labels (Featured, Coming soon) and type classifications (Conference, Meetup). Section labels are tapes. Never use Badge pills for tags.
- Card hover: the hairline darkens to ink (`hover:border-fg`); no glow
- **Icons** come from `@tabler/icons-react` only (monoline, round caps and joins, the mark's own stroke rules), at `stroke={1.75}` and 16 to 24px, in the text colour and never red at rest. They are for controls whose meaning is universal (search, theme, menu, back to top, download, copy), always with an accessible label, and never decorative: no icon beside a section title (the tape names a section), no icon bullets. **Profiles and feeds are named, not drawn** (footer, contact, AuthorBio, share buttons), with one exception: `/links`, a link-in-bio, shows the profiles as a row of icons under the wordmark. Only the profiles Davide posts on are offered (`SOCIAL_PROFILES`, `active` in `src/lib/social.ts`); every profile stays in the JSON-LD `sameAs`
- Portraits and photographs of people go through `Photo`: black and white at rest, and on hover the colour is painted back across them left to right in the marker's gesture (a clipped colour copy of the same file, `.photo-colour` in globals.css), wiped back when the pointer leaves. Touch screens, print and reduced motion keep them plain.
- **Blog covers** (the `heroImage` of a post): monoline illustrations, ink line art on the paper ground, drawn with the mark's stroke rules (monoline, round caps and joins), with **exactly one red detail**. Light ground only: no dark scenes, no glow, no photographs. Each cover ships as `public/images/blog/<slug>/cover.svg` (a page's own drawing, like the 404's, as `public/images/pages/<page>/cover.svg`, held to the same rules and the same test) plus a 1600x900 `cover.png` sibling and a `cover-dark.svg` night twin generated by `pnpm covers:dark` (the three brand colours swapped for their night values; `src/lib/covers.test.ts` fails if a twin is missing or a cover uses any other colour). They render as they are through `PostCover` (16:9, hairline frame, no filter, no hover reveal; SVG served unoptimised), which swaps to the night twin in the dark theme so no paper rectangle glares out of a dark page. Anything that hands a cover to a machine (JSON-LD, the Markdown for LLMs, OG) goes through `rasterCover()` in `src/lib/covers.ts`, which points an SVG at its PNG
- **Figures in a post** (`<DrawnFigure src alt caption />` in the MDX): a diagram or chart in the covers' style that draws itself once when it scrolls into view, the red detail last; parts wrapped in `<g data-step="n">` draw one after the other, since a page has no clicks (the slides' `DrawnSvg` steps on click instead). The file lives at `public/images/blog/<slug>/figures/<name>.svg`, uses only the three brand inks, and has a `<name>-dark.svg` twin from `pnpm covers:dark`; `covers.test.ts` checks both, and `loadFigure` throws at build time on a bad path, a missing file or a missing twin. Labels are `<text>` and render in `font-mono`. The machine surfaces (`/blog/<slug>.md`, `llms-full.txt`, RSS) get a plain Markdown image with the alt and the caption instead (`figuresToMarkdown` in `src/lib/figures.ts`)
- Copy in English, no em dashes

### "use client" directive
Only add `"use client"` when the component needs interactivity (event handlers, hooks). Most layout and UI components do not need it.

## Animations

- Use `motion/react` (not `framer-motion`) for all animations
- `ScrollReveal` handles scroll-triggered fade+slide for section content
- The `Marker` draws itself once (~500ms) when it scrolls into view; reduced motion makes it instant and `<noscript>` shows it drawn. Nothing blinks or loops
- Motion animates the brand's own elements, never the text. Pointing at the NavBar's home link ties the knot again (`.knot-on-hover`, hover-capable pointers only); `ReadingProgress` is an ink hairline that ties a small knot at its end when the reader reaches the last line; a post's body closes on the knot as an end mark (`src/lib/rehype-end-mark.ts`, `.end-mark` in globals.css), inside the last paragraph and before the footnotes, so the Markdown stays plain. These are the knot, not new red: the red rule still holds.
- A post's SVG cover draws itself in the post page (`DrawnCover`, ~1.2s, the red detail last), prepared by the brand's `prepareDrawSvg` (`@davideimola/brand/draw`, whose `draw.css` holds the timing, reduced motion and print) and read by `src/lib/cover-files.ts`; the NavBar's `Mark` traces its graph and ties the knot on the first load of the home page only (`draw`), and the wordmark's two knots answer it one after the other (`Wordmark echo`). Both run once, show drawn under reduced motion (which also zeroes delays), in print and without JavaScript
- `reactStrictMode` is set to `false` in `next.config.ts` — React's double-mount in dev mode resets framer-motion's IntersectionObserver state, causing a flash of invisible content
- Do NOT wrap Next.js App Router `children` in `AnimatePresence mode="wait"` — it blocks page rendering

## SEO & Metadata

- Dynamic OG images: `/og?title=…&category=…&path=…` via `src/app/og/route.tsx` (light card: tape with the category, title, wordmark and URL, tone-on-tone mark). The home card (and the fallback for pages without one) is `/og/home`: the line with its marker and the lead. Pages never write a card URL by hand: they call `ogImageUrl()` / `HOME_OG_IMAGE` from `src/lib/og-url.ts`, which spells spaces as `%20` (a `+` reached one card as a literal plus) and appends `v=OG_VERSION`. **Bump `OG_VERSION` whenever the cards change look**: Telegram and LinkedIn cache the picture by its URL, so a redrawn card under an old URL keeps showing the old one. Every card is laid out on a 1200x630 grid and served at 2x (`OG_SIZE`, 2400x1260) through `ogImageResponse()` and `OgCard` in `src/lib/og.tsx`; SVGs go through `OgVector`, because satori rasterises them at their layout size and the scale would blur them. The shared satori pieces (fonts, tape, mark, wordmark) live in `src/lib/og.tsx` and read the TTFs in `public/fonts/`; the LinkedIn/Bluesky covers use `src/lib/og-cover.tsx`
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
- Do NOT hard-code a light-only or dark-only colour: use the brand tokens, which carry both themes
- Do NOT bring back the terminal aesthetic (command labels, `//` prefixes, dot grid, blinking cursor) anywhere: `/links` carries none of it either. `/terminal` was retired (ADR-0005) and redirects to `/`; the ⌘K palette is search only, with no shell easter eggs
- Do NOT use fonts other than Schibsted Grotesk, IBM Plex Mono and Barlow Condensed (tape labels only)
- Do NOT redraw or typeset the mark or wordmark: use `Mark` / `Wordmark` or the files in `public/brand/`
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
GITHUB_TOKEN=                    # optional, read-only: lifts GitHub's unauthenticated rate limit for /skills
                                 # both are also what `pnpm shelf:snapshot` reads to refresh the committed snapshot
```

## Analytics

Web analytics use **Umami Cloud** (free Hobby tier), not Vercel Web Analytics — see `docs/adr/0001-switch-analytics-to-umami-cloud.md`. The `UmamiAnalytics` component (`src/components/analytics/`) renders a cookieless tracker script in the root layout, proxied first-party (script **and** the `/api/send` collection endpoint) through the `/relay/*` rewrite in `next.config.ts` so ad blockers can't match `cloud.umami.is`. Keep the `/relay` path in sync between `UMAMI_PROXY_PATH`, the rewrite source, and the `redirects()` exclusion in `next.config.ts`. **Known trade-off:** because events reach Umami from the Vercel edge node, Umami geolocates every visitor's *country* to that region (e.g. Frankfurt), not the real visitor — an unavoidable limit of Umami Cloud behind a proxy (`umami#3478`); forwarding `X-Forwarded-For` from a route handler was tried and does not help (Cloud ignores it). Referrers and UTM params are unaffected (they travel in the event payload, not the IP). Vercel **Speed Insights** (`@vercel/speed-insights`) is a separate product and stays. Renders nothing when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is unset.

## Content sources

- Blog posts: `src/content/blog/` (MDX files)
- Talks: `src/content/talks/` (MDX or JSON). A talk may carry `feedback: { url, from?, until? }`, the audience rating link (emblema.live, or the conference's own tool: the URL is arbitrary and the visible hint is derived from its hostname, so a new provider is one URL and never a lookup table). **The window is the whole point: set it once and no surface is ever edited on the day.** It opens on the talk's date and closes `FEEDBACK_WINDOW_DAYS` (7) later, inclusive, unless `from` / `until` override it. The rule lives in `src/lib/talk-feedback.ts`, which is import-free on purpose so `any client component can read it without dragging `node:path` into the browser bundle; `getFeedbackOpenTalks()` in `content.ts` is the server-side seam. Two surfaces read it and neither has a date rule of its own: the conference-day card on `/links` and the rating link in the material column of `/sharing`
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

The widget renders in an iframe on giscus.app, so it cannot see the site's variables or fonts. Its theme is built from the brand tokens by `giscusThemeCss` (`src/lib/giscus-theme.ts`) and served at `/giscus-theme.css` and `/giscus-theme-dark.css`; it imports the fonts itself and marks font rules `!important`, because giscus links its own stylesheet after the theme. In local dev the theme never loads (the browser will not let a public iframe read from localhost), so judge it on a preview deploy or by serving the CSS from a test. The block opens with a "Comments" tape like the others.

### Related posts algorithm

`getRelatedPosts(slug, count)` in `src/lib/content.ts` scores posts by:
- 2 points per shared tag
- 1 point for same category

Returns top `count` posts with score > 0, excluding the current post.
