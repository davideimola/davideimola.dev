import type { ReactNode } from "react";
import { ButtonLink } from "../ui/Button";
import { Tape, type TapeTilt } from "../ui/Tape";

interface HomeBandProps {
  tape: string;
  tilt: TapeTilt;
  title: ReactNode;
  /** The one link to the page this band summarises, top right. */
  more?: { label: string; href: string };
  children: ReactNode;
}

// One block of the home story (BUILDING, WRITING, IN PUBLIC): a pencil rule, a
// tape naming the block, its title and the link to the full page. The rule,
// the tape and the title already mark where a block starts, so the space
// around them stays modest: one rhythm for all three, set here only.
export function HomeBand({ tape, tilt, title, more, children }: HomeBandProps) {
  return (
    <section className="max-w-[1136px] mx-auto px-4 sm:px-8 mt-12 md:mt-16">
      <div className="border-t border-rule pt-7 md:pt-8 flex flex-col gap-6 md:gap-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="flex flex-col items-start gap-3.5 md:gap-4">
            <Tape tilt={tilt}>{tape}</Tape>
            <h2 className="m-0 font-sans font-bold text-fg text-[30px] md:text-[40px] leading-[1.05] tracking-[-0.04em]">
              {title}
            </h2>
          </div>
          {more && (
            <ButtonLink variant="link" href={more.href}>
              {more.label}
            </ButtonLink>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
