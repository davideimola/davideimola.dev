import { Photo } from "../ui/Photo";
import { Tape } from "../ui/Tape";

export interface Community {
  title: string;
  description: string;
  href: string;
}

interface InPublicSectionProps {
  communities: Community[];
  /** Conferences Davide has spoken at, derived from the talk archive. */
  spokenAt: string[];
}

// IN PUBLIC: the Open Source Day audience in black and white, and the
// communities Davide helps run.
export function InPublicSection({ communities, spokenAt }: InPublicSectionProps) {
  return (
    <section className="max-w-[1136px] mx-auto px-4 sm:px-8 mt-14 md:mt-20">
      <div className="border-t border-rule pt-7 md:pt-12 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6 lg:gap-16 items-start">
        <figure className="m-0 order-2 lg:order-1">
          <div className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px]">
            <Photo
              src="/images/osday-audience.webp"
              alt="The audience at Open Source Day, rows of people with lanyards watching a talk"
              sizes="(min-width: 1024px) 620px, 100vw"
            />
          </div>
          <figcaption className="font-mono text-[13px] text-fg-subtle pt-2.5">
            Open Source Day, Florence
          </figcaption>
        </figure>
        <div className="order-1 lg:order-2 flex flex-col items-start gap-4 lg:gap-7">
          <Tape tilt={2}>In public</Tape>
          <h2 className="m-0 font-sans font-bold text-fg text-[30px] md:text-[44px] leading-[1.05] tracking-[-0.04em]">
            Communities I help run
          </h2>
          {communities.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="group flex flex-col gap-1 lg:gap-1.5 pt-3 lg:pt-[18px] border-t border-border w-full no-underline"
            >
              <span className="font-sans font-bold text-[19px] lg:text-[23px] tracking-[-0.02em] text-fg group-hover:text-accent transition-colors duration-150">
                {c.title}
              </span>
              <span className="font-sans text-[15px] lg:text-[18px] leading-[1.55] text-fg-body">
                {c.description}
              </span>
            </a>
          ))}
          {spokenAt.length > 0 && (
            <p className="hidden lg:block m-0 font-mono text-[14px] leading-[1.7] text-fg-subtle pt-[18px] border-t border-border w-full">
              Spoken at {spokenAt.join(", ")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
