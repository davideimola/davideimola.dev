# CLAUDE.md — davideimola.dev

Personal website of Davide Imola. Next.js 15 App Router, TypeScript, Tailwind CSS 4, deployed on Vercel.

---

## Commands

```bash
pnpm dev          # dev server (Turbo)
pnpm build        # production build
pnpm lint         # ESLint
pnpm lint:fix     # ESLint auto-fix
pnpm format:write # Prettier
pnpm typecheck    # tsc --noEmit
pnpm check        # lint + typecheck
pnpm optimize     # optimize images
pnpm logos        # download company logos
```

---

## Project Structure

```
src/
├── app/
│   ├── _components/      # shared UI components (29 components)
│   ├── api/              # API routes (contact, blog/[slug], newsletter, og)
│   ├── (pages)/          # page routes (about, blog, contact, experience, projects, speaking, uses…)
│   ├── layout.tsx         # root layout + metadata
│   ├── page.tsx           # homepage
│   ├── sitemap.ts
│   ├── robots.ts
│   └── rss.xml/
├── content/
│   ├── blog-posts.ts      # blog metadata array (source of truth)
│   ├── projects.ts
│   ├── speaking-events.ts
│   ├── uses.ts
│   ├── now.ts
│   └── blog/              # MDX files (one per post)
├── lib/
│   ├── mdx.ts             # MDX loading & parsing (gray-matter)
│   └── markdown.ts        # markdown → HTML conversion
├── hooks/
│   └── use-blog-post.ts   # TanStack Query hook for blog posts
├── styles/
│   ├── globals.css        # Tailwind imports, .blog-content, tokens
│   ├── animations.css
│   ├── japanese-patterns.css  # Seigaiha pattern
│   └── prism-theme.css
└── env.js                 # t3-oss/env-nextjs validation
```

---

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict, `noUncheckedIndexedAccess`) |
| Styling | Tailwind CSS 4 + custom CSS |
| Content | MDX (`@next/mdx`) + TypeScript content files |
| Email | Resend API |
| Newsletter | Kit (ConvertKit) |
| Analytics | Vercel Analytics + Speed Insights |
| Validation | Zod + t3-oss/env-nextjs |
| Data fetching | TanStack React Query 5 (client-side) |
| Fonts | Geist, Noto Sans JP, Playfair Display |
| Package manager | pnpm 10 / Node ≥ 22 |

---

## Content Management

**No database.** All content is managed via TypeScript arrays and MDX files.

### Adding a blog post
1. Add metadata object to `src/content/blog-posts.ts` (title, slug, excerpt, category, tags, publishDate, heroImage, featured…)
2. Create MDX file at `src/content/blog/[slug].mdx`

### Adding a project
Edit `src/content/projects.ts` — fields: title, description, technologies, featured, status, links (website/github/npm/demo/docs).

### Adding a speaking event
Edit `src/content/speaking-events.ts` — fields: title, talkTitle, date, location, type, role, videoUrl, slidesUrl.

---

## Design System

**Dual aesthetic: Italian elegance × Japanese discipline (和 - wa)**

### Colors
| Name | Hex |
|------|-----|
| Sumi Black (bg) | `#0D0D0D` |
| Secondary bg | `#1A1816` |
| Tertiary bg | `#2A2725` |
| Akane Red (accent) | `#C91F37` |
| Body text | `#d4cfc9` |
| Muted text | `#a39e98` |
| Dim text | `#726d68` |

### Typography
- **Headings / display:** Playfair Display (serif)
- **Body:** Geist (sans-serif)
- **Japanese accents:** Noto Sans JP

### Patterns
- Seigaiha (wave) background at low opacity (5–30%) for hero sections
- Kanji accent characters: 道 創 語 書

---

## Key Conventions

- **Path alias:** `~/*` → `src/*`
- **Component naming:** PascalCase; hooks prefixed `use-`
- **Styling:** Tailwind utility-first; custom CSS only for animations/complex patterns
- **Dark-first:** All design decisions target the dark theme
- **No database:** TypeScript files + MDX are the content layer
- **API routes:** Thin wrappers that read MDX files or call external services (Resend, Kit)
- **Images:** Next.js `<Image>` with WebP/AVIF; run `pnpm optimize` after adding images

---

## Environment Variables

```
RESEND_API_KEY         # contact form email delivery
CONTACT_EMAIL          # email recipient for contact form
CONVERTKIT_API_KEY     # newsletter (Kit/ConvertKit)
CONVERTKIT_FORM_ID     # newsletter form ID
```

See `.env.example`. Validated at build time via `src/env.js`.

---

## Component Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| `Header` | `_components/header.tsx` | Nav with Work dropdown, mobile accordion |
| `Footer` | `_components/footer.tsx` | Multi-column footer |
| `CommandMenu` | `_components/command-menu.tsx` | CMD+K palette (cmdk) |
| `PageHero` | `_components/page-hero.tsx` | Hero section with gradient |
| `PageLayout` | `_components/page-layout.tsx` | Consistent page container |
| `ProjectCard` | `_components/project-card.tsx` | Project display card |
| `Badge` | `_components/badge.tsx` | Status/category badge |
| `SectionHeader` | `_components/section-header.tsx` | Section heading with accent line |
| `TableOfContents` | `_components/table-of-contents.tsx` | Blog post TOC |
| `CodeBlockToolbar` | `_components/code-block-toolbar.tsx` | Copy button on code blocks |
| `ContactForm` | `_components/contact-form.tsx` | Contact (Resend) |
| `Newsletter` | `_components/newsletter.tsx` | Email signup (Kit) |
| `StructuredData` | `_components/structured-data.tsx` | JSON-LD (Person, Website) |
| `ToolIcon` / `HardwareIcon` | `_components/*-icon.tsx` | Uses page icons |
| `CompanyLogo` | `_components/company-logo.tsx` | Experience/project logos |

---

## SEO & Metadata

- Metadata exported per page via Next.js `metadata` / `generateMetadata`
- Dynamic OG images: `/api/og` (1200×630, branded)
- Structured data (JSON-LD): `StructuredData` + `BlogPostStructuredData`
- RSS feed: `/rss.xml`
- Sitemap: `/sitemap.xml`
- Robots: `/robots.ts`

---

## Docs

- `docs/DEVELOPMENT.md` — dev workflow and features
- `docs/design/brand-identity.md` — full brand guidelines
- `src/content/README.md` — content management guide
