import { ButtonLink } from "../ui/Button";
import { Marker } from "../ui/Marker";
import { Photo } from "../ui/Photo";
import { Tape } from "../ui/Tape";

interface HeroSectionProps {
  /** The flagship project, named in the lead as the proof of the headline. */
  flagship?: { title: string; href: string } | null;
}

// The home hero (docs/brand.md, "Site"): display headline with the page's one
// marker on "security", the lead naming the flagship project, one ink button
// (About is in the NavBar, so the hero does not repeat it), the place in mono,
// and the portrait on the right in black and white with its tape. What follows
// is the story the headline promises: BUILDING, WRITING, IN PUBLIC.
export function HeroSection({ flagship }: HeroSectionProps) {
  return (
    <section className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-6 md:pt-14">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-12 lg:gap-[72px] items-stretch">
        <div className="flex flex-col gap-7">
          <h1 className="m-0 font-sans font-bold text-fg text-[44px] sm:text-[64px] lg:text-display leading-[0.98] tracking-[-0.045em]">
            I build AI agents for <Marker>security</Marker>, and the tools I need along the way.
          </h1>
          {/* The headline says what I build; the lead names it. */}
          <p className="m-0 font-sans text-[19px] sm:text-lead leading-[1.5] text-fg-muted">
            Tech Lead at RedCarbon
            {flagship && (
              <>
                , and in the open I build{" "}
                <a
                  href={flagship.href}
                  className="text-fg border-b border-fg no-underline hover:text-accent hover:border-accent transition-colors duration-150"
                >
                  {flagship.title}
                </a>
              </>
            )}
            . I write mostly Go, and I share everything I learn.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink variant="primary" size="lg" href="/blog">
              Read the writing
            </ButtonLink>
            <span className="font-mono text-meta text-fg-subtle">Verona, Italy · Remote</span>
          </div>
        </div>

        <figure className="relative m-0 lg:mt-1.5 w-full max-w-[340px] min-h-[340px] aspect-[4/5] lg:aspect-auto">
          <Photo
            src="/images/davide-about-profile.webp"
            alt="Davide at a lectern giving a talk, laptop covered in community stickers"
            sizes="340px"
            priority
            position="object-[50%_20%]"
          />
          <Tape size="lg" tilt={0} className="absolute -left-3 lg:-left-[26px] bottom-[30px]">
            That&apos;s me, mid-talk
          </Tape>
        </figure>
      </div>
    </section>
  );
}
