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
- **Layout:** page-level `print:` utilities collapse the two-column grid into single-column flow (`print:flex`, `print:static`, `print:self-stretch`). DOM order is the reading order on paper, which is what makes the generated PDF parseable.
- **ATS constraints on `/cv`:** no tables, no images, and no text in page headers or footers. Vendor documentation warns about exactly these three, so they are hard constraints rather than preferences.

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
- About: `❯ whoami`. Its "How I got here" section is the narrative Register of the CV Record: the `trajectory` phases in `src/content/cv.json`, resolved by `getTrajectory()` in `src/lib/cv.ts`. A phase references the engagements it covers by slug and derives its period from them, so nothing about the professional history is hardcoded on this page and companies are named inside the prose. The dated list and the education live on `/cv`, linked from here exactly once
- Blog: `❯ ls ./blog`
- Projects: `❯ ls ./projects`
- Speaking: `❯ ls ./talks`
- Now: `❯ cat ./now.md`
- Uses: `❯ cat ./uses.md`
- CV: `❯ cat ./cv.md` — dense Rendering of the CV Record (`src/content/cv.json`, read through `src/lib/cv.ts`): typed engagement history in a wide rail, then Selected talks and Conferences organised, with contact/skills/education/open source in an aside sticky from `lg`. Indexable and in `sitemap.ts`, deliberately absent from NavBar and Footer
- Contact: `❯ ping davideimola.dev`
- Newsletter: `❯ ls ./newsletter` (archive index + subscribe form); single issue `/newsletter/[slug]` uses `❯ cat` in a Breadcrumb; post-confirmation landing `/newsletter/confirmed` uses `❯ cat ./welcome.md`
- Links: multi-command terminal session (`❯ whoami`, `❯ ls -t ./blog | head -n 1`, `❯ ls ./talks --upcoming`, `❯ cal --book`, `❯ ls ./schrodinger-hat`) — standalone link-in-bio page living outside the `(site)` route group, so it renders without NavBar/Footer even when reached via rewrite; `links.davideimola.dev` serves this page directly via a host-based rewrite in `next.config.ts` (deep paths on the subdomain redirect to the main site); revalidates daily (ISR) so dynamic blocks stay fresh
- Terminal: `❯ ssh guest@davideimola.dev` — a REAL interactive shell at `/terminal`: the visitor types commands and the site answers. Pure command engine in `src/lib/terminal.ts` (unit-tested, no React/browser APIs), client component `InteractiveTerminal` in `src/components/sections/`, data (posts/talks/projects) injected by the server page. Includes easter eggs (`sudo`, `rm`, `nmap`, `argus`, `vim`, `ssh`, `ping`); an `ask` AI command (Gemini free tier) is planned but not built. Linked from footer and 404; revalidates daily (ISR)

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
```

## Analytics

Web analytics use **Umami Cloud** (free Hobby tier), not Vercel Web Analytics — see `docs/adr/0001-switch-analytics-to-umami-cloud.md`. The `UmamiAnalytics` component (`src/components/analytics/`) renders a cookieless tracker script in the root layout, proxied first-party (script **and** the `/api/send` collection endpoint) through the `/relay/*` rewrite in `next.config.ts` so ad blockers can't match `cloud.umami.is`. Keep the `/relay` path in sync between `UMAMI_PROXY_PATH`, the rewrite source, and the `redirects()` exclusion in `next.config.ts`. **Known trade-off:** because events reach Umami from the Vercel edge node, Umami geolocates every visitor's *country* to that region (e.g. Frankfurt), not the real visitor — an unavoidable limit of Umami Cloud behind a proxy (`umami#3478`); forwarding `X-Forwarded-For` from a route handler was tried and does not help (Cloud ignores it). Referrers and UTM params are unaffected (they travel in the event payload, not the IP). Vercel **Speed Insights** (`@vercel/speed-insights`) is a separate product and stays. Renders nothing when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is unset.

## Content sources

- Blog posts: `src/content/blog/` (MDX files)
- Talks: `src/content/talks/` (MDX or JSON)
- Projects: `src/content/projects/` (MDX or JSON)
- CV Record: `src/content/cv.json` — the single source of truth for the professional history. Every Rendering (`/cv` today, the PDF later) derives from it through `src/lib/cv.ts` and holds no facts of its own. Public contact only: no phone number, no home address, no fiscal code, ever. `selectedTalks` holds slugs only: a talk is described once, in `talks.json`, and `getSelectedTalks()` throws on an unknown slug so a rename breaks the build instead of quietly emptying the section
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
