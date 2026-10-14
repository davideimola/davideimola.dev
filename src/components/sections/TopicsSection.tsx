import type { BlogPost } from "../../lib/content";
import type { TopicGroup } from "../../lib/topics";
import { ButtonLink } from "../ui/Button";
import { Tape } from "../ui/Tape";

interface TopicsSectionProps {
  groups: TopicGroup<BlogPost>[];
}

// BY TOPIC: three ruled columns of posts, the post already on the WRITING card
// left out by the caller.
export function TopicsSection({ groups }: TopicsSectionProps) {
  if (groups.length === 0) return null;
  return (
    <section className="max-w-[1136px] mx-auto px-4 sm:px-8 mt-14 md:mt-[120px]">
      <div className="border-t border-rule pt-7 md:pt-12 flex flex-col gap-6 md:gap-9">
        <div className="flex items-end justify-between gap-8">
          <div className="flex flex-col items-start gap-3.5 md:gap-5">
            <Tape tilt={1}>By topic</Tape>
            <h2 className="m-0 font-sans font-bold text-fg text-[30px] md:text-[44px] leading-[1.05] tracking-[-0.04em]">
              Notes from the work
            </h2>
          </div>
          <ButtonLink variant="link" size="lg" href="/blog" className="hidden md:inline-flex">
            All writing
          </ButtonLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {groups.map((group) => (
            <div key={group.slug} className="flex flex-col">
              {/* The column heading opens /blog on the same topic. */}
              <h3 className="m-0 mb-2 font-sans font-bold text-[18px] md:text-[20px] tracking-[-0.02em]">
                <a
                  href={`/blog?topic=${group.slug}`}
                  className="text-fg no-underline hover:text-accent transition-colors duration-150"
                >
                  {group.label}
                </a>
              </h3>
              {group.posts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-1.5 py-3 md:py-4 border-t border-border no-underline"
                >
                  <span className="font-sans font-semibold text-[16px] md:text-[18px] leading-[1.3] text-fg group-hover:text-accent transition-colors duration-150">
                    {post.title}
                  </span>
                  <span className="font-mono text-[12px] md:text-[13px] text-fg-subtle">
                    {new Date(post.date).getFullYear()}
                  </span>
                </a>
              ))}
            </div>
          ))}
        </div>
        <ButtonLink variant="link" size="lg" href="/blog" className="md:hidden self-start">
          All writing
        </ButtonLink>
      </div>
    </section>
  );
}
