"use client";

import { useState } from "react";
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
}

export function BlogList({ posts }: BlogListProps) {
  const [active, setActive] = useState<string | null>(null);

  const categories = Array.from(new Set(posts.map((p) => p.category))).sort();
  const filtered = active ? posts.filter((p) => p.category === active) : posts;

  return (
    <>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={[
            "font-mono text-[11px] tracking-[0.06em] border rounded-[2px] px-3 py-1 transition-[border-color,color] duration-150",
            active === null
              ? "border-border-hover text-accent"
              : "border-border text-text-3 hover:border-border-hover hover:text-accent",
          ].join(" ")}
        >
          all
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat === active ? null : cat)}
            className={[
              "font-mono text-[11px] tracking-[0.06em] border rounded-[2px] px-3 py-1 transition-[border-color,color] duration-150",
              active === cat
                ? "border-border-hover text-accent"
                : "border-border text-text-3 hover:border-border-hover hover:text-accent",
            ].join(" ")}
          >
            {cat.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Post list */}
      <ul className="flex flex-col divide-y divide-border">
        {filtered.map((post, i) => (
          <ScrollReveal key={post.slug} delay={i * 40}>
            <li>
              <a
                href={`/blog/${post.slug}`}
                className="group block py-6 no-underline transition-colors duration-150"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] font-medium tracking-[0.08em] uppercase rounded-[2px] px-2 py-0.5 text-text-3 bg-border">
                    {post.category}
                  </span>
                  {post.featured && (
                    <span className="font-mono text-[10px] font-medium tracking-[0.08em] uppercase rounded-[2px] px-2 py-0.5 text-text-3 bg-border">
                      Featured
                    </span>
                  )}
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

      {filtered.length === 0 && (
        <p className="font-mono text-[13px] text-text-3 py-8">
          <span className="text-accent">~/</span> no posts found
        </p>
      )}
    </>
  );
}
