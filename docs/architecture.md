# Architecture

## Folder structure

```
davideimola.dev/
├── .mise.toml              # Tooling versions (Node 22, pnpm 10)
├── .storybook/             # Storybook configuration
│   ├── main.ts
│   └── preview.ts
├── biome.json              # Linting + formatting (replaces ESLint + Prettier)
├── vitest.config.ts        # Test configuration
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript (strict mode)
├── CLAUDE.md               # AI assistant instructions
├── docs/                   # Developer documentation
│   ├── architecture.md     # This file
│   ├── design-system.md    # Design tokens and component usage
│   └── contributing.md     # How to contribute content and code
├── public/
│   └── images/             # Static assets
└── src/
    ├── app/                # Next.js App Router
    │   ├── globals.css     # Design tokens + Tailwind v4 theme
    │   ├── layout.tsx      # Root layout (fonts, metadata)
    │   ├── page.tsx        # Home page
    │   ├── blog/
    │   │   ├── page.tsx        # Blog index
    │   │   └── [slug]/page.tsx # Individual post
    │   ├── projects/page.tsx
    │   ├── speaking/page.tsx
    │   ├── about/page.tsx
    │   ├── now/page.tsx
    │   ├── uses/page.tsx
    │   └── contact/page.tsx
    ├── components/
    │   ├── ui/             # Atomic UI components
    │   │   ├── Button.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Card.tsx
    │   │   ├── SectionHeader.tsx
    │   │   └── index.ts
    │   ├── layout/         # Layout components
    │   │   ├── NavBar.tsx
    │   │   ├── Footer.tsx
    │   │   └── index.ts
    │   └── sections/       # Page section components (built per-page)
    ├── content/            # MDX content files
    │   ├── blog/           # Blog posts as .mdx files
    │   ├── talks/          # Talk entries
    │   └── projects/       # Project entries
    ├── lib/                # Utilities and helpers
    │   ├── content.ts      # MDX reading and parsing utilities
    │   └── metadata.ts     # OG image generation helpers
    ├── stories/            # Storybook stories (mirrors components/)
    └── test/
        └── setup.ts        # Vitest + Testing Library setup
```

## Data flow

### Static content (blog, talks, projects)
- Content lives as MDX files in `src/content/`
- `src/lib/content.ts` reads and parses MDX at build time
- Pages use `generateStaticParams()` for SSG
- No CMS, no external API calls for content

### Dynamic features
- Contact form → Next.js Server Action → Resend API
- Command palette (`⌘K`) → client-side component, navigates to pages
- OG images → `app/og/route.tsx` using `@vercel/og`

## Naming conventions

- **Components:** PascalCase (`Button.tsx`, `NavBar.tsx`)
- **Pages:** lowercase with hyphens via folder structure (`blog/[slug]/page.tsx`)
- **Utilities:** camelCase (`content.ts`, `metadata.ts`)
- **Stories:** `ComponentName.stories.tsx`
- **Tests:** `ComponentName.test.tsx`
- **CSS classes:** kebab-case via Tailwind utilities
- **Content files:** `slug.mdx` (lowercase, hyphens)

## Rendering strategy

| Page | Strategy | Reason |
|------|----------|--------|
| Home | SSG | Static content |
| Blog index | SSG | Static list |
| Blog post | SSG + ISR | MDX content |
| Projects | SSG | Static |
| Speaking | SSG | Static |
| About | SSG | Static |
| Now | SSG + manual redeploy | Updated periodically |
| Contact | SSR (Server Action) | Form submission |

## Key constraints

- `ignoreBuildErrors: false` — TypeScript errors always fail the build
- Dark-only — no light mode, no `prefers-color-scheme` switching
- No newsletter, no tRPC
- pnpm only (enforced via `pnpm-workspace.yaml`)
