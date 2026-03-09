import Link from "next/link";
import Image from "next/image";
import { type BlogPost } from "~/lib/mdx";

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface BlogPostCardProps {
  post: BlogPost;
  variant?: "hero" | "featured" | "default";
}

function PlaceholderImage({ large = false }: { large?: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1A1816] to-[#2A2725]">
      <div
        className={`flex items-center justify-center rounded-lg ${large ? "h-16 w-16 bg-[#C91F37]/10 ring-1 ring-[#C91F37]/20" : "h-12 w-12 bg-[#2A2725]"}`}
      >
        <svg
          className={large ? "h-8 w-8 text-[#C91F37]" : "h-6 w-6 text-[#726d68]"}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      </div>
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.slice(0, 2).map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-[#3A3735] px-2.5 py-0.5 text-[10px] font-medium text-[#a39e98]"
        >
          {tag}
        </span>
      ))}
      {tags.length > 2 && (
        <span className="text-[10px] font-medium text-[#726d68]">+{tags.length - 2}</span>
      )}
    </div>
  );
}

export function BlogPostCard({ post, variant = "default" }: BlogPostCardProps) {
  if (variant === "hero") {
    return (
      <article className="group relative mb-10 flex flex-col overflow-hidden rounded-xl border border-[#2A2725] bg-[#1A1816] transition-all duration-300 hover:border-[#C91F37]/40 hover:shadow-[0_0_32px_0_rgba(201,31,55,0.08)] lg:flex-row">
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden lg:aspect-auto lg:w-1/2">
          {post.heroImage ? (
            <Image
              src={post.heroImage}
              alt={post.heroImageAlt ?? post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <PlaceholderImage large />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] via-transparent to-transparent opacity-60 lg:bg-gradient-to-r" />
        </div>

        <div className="flex flex-1 flex-col p-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-full bg-[#2A2725] px-3 py-1 text-[11px] font-medium tracking-wide text-[#a39e98]">
              {post.category}
            </span>
            <time className="text-[11px] text-[#726d68]">{formatDate(post.publishDate)}</time>
          </div>

          <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col after:absolute after:inset-0">
            <h3 className="mb-3 text-2xl font-semibold leading-snug text-gray-100 transition-colors group-hover:text-[#C91F37]">
              {post.title}
            </h3>
            <p className="flex-1 text-base leading-relaxed text-[#726d68]">{post.excerpt}</p>
          </Link>

          <div className="mt-6 flex items-center justify-between border-t border-[#2A2725] pt-4">
            <TagList tags={post.tags} />
            <span className="shrink-0 text-[11px] text-[#726d68]">{post.readTime}</span>
          </div>
        </div>
      </article>
    );
  }

  const isFeatured = variant === "featured";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden border border-[#2A2725] bg-[#1A1816] transition-all duration-300 hover:border-[#C91F37]/40 hover:shadow-[0_0_24px_0_rgba(201,31,55,0.08)] ${isFeatured ? "rounded-2xl" : "rounded-xl"}`}
    >
      {isFeatured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center rounded-full bg-[#C91F37] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        </div>
      )}

      {/* Hero Image */}
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
        {post.heroImage ? (
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt ?? post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <PlaceholderImage large={isFeatured} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] via-transparent to-transparent opacity-70" />
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        <div className={`flex items-center justify-between ${isFeatured ? "mb-3" : "mb-2"}`}>
          <span className="rounded-full bg-[#2A2725] px-3 py-1 text-[11px] font-medium tracking-wide text-[#a39e98]">
            {post.category}
          </span>
          <time className="text-[11px] text-[#726d68]">{formatDate(post.publishDate)}</time>
        </div>

        {/* Title + excerpt grow to fill space */}
        <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col after:absolute after:inset-0">
          <h3
            className={`mb-2 line-clamp-2 font-semibold leading-snug text-gray-100 transition-colors group-hover:text-[#C91F37] ${isFeatured ? "text-xl" : "text-base"}`}
          >
            {post.title}
          </h3>
          <p className="flex-1 text-sm leading-relaxed text-[#726d68] line-clamp-3">{post.excerpt}</p>
        </Link>

        {/* Footer always at bottom */}
        <div className="mt-4 flex items-center justify-between border-t border-[#2A2725] pt-4">
          <TagList tags={post.tags} />
          <span className="shrink-0 text-[11px] text-[#726d68]">{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}
