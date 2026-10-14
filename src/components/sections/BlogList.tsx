"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { BlogPost } from "../../lib/content";
import { formatDate } from "../../lib/dates";
import { ScrollReveal } from "../ui/ScrollReveal";

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
          <span className="text-fg-subtle">grep --tag</span>
          <span className="text-fg">{filterLabel}</span>
          <Link
            href="/blog"
            scroll={false}
            className="text-fg-subtle hover:text-accent transition-colors duration-150 ml-1"
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
                      "font-mono text-[10px] font-medium tracking-[0.08em] uppercase  px-2 py-0.5 transition-colors duration-150",
                      activeCategory === post.category
                        ? "text-fg bg-surface-inline border border-[rgba(201,31,55,0.2)]"
                        : "text-fg-subtle bg-border hover:text-accent",
                    ].join(" ")}
                  >
                    {post.category}
                  </Link>
                </div>

                {/* Title + excerpt */}
                <a href={`/blog/${post.slug}`} className="group block no-underline">
                  <h2 className="font-sans text-[17px] sm:text-[19px] font-bold text-fg leading-snug mb-2 group-hover:text-accent transition-colors duration-150 tracking-[-0.02em]">
                    {post.title}
                  </h2>
                  <p className="font-sans text-[14px] text-fg-muted leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </a>

                {/* Date + tags */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[11px] text-fg-subtle">
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
                            ? "text-fg"
                            : "text-fg-subtle hover:text-accent",
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
        <p className="font-mono text-[13px] text-fg-subtle py-8">
          <span className="text-fg">~/</span> no posts found
        </p>
      )}
    </>
  );
}
