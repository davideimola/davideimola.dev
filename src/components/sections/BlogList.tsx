"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { archiveByYear, type TopicCount, tagSlug } from "../../lib/blog-index";
import type { BlogPost } from "../../lib/content";
import { formatDayMonth, formatDayMonthYear } from "../../lib/dates";
import { topicOf } from "../../lib/topics";
import { PostCover } from "../ui/PostCover";
import { Tape } from "../ui/Tape";

export interface StartHerePick {
  post: BlogPost;
  why: string;
}

interface BlogListProps {
  posts: BlogPost[];
  topics: TopicCount[];
  startHere: StartHerePick[];
}

function rowTags(post: BlogPost): string {
  if (post.category === "Personal") return "Personal";
  return post.tags
    .slice(0, 2)
    .map((t) => `#${tagSlug(t).replace(/\s+/g, "")}`)
    .join(" ");
}

function minutes(readingTime: string): string {
  return readingTime.replace(" read", "");
}

// /blog below its header: one filter row (the three editorial topics, the
// same ones the home WRITING block links to), then (unfiltered) the latest post
// as a feature and the START HERE picks, then the archive by year. Filters
// live in the URL so they can be shared: ?topic= from the row, ?tag= from the
// tags on a post page, and ?category= still honoured for old links. A tag or
// a category gets a line of its own instead of a second row of controls.
export function BlogList({ posts, topics, startHere }: BlogListProps) {
  const searchParams = useSearchParams();
  const activeTopic = searchParams.get("topic") ?? undefined;
  const activeTag = searchParams.get("tag")?.toLowerCase();
  const activeCategory = searchParams.get("category")?.toLowerCase();
  const hasFilter = !!(activeTopic || activeTag || activeCategory);

  const filtered = posts.filter((p) => {
    if (activeTopic) return topicOf(p) === activeTopic;
    if (activeTag) return p.tags.some((t) => tagSlug(t) === activeTag);
    if (activeCategory) return p.category.toLowerCase() === activeCategory;
    return true;
  });

  const [featured] = posts;
  const groups = archiveByYear(filtered);

  // What a tag or category filter says about itself, since neither has a
  // control in the row.
  const narrowedBy = activeTag
    ? `Posts tagged #${activeTag.replace(/\s+/g, "")}`
    : activeCategory
      ? `${activeCategory[0].toUpperCase()}${activeCategory.slice(1)} posts`
      : null;

  const topicLink = (label: string, count: number, href: string, active: boolean) => (
    <Link
      key={label}
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={`no-underline pb-1 border-b-2 whitespace-nowrap transition-colors duration-150 ${
        active
          ? "font-semibold text-fg border-fg"
          : "text-fg-muted border-transparent hover:text-accent"
      }`}
    >
      {label} <span className="font-mono text-[13px] font-normal text-fg-subtle">{count}</span>
    </Link>
  );

  return (
    <>
      {/* The one filter row */}
      <nav
        aria-label="Filter by topic"
        className="mt-8 md:mt-10 pt-[18px] border-t border-rule flex flex-wrap gap-x-7 gap-y-3 font-sans text-[16px] md:text-[17px]"
      >
        {topicLink("All", posts.length, "/blog", !activeTopic && !narrowedBy)}
        {topics.map((t) =>
          topicLink(t.label, t.count, `/blog?topic=${t.slug}`, activeTopic === t.slug)
        )}
      </nav>

      {narrowedBy && (
        <p className="mt-6 mb-0 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-sans text-[17px] text-fg">
          <span className="font-semibold">{narrowedBy}</span>
          <span className="font-mono text-[13px] text-fg-subtle">{filtered.length}</span>
          <Link
            href="/blog"
            scroll={false}
            className="text-[15px] text-fg-muted border-b border-fg-subtle no-underline hover:text-accent hover:border-accent"
          >
            Show all
          </Link>
        </p>
      )}

      {!hasFilter && featured && (
        <>
          {/* The latest post, as a feature */}
          <a
            href={`/blog/${featured.slug}`}
            className="group mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-[540px_minmax(0,1fr)] gap-6 lg:gap-12 items-center no-underline"
          >
            {featured.heroImage && (
              <PostCover
                src={featured.heroImage}
                alt={featured.heroImageAlt ?? featured.title}
                sizes="(min-width: 1024px) 540px, 100vw"
                priority
              />
            )}
            <span className="flex flex-col gap-3.5">
              <span className="font-mono text-[13px] text-fg-subtle">
                Latest · {formatDayMonthYear(featured.date)} · {minutes(featured.readingTime)}
              </span>
              <span className="font-sans font-bold text-[28px] md:text-[38px] leading-[1.08] tracking-[-0.035em] text-fg group-hover:text-accent transition-colors duration-150">
                {featured.title}
              </span>
              <span className="font-sans text-[17px] md:text-[18px] leading-[1.6] text-fg-muted">
                {featured.excerpt}
              </span>
              <span className="font-mono text-[13px] text-fg-subtle">
                {featured.tags.map((t) => `#${tagSlug(t).replace(/\s+/g, "")}`).join(" ")}
              </span>
            </span>
          </a>

          {/* START HERE */}
          {startHere.length > 0 && (
            <section className="mt-12 md:mt-14 pt-7 border-t border-border grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-6 lg:gap-10">
              <Tape tilt={1} className="self-start">
                Start here
              </Tape>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-9">
                {startHere.map(({ post, why }) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-2 no-underline"
                  >
                    {post.heroImage && (
                      <PostCover
                        src={post.heroImage}
                        alt=""
                        sizes="(min-width: 768px) 260px, 100vw"
                        className="mb-1"
                      />
                    )}
                    <span className="font-sans font-bold text-[20px] leading-[1.25] tracking-[-0.02em] text-fg group-hover:text-accent transition-colors duration-150">
                      {post.title}
                    </span>
                    <span className="font-sans text-[15px] leading-[1.5] text-fg-muted">{why}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Archive */}
      <section aria-label="Archive" className="mt-12 md:mt-14 flex flex-col">
        {groups.length === 0 && (
          <p className="font-sans text-[17px] text-fg-muted py-6 border-t border-rule">
            Nothing here yet.{" "}
            <Link href="/blog" scroll={false} className="text-fg underline hover:text-accent">
              Show every post
            </Link>
          </p>
        )}
        {groups.map((group) => (
          <div
            key={group.label}
            className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-2 lg:gap-10 border-t border-rule pt-5 pb-2.5"
          >
            <h2
              className={`m-0 font-sans font-bold text-[32px] lg:text-[40px] leading-none tracking-[-0.04em] ${
                group.earlier ? "text-fg-subtle" : "text-fg"
              }`}
            >
              {group.label}
            </h2>
            <ul className="m-0 p-0 list-none flex flex-col">
              {group.posts.map((post, i) => (
                <li key={post.slug}>
                  <a
                    href={`/blog/${post.slug}`}
                    className={`group grid grid-cols-[64px_minmax(0,1fr)] md:grid-cols-[80px_minmax(0,1fr)_160px] gap-x-4 md:gap-x-5 items-start py-3 no-underline ${
                      i < group.posts.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <span className="font-mono text-[13px] text-fg-subtle pt-1">
                      {group.earlier
                        ? new Date(post.date).getFullYear()
                        : formatDayMonth(post.date)}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span
                        className={`font-sans font-semibold text-[17px] md:text-[19px] tracking-[-0.015em] group-hover:text-accent transition-colors duration-150 ${
                          group.earlier ? "text-fg-muted" : "text-fg"
                        }`}
                      >
                        {post.title}
                      </span>
                      <span className="font-mono text-[12px] text-fg-subtle">{rowTags(post)}</span>
                    </span>
                    {/* The cover as a thumbnail on wide screens; on a phone the row
                        stays text only, the list is dense enough already. A post
                        without a cover gets no box at all. */}
                    {post.heroImage && (
                      <PostCover
                        src={post.heroImage}
                        alt=""
                        sizes="160px"
                        className="hidden md:block"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
