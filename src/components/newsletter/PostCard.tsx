interface PostCardProps {
  title: string;
  url: string;
  description: string;
  /** Blog category, rendered as a neutral chip. Optional. */
  category?: string;
  /** Meta line, e.g. "Jul 18, 2026 · 7 min read". Optional. */
  meta?: string;
}

// Web counterpart of the email PostCard (src/emails/components/PostCard.tsx): same props,
// same 2px Akane left border, dark-theme site styling. Rendered inside the newsletter
// issue's MDX body via the shared component map, so `<PostCard/>` looks consistent on the
// site and in the inbox. `not-prose` keeps the @tailwindcss/typography prose styles off it.
export function PostCard({ title, url, description, category, meta }: PostCardProps) {
  return (
    <div className="not-prose border-l-2 border-accent pl-4 sm:pl-5 my-6">
      {category && (
        <span className="inline-block font-mono text-[10px] font-medium tracking-[0.08em] uppercase rounded-[2px] px-2 py-0.5 text-text-3 bg-border mb-2.5">
          {category}
        </span>
      )}
      <a href={url} className="group block no-underline">
        <h3 className="font-mono text-[17px] sm:text-[19px] font-semibold text-text-1 leading-snug mb-2 group-hover:text-accent transition-colors duration-150">
          {title}
        </h3>
        <p className="font-sans text-[14px] text-text-2 leading-relaxed mb-0">{description}</p>
      </a>
      <div className="flex items-center justify-between gap-3 mt-3">
        <span className="font-mono text-[11px] text-text-3">{meta}</span>
        <a
          href={url}
          className="font-mono text-[12px] font-medium text-text-3 hover:text-accent transition-colors duration-150 no-underline"
        >
          Read →
        </a>
      </div>
    </div>
  );
}
