"use client";

import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { Comments } from "~/app/_components/comments";
import { Newsletter } from "~/app/_components/newsletter";
import { TableOfContents } from "~/app/_components/table-of-contents";
import { CodeBlockToolbar } from "~/app/_components/code-block-toolbar";
import { ReadingProgress } from "~/app/_components/reading-progress";
import { BackToTop } from "~/app/_components/back-to-top";
import { BlogPostStructuredData } from "~/app/_components/blog-post-structured-data";
import { blogPosts, type BlogPost } from "~/content/blog-posts";
import { useBlogPost } from "~/hooks/use-blog-post";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

interface RelatedPost extends BlogPost {
  similarityScore: number;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getRelatedPosts(
  currentSlug: string,
  currentTags: string[],
  limit: number = 3,
): RelatedPost[] {
  return blogPosts
    .filter((post) => post.slug !== currentSlug) // Exclude current post
    .map((post) => {
      // Calculate similarity score based on shared tags
      const sharedTags =
        post.tags?.filter((tag) =>
          currentTags.some(
            (currentTag) => currentTag.toLowerCase() === tag.toLowerCase(),
          ),
        ).length || 0;

      return {
        ...post,
        similarityScore: sharedTags,
      };
    })
    .filter((post) => post.similarityScore > 0) // Only posts with shared tags
    .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by similarity
    .slice(0, limit); // Take top N posts
}

export default function BlogPost({ params }: Props) {
  const [slug, setSlug] = useState<string>("");
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

  const { data, loading, error } = useBlogPost(slug);

  useEffect(() => {
    const loadSlug = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };

    loadSlug();
  }, [params]);

  useEffect(() => {
    if (data?.metadata?.tags) {
      setRelatedPosts(getRelatedPosts(slug, data.metadata.tags));
    }
  }, [data, slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-[#0A0A0A]">
          <section className="relative px-6 py-24 sm:py-32 lg:px-8">
            <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-30" />
            <div className="mx-auto max-w-4xl text-center">
              <div className="animate-pulse">
                <div className="mx-auto mb-4 h-8 w-1/2 rounded bg-gray-700"></div>
                <div className="mx-auto mb-2 h-4 w-3/4 rounded bg-gray-700"></div>
                <div className="mx-auto h-4 w-1/2 rounded bg-gray-700"></div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="bg-[#0A0A0A]">
          <section className="relative px-6 py-24 sm:py-32 lg:px-8">
            <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-30" />
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-4 text-4xl font-bold text-gray-100">
                Post Not Found
              </h1>
              <p className="mb-8 text-gray-400">{error}</p>
              <Link
                href="/blog"
                className="inline-flex items-center rounded-md border border-transparent bg-[#C91F37] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#D3381C]"
              >
                Back to Blog
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header />
        <main className="bg-[#0A0A0A]">
          <section className="relative px-6 py-24 sm:py-32 lg:px-8">
            <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-30" />
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-4 text-4xl font-bold text-gray-100">
                Post Not Found
              </h1>
              <p className="mb-8 text-gray-400">
                The requested blog post could not be found.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center rounded-md border border-transparent bg-[#C91F37] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#D3381C]"
              >
                Back to Blog
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const { post, metadata } = data;

  // Prepare URLs for sharing
  const postUrl = `https://davideimola.dev/blog/${slug}`;
  const blueskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(metadata.title)}%20${encodeURIComponent(postUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;

  return (
    <>
      <BlogPostStructuredData
        title={metadata.title}
        excerpt={metadata.excerpt}
        publishDate={metadata.publishDate}
        heroImage={metadata.heroImage}
        slug={slug}
        tags={metadata.tags}
      />
      <ReadingProgress />
      <Header />
      <CodeBlockToolbar />
      <BackToTop />
      <main className="bg-[#0A0A0A]">
        {/* Hero Section with Image */}
        <section className="relative overflow-hidden">
          {metadata.heroImage && (
            <div className="absolute inset-0 -z-10">
              <div
                className="h-full w-full bg-cover bg-center object-cover opacity-30"
                style={{ backgroundImage: `url(${metadata.heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 to-gray-950" />
            </div>
          )}

          <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <Link
                href="/blog"
                className="text-sm text-gray-400 transition-colors hover:text-[#C91F37]"
              >
                ← Back to Blog
              </Link>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-[#C91F37]/10 px-3 py-1 text-sm font-medium text-[#C91F37] ring-1 ring-[#C91F37]/20">
                {metadata.category}
              </span>
              <time className="text-sm text-gray-500">
                {formatDate(metadata.publishDate)}
              </time>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{metadata.readTime}</span>
            </div>

            <h1 className="font-playfair mb-6 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              {metadata.title}
            </h1>

            <p className="mb-6 text-xl leading-8 text-gray-400">
              {metadata.excerpt}
            </p>

            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block rounded bg-gray-800 px-2 py-1 text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {metadata.heroImage && (
          <section className="bg-gray-900/30 py-8">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                <Image
                  src={metadata.heroImage}
                  alt={metadata.heroImageAlt ?? metadata.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
              </div>
            </div>
          </section>
        )}

        {/* Article Content with TOC */}
        <article className="bg-gray-900/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
              {/* Main Content */}
              <div className="max-w-4xl">
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Table of Contents - Sidebar */}
              <aside className="lg:order-last">
                <TableOfContents content={post.content} />
              </aside>
            </div>
          </div>
        </article>

        {/* Share & Back to Blog */}
        <section className="bg-gray-900 py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <Link
                href="/blog"
                className="text-sm font-semibold text-gray-300 transition-colors hover:text-[#C91F37]"
              >
                ← Back to all articles
              </Link>
              <div className="flex gap-4">
                <a
                  href={blueskyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-gray-300 transition-colors hover:text-[#C91F37]"
                >
                  Share on BlueSky
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-gray-300 transition-colors hover:text-[#C91F37]"
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <Newsletter
          title="Enjoyed this article?"
          description="Subscribe to my newsletter for more insights on infrastructure, Kubernetes, Go, security, and tech community updates. No spam, just quality content."
          formId="blog-post"
        />

        {/* Comments Section */}
        <Comments slug={slug} />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-900/30 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mb-12 text-center">
                <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                  Related Articles
                </h2>
                <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-all duration-300 hover:border-[#C91F37]/50 hover:shadow-lg"
                  >
                    {/* Hero Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {relatedPost.heroImage ? (
                        <Image
                          src={relatedPost.heroImage}
                          alt={relatedPost.heroImageAlt ?? relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                          <span className="text-4xl text-gray-500">📝</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="inline-block rounded bg-[#C91F37]/10 px-2 py-1 text-xs font-medium text-[#C91F37]">
                          {relatedPost.category}
                        </span>
                      </div>

                      <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-gray-100 transition-colors group-hover:text-[#C91F37]">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h3>

                      <p className="mb-4 line-clamp-3 text-sm text-gray-400">
                        {relatedPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {relatedPost.tags?.slice(0, 2).map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-block rounded bg-gray-800 px-2 py-1 text-xs text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                          {relatedPost.tags && relatedPost.tags.length > 2 && (
                            <span className="inline-block rounded bg-gray-800 px-2 py-1 text-xs text-gray-400">
                              +{relatedPost.tags.length - 2}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {relatedPost.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
