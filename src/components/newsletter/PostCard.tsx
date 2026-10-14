import { ROW_CLASSES } from "./row";

interface PostCardProps {
  title: string;
  url: string;
  description: string;
  /** Blog category, printed in the mono meta line. Optional. */
  category?: string;
  /** Meta line, e.g. "Jul 18, 2026 · 7 min read". Optional. */
  meta?: string;
}

// Web counterpart of the email PostCard (src/emails/components/PostCard.tsx): same props.
// A ruled row like the blog archive: a hairline above, the title in sans, the "why read
// it" line, the meta in mono. `not-prose` keeps the @tailwindcss/typography styles off it.
export function PostCard({ title, url, description, category, meta }: PostCardProps) {
  const line = [category, meta].filter(Boolean).join(" · ");
  return (
    <a href={url} className={ROW_CLASSES}>
      <span className="block font-sans text-[20px] sm:text-[22px] font-bold text-fg leading-[1.2] tracking-[-0.02em] group-hover:text-accent transition-colors duration-150">
        {title}
      </span>
      <span className="block mt-2 font-sans text-[16px] sm:text-[17px] text-fg-muted leading-[1.55]">
        {description}
      </span>
      {line && <span className="block mt-2.5 font-mono text-[13px] text-fg-subtle">{line}</span>}
    </a>
  );
}
