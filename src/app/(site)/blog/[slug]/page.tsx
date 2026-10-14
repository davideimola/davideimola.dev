import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type React from "react";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkGithubAlerts from "remark-github-alerts";
import { AuthorBio } from "../../../../components/ui/AuthorBio";
import { BackToTop } from "../../../../components/ui/BackToTop";
import { CodeBlock } from "../../../../components/ui/CodeBlock";
import { GiscusComments } from "../../../../components/ui/GiscusComments";
import { JsonLd } from "../../../../components/ui/JsonLd";
import { PostCover } from "../../../../components/ui/PostCover";
import { PostNavigation } from "../../../../components/ui/PostNavigation";
import { ReadingProgress } from "../../../../components/ui/ReadingProgress";
import { RelatedPosts } from "../../../../components/ui/RelatedPosts";
import { ShareButtons } from "../../../../components/ui/ShareButtons";
import { SubscribeCTA } from "../../../../components/ui/SubscribeCTA";
import { TableOfContents } from "../../../../components/ui/TableOfContents";
import { Tape } from "../../../../components/ui/Tape";
import {
  extractToc,
  getAllPosts,
  getPostBySlug,
  getPrevNextPosts,
  getRelatedPosts,
} from "../../../../lib/content";
import { rasterCover } from "../../../../lib/covers";
import { formatDate } from "../../../../lib/dates";
import { rehypeCodeTitle } from "../../../../lib/rehype-code-title";

function absoluteUrl(src: string): string {
  return src.startsWith("http") ? src : `https://davideimola.dev${src}`;
}

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

  const ogImageUrl = `https://davideimola.dev/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}&path=%2Fblog`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://davideimola.dev/blog/${slug}`,
      types: {
        "text/markdown": `https://davideimola.dev/blog/${slug}.md`,
      },
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
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://davideimola.dev/blog/${slug}`,
      },
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
    ...(post.heroImage && { image: absoluteUrl(rasterCover(post.heroImage)) }),
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={blogPostingSchema} />
      <ReadingProgress />
      <BackToTop />
      <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-12 md:pt-16 pb-20">
        <header className="flex flex-col gap-[22px] max-w-[1000px] pb-10 md:pb-12">
          <Tape tilt={0}>{post.category}</Tape>
          <h1 className="m-0 font-sans font-bold text-fg text-[38px] sm:text-[52px] lg:text-h1 leading-[1.02] tracking-[-0.045em]">
            {post.title}
          </h1>
          <p className="m-0 font-sans text-[19px] sm:text-lead leading-[1.5] text-fg-muted max-w-[820px]">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-meta text-fg-subtle">
            <span>{formatDate(post.date)}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
            <span aria-hidden="true">·</span>
            <span className="flex flex-wrap gap-x-2 gap-y-1">
              {post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}
                  className="text-fg-subtle no-underline hover:text-accent transition-colors duration-150"
                >
                  #{tag.toLowerCase()}
                </a>
              ))}
            </span>
          </div>
        </header>

        <div className="h-px bg-rule" />

        <div className="pt-10 md:pt-14 grid grid-cols-1 lg:grid-cols-[minmax(0,700px)_240px] lg:justify-between gap-12">
          {/* Article: the 700px reading column (docs/brand.md, "Site") */}
          <article className="min-w-0">
            {/* Hero image */}
            {post.heroImage && (
              <PostCover
                src={post.heroImage}
                alt={post.heroImageAlt ?? post.title}
                priority
                className="mb-10"
              />
            )}

            {/* Content */}
            <div id="article-content" className="prose max-w-none">
              <MDXRemote
                source={post.content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm, remarkGithubAlerts],
                    rehypePlugins: [
                      rehypeSlug,
                      rehypeCodeTitle,
                      [rehypePrism, { ignoreMissing: true }],
                    ],
                  },
                }}
                components={{ pre: CodeBlock as React.ComponentType<object> }}
              />
            </div>

            {/* Easter egg for silicon readers: the same post, served raw */}
            <p className="font-mono text-[13px] text-fg-subtle mt-12">
              Are you an LLM? You&apos;d probably prefer the Markdown:{" "}
              <a
                href={`/blog/${slug}.md`}
                className="text-fg-muted hover:text-accent transition-colors duration-150"
              >
                {slug}.md →
              </a>
            </p>

            <AuthorBio />
            <ShareButtons slug={post.slug} title={post.title} />
            <SubscribeCTA className="mt-12" />
            <PostNavigation prev={prev} next={next} />
            <RelatedPosts posts={related} />
            <GiscusComments />
          </article>

          {/* Sticky ToC */}
          {toc.length > 0 && (
            <aside className="hidden lg:block pt-1.5">
              <div className="sticky top-[110px]">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
