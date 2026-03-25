import type { Metadata } from "next";
import { Badge } from "../../components/ui/Badge";
import { ScrollReveal } from "../../components/ui/ScrollReveal";
import { getAllPosts } from "../../lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on backend engineering, platform thinking, Go, security, and open source.",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <ScrollReveal>
        <header className="mb-12">
          <p className="font-mono text-[13px] text-text-3 mb-4">
            <span className="text-accent mr-2">❯</span>ls ./blog
          </p>
          <h1 className="font-mono text-[32px] sm:text-[40px] font-bold text-text-1 tracking-[-0.03em] leading-none mb-3">
            Writing
          </h1>
          <p className="font-sans text-[15px] text-text-2">
            {posts.length} articles on engineering, platform thinking, Go, and security.
          </p>
        </header>
      </ScrollReveal>

      <ul className="flex flex-col divide-y divide-border">
        {posts.map((post, i) => (
          <ScrollReveal key={post.slug} delay={i * 40}>
            <li>
              <a
                href={`/blog/${post.slug}`}
                className="group block py-6 no-underline transition-colors duration-150"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="category">{post.category}</Badge>
                  {post.featured && <Badge variant="active">Featured</Badge>}
                </div>
                <h2 className="font-mono text-[17px] sm:text-[19px] font-semibold text-text-1 leading-snug mb-2 group-hover:text-accent transition-colors duration-150">
                  {post.title}
                </h2>
                <p className="font-sans text-[14px] text-text-2 leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <p className="font-mono text-[11px] text-text-3">
                  {formatDate(post.date)} · {post.readingTime}
                </p>
              </a>
            </li>
          </ScrollReveal>
        ))}
      </ul>
    </div>
  );
}
