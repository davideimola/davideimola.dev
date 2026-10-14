import type { Talk } from "../../lib/content";
import { getRecentTalks, getUpcomingTalks } from "../../lib/content";
import { formatMonthYear, formatRelative } from "../../lib/dates";
import { BookingPrompt, ScrollReveal, SectionHeader } from "../ui";

function displayDate(talk: Talk): string {
  return talk.eventDateRange ?? formatMonthYear(talk.date);
}

// The nearest engagement, given a little room to breathe and a clear "next" marker.
function FeaturedNext({ talk, relative }: { talk: Talk; relative: string }) {
  return (
    <a href={`/sharing#${talk.slug}`} className="group block py-4 no-underline">
      <div className="flex items-center gap-2 font-mono text-[13px] mb-2">
        <span className="text-fg font-medium">Next</span>
        <span className="text-fg-subtle">·</span>
        <span className="text-fg-muted">{relative}</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
        <div className="min-w-0">
          <div className="font-mono text-[13px] text-fg-subtle mb-1.5">
            {displayDate(talk)} · {talk.location}
          </div>
          <div className="font-sans text-[20px] sm:text-[22px] tracking-[-0.02em] leading-snug">
            <span className="text-fg font-bold">{talk.event}</span>
            {talk.session?.title && <span className="text-fg-muted"> / {talk.session.title}</span>}
          </div>
        </div>
        <span className="font-mono text-[13px] text-fg-subtle group-hover:text-accent group-hover:translate-x-1 transition-[color,transform] duration-150 shrink-0 hidden sm:inline">
          →
        </span>
      </div>
    </a>
  );
}

function CompactRow({ talk }: { talk: Talk }) {
  return (
    <a
      href={`/sharing#${talk.slug}`}
      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-4 no-underline transition-colors duration-150"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0">
        <span className="font-mono text-[13px] text-fg-subtle shrink-0">{displayDate(talk)}</span>
        <span className="font-mono text-[13px] text-fg-subtle shrink-0 hidden sm:inline">·</span>
        <span className="font-mono text-[13px] text-fg-muted shrink-0">{talk.event}</span>
        {talk.session?.title && (
          <span className="font-sans text-[16px] font-semibold text-fg truncate">
            {talk.session.title}
          </span>
        )}
      </div>
      <span className="font-mono text-[13px] text-fg-subtle group-hover:text-accent group-hover:translate-x-1 transition-[color,transform] duration-150 shrink-0">
        →
      </span>
    </a>
  );
}

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[1136px] mx-auto px-4 sm:px-8">{children}</div>
    </section>
  );
}

export function TalksSection() {
  const upcoming = getUpcomingTalks();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // State A: forward-looking: lead with where you can catch me next.
  if (upcoming.length > 0) {
    const [next, ...rest] = upcoming;
    return (
      <SectionWrapper>
        <ScrollReveal>
          <SectionHeader
            title="Upcoming Engagements"
            seeAllHref="/sharing"
            seeAllLabel="All engagements →"
            tilt={1}
          />
        </ScrollReveal>
        <div className="mt-8 flex flex-col divide-y divide-border">
          <ScrollReveal>
            <FeaturedNext talk={next} relative={formatRelative(next.date, today)} />
          </ScrollReveal>
          {rest.slice(0, 2).map((talk, i) => (
            <ScrollReveal key={talk.slug} delay={(i + 1) * 80}>
              <CompactRow talk={talk} />
            </ScrollReveal>
          ))}
        </div>
      </SectionWrapper>
    );
  }

  // State B: calendar empty, but there's a track record: prove it, then invite.
  const recent = getRecentTalks(3);
  if (recent.length > 0) {
    return (
      <SectionWrapper>
        <ScrollReveal>
          <SectionHeader
            title="Recently spoke"
            seeAllHref="/sharing"
            seeAllLabel="All engagements →"
            tilt={1}
          />
        </ScrollReveal>
        <ul className="mt-8 flex flex-col divide-y divide-border">
          {recent.map((talk, i) => (
            <ScrollReveal key={talk.slug} delay={i * 80}>
              <li>
                <CompactRow talk={talk} />
              </li>
            </ScrollReveal>
          ))}
        </ul>
        <ScrollReveal>
          <BookingPrompt
            className="mt-8 pt-6 border-t border-border"
            message="No public dates right now. Want me at your event?"
          />
        </ScrollReveal>
      </SectionWrapper>
    );
  }

  // State C: nothing yet: a pure invitation.
  return (
    <SectionWrapper>
      <ScrollReveal>
        <SectionHeader
          title="Speaking"
          seeAllHref="/sharing"
          seeAllLabel="Speaker kit →"
          tilt={1}
        />
      </ScrollReveal>
      <ScrollReveal>
        <BookingPrompt
          className="mt-8"
          message="I speak about Go, security & open source. Let's talk."
        />
      </ScrollReveal>
    </SectionWrapper>
  );
}
