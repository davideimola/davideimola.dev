import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml } from "./markdown";

export interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishDate: string; // YYYY-MM-DD
  slug: string; // derived from filename at runtime
  tags: string[];
  featured?: boolean;
  heroImage?: string;
  heroImageAlt?: string;
}

const blogDirectory = path.join(process.cwd(), "src/content/blog");

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const filenames = fs
    .readdirSync(blogDirectory)
    .filter((f) => f.endsWith(".mdx"));

  const posts = filenames.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const fullPath = path.join(blogDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title as string,
      excerpt: data.excerpt as string,
      category: data.category as string,
      readTime: data.readTime as string,
      publishDate: data.publishDate as string,
      tags: (data.tags as string[]) ?? [],
      featured: data.featured as boolean | undefined,
      heroImage: data.heroImage as string | undefined,
      heroImageAlt: data.heroImageAlt as string | undefined,
    } satisfies BlogPost;
  });

  return posts.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
}

export function getAllBlogSlugs(): string[] {
  return fs
    .readdirSync(blogDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getBlogPost(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(blogDirectory, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const htmlContent = await markdownToHtml(content);

  const metadata: BlogPost = {
    slug: realSlug,
    title: data.title as string,
    excerpt: data.excerpt as string,
    category: data.category as string,
    readTime: data.readTime as string,
    publishDate: data.publishDate as string,
    tags: (data.tags as string[]) ?? [],
    featured: data.featured as boolean | undefined,
    heroImage: data.heroImage as string | undefined,
    heroImageAlt: data.heroImageAlt as string | undefined,
  };

  return {
    slug: realSlug,
    frontmatter: data,
    content: htmlContent,
    metadata,
  };
}

export function getRelatedPosts(
  allPosts: BlogPost[],
  currentSlug: string,
  currentTags: string[],
  currentCategory: string,
  limit = 3,
): BlogPost[] {
  return allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      const tagScore =
        p.tags.filter((tag) =>
          currentTags.some((t) => t.toLowerCase() === tag.toLowerCase()),
        ).length * 2;
      const categoryScore = p.category === currentCategory ? 1 : 0;
      return { ...p, score: tagScore + categoryScore };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score: _score, ...post }) => post as BlogPost);
}

export async function getBlogPostMetadata(
  slug: string,
): Promise<BlogPost | null> {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(blogDirectory, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title as string,
    excerpt: data.excerpt as string,
    category: data.category as string,
    readTime: data.readTime as string,
    publishDate: data.publishDate as string,
    tags: (data.tags as string[]) ?? [],
    featured: data.featured as boolean | undefined,
    heroImage: data.heroImage as string | undefined,
    heroImageAlt: data.heroImageAlt as string | undefined,
  };
}
