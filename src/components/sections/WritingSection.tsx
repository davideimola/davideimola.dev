import { getRecentPosts } from "../../lib/content";
import { Card, ScrollReveal, SectionHeader } from "../ui";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function WritingSection() {
  const [featured, ...rest] = getRecentPosts(3);

  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <SectionHeader title="Latest writing" seeAllHref="/blog" seeAllLabel="All posts →" />
        </ScrollReveal>

        <div className="mt-8 flex flex-col gap-3">
          {/* Featured post */}
          {featured && (
            <ScrollReveal>
              <Card href={`/blog/${featured.slug}`} className="w-full">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
                  {featured.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[11px] text-text-3">
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>
                <h3 className="font-mono text-[18px] font-semibold text-text-1 mb-2 leading-snug">
                  {featured.title}
                </h3>
                <p className="font-sans text-[14px] text-text-2 leading-relaxed mb-4">
                  {featured.excerpt}
                </p>
                <p className="font-mono text-[11px] text-text-3">
                  {formatDate(featured.date)} · {featured.readingTime}                </p>
              </Card>
            </ScrollReveal>
          )}

          {/* Smaller posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rest.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 80}>
                <Card href={`/blog/${post.slug}`} className="h-full">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="font-mono text-[11px] text-text-3">
                        #{tag.toLowerCase()}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-mono text-[15px] font-semibold text-text-1 mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="font-sans text-[13px] text-text-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <p className="font-mono text-[11px] text-text-3">
                    {formatDate(post.date)} · {post.readingTime}                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
