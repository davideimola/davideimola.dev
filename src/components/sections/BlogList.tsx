import { ScrollReveal } from "../ui/ScrollReveal";
import type { BlogPost } from "../../lib/content";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface BlogListProps {
  posts: BlogPost[];
  activeTag?: string;
  activeCategory?: string;
}

export function BlogList({ posts, activeTag, activeCategory }: BlogListProps) {
  const hasFilter = !!(activeTag || activeCategory);
  const filterLabel = activeTag ? `#${activeTag}` : activeCategory;

  return (
    <>
      {/* Active filter chip */}
      {hasFilter && (
        <div className="flex items-center gap-2 font-mono text-[12px] mb-6">
          <span className="text-accent">❯</span>
          <span className="text-text-3">filtering by</span>
          <span className="text-accent">{filterLabel}</span>
          <a
            href="/blog"
            className="text-text-3 hover:text-accent transition-colors duration-150 ml-1"
            aria-label="Clear filter"
          >
            ×
          </a>
        </div>
      )}

      {/* Post list */}
      {posts.length > 0 ? (
        <ul className="flex flex-col divide-y divide-border">
          {posts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 40}>
              <li className="py-6 flex flex-col gap-3">
                {/* Category + featured */}
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`/blog?category=${encodeURIComponent(post.category)}`}
                    className={[
                      "font-mono text-[10px] font-medium tracking-[0.08em] uppercase rounded-[2px] px-2 py-0.5 transition-colors duration-150",
                      activeCategory === post.category
                        ? "text-accent bg-accent-glow border border-[rgba(201,31,55,0.2)]"
                        : "text-text-3 bg-border hover:text-accent",
                    ].join(" ")}
                  >
                    {post.category}
                  </a>
                  {post.featured && (
                    <span className="font-mono text-[10px] font-medium tracking-[0.08em] uppercase rounded-[2px] px-2 py-0.5 text-text-3 bg-border">
                      Featured
                    </span>
                  )}
                </div>

                {/* Title + excerpt */}
                <a
                  href={`/blog/${post.slug}`}
                  className="group block no-underline"
                >
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
                      <a
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}
                        className={[
                          "font-mono text-[11px] transition-colors duration-150",
                          activeTag === tag.toLowerCase()
                            ? "text-accent"
                            : "text-text-3 hover:text-accent",
                        ].join(" ")}
                      >
                        #{tag.toLowerCase()}
                      </a>
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
