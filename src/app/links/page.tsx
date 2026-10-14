import type { Metadata } from "next";
import { Mark, Wordmark } from "../../components/ui/BrandMark";
import { JsonLd } from "../../components/ui/JsonLd";
import { SubscribeForm } from "../../components/ui/SubscribeForm";
import { Tape } from "../../components/ui/Tape";
import {
  getAllPosts,
  getAllProjects,
  getFeedbackOpenTalks,
  getUpcomingTalks,
} from "../../lib/content";
import { formatDayMonth } from "../../lib/dates";
import { city, eventName } from "../../lib/sharing";
import { getShowcase } from "../../lib/shelf";
import { CAL_COM_URL, SOCIAL_PROFILES } from "../../lib/social";

// Regenerate hourly so the time-based blocks turn over without a deploy. The
// rating block has to light up on the conference morning: this page is what
// the closing slide's QR points at.
export const revalidate = 3600;

const DESCRIPTION =
  "Profiles, latest writing, and upcoming talks: every place you can find me, in one page.";

export const metadata: Metadata = {
  title: "Links",
  description: DESCRIPTION,
  // The page is also served at links.davideimola.dev (host rewrite);
  // this keeps one canonical URL across both hosts.
  alternates: { canonical: "https://davideimola.dev/links" },
  openGraph: {
    title: "Links · Davide Imola",
    description: DESCRIPTION,
    url: "https://davideimola.dev/links",
    // og:image comes from the co-located opengraph-image.tsx (file-based metadata)
  },
};

// Absolute: on links.davideimola.dev a relative "/" would be this page.
const SITE = "https://davideimola.dev";
const SCHRODINGER_HAT = "https://schroedinger-hat.org";

const PROFILE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Davide Imola",
    url: SITE,
    sameAs: SOCIAL_PROFILES.map((profile) => profile.url),
  },
};

function Row({
  href,
  title,
  hint,
  kicker,
  first = false,
  last = false,
  stacked = false,
}: {
  href: string;
  title: string;
  hint?: string;
  kicker?: string;
  first?: boolean;
  last?: boolean;
  stacked?: boolean;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group no-underline border-t ${first ? "border-fg" : "border-border"} ${
        last ? "border-b border-b-border" : ""
      } ${
        stacked
          ? "flex flex-col gap-1 py-4"
          : "flex items-center justify-between gap-4 min-h-14 py-3"
      }`}
    >
      {kicker && <span className="font-mono text-[12px] text-fg-subtle">{kicker}</span>}
      <span className="font-sans font-semibold text-[18px] leading-[1.3] text-fg group-hover:text-accent transition-colors duration-150">
        {title}
      </span>
      {hint && <span className="font-sans text-[14px] text-fg-subtle text-right">{hint}</span>}
    </a>
  );
}

// The link-in-bio, built for a phone first: who this is, the conference-day
// rating card first while a talk's window is open, a ruled list of links, the
// newsletter, the profiles.
export default async function LinksPage() {
  const latestPost = getAllPosts()[0];
  const upcomingTalks = getUpcomingTalks()
    .filter((t) => t.session)
    .slice(0, 2);
  // Live only during a talk's rating window, which the entry in talks.json
  // carries. Nothing here is edited on the day.
  const ratingTalks = getFeedbackOpenTalks();
  const flagship = getAllProjects().find((p) => p.flagship && p.status === "active");
  // The same seam /shelf and /now read; with nothing being read the row is absent.
  const { document: showcase } = await getShowcase();
  const reading = showcase.now.find((pass) => pass.type.verbBase === "read");

  return (
    <div className="max-w-[440px] mx-auto px-5 flex flex-col min-h-full pb-8">
      <JsonLd data={PROFILE_JSON_LD} />

      <header className="flex flex-col items-center gap-3.5 pt-10 pb-7 text-center">
        <div className="w-[84px] h-[84px] rounded-full bg-fg text-bg flex items-center justify-center">
          <Mark cut="m" size={56} title="Davide Imola" />
        </div>
        <h1 className="m-0 text-fg">
          <Wordmark weight="bold" width={180} title="davide imola" />
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[1.45] text-fg-muted max-w-[300px]">
          Builder. AI agents for security, mostly in Go. Learning in public.
        </p>
      </header>

      {/* Conference day: first on the page while it lasts, because in the room
          nobody scrolls. */}
      {ratingTalks.map((talk) => (
        <section
          key={talk.slug}
          className="relative mt-2 mb-6 bg-surface border border-fg px-5 pt-[22px] pb-5 flex flex-col gap-3"
        >
          <Tape tilt={0} size="sm" className="absolute -left-1.5 -top-3.5">
            Just saw my talk?
          </Tape>
          <span className="mt-1 font-sans font-bold text-[21px] leading-[1.25] tracking-[-0.02em] text-fg">
            {talk.session?.title ?? talk.event}
          </span>
          <span className="font-mono text-[13px] text-fg-subtle">
            {talk.event} · {city(talk.location)}
          </span>
          {talk.feedback?.url && (
            <a
              href={talk.feedback.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center justify-center h-[52px] bg-fg text-bg font-sans font-semibold text-[17px] no-underline hover:bg-fg-body"
            >
              Rate this talk
            </a>
          )}
          {talk.session?.slides && (
            <a
              href={talk.session.slides}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-12 border border-fg font-sans font-semibold text-[16px] text-fg no-underline hover:text-accent hover:border-accent"
            >
              Get the slides
            </a>
          )}
        </section>
      ))}

      <nav aria-label="Links" className="flex flex-col mt-7">
        {latestPost && (
          <Row
            first
            stacked
            kicker="Latest post"
            title={latestPost.title}
            href={`${SITE}/blog/${latestPost.slug}`}
          />
        )}
        {upcomingTalks.map((talk, i) => (
          <Row
            key={talk.slug}
            first={!latestPost && i === 0}
            stacked
            kicker={i === 0 ? "Next talks" : undefined}
            title={talk.session?.title ?? talk.event}
            hint={`${eventName(talk.event)}, ${city(talk.location)} · ${formatDayMonth(talk.date)}`}
            href={`${SITE}/sharing#${talk.slug}`}
          />
        ))}
        {flagship && (
          <Row
            title={flagship.title}
            hint="AI security review agent"
            href={flagship.github ?? flagship.url ?? `${SITE}/projects`}
          />
        )}
        <Row
          title="Book a call"
          hint={CAL_COM_URL.replace(/^https?:\/\//, "")}
          href={CAL_COM_URL}
        />
        <Row title="Schrodinger Hat" hint="the community" href={SCHRODINGER_HAT} />
        {reading && <Row title="Reading now" hint={reading.title} href={`${SITE}/shelf`} />}
        <Row last title="davideimola.dev" hint="everything else" href={SITE} />
      </nav>

      <div className="mt-8 flex flex-col gap-2.5">
        <p className="m-0 font-sans font-bold text-[18px] tracking-[-0.01em] text-fg">
          One email a month
        </p>
        <SubscribeForm mode="inline" label={null} />
      </div>

      <footer className="mt-auto pt-7 flex flex-col items-center gap-3.5">
        <div className="flex gap-[22px] font-mono text-[14px]">
          {SOCIAL_PROFILES.map((profile) => (
            <a
              key={profile.url}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg no-underline hover:text-accent"
            >
              {profile.label === "BlueSky" ? "Bluesky" : profile.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2.5 text-fg">
          <Mark cut="s" size={22} />
          <span className="font-sans font-bold text-[15px]">Everything I learn, I share.</span>
        </div>
        <a
          href={`${SITE}/privacy`}
          className="font-mono text-[12px] text-fg-subtle no-underline hover:text-accent"
        >
          Privacy
        </a>
      </footer>
    </div>
  );
}
