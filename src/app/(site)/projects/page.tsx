import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ButtonLink } from "../../../components/ui/Button";
import { Marker } from "../../../components/ui/Marker";
import { Tape, type TapeTilt } from "../../../components/ui/Tape";
import type { Project } from "../../../lib/content";
import { getAllProjects, getOssContributions, getPostBySlug } from "../../../lib/content";

export const metadata: Metadata = {
  title: "Built",
  description: "What I build, for work, in the open and for myself.",
  openGraph: {
    title: "Built · Davide Imola",
    description: "What I build, for work, in the open and for myself.",
    url: "https://davideimola.dev/projects",
    images: [
      { url: "https://davideimola.dev/og?title=Built&category=projects", width: 1200, height: 630 },
    ],
  },
};

const inlineLink = "text-fg border-b border-fg no-underline hover:text-accent hover:border-accent";

function hrefOf(project: Project): string {
  return project.caseStudy ?? project.url ?? project.github ?? "/projects";
}

function startYear(period: string): string {
  return period.match(/\d{4}/)?.[0] ?? period;
}

function Group({ tape, tilt, children }: { tape: string; tilt: TapeTilt; children: ReactNode }) {
  return (
    <section className="mt-14 md:mt-16 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-5 lg:gap-14">
      <Tape as="h2" tilt={tilt} size="lg" className="self-start">
        {tape}
      </Tape>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function ProjectRow({ project, last }: { project: Project; last: boolean }) {
  const href = hrefOf(project);
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)_auto] gap-x-8 gap-y-1.5 py-[22px] border-t border-border items-baseline no-underline ${
        last ? "border-b" : ""
      }`}
    >
      <span className="font-sans font-bold text-[24px] md:text-[28px] tracking-[-0.03em] text-fg group-hover:text-accent transition-colors duration-150">
        {project.title}
      </span>
      <span className="font-sans text-[16px] md:text-[17px] leading-[1.55] text-fg-body">
        {project.description}
      </span>
      {project.note && <span className="font-mono text-[13px] text-fg-subtle">{project.note}</span>}
    </a>
  );
}

// Grouped by why each thing exists: the flagship in the open, then work,
// then what I build for myself, the communities, and upstream contributions.
export default function ProjectsPage() {
  const projects = getAllProjects().filter((p) => p.status !== "archived");
  const oss = getOssContributions();
  const flagship = projects.find((p) => p.flagship);
  const byGroup = (group: Project["group"]) =>
    projects.filter((p) => p.group === group && p !== flagship);
  const work = byGroup("work");
  const personal = byGroup("personal");
  const community = byGroup("community");
  const caseStudies = projects.filter((p) => p.caseStudy);
  const flagshipPost = flagship?.post ? getPostBySlug(flagship.post) : null;
  if (flagship?.post && !flagshipPost) {
    throw new Error(`/projects: the flagship's post "${flagship.post}" does not exist.`);
  }

  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-16">
      <header className="flex flex-col gap-6 max-w-[900px]">
        <Tape tilt={0} size="lg">
          Built by me
        </Tape>
        <h1 className="m-0 font-sans font-bold text-fg text-[42px] sm:text-[56px] lg:text-[72px] leading-[1] tracking-[-0.045em]">
          What I build, for work, in the open and <Marker>for myself</Marker>.
        </h1>
      </header>

      {flagship && (
        <section className="mt-14 md:mt-[72px] pt-8 border-t border-rule grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 lg:gap-16">
          <div className="flex flex-col gap-[18px]">
            <span className="font-mono text-[13px] text-fg-subtle">
              In the open · {startYear(flagship.period)} to present
            </span>
            <h2 className="m-0 font-sans font-bold text-fg text-[44px] md:text-[56px] leading-none tracking-[-0.045em]">
              {flagship.title}
            </h2>
            <p className="m-0 font-sans text-[18px] md:text-[21px] leading-[1.55] text-fg-body max-w-[620px]">
              {flagship.description}
            </p>
            <div className="flex flex-wrap items-center gap-5 mt-1.5">
              {flagship.github && (
                <ButtonLink
                  variant="primary"
                  size="lg"
                  href={flagship.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </ButtonLink>
              )}
              {flagshipPost && (
                <ButtonLink variant="link" size="lg" href={`/blog/${flagshipPost.slug}`}>
                  Read: {flagshipPost.title.split(":")[0]}
                </ButtonLink>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:pt-[34px]">
            {flagship.quickstart && (
              <pre className="m-0 bg-surface border border-border px-5 py-[18px] font-mono text-[14px] leading-[1.6] text-fg whitespace-pre-wrap break-all">
                <span className="text-fg-subtle select-none" aria-hidden="true">
                  ${" "}
                </span>
                {flagship.quickstart}
              </pre>
            )}
            <span className="font-mono text-[13px] text-fg-subtle">
              {flagship.tags.join(" · ")}
            </span>
          </div>
        </section>
      )}

      {work.length > 0 && (
        <Group tape="For work" tilt={1}>
          {work.map((p, i) => (
            <ProjectRow key={p.slug} project={p} last={i === work.length - 1} />
          ))}
        </Group>
      )}

      {personal.length > 0 && (
        <Group tape="For myself" tilt={2}>
          {personal.map((p, i) => (
            <ProjectRow key={p.slug} project={p} last={i === personal.length - 1} />
          ))}
        </Group>
      )}

      {community.length > 0 && (
        <Group tape="Community" tilt={1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {community.map((p) => {
              const href = hrefOf(p);
              return (
                <a
                  key={p.slug}
                  href={href}
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group bg-surface border border-border hover:border-fg transition-colors duration-150 p-[26px] flex flex-col gap-2.5 no-underline"
                >
                  <span className="font-sans font-bold text-[24px] md:text-[26px] tracking-[-0.03em] text-fg group-hover:text-accent transition-colors duration-150">
                    {p.title}
                  </span>
                  <span className="font-sans text-[16px] leading-[1.55] text-fg-muted">
                    {p.description}
                  </span>
                  {p.note && <span className="font-mono text-[13px] text-fg-subtle">{p.note}</span>}
                </a>
              );
            })}
          </div>
        </Group>
      )}

      {oss.length > 0 && (
        <Group tape="Upstream" tilt={0}>
          <div className="flex flex-col gap-3.5">
            <p className="m-0 font-sans text-[16px] text-fg-subtle">Projects I contributed to.</p>
            <div className="flex flex-wrap gap-x-10 gap-y-5">
              {oss.map((c) => (
                <a
                  key={c.name}
                  href={c.url ?? c.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1 no-underline max-w-[260px]"
                >
                  <span className="font-sans font-semibold text-[19px] text-fg group-hover:text-accent transition-colors duration-150">
                    {c.name}
                  </span>
                  <span className="font-sans text-[15px] text-fg-subtle">{c.description}</span>
                </a>
              ))}
            </div>
          </div>
        </Group>
      )}

      {caseStudies.length > 0 && (
        <p className="mt-14 m-0 font-sans text-[16px] text-fg-muted">
          Case studies:{" "}
          {caseStudies.map((p, i) => (
            <span key={p.slug}>
              {i > 0 && (i === caseStudies.length - 1 ? " and " : ", ")}
              <a href={p.caseStudy} className={inlineLink}>
                {p.title}
              </a>
            </span>
          ))}
          .
        </p>
      )}
    </div>
  );
}
