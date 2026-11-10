import type { Metadata } from "next";
import { NewsletterSection } from "../../../components/sections/NewsletterSection";
import { ButtonLink } from "../../../components/ui/Button";
import { JsonLd } from "../../../components/ui/JsonLd";
import { Marker } from "../../../components/ui/Marker";
import { Tape } from "../../../components/ui/Tape";
import { type AiSecurityHub, getAiSecurityHub, type HubTalk } from "../../../lib/ai-security";
import type { BlogPost } from "../../../lib/content";
import { formatDayMonthYear, formatMonthYear } from "../../../lib/dates";
import { OG_SIZE, ogImageUrl } from "../../../lib/og-url";
import { collectionAnchor } from "../../../lib/skills";

const DESCRIPTION =
  "What I write, build and say on stage about securing AI agents, as a reading path: the argument, the series, the tools, the talks.";

export const metadata: Metadata = {
  title: "AI security",
  description: DESCRIPTION,
  alternates: { canonical: "https://davideimola.dev/ai-security" },
  openGraph: {
    title: "AI security · Davide Imola",
    description: DESCRIPTION,
    url: "https://davideimola.dev/ai-security",
    images: [
      {
        url: ogImageUrl({
          title: "The part of AI nobody demos",
          category: "AI security",
          path: "/ai-security",
          lead: DESCRIPTION,
        }),
        ...OG_SIZE,
      },
    ],
  },
};

// Hourly, so a series part turns from "due" into a link on its day.
export const revalidate = 3600;

const inlineLink =
  "text-fg underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent transition-colors duration-150";

// ── The rows each step is made of ─────────────────────────────────────────

function PostRows({ posts }: { posts: BlogPost[] }) {
  return (
    <ul className="m-0 p-0 list-none border-t border-fg">
      {posts.map((post) => (
        <li key={post.slug} className="border-b border-border">
          <a
            href={`/blog/${post.slug}`}
            className="group grid grid-cols-1 sm:grid-cols-[7rem_minmax(0,1fr)] gap-x-6 gap-y-1 py-4 no-underline"
          >
            <span className="font-mono text-[13px] text-fg-subtle">
              {formatMonthYear(post.date)}
            </span>
            <span className="flex flex-col gap-1 min-w-0">
              <span className="font-sans font-semibold text-[18px] leading-[1.3] text-fg group-hover:text-accent transition-colors duration-150">
                {post.title}
              </span>
              <span className="font-sans text-[15px] leading-[1.5] text-fg-muted line-clamp-2">
                {post.excerpt}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// A published part links to its post; an upcoming one keeps its planned date,
// the same public commitment the series list on a post page makes.
function SeriesRows({ series }: { series: AiSecurityHub["series"] }) {
  return (
    <ol className="m-0 p-0 list-none border-t border-fg">
      {series.parts.map((part) => (
        <li
          key={part.number}
          className="grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)_9rem] gap-x-4 gap-y-1 py-4 border-b border-border items-baseline"
        >
          <span className="font-mono text-[13px] text-fg-subtle">
            {String(part.number).padStart(2, "0")}
          </span>
          {part.slug ? (
            <a
              href={`/blog/${part.slug}`}
              className="font-sans font-semibold text-[18px] leading-[1.3] text-fg no-underline hover:text-accent transition-colors duration-150"
            >
              {part.title}
            </a>
          ) : (
            <span className="font-sans font-semibold text-[18px] leading-[1.3] text-fg-muted">
              {part.title}
            </span>
          )}
          <span className="col-start-2 sm:col-start-3 font-mono text-[13px] text-fg-subtle sm:text-right">
            {part.slug ? formatDayMonthYear(part.date) : `due ${formatDayMonthYear(part.date)}`}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Tools({ hub }: { hub: AiSecurityHub }) {
  const { flagship, flagshipPost, skills } = hub;
  return (
    <div className={`grid grid-cols-1 gap-6 ${flagship && skills ? "md:grid-cols-2" : ""}`}>
      {flagship && (
        <div className="border border-border bg-surface p-5 md:p-6 flex flex-col gap-4 min-w-0">
          <span className="font-mono text-[12px] text-fg-subtle uppercase tracking-[0.08em]">
            Before the merge
          </span>
          <h3 className="m-0 font-sans font-bold text-[24px] text-fg">{flagship.title}</h3>
          <p className="m-0 font-sans text-[16px] leading-[1.55] text-fg-body">
            {flagship.description}
          </p>
          {flagship.quickstart && (
            <pre className="m-0 bg-bg border border-border px-4 py-3 font-mono text-[13px] leading-[1.6] text-fg whitespace-pre-wrap break-words">
              <span className="text-fg-subtle select-none" aria-hidden="true">
                ${" "}
              </span>
              {flagship.quickstart}
            </pre>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3">
            {(flagship.github ?? flagship.url) && (
              <ButtonLink variant="primary" href={flagship.github ?? flagship.url}>
                View on GitHub
              </ButtonLink>
            )}
            {flagshipPost && (
              <ButtonLink variant="link" href={`/blog/${flagshipPost.slug}`}>
                Why I built it
              </ButtonLink>
            )}
          </div>
        </div>
      )}
      {skills && (
        <div className="border border-border bg-surface p-5 md:p-6 flex flex-col gap-4 min-w-0">
          <span className="font-mono text-[12px] text-fg-subtle uppercase tracking-[0.08em]">
            In your agent
          </span>
          <h3 className="m-0 font-sans font-bold text-[24px] text-fg">{skills.title} skills</h3>
          <p className="m-0 font-sans text-[16px] leading-[1.55] text-fg-body">{skills.intro}</p>
          {skills.install && (
            <pre className="m-0 bg-bg border border-border px-4 py-3 font-mono text-[13px] leading-[1.6] text-fg whitespace-pre-wrap break-words">
              <span className="text-fg-subtle select-none" aria-hidden="true">
                ${" "}
              </span>
              {skills.install}
            </pre>
          )}
          <div className="mt-auto">
            <ButtonLink variant="link" href={`/skills#${collectionAnchor(skills.repo)}`}>
              See the skills
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}

// Cards rather than rows: a CFP reviewer reads the abstract, not the title.
function TalkCards({ talks }: { talks: HubTalk[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {talks.map(({ talk, events }) => (
        <article
          key={talk.slug}
          className="border border-border bg-surface p-5 md:p-6 flex flex-col gap-3 min-w-0"
        >
          <span className="font-mono text-[12px] text-fg-subtle">
            {talk.session?.format} · {formatMonthYear(talk.date)} · {events.join(", ")}
          </span>
          <h3 className="m-0 font-sans font-bold text-[21px] leading-[1.25] text-fg">
            <a
              href={`/sharing#${talk.slug}`}
              className="text-fg no-underline hover:text-accent transition-colors duration-150"
            >
              {talk.session?.title}
            </a>
          </h3>
          {talk.session?.abstract && (
            <p className="m-0 font-sans text-[15px] leading-[1.55] text-fg-body">
              {talk.session.abstract}
            </p>
          )}
          {(talk.session?.slides || talk.session?.video) && (
            <div className="mt-auto pt-1 flex gap-4 font-mono text-[13px]">
              {talk.session?.slides && (
                <a
                  href={talk.session.slides}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={inlineLink}
                >
                  Slides
                </a>
              )}
              {talk.session?.video && (
                <a
                  href={talk.session.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={inlineLink}
                >
                  Recording
                </a>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

// ── The page ───────────────────────────────────────────────────────────────

// One page for the topic, written for whoever arrives from a CFP submission, a
// bio or a "where can I read more": the thesis, the facts a reviewer looks
// for, then a numbered path from the argument to the tools and the talks. No
// call to action at the top: at a conference you submit, nobody invites you,
// so the page is the evidence. The speaker kit is a quiet line for after a
// talk is accepted, and the newsletter closes the page.
export default function AiSecurityPage() {
  const hub = getAiSecurityHub();

  const steps = [
    {
      id: "argument",
      label: "Start with the argument",
      why: "What an agent stores that nobody designed, and why fixing it is the framework's job, not yours.",
      body: <PostRows posts={[hub.start]} />,
    },
    {
      id: "boundaries",
      label: "Read the four boundaries",
      why: "Where the controls go once you accept the prompt will be broken. Four parts, in order.",
      body: <SeriesRows series={hub.series} />,
    },
    {
      id: "tools",
      label: "Run it on your repo",
      why: "The same ideas as tools: one reviews a change before it merges, one teaches your agent the checks.",
      body: <Tools hub={hub} />,
    },
    {
      id: "talks",
      label: "Hear it out loud",
      why: "The talks this work grew from, with slides and recordings.",
      body: hub.talks.length > 0 ? <TalkCards talks={hub.talks} /> : null,
    },
    {
      id: "further",
      label: "Go further",
      why: "Everything else I wrote on the topic.",
      body: hub.further.length > 0 ? <PostRows posts={hub.further} /> : null,
    },
  ].filter((step) => step.body !== null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI security",
    description: DESCRIPTION,
    url: "https://davideimola.dev/ai-security",
    author: { "@type": "Person", name: "Davide Imola", url: "https://davideimola.dev" },
    hasPart: [hub.start, ...hub.further].map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `https://davideimola.dev/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-16">
        <header className="flex flex-col gap-6 max-w-[900px]">
          <Tape tilt={0} size="lg">
            AI security
          </Tape>
          <h1 className="m-0 font-sans font-bold text-fg text-[42px] sm:text-[56px] lg:text-[72px] leading-[1] tracking-[-0.045em]">
            I talk about the part of AI nobody demos: <Marker>security</Marker>.
          </h1>
          <p className="m-0 font-sans text-[18px] md:text-[21px] leading-[1.55] text-fg-body max-w-[720px]">
            Talks and writing on securing AI agents and Go services, built from production work at
            RedCarbon and from tools I maintain in the open.
          </p>
          <div className="flex flex-col gap-2">
            {hub.facts.length > 0 && (
              <p className="m-0 font-mono text-[13px] text-fg-subtle">{hub.facts.join(" · ")}</p>
            )}
            <p className="m-0 font-sans text-[15px] text-fg-muted">
              Organising an event? Bios, headshot and logos are in the{" "}
              <a href="/sharing#speaker-kit" className={inlineLink}>
                speaker kit
              </a>
              .
            </p>
          </div>
        </header>

        <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-10 lg:gap-16">
          <nav aria-label="The path" className="hidden lg:block" data-print-hide>
            <ol className="sticky top-24 m-0 p-0 list-none flex flex-col gap-3 border-t border-fg pt-4">
              {steps.map((step, i) => (
                <li key={step.id}>
                  <a
                    href={`#${step.id}`}
                    className="font-sans text-[15px] text-fg-muted no-underline hover:text-accent transition-colors duration-150"
                  >
                    <span className="font-mono text-fg-subtle mr-2">{i + 1}</span>
                    {step.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <ol className="m-0 p-0 list-none flex flex-col gap-14 md:gap-16 min-w-0">
            {steps.map((step, i) => (
              <li key={step.id} id={step.id} className="flex flex-col gap-5 scroll-mt-24">
                <div className="flex items-baseline gap-4">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[32px] md:text-[40px] leading-none text-fg-subtle"
                  >
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h2 className="m-0 font-sans font-bold text-fg text-[24px] md:text-[32px] leading-[1.1] tracking-[-0.03em]">
                      {step.label}
                    </h2>
                    <p className="m-0 font-sans text-[16px] leading-[1.5] text-fg-muted">
                      {step.why}
                    </p>
                  </div>
                </div>
                {step.body}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mb-20 md:mb-24">
        <NewsletterSection />
      </div>
    </>
  );
}
