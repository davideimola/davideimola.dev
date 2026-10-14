import type { ReactNode } from "react";

// Label-maker tape (docs/brand.md, "The tape"): ink tape with paper letters,
// chalk with night letters on dark, never red, flat. It labels sections and
// content types. One tape per block, never stacked, and the tilt alternates:
// pass a different `tilt` to neighbouring tapes so they never all lean the
// same way. Tapes sit on straight things; the thing under them never rotates.

export const TAPE_TILTS = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]"] as const;
export type TapeTilt = 0 | 1 | 2;

type TapeSize = "sm" | "md" | "lg";

const sizeClasses: Record<TapeSize, string> = {
  sm: "text-[13px]",
  md: "text-label",
  lg: "text-[17px]",
};

interface TapeProps {
  children: ReactNode;
  /** Index into the brand's tilt cycle (-1deg, 1deg, -0.5deg). */
  tilt?: TapeTilt;
  size?: TapeSize;
  /** Render as a heading when the tape is the section's title. */
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
}

export function Tape({
  children,
  tilt = 0,
  size = "md",
  as: Tag = "span",
  className = "",
}: TapeProps) {
  return (
    <Tag
      className={[
        "inline-block w-fit m-0 bg-tape-bg text-tape-fg font-label font-bold uppercase",
        "leading-none tracking-[0.12em] rounded-[3px] px-[0.67em] py-[0.27em]",
        "whitespace-nowrap select-none",
        TAPE_TILTS[tilt],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
