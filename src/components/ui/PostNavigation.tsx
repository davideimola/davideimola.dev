import type { BlogPost } from "../../lib/content";

interface PostNavigationProps {
  prev: BlogPost | null;
  next: BlogPost | null;
}

export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <a
          href={`/blog/${prev.slug}`}
          className="group flex flex-col gap-1 p-4 border border-border bg-surface hover:border-fg transition-colors duration-150 no-underline"
        >
          <span className="font-mono text-[12px] text-fg-subtle tracking-[0.06em]">OLDER</span>
          <span className="font-sans text-[17px] font-semibold tracking-[-0.01em] text-fg group-hover:text-accent transition-colors duration-150 line-clamp-2">
            {prev.title}
          </span>
        </a>
      ) : (
        <div />
      )}
      {next ? (
        <a
          href={`/blog/${next.slug}`}
          className="group flex flex-col gap-1 p-4 border border-border bg-surface hover:border-fg transition-colors duration-150 no-underline sm:text-right"
        >
          <span className="font-mono text-[12px] text-fg-subtle tracking-[0.06em]">NEWER</span>
          <span className="font-sans text-[17px] font-semibold tracking-[-0.01em] text-fg group-hover:text-accent transition-colors duration-150 line-clamp-2">
            {next.title}
          </span>
        </a>
      ) : (
        <div />
      )}
    </nav>
  );
}
