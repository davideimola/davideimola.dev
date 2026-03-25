import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type React from "react";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { AuthorBio } from "../../../components/ui/AuthorBio";
import { Breadcrumb } from "../../../components/ui/Breadcrumb";
import { BackToTop } from "../../../components/ui/BackToTop";
import { Badge } from "../../../components/ui/Badge";
import { CodeBlock } from "../../../components/ui/CodeBlock";
import { GiscusComments } from "../../../components/ui/GiscusComments";
import { JsonLd } from "../../../components/ui/JsonLd";
import { PostNavigation } from "../../../components/ui/PostNavigation";
import { ReadingProgress } from "../../../components/ui/ReadingProgress";
import { RelatedPosts } from "../../../components/ui/RelatedPosts";
import { ShareButtons } from "../../../components/ui/ShareButtons";
import { TableOfContents } from "../../../components/ui/TableOfContents";
import {
  extractToc,
  getAllPosts,
  getPostBySlug,
  getPrevNextPosts,
  getRelatedPosts,
} from "../../../lib/content";

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

  const ogImageUrl = `https://davideimola.dev/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://davideimola.dev/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://davideimola.dev/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
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
  const { prev, next } = getPrevNextPosts(slug);
  const related = getRelatedPosts(slug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://davideimola.dev" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://davideimola.dev/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://davideimola.dev/blog/${slug}` },
    ],
  };

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `https://davideimola.dev/blog/${slug}`,
    author: {
      "@type": "Person",
      name: "Davide Imola",
      url: "https://davideimola.dev",
    },
    keywords: post.tags.join(", "),
    ...(post.heroImage && { image: post.heroImage }),
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={blogPostingSchema} />
      <ReadingProgress />
      <BackToTop />
      <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
        <Breadcrumb
          command="cat"
          items={[
            { label: "blog", href: "/blog" },
            { label: `${slug}.mdx` },
          ]}
          className="mb-10"
        />

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Article */}
          <article className="flex-1 min-w-0">
            {/* Header */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <a
                  href={`/blog?category=${encodeURIComponent(post.category)}`}
                  className="font-mono text-[10px] font-medium tracking-[0.08em] uppercase rounded-[2px] px-2 py-0.5 text-text-3 bg-border hover:text-accent transition-colors duration-150"
                >
                  {post.category}
                </a>
                {post.featured && <Badge variant="active">Featured</Badge>}
              </div>
              <h1 className="font-mono text-[26px] sm:text-[32px] font-bold text-text-1 tracking-[-0.03em] leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="font-mono text-[12px] text-text-3">
                  {formatDate(post.date)} · {post.readingTime}
                </p>
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {post.tags.map((tag) => (
                    <a
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}
                      className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
                    >
                      #{tag.toLowerCase()}
                    </a>
                  ))}
                </div>
              </div>
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

            <AuthorBio />
            <ShareButtons slug={post.slug} title={post.title} />
            <PostNavigation prev={prev} next={next} />
            <RelatedPosts posts={related} />
            <GiscusComments />
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
