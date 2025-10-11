import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogSlugs, getBlogPostMetadata } from "~/lib/mdx";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const metadata = getBlogPostMetadata(slug);

  if (!metadata) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${metadata.title} - Davide Imola`,
    description: metadata.excerpt,
    openGraph: {
      title: metadata.title,
      description: metadata.excerpt,
      type: "article",
      publishedTime: metadata.publishDate,
      authors: ["Davide Imola"],
      images: metadata.heroImage ? [metadata.heroImage] : [],
    },
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const metadata = getBlogPostMetadata(slug);

  if (!post || !metadata) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="bg-gray-950">
        {/* Hero Section with Image */}
        <section className="relative overflow-hidden">
          {metadata.heroImage && (
            <div className="absolute inset-0 -z-10">
              <div
                className="h-full w-full bg-cover bg-center object-cover opacity-20"
                style={{ backgroundImage: `url(${metadata.heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 to-gray-950" />
            </div>
          )}

          <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <Link
                href="/blog"
                className="text-sm text-gray-400 transition-colors hover:text-blue-400"
              >
                ← Back to Blog
              </Link>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-blue-500/20">
                {metadata.category}
              </span>
              <time className="text-sm text-gray-500">
                {formatDate(metadata.publishDate)}
              </time>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{metadata.readTime}</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              {metadata.title}
            </h1>

            <p className="mb-6 text-xl leading-8 text-gray-400">
              {metadata.excerpt}
            </p>

            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag) => (
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

        {/* Article Content */}
        <article className="border-t border-gray-800 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Share & Back to Blog */}
        <section className="border-t border-gray-800 bg-gray-900 py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <Link
                href="/blog"
                className="text-sm font-semibold text-gray-300 transition-colors hover:text-blue-400"
              >
                ← Back to all articles
              </Link>
              <div className="flex gap-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(metadata.title)}&url=${encodeURIComponent(`https://davideimola.dev/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-gray-300 transition-colors hover:text-blue-400"
                >
                  Share on Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://davideimola.dev/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-gray-300 transition-colors hover:text-blue-400"
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
