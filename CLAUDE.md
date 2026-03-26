# CLAUDE.md — davideimola.dev

AI context for Claude Code and other AI assistants working on this codebase.

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

**`SiteShell`** — client-side layout wrapper. Renders NavBar + CommandPalette (⌘K) + children. Does NOT use AnimatePresence — wrapping Next.js App Router children in AnimatePresence with `mode="wait"` breaks page rendering.

**`JsonLd`** — injects `<script type="application/ld+json">` for structured data.

### Terminal command theme
Every page uses a terminal-style command as its hero label. Follow this pattern:
- Home: `❯ whoami`
- About: `❯ whoami`
- Blog: `❯ ls ./blog`
- Projects: `❯ ls ./projects`
- Speaking: `❯ ls ./talks`
- Now: `❯ cat ./now.md`
- Uses: `❯ cat ./uses.md`
- Contact: `❯ ping davideimola.dev`

### Rules
- Every component in `src/components/ui/` and `src/components/layout/` MUST have a Storybook story
- Use Tailwind utility classes directly — avoid custom CSS unless absolutely necessary
- Prefer `font-mono` for anything that looks like UI/terminal text
- Akane Red (`text-accent`, `bg-accent`) is for accents only: hover states, active badges, decorative elements, `//` prefixes. Never use as a background fill for large areas
- **Tags vs categories**: tags (`post.tags`, `project.tags`, `talk.tags`) are always rendered as `#xxx` in `font-mono text-[11px] text-text-3`. Badge pills are reserved for categories, status labels (Featured, Coming soon), and type classifications (Conference, Meetup). Never use Badge pills for tags.
- Dot grid background: defined in `globals.css` as `body::before`. Use `.dot-grid` utility class for other elements
- Card hover glow: `after:bg-accent-glow after:opacity-0 hover:after:opacity-100` pattern

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

## What NOT to do

- Do NOT add newsletter or email subscription UI
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
```

## Content sources

- Blog posts: `src/content/blog/` (MDX files)
- Talks: `src/content/talks/` (MDX or JSON)
- Projects: `src/content/projects/` (MDX or JSON)

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
