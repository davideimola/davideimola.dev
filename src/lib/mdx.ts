import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { blogPosts } from "~/content/blog-posts";
import { markdownToHtml } from "./markdown";

const blogDirectory = path.join(process.cwd(), "src/content/blog");

export async function getBlogPost(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(blogDirectory, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const htmlContent = await markdownToHtml(content);

  // Get metadata from blog-posts.ts
  const postMetadata = blogPosts.find((post) => post.slug === realSlug);

  return {
    slug: realSlug,
    frontmatter: data,
    content: htmlContent,
    metadata: postMetadata,
  };
}

export function getAllBlogSlugs() {
  return blogPosts.map((post) => post.slug);
}

export function getBlogPostMetadata(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
