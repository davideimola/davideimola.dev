import type { BlogPost } from "../../lib/content";
import { Badge } from "./Badge";

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
      <h2 className="font-mono text-[11px] text-text-3 tracking-[0.06em] mb-6">RELATED POSTS</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-2 p-4 border border-border rounded-sm hover:border-border-hover hover:bg-bg-hover transition-colors duration-150 no-underline"
          >
            <div className="flex items-center gap-2">
              <Badge variant="category">{post.category}</Badge>
            </div>
            <p className="font-mono text-[13px] text-text-1 group-hover:text-accent transition-colors duration-150 line-clamp-2 leading-snug">
              {post.title}
            </p>
            <p className="font-mono text-[11px] text-text-3 mt-auto">
              {formatDate(post.date)} · {post.readingTime}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
