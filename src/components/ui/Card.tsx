import type { ReactNode } from "react";
import { Tape, type TapeTilt } from "./Tape";

// A straight block on the surface with a hairline (docs/brand.md). Cards never
// rotate; a tape may sit on the top-left edge to say what the card is. Hover
// darkens the hairline to ink: no glow, no red.

interface CardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  hoverable?: boolean;
  /** Label-maker tape on the top-left edge, e.g. "Writing". */
  tape?: ReactNode;
  tapeTilt?: TapeTilt;
}

const baseClasses = "relative block bg-surface border border-border p-6";
const hoverClasses = "transition-colors duration-150 hover:border-fg";

export function Card({
  children,
  className = "",
  href,
  hoverable = true,
  tape,
  tapeTilt = 0,
}: CardProps) {
  const classes = [baseClasses, tape ? "pt-9" : "", hoverable ? hoverClasses : "", className].join(
    " "
  );

  const content = (
    <>
      {tape && (
        <Tape tilt={tapeTilt} className="absolute -left-2.5 -top-3.5 z-10">
          {tape}
        </Tape>
      )}
      <div className="relative h-full">{children}</div>
    </>
  );

  if (href) {
    // An off-site card opens in a new tab on its own: the callers pass a URL,
    // not a flag, and none of them has to remember the rel attributes.
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={`no-underline text-fg ${classes}`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return <div className={classes}>{content}</div>;
}
