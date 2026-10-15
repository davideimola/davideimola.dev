import { IconBrandGithub, IconBrandLinkedin, IconWorld } from "@tabler/icons-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Mark, Wordmark } from "../../components/ui/BrandMark";
import { JsonLd } from "../../components/ui/JsonLd";
import { Photo } from "../../components/ui/Photo";
import { PostCover } from "../../components/ui/PostCover";
import { SubscribeForm } from "../../components/ui/SubscribeForm";
import { Tape, type TapeTilt } from "../../components/ui/Tape";
import {
  getAllPosts,
  getAllProjects,
  getAllTalks,
  getFeedbackOpenTalks,
  getPostBySlug,
  getUpcomingTalks,
  type Talk,
} from "../../lib/content";
import { formatDayMonth } from "../../lib/dates";
import { city, eventName, hostedBy, organisedByKind } from "../../lib/sharing";
import { ALL_PROFILES, CAL_COM_URL, SOCIAL_PROFILES } from "../../lib/social";
import { upcomingBesidesRated } from "../../lib/talk-feedback";

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

// The association COMMUNITY presents, read from projects.json.
const ASSOCIATION = "schrodinger-hat";

const PROFILE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Davide Imola",
    url: SITE,
    sameAs: ALL_PROFILES.map((profile) => profile.url),
  },
};

// The one place on the site where profiles are icons rather than names: a
// link-in-bio is read as a row of icons under the name (CLAUDE.md, "Icons").
const PROFILE_ICONS: Record<string, typeof IconWorld> = {
  LinkedIn: IconBrandLinkedin,
  GitHub: IconBrandGithub,
};
// LinkedIn first: it is where he posts most.
const PROFILE_ORDER = ["LinkedIn", "GitHub"];

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;
const opensElsewhere = (href: string) => href.startsWith("http") && !href.startsWith(SITE);

function Group({ tape, tilt, children }: { tape: string; tilt: TapeTilt; children: ReactNode }) {
  return (
    <section className="flex flex-col items-start">
      <Tape tilt={tilt} size="sm" className="mb-3">
        {tape}
      </Tape>
      <div className="w-full border-t border-fg flex flex-col">{children}</div>
    </section>
  );
}

// A plain row: a title and a line under it.
function Row({ href, title, hint }: { href: string; title: string; hint: string }) {
  return (
    <a
      href={href}
      {...(opensElsewhere(href) ? newTab : {})}
      className="group flex flex-col gap-0.5 py-3.5 border-b border-border no-underline"
    >
      <span className="font-sans font-semibold text-[17px] leading-[1.3] text-fg group-hover:text-accent transition-colors duration-150">
        {title}
      </span>
      <span className="font-sans text-[14px] text-fg-subtle">{hint}</span>
    </a>
  );
}

// A row with a 112px thumbnail (a drawing, a calendar leaf, a photo), so the
// work reads at a glance and every row of a group keeps one step.
function ThumbRow({
  href,
  kicker,
  title,
  meta,
  thumb,
}: {
  href: string;
  kicker: string;
  title: string;
  meta?: string;
  thumb: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(opensElsewhere(href) ? newTab : {})}
      className="group grid grid-cols-[112px_minmax(0,1fr)] gap-3.5 items-center py-3.5 border-b border-border no-underline"
    >
      {thumb}
      <span className="flex flex-col gap-1 min-w-0">
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-subtle">
          {kicker}
        </span>
        <span className="font-sans font-semibold text-[16px] leading-[1.3] text-fg group-hover:text-accent transition-colors duration-150">
          {title}
        </span>
        {meta && <span className="font-mono text-[12px] text-fg-subtle truncate">{meta}</span>}
      </span>
    </a>
  );
}

// A talk is a date: a calendar leaf the size of a cover, the day large.
function CalendarLeaf({ talk }: { talk: Talk }) {
  const [day, month] = formatDayMonth(talk.date).split(" ");
  return (
    <span className="relative w-full aspect-video border border-border bg-surface flex flex-col items-center justify-center leading-none">
      <span className="absolute top-0 inset-x-0 h-[7px] bg-fg" aria-hidden="true" />
      <span className="font-mono text-[28px] tracking-[-0.03em] text-fg pt-1">{day}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle pt-1">
        {month}
      </span>
    </span>
  );
}

// The link-in-bio, built for a phone first: the mark, the wordmark and the
// profiles as icons; the conference-day rating card while a talk's window is
// open; then NOW (the latest post, the flagship), ON STAGE (the next talks,
// and always the invitation), COMMUNITY (the association) and KEEP IN TOUCH
// (the newsletter, a call). Every group opens with a tape.
export default function LinksPage() {
  const latestPost = getAllPosts()[0];
  const talks = getAllTalks();
  const projects = getAllProjects();
  // Live only during a talk's rating window, which the entry in talks.json
  // carries. Nothing here is edited on the day.
  const ratingTalks = getFeedbackOpenTalks();
  const nextTalks = upcomingBesidesRated(
    getUpcomingTalks().filter((t) => t.session),
    ratingTalks,
    2
  );
  const flagship = projects.find((p) => p.flagship && p.status === "active");
  const flagshipPost = flagship?.post ? getPostBySlug(flagship.post) : null;
  const association = projects.find((p) => p.slug === ASSOCIATION);
  // "Open Source Day, meetups": what the association organises, from the archive.
  const organises = organisedByKind(hostedBy(talks, ASSOCIATION))
    .map((kind, i) => {
      const name = kind.kind === "Conference" ? eventName(kind.latest.event) : `${kind.kind}s`;
      return i === 0 ? name : name.toLowerCase();
    })
    .join(", ");

  const profiles = [
    ...[...SOCIAL_PROFILES]
      .sort((a, b) => PROFILE_ORDER.indexOf(a.label) - PROFILE_ORDER.indexOf(b.label))
      .map((p) => ({ label: p.label, href: p.url, Icon: PROFILE_ICONS[p.label] })),
    { label: "Website", href: SITE, Icon: IconWorld },
  ].filter((p) => p.Icon);

  return (
    <div className="max-w-[440px] mx-auto px-5 flex flex-col gap-8 min-h-full pb-10">
      <JsonLd data={PROFILE_JSON_LD} />

      <div className="flex flex-col">
        <header className="flex flex-col items-center gap-3.5 pt-10 pb-7 text-center">
          <div className="w-[84px] h-[84px] rounded-full bg-fg text-bg flex items-center justify-center">
            <Mark cut="m" size={56} title="Davide Imola" />
          </div>
          <h1 className="m-0 text-fg">
            <Wordmark weight="bold" width={180} title="davide imola" />
          </h1>
          <nav aria-label="Profiles" className="flex items-center gap-1">
            {profiles.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(opensElsewhere(href) ? newTab : {})}
                className="w-11 h-11 flex items-center justify-center text-fg hover:text-accent transition-colors duration-150"
              >
                <Icon size={24} stroke={1.75} aria-hidden="true" />
              </a>
            ))}
          </nav>
          <p className="m-0 font-sans text-[16px] leading-[1.45] text-fg-muted max-w-[300px]">
            I build AI agents for security. I write mostly Go, and I share everything I learn.
          </p>
        </header>

        {/* Conference day: first on the page while it lasts, because in the
            room nobody scrolls. */}
        {ratingTalks.map((talk) => (
          <section
            key={talk.slug}
            className="relative mt-2 bg-surface border border-fg px-5 pt-[22px] pb-5 flex flex-col gap-3"
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
                {...newTab}
                className="mt-1 flex items-center justify-center h-[52px] bg-fg text-bg font-sans font-semibold text-[17px] no-underline hover:bg-fg-body"
              >
                Rate this talk
              </a>
            )}
            {talk.session?.slides && (
              <a
                href={talk.session.slides}
                {...newTab}
                className="flex items-center justify-center h-12 border border-fg font-sans font-semibold text-[16px] text-fg no-underline hover:text-accent hover:border-accent"
              >
                Get the slides
              </a>
            )}
          </section>
        ))}
      </div>

      {(latestPost || flagship) && (
        <Group tape="Now" tilt={0}>
          {latestPost && (
            <ThumbRow
              href={`${SITE}/blog/${latestPost.slug}`}
              kicker="Writing"
              title={latestPost.title}
              thumb={
                latestPost.heroImage ? (
                  <PostCover src={latestPost.heroImage} alt="" sizes="112px" />
                ) : (
                  <span />
                )
              }
            />
          )}
          {flagship && (
            <ThumbRow
              href={flagship.github ?? flagship.url ?? `${SITE}/projects`}
              kicker="Building"
              title={flagship.title}
              meta="AI security agent, in Go"
              thumb={
                flagshipPost?.heroImage ? (
                  <PostCover src={flagshipPost.heroImage} alt="" sizes="112px" />
                ) : (
                  <span />
                )
              }
            />
          )}
        </Group>
      )}

      {/* A talk is a date, not something to read: a group of its own, never
          empty, because the invitation is always there. */}
      <Group tape="On stage" tilt={1}>
        {nextTalks.map((talk) => (
          <ThumbRow
            key={talk.slug}
            href={`${SITE}/sharing#${talk.slug}`}
            kicker={`${eventName(talk.event)} · ${city(talk.location)}`}
            title={talk.session?.title ?? talk.event}
            thumb={<CalendarLeaf talk={talk} />}
          />
        ))}
        <Row
          href={`${SITE}/sharing#speaker-kit`}
          title="Invite me to speak"
          hint="The speaker kit: bios, topics, headshot"
        />
      </Group>

      {association?.url && (
        <Group tape="Community" tilt={2}>
          <ThumbRow
            href={association.url}
            kicker="The association I run"
            title={association.title}
            meta={organises || undefined}
            thumb={
              <span className="relative block w-full aspect-video overflow-hidden border border-border">
                <Photo src="/images/osday-audience.webp" alt="" sizes="112px" />
              </span>
            }
          />
        </Group>
      )}

      <Group tape="Keep in touch" tilt={0}>
        <div className="py-3.5 border-b border-border flex flex-col gap-2">
          <span className="font-sans font-semibold text-[17px] text-fg">One email a month</span>
          <SubscribeForm mode="inline" label={null} />
        </div>
        <Row
          href={CAL_COM_URL}
          title="Book a call"
          hint={CAL_COM_URL.replace(/^https?:\/\//, "")}
        />
      </Group>

      <a
        href={`${SITE}/privacy`}
        className="self-center font-mono text-[12px] text-fg-subtle no-underline hover:text-accent"
      >
        Privacy
      </a>
    </div>
  );
}
