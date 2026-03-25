import type { Metadata } from "next";
import { BlogList } from "../../components/sections/BlogList";
import { PageHero } from "../../components/ui/PageHero";
import { getAllPosts } from "../../lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on backend engineering, platform thinking, Go, security, and open source.",
  openGraph: {
    title: "Blog — Davide Imola",
    description:
      "Articles on backend engineering, platform thinking, Go, security, and open source.",
    url: "https://davideimola.dev/blog",
    images: [
      { url: "https://davideimola.dev/og?title=Blog&category=writing", width: 1200, height: 630 },
    ],
  },
};

interface PageProps {
  searchParams: Promise<{ tag?: string; category?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { tag, category } = await searchParams;
  const allPosts = getAllPosts();

  const posts = allPosts.filter((p) => {
    if (tag) return p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase());
    if (category) return p.category.toLowerCase() === category.toLowerCase();
    return true;
  });

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="ls ./blog"
        title="Writing"
        description={`${allPosts.length} articles on engineering, platform thinking, Go, and security.`}
      />
      <BlogList posts={posts} activeTag={tag} activeCategory={category} />
    </div>
  );
}
