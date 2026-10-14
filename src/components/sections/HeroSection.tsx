import Image from "next/image";
import type { BlogPost, Project } from "../../lib/content";
import { formatDayMonth, formatDayMonthYear } from "../../lib/dates";
import type { RotatingCard } from "../../lib/home-cards";
import { ButtonLink } from "../ui/Button";
import { Card } from "../ui/Card";
import { Marker } from "../ui/Marker";
import { Tape } from "../ui/Tape";

interface HeroSectionProps {
  latestPost: BlogPost | null;
  project: Project | null;
  rotating: RotatingCard | null;
}

interface HomeCard {
  key: string;
  tape: string;
  href: string;
  title: string;
  meta?: string;
  /** Mono date line instead of the sans meta line. */
  date?: string;
}

function rotatingCard(card: RotatingCard): HomeCard {
  switch (card.kind) {
    case "next-talk":
      return {
        key: "talk",
        tape: "Next talk",
        href: `/sharing#${card.talk.slug}`,
        title: card.talk.session?.title ?? card.talk.event,
        meta: `${card.talk.event} · ${formatDayMonth(card.talk.date)}`,
      };
    case "last-recording":
      return {
        key: "talk",
        tape: "Last talk",
        href: card.talk.session?.video ?? `/sharing#${card.talk.slug}`,
        title: card.talk.session?.title ?? card.talk.event,
        meta: `${card.talk.event} · Watch the recording`,
      };
    case "reading":
      return {
        key: "reading",
        tape: "Reading",
        href: "/shelf",
        title: card.pass.title,
        meta: card.pass.type.label,
      };
  }
}

// The column count follows the cards that exist: the rotating slot never
// renders empty, it disappears and the grid closes up.
const GRID_COLS: Record<number, string> = {
  1: "md:grid-cols-1 md:max-w-[33%]",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

// The home hero (docs/brand.md, "Site"): display headline with the page's one
// marker on "security", the lead, one ink button plus one text link, the place
// in mono, and the portrait on the right in black and white with its tape.
// Under it three straight cards, each with a tape on its edge.
export function HeroSection({ latestPost, project, rotating }: HeroSectionProps) {
  const cards: HomeCard[] = [];
  if (latestPost) {
    cards.push({
      key: "writing",
      tape: "Writing",
      href: `/blog/${latestPost.slug}`,
      title: latestPost.title,
      date: formatDayMonthYear(latestPost.date),
    });
  }
  if (project) {
    cards.push({
      key: "building",
      tape: "Building",
      href: project.url ?? project.github ?? "/projects",
      title: project.title,
      meta: project.description,
    });
  }
  if (rotating) cards.push(rotatingCard(rotating));

  return (
    <section className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-6 md:pt-14">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-12 lg:gap-[72px] items-stretch">
        <div className="flex flex-col gap-7">
          <h1 className="m-0 font-sans font-bold text-fg text-[44px] sm:text-[64px] lg:text-display leading-[0.98] tracking-[-0.045em]">
            I build AI agents for <Marker>security</Marker>, and the tools I need along the way.
          </h1>
          <p className="m-0 font-sans text-[19px] sm:text-lead leading-[1.5] text-fg-muted">
            Tech Lead at RedCarbon. I write mostly Go, and I share everything I learn.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink variant="primary" size="lg" href="/blog">
              Read the writing
            </ButtonLink>
            <ButtonLink variant="link" size="lg" href="/about">
              More about me
            </ButtonLink>
            <span className="font-mono text-meta text-fg-subtle">Verona, Italy · Remote</span>
          </div>
        </div>

        <figure className="relative m-0 lg:mt-1.5 w-full max-w-[340px] min-h-[340px] aspect-[4/5] lg:aspect-auto">
          <Image
            src="/images/davide-about-profile.webp"
            alt="Davide at a lectern giving a talk, laptop covered in community stickers"
            fill
            sizes="340px"
            priority
            className="object-cover object-[50%_20%] grayscale contrast-[1.05]"
          />
          <Tape size="lg" tilt={0} className="absolute -left-3 lg:-left-[26px] bottom-[30px]">
            That&apos;s me, mid-talk
          </Tape>
        </figure>
      </div>

      {cards.length > 0 && (
        <div
          className={`mt-10 md:mt-[72px] grid grid-cols-1 gap-[26px] md:gap-7 ${GRID_COLS[cards.length]}`}
        >
          {cards.map((card, i) => (
            <Card
              key={card.key}
              href={card.href}
              tape={card.tape}
              tapeTilt={(i % 3) as 0 | 1 | 2}
              className="px-[26px] pb-6 pt-[34px]"
            >
              <span className="flex flex-col gap-2">
                <span className="font-sans font-bold text-[23px] leading-[1.2] tracking-[-0.025em] text-fg">
                  {card.title}
                </span>
                {card.date && (
                  <span className="font-mono text-[12px] md:text-[13px] text-fg-subtle">
                    {card.date}
                  </span>
                )}
                {card.meta && (
                  <span className="font-sans text-[16px] leading-[1.5] text-fg-subtle line-clamp-2">
                    {card.meta}
                  </span>
                )}
              </span>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
