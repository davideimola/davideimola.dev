interface SectionHeaderProps {
  title: string;
  variant?: "section" | "subsection";
  seeAllHref?: string;
  seeAllLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  variant = "section",
  seeAllHref,
  seeAllLabel = "See all →",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-baseline justify-between mb-12 ${className}`}>
      {variant === "section" ? (
        <h2 className="font-mono text-[13px] font-semibold text-text-2 tracking-[0.12em] uppercase flex items-center gap-2.5 before:content-['//'] before:text-accent before:text-[11px]">
          {title}
        </h2>
      ) : (
        <h3 className="font-mono text-[13px] font-medium text-text-2 mb-0">
          {title}
        </h3>
      )}
      {seeAllHref && (
        <a
          href={seeAllHref}
          className="font-mono text-[11px] text-text-3 no-underline transition-colors duration-150 hover:text-accent"
        >
          {seeAllLabel}
        </a>
      )}
    </div>
  );
}
