# Content Management Guide

This directory contains all the data for your website. Update these files to manage your content without touching the UI code.

## 📁 Files Overview

### `now.ts`
Manage your "What I'm Doing Now" section on the About page.

**How to update:**
```typescript
export const nowInfo = {
  lastUpdated: "October 2025", // Update when you make changes
  currentRole: {
    title: "Software Engineer",
    company: "RedCarbon",
    companyLogo: "/logos/redcarbon.png", // Optional
    location: "Remote / Verona, Italy",
    description: "What you're working on",
  },
  location: { city: "Verona", country: "Italy", ... },
  learning: ["Topic 1", "Topic 2"],
  workingOn: ["Project 1", "Project 2"],
  hobbies: {
    sports: { name: "Football", emoji: "⚽", details: "..." },
    // ... other hobbies
  }
}
```

**Update frequency:** Monthly or when something significant changes.

---

### `uses.ts`
Manage your tech stack and tools on the `/uses` page.

**How to add/update items:**
```typescript
export const usesData = {
  lastUpdated: "October 2025",
  hardware: {
    items: [
      {
        name: "MacBook Pro 16\"",
        description: "M3 Max, 48GB RAM",
        category: "Laptop",
      },
    ],
  },
  software: {
    items: [
      {
        name: "VS Code",
        description: "Primary editor",
        category: "Editor",
        link: "https://code.visualstudio.com/",
      },
    ],
  },
  // ... devStack, services, extensions
}
```

**Sections:** Hardware, Software, Dev Stack, Services, VS Code Extensions

**Update frequency:** Quarterly or when you switch major tools.

---

## 📁 Content Files

### `speaking-events.ts`
Manage all your speaking engagements, conferences, and podcast appearances.

**How to add a new event:**
```typescript
{
  id: 15, // Increment from the last ID
  title: "Your Conference Name",
  role: "Speaker", // or "Organizer", "MC", "Guest", etc.
  talkTitle: "Title of Your Talk",
  location: "City, Country", // or "Remote"
  date: "2025-06-15", // Format: YYYY-MM-DD
  type: "Conference", // or "Meetup", "Podcast", etc.
  description: "Brief description of your talk",
  videoUrl: "https://youtube.com/...", // Optional
  slidesUrl: "https://slides.com/...", // Optional
  website: "https://conference-site.com", // Optional
  coSpeaker: "with Co-Speaker Name", // Optional
}
```

The system **automatically**:
- Separates past and future events based on today's date
- Sorts upcoming events (nearest first)
- Sorts past events (most recent first)

### `projects.ts`
Manage all your projects, conferences, communities, and open-source work.

**How to add a new project:**
```typescript
{
  id: 6,
  title: "Your Project Name",
  category: "Open Source", // or "Conference", "Community", "SaaS"
  description: "Description of your project",
  technologies: ["Tech1", "Tech2", "Tech3"],
  links: {
    website: "https://...",
    github: "https://github.com/...",
    // npm, demo, docs are also available
  },
  status: "Active", // or "Completed", "Archived"
  year: "2024-Present",
  featured: true, // Set to true to show in homepage
  highlights: [ // Optional, for featured projects
    "Highlight 1",
    "Highlight 2",
  ],
}
```

### `blog-posts.ts`
Manage all your blog posts metadata.

**How to add a new blog post:**
```typescript
{
  id: 7,
  title: "Your Article Title",
  excerpt: "Brief summary of the article...",
  category: "DevOps", // or any category
  readTime: "5 min read",
  publishDate: "2024-12-15", // Format: YYYY-MM-DD
  slug: "your-article-slug", // Used in URL: /blog/your-article-slug
  tags: ["Tag1", "Tag2", "Tag3"],
  featured: true, // Shows in featured section
}
```

## 🔄 How It Works

1. **Edit the content files** in `src/content/`
2. **Save the file** - changes are picked up automatically
3. **Refresh your browser** - the content updates immediately

No need to touch any UI components or page files!

## 📝 Next Steps

### For Blog Posts

**The blog system is fully configured and ready!** ✅

You have 6 real blog posts already imported:
1. 2023 Retrospective
2. Level UP your RDBMS Productivity in GO
3. Securing Secrets in the Age of GitOps
4. 2022 Retrospective
5. Git Hook in GitKraken Client with Husky and Nvm
6. How to Delete Docker Image From Private Registry

**To add a new blog post:**

1. **Create the MDX file:**
   ```bash
   # In src/content/blog/
   touch my-new-post.mdx
   ```

2. **Add frontmatter and content:**
   ```mdx
   ---
   title: Your Post Title
   description: Brief description
   pubDate: Jan 15 2024
   heroImage: https://images.unsplash.com/...
   heroImageAlt: Image description
   ---

   Your markdown content here...
   ```

3. **Add metadata to `blog-posts.ts`:**
   ```typescript
   {
     id: 7,
     title: "Your Post Title",
     excerpt: "Brief summary...",
     category: "DevOps", // or GitOps, Kubernetes, etc.
     readTime: "5 min read",
     publishDate: "2024-01-15",
     slug: "my-new-post", // Must match filename without .mdx
     tags: ["Tag1", "Tag2"],
     featured: true,
   }
   ```

4. Save and refresh - your post is live at `/blog/my-new-post`!

### Adding Images to Blog Posts

**For images in your blog posts:**

1. **Store images in `/public/blog/`:**
   ```bash
   mkdir -p public/blog/my-post-slug/
   cp my-image.jpg public/blog/my-post-slug/
   ```

2. **Reference them in your MDX:**
   ```markdown
   ![Image description](/blog/my-post-slug/my-image.jpg)
   ```

**Important:**
- ✅ Use **absolute paths** starting with `/blog/...`
- ❌ Don't use relative paths like `./images/...`
- 💡 Organize images by post: `/public/blog/post-slug/image.jpg`
- 🎨 Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

**Example:**
```markdown
![Spotify Wrapped 2023](/blog/2023-retrospective/spotify-wrapped-2023.jpeg)
```

## 🎯 Tips

- Keep IDs sequential and unique
- Use ISO date format (YYYY-MM-DD) for proper sorting
- Add meaningful descriptions for SEO
- Include links to slides/videos when available
- Mark your best work as `featured: true`

