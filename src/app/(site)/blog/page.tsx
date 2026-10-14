import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogList } from "../../../components/sections/BlogList";
import { PageHero } from "../../../components/ui/PageHero";
import { getAllPosts } from "../../../lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on backend engineering, platform thinking, Go, security, and open source.",
  openGraph: {
    title: "Blog · Davide Imola",
    description:
      "Articles on backend engineering, platform thinking, Go, security, and open source.",
    url: "https://davideimola.dev/blog",
    images: [
      { url: "https://davideimola.dev/og?title=Blog&category=writing", width: 1200, height: 630 },
    ],
  },
};

export default function BlogPage() {
  const allPosts = getAllPosts();

  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-12 md:pt-16 pb-20">
      <PageHero
        label="Blog"
        title="Writing"
        description={`${allPosts.length} articles on engineering, platform thinking, Go, and security.`}
      />
      <Suspense
        fallback={
          <p className="font-mono text-meta text-fg-subtle" aria-hidden="true">
            Loading...
          </p>
        }
      >
        <BlogList posts={allPosts} />
      </Suspense>
    </div>
  );
}
