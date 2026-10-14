import { getRecentPosts } from "../../lib/content";
import { formatDate } from "../../lib/dates";
import { Card, ScrollReveal, SectionHeader } from "../ui";

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
      {tags.map((tag) => (
        <span key={tag} className="font-mono text-[12px] text-fg-subtle">
          #{tag.toLowerCase()}
        </span>
      ))}
    </div>
  );
}

export function WritingSection() {
  const [featured, ...rest] = getRecentPosts(3);

  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[1136px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <SectionHeader
            title="Latest writing"
            seeAllHref="/blog"
            seeAllLabel="All posts →"
            tilt={2}
          />
        </ScrollReveal>

        <div className="mt-8 flex flex-col gap-5">
          {/* Featured post */}
          {featured && (
            <ScrollReveal>
              <Card href={`/blog/${featured.slug}`} className="w-full">
                <Tags tags={featured.tags} />
                <h3 className="font-sans text-[24px] sm:text-[28px] font-bold tracking-[-0.03em] leading-[1.15] text-fg mb-2">
                  {featured.title}
                </h3>
                <p className="font-sans text-[17px] text-fg-muted leading-relaxed mb-4">
                  {featured.excerpt}
                </p>
                <p className="font-mono text-[13px] text-fg-subtle">
                  {formatDate(featured.date)} · {featured.readingTime}
                </p>
              </Card>
            </ScrollReveal>
          )}

          {/* Smaller posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rest.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 80}>
                <Card href={`/blog/${post.slug}`} className="h-full">
                  <Tags tags={post.tags.slice(0, 2)} />
                  <h3 className="font-sans text-[20px] font-bold tracking-[-0.025em] leading-[1.2] text-fg mb-2">
                    {post.title}
                  </h3>
                  <p className="font-sans text-[15px] text-fg-muted leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <p className="font-mono text-[13px] text-fg-subtle">
                    {formatDate(post.date)} · {post.readingTime}
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
