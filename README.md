# davideimola.dev

> **Personal website of Davide Imola** – Software Engineer, conference organizer, and tech speaker.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Visit **[http://localhost:3000](http://localhost:3000)**

---

## ✏️ Content Management

All content is managed through **simple TypeScript files** in `/src/content/`:

```bash
src/content/
├── speaking-events.ts  # Conferences, talks, podcasts
├── projects.ts         # OSDay, Schrodinger Hat, open-source
├── blog-posts.ts       # Blog metadata
├── now.ts             # "What I'm doing now" section
├── uses.ts            # Tech stack & tools
└── blog/              # MDX blog posts
```

**→ [See Content Management Guide](./src/content/README.md)**

---

## 🎨 Design System

**Japanese-inspired aesthetic** (和) combining traditional elements with modern minimalism:

- **Akane Red** `#C91F37` – Primary accent
- **Kanji accents** – 道 (way), 創 (create), 語 (speak), 書 (write)
- **Seigaiha pattern** – Ocean waves background
- **Ma** (間) – Respect for negative space

**→ [See Brand Identity Guide](./docs/design/brand-identity.md)**

---

## 📚 Documentation

### **Setup Guides**
- **[Contact Form Setup](./docs/setup/contact-form.md)** – Resend API integration
- **[Newsletter Setup](./docs/setup/newsletter.md)** – Kit (ConvertKit) integration

### **Development**
- **[Features Changelog](./docs/development/features-changelog.md)** – New features log
- **[Menu Optimization](./docs/development/menu-optimization.md)** – Navigation changes

### **Design**
- **[Brand Identity](./docs/design/brand-identity.md)** – Complete design system
- **[Brand Audit](./docs/design/brand-audit.md)** – Initial site audit

---

## ✨ Features

- ✅ Dark minimalist theme with Japanese aesthetics
- ✅ Fully responsive (mobile-first)
- ✅ SEO optimized (meta tags, structured data, sitemap)
- ✅ MDX blog with syntax highlighting
- ✅ Contact form with Resend API
- ✅ Newsletter integration with Kit
- ✅ "What I'm Doing Now" section
- ✅ "/uses" page (tech stack showcase)
- ✅ Dynamic content (no database needed)
- ✅ TypeScript strict mode
- ✅ Performance optimized

---

## 🔧 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Content** | MDX + TypeScript |
| **Syntax** | PrismJS |
| **Email** | Resend API |
| **Newsletter** | Kit (ConvertKit) |
| **Deployment** | Vercel |

---

## 📱 Commands

```bash
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Run ESLint
pnpm lint:fix      # Fix linting issues
pnpm format:write  # Format all files
pnpm typecheck     # Type checking
pnpm check         # Lint + typecheck
```

---

## 🚀 Deployment

Optimized for **Vercel**:

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add environment variables (see [docs/setup/](./docs/setup/))
4. Deploy automatically on every push

**Environment variables needed:**
- `RESEND_API_KEY` – Contact form
- `CONTACT_EMAIL` – Email recipient
- `CONVERTKIT_API_KEY` – Newsletter
- `CONVERTKIT_FORM_ID` – Newsletter form ID

---

## 📂 Project Structure

```
davideimola.dev/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── _components/  # Reusable components
│   │   ├── about/        # About page
│   │   ├── blog/         # Blog listing
│   │   ├── contact/      # Contact form
│   │   ├── experience/   # CV/Resume
│   │   ├── projects/     # Projects showcase
│   │   ├── speaking/     # Speaking engagements
│   │   └── uses/         # Tech stack & tools
│   └── content/          # Content files (EDIT HERE!)
├── docs/                 # Documentation
│   ├── setup/           # Setup guides
│   ├── development/     # Development docs
│   └── design/          # Design system
└── public/
    └── logos/           # Company logos
```

---

## 📬 Contact

- **Website:** [davideimola.dev](https://davideimola.dev)
- **Email:** hello@davideimola.dev
- **GitHub:** [@davideimola](https://github.com/davideimola)
- **LinkedIn:** [davideimola](https://linkedin.com/in/davideimola)

---

## 📄 License

© 2025 Davide Imola. All rights reserved.

Built with ❤️ using Next.js and Tailwind CSS.
