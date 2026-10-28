import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogList, type StartHerePick } from "../../../components/sections/BlogList";
import { ButtonLink } from "../../../components/ui/Button";
import { Marker } from "../../../components/ui/Marker";
import { Tape } from "../../../components/ui/Tape";
import { START_HERE, topicCounts } from "../../../lib/blog-index";
import { getAllPosts } from "../../../lib/content";
import { OG_SIZE, ogImageUrl } from "../../../lib/og-url";

export const metadata: Metadata = {
  title: "Writing",
  description: "Long-form notes on AI agents, security, Go and the craft around them.",
  openGraph: {
    title: "Writing · Davide Imola",
    description: "Long-form notes on AI agents, security, Go and the craft around them.",
    url: "https://davideimola.dev/blog",
    images: [
      {
        url: ogImageUrl({ title: "Writing", category: "writing" }),
        ...OG_SIZE,
      },
    ],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const firstYear = posts.length > 0 ? new Date(posts[posts.length - 1].date).getFullYear() : null;

  // Resolved loudly: a renamed post breaks the build instead of the block.
  const startHere: StartHerePick[] = START_HERE.map(({ slug, why }) => {
    const post = posts.find((p) => p.slug === slug);
    if (!post) throw new Error(`/blog START HERE: unknown post "${slug}".`);
    return { post, why };
  });

  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-12">
      <header className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 lg:gap-[72px] items-end">
        <div className="flex flex-col gap-[22px]">
          <Tape tilt={0}>Writing</Tape>
          <h1 className="m-0 font-sans font-bold text-fg text-[40px] sm:text-[52px] lg:text-h1 leading-[1.02] tracking-[-0.045em]">
            What I <Marker>learned</Marker> building things, written down.
          </h1>
          <p className="m-0 font-sans text-[18px] sm:text-[21px] leading-[1.5] text-fg-muted max-w-[680px]">
            Long-form notes on AI agents, security, Go and the craft around them. {posts.length}{" "}
            posts{firstYear ? ` since ${firstYear}` : ""}, including the ones about what did not
            work.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:pb-1.5">
          <ButtonLink variant="link" size="lg" href="/newsletter" className="self-start">
            Get them by email, once a month
          </ButtonLink>
          <a
            href="/rss.xml"
            className="font-mono text-[14px] text-fg-subtle no-underline hover:text-accent"
          >
            RSS · /rss.xml
          </a>
          <a
            href="/llms.txt"
            className="font-mono text-[14px] text-fg-subtle no-underline hover:text-accent"
          >
            Markdown for LLMs · /llms.txt
          </a>
        </div>
      </header>
      <Suspense
        fallback={
          <p className="font-mono text-meta text-fg-subtle mt-10" aria-hidden="true">
            Loading...
          </p>
        }
      >
        <BlogList posts={posts} topics={topicCounts(posts)} startHere={startHere} />
      </Suspense>
    </div>
  );
}
