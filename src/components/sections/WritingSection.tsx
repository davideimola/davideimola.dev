import type { TopicCount } from "../../lib/blog-index";
import type { BlogPost } from "../../lib/content";
import { formatDayMonthYear } from "../../lib/dates";
import { TOPICS, topicOf } from "../../lib/topics";
import { PostCover } from "../ui/PostCover";
import { HomeBand } from "./HomeBand";

interface WritingSectionProps {
  /** The latest posts, newest first, as many as the block shows. */
  posts: BlogPost[];
  /** Every post's topic with its count, the same row /blog filters by. */
  topics: TopicCount[];
  total: number;
}

const label = (post: BlogPost) => TOPICS.find((t) => t.slug === topicOf(post))?.label;

// WRITING: the latest posts as the ruled rows of /blog (date, title, topic,
// cover), so they read as articles at a glance. The three topics sit above
// the rows as links into /blog, each with its count.
export function WritingSection({ posts, topics, total }: WritingSectionProps) {
  return (
    <HomeBand
      tape="Writing"
      tilt={0}
      title="Notes from the work"
      more={{ label: `All ${total} posts`, href: "/blog" }}
    >
      <div className="flex flex-col gap-4">
        <nav
          aria-label="Topics"
          className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[13px] text-fg-subtle"
        >
          {topics.map((topic) => (
            <a
              key={topic.slug}
              href={`/blog?topic=${topic.slug}`}
              className="text-fg-muted no-underline hover:text-accent transition-colors duration-150"
            >
              {topic.label} <span className="text-fg-subtle">{topic.count}</span>
            </a>
          ))}
        </nav>
        <ul className="m-0 p-0 list-none border-t border-fg">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-border">
              <a
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-1 md:grid-cols-[112px_minmax(0,1fr)_160px] gap-x-5 gap-y-1 items-center py-3.5 md:py-4 no-underline"
              >
                <span className="font-mono text-[13px] text-fg-subtle">
                  {formatDayMonthYear(post.date)}
                </span>
                <span className="flex flex-col gap-1 min-w-0">
                  <span className="font-sans font-semibold text-[18px] md:text-[20px] leading-[1.3] tracking-[-0.015em] text-fg group-hover:text-accent transition-colors duration-150">
                    {post.title}
                  </span>
                  <span className="font-mono text-[12px] text-fg-subtle">
                    {label(post)} · {post.readingTime.replace(" read", "")}
                  </span>
                </span>
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
    </HomeBand>
  );
}
