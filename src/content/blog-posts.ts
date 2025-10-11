/**
 * Blog Posts Data
 *
 * Real blog posts from davideimola.dev
 */

export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishDate: string; // Format: YYYY-MM-DD
  slug: string;
  tags: string[];
  featured?: boolean;
  heroImage?: string;
  heroImageAlt?: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "2023 Retrospective",
    excerpt:
      "A look back at 2023 - reflecting on goals, business growth, health, community involvement, learning, and plans for 2024.",
    category: "Personal",
    readTime: "10 min read",
    publishDate: "2023-12-28",
    slug: "2023-retrospective",
    tags: ["Retrospective", "Year Review", "Community", "Learning"],
    featured: false,
    heroImage:
      "https://images.unsplash.com/photo-1668855516656-7c250e694564?q=80&w=3870&auto=format&fit=crop",
    heroImageAlt: "Desktop folder renamed to 2023",
  },
  {
    id: 2,
    title: "Level UP your RDBMS Productivity in GO",
    excerpt:
      "Learn how to improve your RDBMS productivity in GO with sqlc, dbmate, and docker test. A comprehensive guide to handling SQL databases efficiently in Go.",
    category: "Go",
    readTime: "12 min read",
    publishDate: "2023-12-05",
    slug: "level-up-your-rdbms-productivity-in-go",
    tags: ["Go", "PostgreSQL", "Database", "sqlc", "dbmate"],
    featured: true,
    heroImage:
      "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=3870&auto=format&fit=crop",
    heroImageAlt: "Hard disk representing database storage",
  },
  {
    id: 3,
    title: "Securing Secrets in the Age of GitOps",
    excerpt:
      "Learn how to secure secrets in a GitOps workflow using Sealed Secrets, Secrets Managers, and the Secret Store CSI Driver. Managing sensitive data in Kubernetes.",
    category: "GitOps",
    readTime: "8 min read",
    publishDate: "2023-10-27",
    slug: "securing-secrets-in-the-gitops-era",
    tags: ["GitOps", "Kubernetes", "Security", "Sealed Secrets", "DevOps"],
    featured: true,
    heroImage:
      "https://images.unsplash.com/photo-1618060932014-4deda4932554?auto=format&fit=crop&q=80&w=3870",
    heroImageAlt: "Lock in the middle of key caps representing security",
  },
  {
    id: 4,
    title: "2022 Retrospective",
    excerpt:
      "A look back at 2022 - my first year retrospective covering business changes, health, community involvement, learning new technologies, and goals for 2023.",
    category: "Personal",
    readTime: "8 min read",
    publishDate: "2022-12-23",
    slug: "2022-retrospective",
    tags: ["Retrospective", "Year Review", "Career", "DevOps"],
    featured: false,
    heroImage:
      "https://images.unsplash.com/photo-1635335356074-5a9e45b47a14?auto=format&fit=crop&w=3174&q=80",
    heroImageAlt: "Year 2022 in ASCII art",
  },
  {
    id: 5,
    title: "Git Hook in GitKraken Client with Husky and Nvm",
    excerpt:
      "How to configure GitKraken Client to run Git hooks with Husky and Nvm. A practical guide to setting up pre-commit hooks in your favorite Git GUI.",
    category: "Git",
    readTime: "6 min read",
    publishDate: "2022-01-08",
    slug: "git-hooks-gitkraken-client-husky-nvm",
    tags: ["Git", "GitKraken", "Husky", "Nvm", "Tooling"],
    featured: false,
    heroImage:
      "https://images.unsplash.com/photo-1627399270231-7d36245355a9?auto=format&fit=crop&w=1974&q=80",
    heroImageAlt: "Code editor showing files",
  },
  {
    id: 6,
    title: "How to Delete Docker Image From Private Registry",
    excerpt:
      "A practical guide to deleting Docker images from private registries using Docker's API. Step-by-step instructions for managing your private registry.",
    category: "Docker",
    readTime: "5 min read",
    publishDate: "2020-06-12",
    slug: "delete-docker-image-from-private-registry",
    tags: ["Docker", "Registry", "DevOps", "API"],
    featured: false,
    heroImage:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=2971&q=80",
    heroImageAlt: "Container ship representing Docker containers",
  },
];
