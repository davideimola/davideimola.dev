# CLAUDE.md — davideimola.dev

AI context for Claude Code and other AI assistants working on this codebase.

## Stack

- **Framework:** Next.js 16 (App Router), TypeScript strict
- **Styling:** Tailwind CSS v4 (CSS-first config in `src/app/globals.css`)
- **Components:** Custom design system + shadcn/ui where appropriate
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
| `--text-3` | `#4E4A46` | `text-text-3` |
| `--accent` | `#C91F37` (Akane Red) | `text-accent`, `bg-accent` |
| `--accent-hover` | `#a8192e` | `bg-accent-hover` |
| `--accent-glow` | `rgba(201,31,55,0.12)` | `bg-accent-glow` |

## Typography

- **`font-mono`** → JetBrains Mono — use for headings, UI elements, labels, code
- **`font-sans`** → IBM Plex Sans — use for body text, descriptions

Apply with Tailwind: `font-mono`, `font-sans`

## Component Patterns

### File location
- `src/components/ui/` — atomic UI components (Button, Badge, Card, SectionHeader)
- `src/components/layout/` — layout components (NavBar, Footer)
- `src/components/sections/` — page-level section components
- `src/stories/` — Storybook stories (one file per component)

### Rules
- Every component in `src/components/ui/` and `src/components/layout/` MUST have a Storybook story
- Use Tailwind utility classes directly — avoid custom CSS unless absolutely necessary
- Prefer `font-mono` for anything that looks like UI/terminal text
- Akane Red (`text-accent`, `bg-accent`) is for accents only: hover states, active badges, decorative elements, `//` prefixes. Never use as a background fill for large areas
- Dot grid background: defined in `globals.css` as `body::before`. Use `.dot-grid` utility class for other elements
- Card hover glow: `after:bg-accent-glow after:opacity-0 hover:after:opacity-100` pattern

### "use client" directive
Only add `"use client"` when the component needs interactivity (event handlers, hooks). NavBar needs it for the search button handler. Most layout and UI components do not need it.

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

## Content sources

- Blog posts: `src/content/blog/` (MDX files)
- Talks: `src/content/talks/` (MDX or JSON)
- Projects: `src/content/projects/` (MDX or JSON)
