import { type Metadata } from "next";
import { getAllBlogSlugs, getBlogPostMetadata } from "~/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

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

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
