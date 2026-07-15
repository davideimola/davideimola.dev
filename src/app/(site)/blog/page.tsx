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
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="ls ./blog"
        title="Writing"
        description={`${allPosts.length} articles on engineering, platform thinking, Go, and security.`}
      />
      <Suspense
        fallback={
          <p className="font-mono text-[13px] text-text-3" aria-hidden="true">
            <span className="text-accent">❯</span> loading
            <span className="inline-block w-[3px] h-[1em] bg-accent ml-1 align-middle animate-[blink_1.1s_step-end_infinite]" />
          </p>
        }
      >
        <BlogList posts={allPosts} />
      </Suspense>
    </div>
  );
}
