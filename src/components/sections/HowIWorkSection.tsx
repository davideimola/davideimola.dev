import type { ReactNode } from "react";
import { Tape } from "../ui/Tape";

export interface Principle {
  title: string;
  body: ReactNode;
}

interface HowIWorkSectionProps {
  /** The creed from the CV Record: the motto and its gloss. */
  quote: string;
  gloss: string;
  principles: Principle[];
}

// HOW I WORK: the motto on the left, three numbered principles on the right,
// each a ruled row. The motto and gloss are the Record's creed, not copy here.
export function HowIWorkSection({ quote, gloss, principles }: HowIWorkSectionProps) {
  return (
    <section className="max-w-[1136px] mx-auto px-4 sm:px-8 mt-16 md:mt-[120px]">
      <div className="border-t border-fg pt-7 md:pt-12 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-4 lg:gap-[72px]">
        <div className="flex flex-col items-start gap-4 md:gap-6">
          <Tape tilt={0}>How I work</Tape>
          <h2 className="m-0 font-sans font-bold text-fg text-[34px] md:text-[56px] leading-[1.03] tracking-[-0.04em]">
            {quote}
          </h2>
          <p className="m-0 font-sans text-[17px] md:text-[20px] leading-[1.55] text-fg-muted">
            {gloss}
          </p>
        </div>
        <ol className="m-0 p-0 list-none flex flex-col">
          {principles.map((principle, i) => (
            <li
              key={principle.title}
              className="grid grid-cols-1 md:grid-cols-[56px_minmax(0,1fr)] gap-1 md:gap-4 py-3.5 md:py-[22px] border-t md:border-t-0 md:border-b last:md:border-b-0 border-border"
            >
              <span className="hidden md:block font-mono text-[14px] text-fg-subtle pt-[5px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-1 md:gap-1.5">
                <span className="font-sans font-bold text-[18px] md:text-[23px] tracking-[-0.02em] text-fg">
                  <span className="md:hidden font-mono text-[12px] font-normal text-fg-subtle mr-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {principle.title}
                </span>
                <span className="font-sans text-[15px] md:text-[18px] leading-[1.5] md:leading-[1.6] text-fg-body">
                  {principle.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
