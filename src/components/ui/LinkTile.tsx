interface LinkTileProps {
  label: string;
  href: string;
  hint?: string;
  className?: string;
}

const tileClasses = [
  "group flex items-center gap-4 no-underline",
  "bg-surface border border-border  px-5 py-4",
  "relative overflow-hidden",
  "transition-[border-color,background] duration-200",
  "hover:border-fg hover:bg-surface-inline",
  "after:absolute after:inset-0 after:bg-surface-inline after:opacity-0",
  "after:transition-opacity after:duration-200 hover:after:opacity-100",
].join(" ");

export function LinkTile({ label, href, hint, className = "" }: LinkTileProps) {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      className={`${tileClasses} ${className}`}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="relative z-10 flex-1 min-w-0 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
        <span className="font-mono text-[14px] font-medium text-fg">{label}</span>
        {hint && <span className="font-mono text-[11px] text-fg-muted truncate">{hint}</span>}
      </span>
      <span
        aria-hidden="true"
        className="relative z-10 font-mono text-[13px] text-fg-subtle transition-colors duration-200 group-hover:text-accent"
      >
        →
      </span>
    </a>
  );
}
