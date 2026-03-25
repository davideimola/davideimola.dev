import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

// ── Types ──────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string; // mapped from publishDate
  readingTime: string;
  featured: boolean;
  heroImage?: string;
  heroImageAlt?: string;
  content: string;
}

export interface Talk {
  slug: string;
  title: string;
  event: string;
  date: string;
  location: string;
  slides?: string;
  video?: string;
  tags: string[];
}

export interface Project {
  slug: string;
  title: string;
  status: "active" | "coming-soon" | "archived";
  url?: string;
  github?: string;
  period: string;
  featured: boolean;
  tags: string[];
  description: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

// ── Blog ──────────────────────────────────────────────────────────────────

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = [];
  for (const line of content.split("\n")) {
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);
    if (h2) {
      const text = h2[1].replace(/[*_`[\]]/g, "").trim();
      toc.push({ id: slugify(text), text, level: 2 });
    } else if (h3) {
      const text = h3[1].replace(/[*_`[\]]/g, "").trim();
      toc.push({ id: slugify(text), text, level: 3 });
    }
  }
  return toc;
}

function parsePost(slug: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf-8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  return {
    slug,
    title: data.title,
    excerpt: data.excerpt ?? "",
    category: data.category ?? "General",
    tags: data.tags ?? [],
    date: data.publishDate,
    readingTime: rt.text,
    featured: data.featured ?? false,
    heroImage: data.heroImage,
    heroImageAlt: data.heroImageAlt,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parsePost(f.replace(".mdx", "")))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parsePost(slug);
}

export function getRecentPosts(count = 3): BlogPost[] {
  return getAllPosts().slice(0, count);
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];

  return all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => current.tags.includes(t)).length;
      const sameCategory = p.category === current.category ? 1 : 0;
      return { post: p, score: sharedTags * 2 + sameCategory };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ post }) => post);
}

export function getPrevNextPosts(slug: string): { prev: BlogPost | null; next: BlogPost | null } {
  const all = getAllPosts(); // sorted newest first
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: all[idx + 1] ?? null, // older
    next: all[idx - 1] ?? null, // newer
  };
}

// ── Talks (placeholder — replaced in issue #14) ───────────────────────────

const TALKS: Talk[] = [
  {
    slug: "gitops-kcd-italy-2025",
    title: "From chaos to control: GitOps for platform teams",
    event: "KCD Italy 2025",
    date: "2025-06-20",
    location: "Milan, Italy",
    tags: ["GitOps", "Kubernetes"],
  },
  {
    slug: "go-security-codemotion-2025",
    title: "Secure by design: building safer Go services",
    event: "Codemotion Milan 2025",
    date: "2025-04-10",
    location: "Milan, Italy",
    tags: ["Go", "Security"],
  },
  {
    slug: "platform-eng-devops-days-2024",
    title: "The platform engineering shift",
    event: "DevOpsDays Zurich 2024",
    date: "2024-09-15",
    location: "Zurich, Switzerland",
    tags: ["Platform Engineering", "DevOps"],
  },
];

export function getRecentTalks(count = 3): Talk[] {
  return [...TALKS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

// ── Projects ──────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    slug: "schrodinger-hat",
    title: "Schrodinger Hat",
    status: "active",
    url: "https://schrodinger-hat.it",
    period: "2020–present",
    featured: true,
    tags: ["Community", "Open Source"],
    description:
      "International open source community. 20k+ people reached, 100+ speakers at events across Europe.",
  },
  {
    slug: "worky",
    title: "Worky",
    status: "coming-soon",
    url: "https://worky.davideimola.dev",
    github: "https://github.com/davideimola/worky",
    period: "2026",
    featured: true,
    tags: ["Tool", "Workshops"],
    description:
      "A tool for running interactive workshops. Designed for speakers and educators who want to engage their audience.",
  },
];

export function getAllProjects(): Project[] {
  return [...PROJECTS].sort((a, b) => {
    const order = { active: 0, "coming-soon": 1, archived: 2 };
    return order[a.status] - order[b.status];
  });
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}
