# davideimola.dev

Personal website of **Davide Imola** - Software Engineer, conference organizer, and tech speaker.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![MDX](https://img.shields.io/badge/MDX-3-1B1F24?style=flat-square&logo=mdx)](https://mdxjs.com/)

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.

## 📝 Content Management

All content is managed through simple TypeScript files in `/src/content/`:

- **`speaking-events.ts`** - Speaking engagements, conferences, podcasts
- **`projects.ts`** - Projects, communities, conferences you organize
- **`blog-posts.ts`** - Blog posts metadata

See [`/src/content/README.md`](./src/content/README.md) for detailed instructions.

### Adding Content

**Add a speaking event:**
```typescript
// src/content/speaking-events.ts
{
  id: 15,
  title: "Conference Name",
  role: "Speaker",
  talkTitle: "Your Talk Title",
  location: "City, Country",
  date: "2025-06-15", // YYYY-MM-DD
  type: "Conference",
  description: "Talk description",
  videoUrl: "https://...",  // Optional
  slidesUrl: "https://...", // Optional
}
```

The system **automatically** separates past/future events based on the current date!

**Add a project:**
```typescript
// src/content/projects.ts
{
  id: 6,
  title: "Project Name",
  category: "Open Source",
  description: "Project description",
  technologies: ["Tech1", "Tech2"],
  links: { website: "https://...", github: "https://..." },
  status: "Active",
  year: "2024-Present",
  featured: true, // Shows on homepage
}
```

**Add a blog post:**
```typescript
// src/content/blog-posts.ts
{
  id: 7,
  title: "Your Article Title",
  excerpt: "Brief summary of the article...",
  category: "Go", // or any category
  readTime: "5 min read",
  publishDate: "2024-01-15", // YYYY-MM-DD
  slug: "your-article-slug", // Must match MDX filename
  tags: ["Tag1", "Tag2"],
  featured: false,
  heroImage: "https://images.unsplash.com/...", // Optional
  heroImageAlt: "Image description", // Optional
}
```

Then create the MDX file at `src/content/blog/your-article-slug.mdx`

## 🏢 Company Logos

The experience page supports company logos! You have two options:

### Option 1: Use the Automatic Logo Downloader

Run the utility script to automatically download logos using Clearbit API:

```bash
node scripts/download-logos.js
```

This will:
- ✅ Download logos from Clearbit (free, no API key needed)
- ✅ Save them to `/public/logos/`
- ✅ Show a summary of what was downloaded

### Option 2: Add Logos Manually

1. Save logo files to `/public/logos/`
2. Add the `logo` field to your experience:

```typescript
// src/app/experience/page.tsx
const experiences = [
  {
    company: "YourCompany",
    logo: "/logos/yourcompany.png", // Add this line
    position: "Software Engineer",
    // ... rest of the data
  },
];
```

### Graceful Fallback

If a logo is missing or fails to load, the system automatically shows:
- **Colored initials** (e.g., "RC" for RedCarbon)
- Consistent colors generated from company name
- Professional gradient background

**No logo required!** The system looks great either way.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── _components/        # Reusable components
│   │   ├── header.tsx      # Navigation
│   │   ├── footer.tsx      # Footer with links
│   │   └── structured-data.tsx  # SEO structured data
│   ├── about/             # About page
│   ├── blog/              # Blog listing
│   ├── experience/        # CV/Resume page
│   ├── projects/          # Projects showcase
│   ├── speaking/          # Speaking engagements
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   ├── layout.tsx         # Root layout with dark theme
│   ├── page.tsx           # Homepage
│   ├── robots.ts          # SEO robots.txt
│   └── sitemap.ts         # SEO sitemap
├── content/               # Content management (EDIT HERE!)
│   ├── speaking-events.ts # All speaking events
│   ├── projects.ts        # All projects
│   ├── blog-posts.ts      # Blog metadata
│   ├── blog/              # MDX blog posts
│   └── README.md          # Content management guide
├── lib/                   # Utilities
│   ├── mdx.ts             # MDX processing
│   └── markdown.ts        # Markdown to HTML
└── styles/                # Global styles & Prism theme
```

## 🎨 Design System

**Brand Colors:**
- Primary: Blue (`blue-400`, `blue-500`, `blue-600`)
- Accent: Purple (for Schrodinger Hat)
- Background: Dark (`gray-950`, `gray-900`)
- Text: Light grays (`gray-100`, `gray-400`)

**Theme:**
- Minimalist dark design
- Clean typography (Geist font)
- Subtle hover effects and transitions
- Mobile-first responsive

## ✨ Features

- ✅ **Dark minimalist theme** - Professional and easy on the eyes
- ✅ **Fully responsive** - Perfect on mobile, tablet, and desktop
- ✅ **SEO optimized** - Meta tags, structured data, sitemap
- ✅ **Easy content management** - Edit TypeScript files, no database needed
- ✅ **MDX blog with syntax highlighting** - Write technical articles with PrismJS
- ✅ **Dynamic content** - Homepage auto-updates from content files
- ✅ **Company logos with fallback** - Professional CV with logos or colored initials
- ✅ **Category filters** - Filter blog posts by category in real-time
- ✅ **Hero images** - Support for hero images in blog posts
- ✅ **Auto-sorting events** - Automatically separates past/future by date
- ✅ **Volunteering section** - Separate community work from professional experience
- ✅ **Type-safe** - Full TypeScript with strict types
- ✅ **Performance** - Fully static, optimized build
- ✅ **Accessible** - Semantic HTML, ARIA labels

## 📄 Pages

1. **Home** (`/`) - Hero, featured projects, recent talks, latest blog posts
2. **About** (`/about`) - Personal story, skills, stats, contact info
3. **Projects** (`/projects`) - OSDay, Schrodinger Hat, open-source work
4. **Experience** (`/experience`) - Professional CV, work history, education
5. **Blog** (`/blog`) - Technical articles with MDX, syntax highlighting, category filters
6. **Speaking** (`/speaking`) - All talks and events (auto-sorted)
7. **Privacy** (`/privacy`) - Privacy policy
8. **Terms** (`/terms`) - Terms of service

## 🔧 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Content:** MDX for blog posts
- **Syntax Highlighting:** PrismJS with rehype-prism-plus
- **Markdown:** unified, remark, rehype
- **Validation:** Zod
- **Package Manager:** pnpm

## 🌐 SEO Features

- ✅ Meta tags (Open Graph, Twitter Cards)
- ✅ Structured data (Schema.org)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Semantic HTML
- ✅ Alt texts and ARIA labels
- ✅ Fast Core Web Vitals

## 📱 Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix linting issues
pnpm format:check # Check formatting
pnpm format:write # Format all files
pnpm typecheck    # Type checking
pnpm check        # Lint + typecheck
```

## 🚀 Deployment

This site is optimized for **Vercel** deployment:

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Deploy automatically on every push

Or deploy manually:
```bash
pnpm build
pnpm start
```

## 🎯 Next Steps

1. **Add real images** - Replace placeholder gradients with actual photos
2. **Write blog posts** - Create MDX files in `/src/app/blog/[slug]/`
3. **Update professional info** - Edit Experience page with real work history
4. **Add analytics** - Integrate Vercel Analytics or Google Analytics
5. **Social sharing images** - Create OG images for better social previews
6. **Newsletter integration** - Connect email signup to ConvertKit/Mailchimp

## 📬 Contact

- **Email:** hello@davideimola.dev
- **GitHub:** [@davideimola](https://github.com/davideimola)
- **LinkedIn:** [davideimola](https://linkedin.com/in/davideimola)

## 📄 License

© 2025 Davide Imola. All rights reserved.

---

Built with ❤️ using the [T3 Stack](https://create.t3.gg/)
