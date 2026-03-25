// Content data layer — placeholder data until MDX pipeline is implemented in issue #12/#14

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  readingTime: number;
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

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "gitops-at-scale",
    title: "GitOps at scale: lessons from production",
    date: "2026-02-10",
    tags: ["GitOps", "Kubernetes", "DevOps"],
    excerpt:
      "After two years running GitOps in production across multiple clusters, here's what I'd tell my past self.",
    readingTime: 7,
  },
  {
    slug: "go-error-handling",
    title: "Error handling in Go: patterns that actually work",
    date: "2025-12-05",
    tags: ["Go", "Backend"],
    excerpt:
      "A pragmatic guide to Go error handling that doesn't end up with error strings everywhere.",
    readingTime: 5,
  },
  {
    slug: "platform-engineering-intro",
    title: "Platform engineering is not just DevOps with a new name",
    date: "2025-10-18",
    tags: ["Platform Engineering", "DevOps"],
    excerpt:
      "What actually changes when you shift from DevOps to platform engineering, and when it makes sense.",
    readingTime: 6,
  },
];

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

export function getRecentPosts(count = 3): BlogPost[] {
  return [...BLOG_POSTS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getRecentTalks(count = 3): Talk[] {
  return [...TALKS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}
