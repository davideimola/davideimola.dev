"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { BlogPost } from "../../lib/content";
import { ScrollReveal } from "../ui/ScrollReveal";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") ?? undefined;
  const activeCategory = searchParams.get("category") ?? undefined;

  const filtered = posts.filter((p) => {
    if (activeTag) return p.tags.map((t) => t.toLowerCase()).includes(activeTag.toLowerCase());
    if (activeCategory) return p.category.toLowerCase() === activeCategory.toLowerCase();
    return true;
  });

  const hasFilter = !!(activeTag || activeCategory);
  const filterLabel = activeTag ? `#${activeTag}` : activeCategory;

  return (
    <>
      {/* Active filter chip */}
      {hasFilter && (
        <div className="flex items-center gap-2 font-mono text-[12px] mb-6">
          <span className="text-accent">❯</span>
          <span className="text-text-3">grep --tag</span>
          <span className="text-accent">{filterLabel}</span>
          <Link
            href="/blog"
            scroll={false}
            className="text-text-3 hover:text-accent transition-colors duration-150 ml-1"
            aria-label="Clear filter"
          >
            ×
          </Link>
        </div>
      )}

      {/* Post list */}
      {filtered.length > 0 ? (
        <ul className="flex flex-col divide-y divide-border">
          {filtered.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 40}>
              <li className="py-6 flex flex-col gap-3">
                {/* Category + featured */}
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/blog?category=${encodeURIComponent(post.category)}`}
                    scroll={false}
                    className={[
                      "font-mono text-[10px] font-medium tracking-[0.08em] uppercase rounded-[2px] px-2 py-0.5 transition-colors duration-150",
                      activeCategory === post.category
                        ? "text-accent bg-accent-glow border border-[rgba(201,31,55,0.2)]"
                        : "text-text-3 bg-border hover:text-accent",
                    ].join(" ")}
                  >
                    {post.category}
                  </Link>
                </div>

                {/* Title + excerpt */}
                <a href={`/blog/${post.slug}`} className="group block no-underline">
                  <h2 className="font-mono text-[17px] sm:text-[19px] font-semibold text-text-1 leading-snug mb-2 group-hover:text-accent transition-colors duration-150">
                    {post.title}
                  </h2>
                  <p className="font-sans text-[14px] text-text-2 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </a>

                {/* Date + tags */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[11px] text-text-3">
                    {formatDate(post.date)} · {post.readingTime}
                  </p>
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}
                        scroll={false}
                        className={[
                          "font-mono text-[11px] transition-colors duration-150",
                          activeTag === tag.toLowerCase()
                            ? "text-accent"
                            : "text-text-3 hover:text-accent",
                        ].join(" ")}
                      >
                        #{tag.toLowerCase()}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            </ScrollReveal>
          ))}
        </ul>
      ) : (
        <p className="font-mono text-[13px] text-text-3 py-8">
          <span className="text-accent">~/</span> no posts found
        </p>
      )}
    </>
  );
}
