import { notFound } from "next/navigation";
import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { Comments } from "~/app/_components/comments";
import { Newsletter } from "~/app/_components/newsletter";
import { TableOfContents } from "~/app/_components/table-of-contents";
import { CodeBlockToolbar } from "~/app/_components/code-block-toolbar";
import { ReadingProgress } from "~/app/_components/reading-progress";
import { BackToTop } from "~/app/_components/back-to-top";
import { BlogPostStructuredData } from "~/app/_components/blog-post-structured-data";
import { getBlogPost, getAllBlogPosts, getRelatedPosts } from "~/lib/mdx";
import { BlogPostCard, formatDate } from "~/app/blog/_components/blog-post-card";
import Link from "next/link";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  const [post, allPosts] = await Promise.all([
    getBlogPost(slug),
    getAllBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const { metadata } = post;

  const relatedPosts = getRelatedPosts(
    allPosts,
    slug,
    metadata.tags,
    metadata.category,
  );

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
      <main className="bg-[#0D0D0D]">
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
                className="text-sm text-[#a39e98] transition-colors hover:text-[#C91F37]"
              >
                ← Back to Blog
              </Link>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-[#C91F37]/15 px-3 py-1 text-sm font-medium text-[#E6E4E0] ring-1 ring-[#C91F37]/40">
                {metadata.category}
              </span>
              <time className="text-sm text-[#726d68]">
                {formatDate(metadata.publishDate)}
              </time>
              <span className="text-sm text-[#726d68]">•</span>
              <span className="text-sm text-[#726d68]">{metadata.readTime}</span>
            </div>

            <h1 className="font-playfair mb-6 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              {metadata.title}
            </h1>

            <p className="mb-6 text-xl leading-8 text-[#a39e98]">
              {metadata.excerpt}
            </p>

            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded bg-[#2A2725] px-2 py-1 text-xs text-[#a39e98]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {metadata.heroImage && (
          <section className="bg-[#1A1816]/30 py-8">
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
        <article className="bg-[#1A1816]/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
              <div className="max-w-4xl">
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
              <aside className="lg:order-last">
                <TableOfContents content={post.content} />
              </aside>
            </div>
          </div>
        </article>

        {/* Share & Back to Blog */}
        <section className="bg-[#1A1816] py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <Link
                href="/blog"
                className="text-sm font-semibold text-[#d4cfc9] transition-colors hover:text-[#C91F37]"
              >
                ← Back to all articles
              </Link>
              <div className="flex gap-4">
                <a
                  href={blueskyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#d4cfc9] transition-colors hover:text-[#C91F37]"
                >
                  Share on BlueSky
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#d4cfc9] transition-colors hover:text-[#C91F37]"
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        <Newsletter
          title="Enjoyed this article?"
          description="Subscribe to my newsletter for more insights on infrastructure, Kubernetes, Go, security, and tech community updates. No spam, just quality content."
          formId="blog-post"
        />

        <Comments slug={slug} />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-[#1A1816]/30 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mb-12 text-center">
                <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                  Related Articles
                </h2>
                <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <BlogPostCard key={relatedPost.slug} post={relatedPost} />
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
