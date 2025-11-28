# Development Guide

This document consolidates all development-related information for davideimola.dev.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **Fonts:** Geist, Noto Sans JP, Playfair Display
- **Deployment:** Vercel
- **Content:** Markdown-based (blog posts, speaking events, projects)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── _components/        # Shared components
│   ├── blog/              # Blog pages
│   ├── speaking/          # Speaking page
│   └── ...                # Other pages
├── content/               # Content data (blog, projects, events)
├── styles/                # Global styles
│   ├── globals.css        # Main styles + design tokens
│   └── animations.css     # Animations
└── lib/                   # Utilities
```

## Design System

### Colors
- **Sumi Black:** `#0D0D0D` (main background)
- **Akane Red:** `#C91F37` (primary accent)
- **Warm Grays:** Custom scale from `#1A1816` to `#E6E4E0`

See `docs/design/brand-identity.md` for complete brand guidelines.

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Geist (sans-serif)
- **Japanese:** Noto Sans JP

### Patterns
- **Seigaiha:** Wave pattern (Japanese aesthetic)
- Usage: Hero backgrounds at low opacity (5-30%)

## Key Features

### Command Menu
- **Component:** `src/app/_components/command-menu.tsx`
- **Trigger:** `Cmd/Ctrl + K`
- **Features:** Navigation, theme toggle, search

### Contact Form
- **Component:** `src/app/_components/contact-form.tsx`
- **Backend:** Formspree integration
- **Validation:** Client-side with error handling

### Newsletter
- **Component:** `src/app/_components/newsletter.tsx`
- **Service:** Beehiiv
- **Location:** Blog page footer

### RSS Feed
- **Endpoint:** `/rss.xml`
- **Content:** Blog posts
- **Format:** RSS 2.0

## Development Workflow

### Local Development
```bash
pnpm install
pnpm dev
```

### Build
```bash
pnpm build
pnpm start
```

### Linting
```bash
pnpm lint
```

## Content Management

### Blog Posts
- **Location:** `src/content/blog-posts.ts`
- **Format:** TypeScript objects with metadata
- **Fields:** title, slug, excerpt, content, tags, category, publishDate, heroImage

### Speaking Events
- **Location:** `src/content/speaking-events.ts`
- **Format:** TypeScript objects
- **Fields:** title, talkTitle, date, location, role, type, videoUrl, slidesUrl

### Projects
- **Location:** `src/content/projects.ts`
- **Format:** TypeScript objects
- **Fields:** title, description, technologies, featured, githubUrl, liveUrl

## Recent Enhancements

### Dark Mode Refinement (2024-11)
- Implemented warm gray scale for softer contrast
- Updated Sumi Black to `#0D0D0D` (warmer tone)
- Applied across all pages and components

### Logo & Branding (2024-11)
- Custom "Noble Mon" logo (Italian + Japanese fusion)
- SVG implementation with `currentColor` for dynamic theming
- Favicon with dark background for visibility

### Hero Sections (2024-11)
- Added decorative accent lines (red gradient)
- Floating animation on profile image (Home)
- Consistent visual hierarchy across all pages

## Performance

- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **Image Optimization:** Next.js Image component with WebP
- **Code Splitting:** Automatic via Next.js App Router
- **CSS:** Tailwind JIT + minimal custom CSS

## Deployment

- **Platform:** Vercel
- **Branch:** `main` (auto-deploy)
- **Domain:** davideimola.dev
- **Analytics:** Vercel Analytics

## Troubleshooting

### Common Issues

**Build Errors:**
- Check TypeScript errors: `pnpm tsc --noEmit`
- Clear `.next` cache: `rm -rf .next`

**Styling Issues:**
- Rebuild Tailwind: `pnpm dev` (JIT rebuilds automatically)
- Check `globals.css` for custom CSS conflicts

**Content Not Showing:**
- Verify content files in `src/content/`
- Check TypeScript types match data structure

## Contributing

When adding new features:
1. Follow existing code structure
2. Maintain brand identity (see `docs/design/brand-identity.md`)
3. Test responsiveness (mobile, tablet, desktop)
4. Update this document if adding major features

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Brand Identity Guide](./design/brand-identity.md)
