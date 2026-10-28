import type { Metadata } from "next";
import { Marker } from "../../../components/ui/Marker";
import { Tape, type TapeTilt } from "../../../components/ui/Tape";
import { OG_SIZE, ogImageUrl } from "../../../lib/og-url";
import type { SkillCollection } from "../../../lib/skills";
import { collectionAnchor, getSkillCollections, skillSummary, skillUrl } from "../../../lib/skills";

const DESCRIPTION = "The Agent Skills I write: some to install in your repo, some to read.";

export const metadata: Metadata = {
  title: "Skills",
  description: DESCRIPTION,
  openGraph: {
    title: "Skills · Davide Imola",
    description: DESCRIPTION,
    url: "https://davideimola.dev/skills",
    images: [
      {
        url: ogImageUrl({
          title: "Skills",
          category: "skills",
          path: "/skills",
          lead: DESCRIPTION,
        }),
        ...OG_SIZE,
      },
    ],
  },
};

// The skills are read from their repos on GitHub, so a new one shows up within
// the hour without a deploy.
export const revalidate = 3600;

const TILTS: TapeTilt[] = [1, 2];

function Collection({ collection, tilt }: { collection: SkillCollection; tilt: TapeTilt }) {
  const { repo, skills, talk } = collection;
  return (
    <section
      id={collectionAnchor(repo)}
      className="mt-14 md:mt-16 scroll-mt-24 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-5 lg:gap-14"
    >
      <Tape as="span" tilt={tilt} size="lg" className="self-start">
        {collection.tape}
      </Tape>
      <div className="min-w-0 flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <h2 className="m-0 font-sans font-bold text-fg text-[32px] md:text-[40px] leading-none tracking-[-0.04em]">
            {collection.title}
          </h2>
          <p className="m-0 font-sans text-[17px] md:text-[18px] leading-[1.55] text-fg-body max-w-[680px]">
            {collection.intro}
          </p>
          <span className="font-mono text-[13px] text-fg-subtle flex flex-wrap gap-x-4 gap-y-1">
            <a
              href={collection.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-subtle hover:text-accent transition-colors duration-150"
            >
              {repo}
            </a>
            {talk && (
              <a
                href={`/sharing#${talk.slug}`}
                className="text-fg-subtle hover:text-accent transition-colors duration-150"
              >
                From the talk at {talk.event}
              </a>
            )}
          </span>
        </div>

        {collection.install && (
          <pre className="m-0 bg-surface border border-border px-5 py-[18px] font-mono text-[14px] leading-[1.6] text-fg whitespace-pre-wrap break-words">
            <span className="text-fg-subtle select-none" aria-hidden="true">
              ${" "}
            </span>
            {collection.install}
          </pre>
        )}

        <ul className="m-0 p-0 list-none">
          {skills.map((skill, i) => (
            <li key={skill.name}>
              <a
                href={skillUrl(repo, skill)}
                target="_blank"
                rel="noopener noreferrer"
                className={`group grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-x-8 gap-y-1.5 py-[18px] border-t border-border items-baseline no-underline ${
                  i === skills.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="font-mono font-semibold text-[16px] text-fg group-hover:text-accent transition-colors duration-150 break-words">
                  {skill.name}
                </span>
                <span className="font-sans text-[16px] leading-[1.55] text-fg-body">
                  {skillSummary(skill.description)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default async function SkillsPage() {
  const collections = await getSkillCollections();
  const stale = collections.some((c) => c.source === "fallback");

  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-16">
      <header className="flex flex-col gap-6 max-w-[900px]">
        <Tape tilt={0} size="lg">
          Skills
        </Tape>
        <h1 className="m-0 font-sans font-bold text-fg text-[42px] sm:text-[56px] lg:text-[72px] leading-[1] tracking-[-0.045em]">
          What I teach my <Marker>agents</Marker> to do.
        </h1>
        <p className="m-0 font-sans text-[18px] md:text-[21px] leading-[1.55] text-fg-body max-w-[720px]">
          Agent Skills are folders with a SKILL.md that Claude Code, Codex, Cursor, Copilot or
          Gemini CLI pick up when the task fits. You do not call them by name: you ask in plain
          words. Some of mine are meant to be installed, others only to be read.
        </p>
        {stale && (
          <span className="font-mono text-[13px] text-fg-subtle">
            GitHub could not be read just now, so this is the last snapshot.
          </span>
        )}
      </header>

      {collections.map((collection, i) => (
        <Collection key={collection.repo} collection={collection} tilt={TILTS[i % TILTS.length]} />
      ))}
    </div>
  );
}
