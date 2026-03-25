import type { ReactNode } from "react";
import { ScrollReveal } from "./ScrollReveal";

interface PageHeroProps {
  command: string;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function PageHero({
  command,
  title,
  description,
  children,
  className = "mb-12",
}: PageHeroProps) {
  return (
    <ScrollReveal>
      <header className={className}>
        <p className="font-mono text-[13px] text-text-3 mb-4">
          <span className="text-accent mr-2">❯</span>
          {command}
        </p>
        <h1 className="font-mono text-[32px] sm:text-[40px] font-bold text-text-1 tracking-[-0.03em] leading-none mb-4">
          {title}
        </h1>
        <p className="font-sans text-[15px] text-text-2 leading-relaxed max-w-2xl">{description}</p>
        {children}
      </header>
    </ScrollReveal>
  );
}
