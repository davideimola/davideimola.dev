import type { ReactNode } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { Tape, type TapeTilt } from "./Tape";

interface PageHeroProps {
  /** The tape above the title: what kind of page this is ("Writing", "Talks"). */
  label: string;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  tilt?: TapeTilt;
  className?: string;
}

export function PageHero({
  label,
  title,
  description,
  children,
  tilt = 0,
  className = "mb-12",
}: PageHeroProps) {
  return (
    <ScrollReveal>
      <header className={className}>
        <Tape tilt={tilt} className="mb-6">
          {label}
        </Tape>
        <h1 className="font-sans font-bold text-fg text-[40px] sm:text-[52px] lg:text-h1 leading-[1.02] tracking-[-0.045em] mb-5">
          {title}
        </h1>
        <div className="font-sans text-[18px] sm:text-lead leading-[1.5] text-fg-muted max-w-[42rem]">
          {description}
        </div>
        {children}
      </header>
    </ScrollReveal>
  );
}
