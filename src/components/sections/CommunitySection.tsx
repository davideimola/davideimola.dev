import { Photo } from "../ui/Photo";
import { HomeBand } from "./HomeBand";

export interface CommunityEvent {
  title: string;
  line: string;
  href?: string;
}

interface CommunitySectionProps {
  /** The association Davide runs, from projects.json. */
  association: { title: string; description: string; href: string };
  /** What it organises, folded by kind from the talk archive (its `host`). */
  events: CommunityEvent[];
}

const eventText = (e: CommunityEvent, hover: boolean) => (
  <>
    <span
      className={`font-sans font-semibold text-[16px] text-fg ${
        hover ? "group-hover:text-accent transition-colors duration-150" : ""
      }`}
    >
      {e.title}
    </span>
    <span className="font-sans text-[14px] leading-[1.5] text-fg-muted">{e.line}</span>
  </>
);

// COMMUNITY: the association first and what it organises under it, so Open
// Source Day reads as one of its events rather than a community of its own.
// The Open Source Day audience sits beside them, cut to end with the text.
export function CommunitySection({ association, events }: CommunitySectionProps) {
  return (
    <HomeBand tape="Community" tilt={0} title="Open source, in person.">
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-8 lg:gap-12 items-start">
        <figure className="m-0">
          <div className="relative w-full aspect-[3/2]">
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
        <div className="flex flex-col gap-5 min-w-0">
          <a href={association.href} className="group flex flex-col gap-2 no-underline">
            <span className="font-sans font-bold text-[24px] md:text-[28px] leading-[1.1] tracking-[-0.03em] text-fg group-hover:text-accent transition-colors duration-150">
              {association.title}
            </span>
            <span className="font-sans text-[16px] leading-[1.55] text-fg-body">
              {association.description}
            </span>
          </a>
          {events.length > 0 && (
            <div>
              <p className="m-0 mb-2.5 font-mono text-[12px] tracking-[0.04em] uppercase text-fg-subtle">
                What we organise
              </p>
              <ul className="m-0 p-0 list-none border-t border-fg">
                {events.map((e) => (
                  <li key={e.title} className="border-b border-border">
                    {e.href ? (
                      <a href={e.href} className="group flex flex-col gap-0.5 py-3 no-underline">
                        {eventText(e, true)}
                      </a>
                    ) : (
                      <span className="flex flex-col gap-0.5 py-3">{eventText(e, false)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </HomeBand>
  );
}
