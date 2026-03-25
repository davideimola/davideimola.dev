import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type React from "react";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Badge } from "../../../components/ui/Badge";
import { CodeBlock } from "../../../components/ui/CodeBlock";
import { ReadingProgress } from "../../../components/ui/ReadingProgress";
import { TableOfContents } from "../../../components/ui/TableOfContents";
import { extractToc, getAllPosts, getPostBySlug } from "../../../lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const toc = extractToc(post.content);

  return (
    <>
      <ReadingProgress />
      <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
        {/* Back link */}
        <a
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-[12px] text-text-3 no-underline hover:text-text-2 transition-colors duration-150 mb-10"
        >
          ← back to blog
        </a>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Article */}
          <article className="flex-1 min-w-0">
            {/* Header */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="category">{post.category}</Badge>
                {post.featured && <Badge variant="active">Featured</Badge>}
              </div>
              <h1 className="font-mono text-[26px] sm:text-[32px] font-bold text-text-1 tracking-[-0.03em] leading-tight mb-4">
                {post.title}
              </h1>
              <p className="font-mono text-[12px] text-text-3">
                {formatDate(post.date)} · {post.readingTime}
              </p>
            </header>

            {/* Hero image */}
            {post.heroImage && (
              <div className="relative w-full aspect-2/1 mb-10 rounded-sm overflow-hidden border border-border">
                <Image
                  src={post.heroImage}
                  alt={post.heroImageAlt ?? post.title}
                  fill
                  className="object-cover grayscale"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div id="article-content" className="prose prose-lg max-w-none">
              <MDXRemote
                source={post.content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug, [rehypePrism, { ignoreMissing: true }]],
                  },
                }}
                components={{ pre: CodeBlock as React.ComponentType<object> }}
              />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <footer className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="category">
                    {tag}
                  </Badge>
                ))}
              </footer>
            )}
          </article>

          {/* Sticky ToC */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-[220px] shrink-0">
              <div className="sticky top-[72px]">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
