interface SectionHeaderProps {
  title: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  seeAllHref,
  seeAllLabel = "See all →",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-baseline justify-between mb-12 ${className}`}>
      <h2 className="font-mono text-[11px] font-medium text-text-3 tracking-[0.12em] uppercase flex items-center gap-2.5 before:content-['//'] before:text-accent before:opacity-70 before:text-[10px]">
        {title}
      </h2>
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
