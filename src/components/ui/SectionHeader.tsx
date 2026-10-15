import { Tape, type TapeTilt } from "./Tape";

interface SectionHeaderProps {
  title: string;
  variant?: "section" | "subsection";
  seeAllHref?: string;
  seeAllLabel?: string;
  /** Alternate between neighbouring sections so the tapes never all lean one way. */
  tilt?: TapeTilt;
  className?: string;
}

// A section opens with a tape (docs/brand.md, "The tape"); a subsection with a
// plain h3. The "see all" link is mono, underlined, and turns red on hover only.
export function SectionHeader({
  title,
  variant = "section",
  seeAllHref,
  seeAllLabel = "See all",
  tilt = 0,
  className = "mb-12",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {variant === "section" ? (
        <Tape as="h2" tilt={tilt}>
          {title}
        </Tape>
      ) : (
        <h3 className="text-[20px] sm:text-h3 font-bold text-fg mb-0">{title}</h3>
      )}
      {seeAllHref && (
        <a
          href={seeAllHref}
          className="font-mono text-meta text-fg-muted underline underline-offset-4 decoration-1 transition-colors duration-150 hover:text-accent shrink-0"
        >
          {seeAllLabel}
        </a>
      )}
    </div>
  );
}
