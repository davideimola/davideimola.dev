import type { BlogPost } from "../../lib/content";
import { Badge } from "./Badge";
import { PostCover } from "./PostCover";
import { SectionHeader } from "./SectionHeader";

interface RelatedPostsProps {
  posts: BlogPost[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <SectionHeader title="Related posts" tilt={1} className="mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-2 p-4 border border-border bg-surface hover:border-fg transition-colors duration-150 no-underline"
          >
            {post.heroImage && (
              <PostCover src={post.heroImage} alt="" sizes="(min-width: 1024px) 220px, 50vw" />
            )}
            <div className="flex items-center gap-2">
              <Badge variant="category">{post.category}</Badge>
            </div>
            <p className="font-sans text-[17px] font-semibold tracking-[-0.01em] text-fg group-hover:text-accent transition-colors duration-150 line-clamp-2 leading-snug">
              {post.title}
            </p>
            <p className="font-mono text-[12px] text-fg-subtle mt-auto">
              {formatDate(post.date)} · {post.readingTime}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
