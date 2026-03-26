import { getAllPosts, getAllProjects, getAllTalks } from "./content";

export interface SearchItem {
  id: string;
  type: "post" | "talk" | "project" | "page";
  title: string;
  description: string;
  href: string;
  meta?: string;
}

const STATIC_PAGES: SearchItem[] = [
  { id: "page-home", type: "page", title: "Home", description: "davideimola.dev", href: "/" },
  {
    id: "page-about",
    type: "page",
    title: "About",
    description: "Who I am, what I do, and how I got here.",
    href: "/about",
  },
  {
    id: "page-now",
    type: "page",
    title: "Now",
    description: "What I'm working on and thinking about right now.",
    href: "/now",
  },
  {
    id: "page-uses",
    type: "page",
    title: "Uses",
    description: "Hardware, software, and tools I use daily.",
    href: "/uses",
  },
  {
    id: "page-sharing",
    type: "page",
    title: "Sharing",
    description: "Talks, workshops, and events on Go, platform engineering, and open source.",
    href: "/sharing",
  },
  {
    id: "page-blog",
    type: "page",
    title: "Blog",
    description: "Articles on engineering, security, and open source.",
    href: "/blog",
  },
  {
    id: "page-projects",
    type: "page",
    title: "Projects",
    description: "Open source tools, communities, and side projects.",
    href: "/projects",
  },
];

export function buildSearchIndex(): SearchItem[] {
  const posts: SearchItem[] = getAllPosts().map((p) => ({
    id: `post-${p.slug}`,
    type: "post",
    title: p.title,
    description: p.excerpt,
    href: `/blog/${p.slug}`,
    meta: p.category,
  }));

  const talks: SearchItem[] = getAllTalks()
    .filter((t) => !!t.session)
    .map((t) => ({
      id: `talk-${t.slug}`,
      type: "talk",
      title: t.session?.title as string,
      description: t.event,
      href: `/sharing`,
      meta: new Date(t.date).getFullYear().toString(),
    }));

  const projects: SearchItem[] = getAllProjects().map((p) => ({
    id: `project-${p.slug}`,
    type: "project",
    title: p.title,
    description: p.description,
    href: p.url ?? p.github ?? "/projects",
    meta: p.status,
  }));

  return [...STATIC_PAGES, ...posts, ...talks, ...projects];
}
