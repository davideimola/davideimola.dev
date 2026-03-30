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
  draft?: boolean;
  heroImage?: string;
  heroImageAlt?: string;
  content: string;
}

export interface TalkSession {
  title: string;
  format: "Talk" | "Workshop" | "Interview" | "Panel" | "Lightning Talk";
  coSpeaker?: string;
  slides?: string;
  video?: string;
}

export interface Talk {
  slug: string;
  event: string;
  type: "Conference" | "Meetup" | "Podcast/Stream";
  date: string;
  eventDateRange?: string;
  location: string;
  organizer?: boolean;
  mc?: boolean;
  session?: TalkSession;
  tags: string[];
}

export interface Project {
  slug: string;
  title: string;
  role?: string; // e.g. "Tech Lead" — shown when the project is a workplace, not something you built
  status: "active" | "coming-soon" | "archived";
  url?: string;
  github?: string;
  caseStudy?: string; // internal path to case study page, e.g. "/projects/redcarbon"
  period: string;
  featured: boolean;
  tags: string[];
  description: string;
}

export interface OssContribution {
  name: string;
  description: string;
  github: string;
  url?: string;
  tags: string[];
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
    draft: data.draft ?? false,
    heroImage: data.heroImage,
    heroImageAlt: data.heroImageAlt,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  const isDev = process.env.NODE_ENV === "development";
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parsePost(f.replace(".mdx", "")))
    .filter((p) => isDev || !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const isDev = process.env.NODE_ENV === "development";
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const post = parsePost(slug);
  if (!isDev && post.draft) return null;
  return post;
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

// ── Talks ─────────────────────────────────────────────────────────────────

function loadTalks(): Talk[] {
  const raw = fs.readFileSync(path.join(process.cwd(), "src/content/talks.json"), "utf-8");
  return JSON.parse(raw) as Talk[];
}

export function getRecentTalks(count = 3): Talk[] {
  return loadTalks()
    .filter((t) => !!t.session)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getAllTalks(): Talk[] {
  return loadTalks().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Projects ──────────────────────────────────────────────────────────────

function loadProjects(): Project[] {
  const raw = fs.readFileSync(path.join(process.cwd(), "src/content/projects.json"), "utf-8");
  return JSON.parse(raw) as Project[];
}

export function getAllProjects(): Project[] {
  const order = { active: 0, "coming-soon": 1, archived: 2 };
  return loadProjects().sort((a, b) => order[a.status] - order[b.status]);
}

export function getFeaturedProjects(): Project[] {
  return loadProjects().filter((p) => p.featured);
}

// ── OSS Contributions ─────────────────────────────────────────────────────

export function getOssContributions(): OssContribution[] {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "src/content/oss-contributions.json"),
    "utf-8"
  );
  return JSON.parse(raw) as OssContribution[];
}
