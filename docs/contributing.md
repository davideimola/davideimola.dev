# Contributing

## Adding content

### Blog post

1. Create `src/content/blog/your-slug.mdx`
2. Add frontmatter:

```mdx
---
title: "Post title"
date: "2026-01-15"
tags: ["Go", "Security"]
excerpt: "One sentence summary for the card."
readingTime: 5
---

Content here…
```

3. The post appears automatically in `/blog` and the homepage "Latest writing" section (if recent).

### Talk

1. Create `src/content/talks/event-year-slug.mdx` or add to a JSON file (TBD per content layer decision):

```mdx
---
title: "Talk title"
event: "KCD Italy 2024"
date: "2024-06-15"
location: "Milan, Italy"
slides: "https://..."
video: "https://..."
tags: ["GitOps", "Kubernetes"]
---

Optional talk description…
```

### Project

1. Create `src/content/projects/project-name.mdx`:

```mdx
---
title: "Project Name"
status: "active" | "coming-soon" | "archived"
url: "https://..."
period: "2022–present"
featured: true
tags: ["Community", "Open Source"]
---

Project description…
```

## Running Storybook

```bash
pnpm storybook
```

Opens at `http://localhost:6006`. Every component in `src/components/` must have a corresponding story in `src/stories/`.

When adding a new component:
1. Create `src/components/ui/MyComponent.tsx`
2. Export from `src/components/ui/index.ts`
3. Create `src/stories/MyComponent.stories.tsx` with stories for all variants
4. Run `pnpm storybook` to verify it looks correct

## Running tests

```bash
pnpm test          # Single run
pnpm test:watch    # Watch mode during development
pnpm test:coverage # With coverage report
```

Tests live next to components or in `src/` with `.test.tsx` extension.

## PR conventions

- Branch from `redesign` for new features
- Branch name: `feat/description`, `fix/description`, `content/blog-post-slug`
- PRs must pass `pnpm build` and `pnpm lint` (Biome check)
- Storybook stories required for new components
- No `ignoreBuildErrors` workarounds

## Linting and formatting

```bash
pnpm lint          # Check (Biome)
pnpm lint:fix      # Fix automatically
pnpm format        # Format only
```

Biome handles both linting and formatting. No ESLint, no Prettier.
Configure rules in `biome.json`.

## Deployment

- Push to `redesign` → preview deploy on Vercel
- Merge to `main` → production deploy to `davideimola.dev`
- Storybook: deploy to `storybook.davideimola.dev` via Chromatic or Vercel
