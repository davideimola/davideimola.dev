import type { Project } from "../../lib/content";
import type { DrawableCover } from "../../lib/cover-files";
import { ButtonLink } from "../ui/Button";
import { DrawnCover } from "../ui/DrawnCover";
import { HomeBand } from "./HomeBand";

interface BuildingSectionProps {
  project: Project;
  /** The cover of the post that introduces the project, drawing itself. */
  cover?: { drawable: DrawableCover; alt: string } | null;
  /** That post, linked as the reason the project exists. */
  post?: { slug: string } | null;
  /** The projects built for himself, named in one line under the flagship. */
  others: Project[];
}

const linkClasses =
  "text-fg-muted border-b border-border no-underline hover:text-accent hover:border-accent transition-colors duration-150";

// BUILDING: the proof of the headline. The flagship gets room to say what it
// does, three facts, the one line to try it and the way to its repo; the
// projects built for himself follow in a single mono line.
export function BuildingSection({ project, cover, post, others }: BuildingSectionProps) {
  const repo = project.github ?? project.url;
  return (
    <HomeBand
      tape="Building"
      tilt={1}
      title="What I'm building in the open"
      more={{ label: "All projects", href: "/projects" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 lg:gap-12 items-center">
        {cover && (
          <DrawnCover light={cover.drawable.light} dark={cover.drawable.dark} alt={cover.alt} />
        )}
        <div className="flex flex-col items-start gap-4 min-w-0">
          <h3 className="m-0 font-sans font-bold text-fg text-[28px] md:text-[34px] leading-[1.05] tracking-[-0.035em]">
            {project.title}
          </h3>
          <p className="m-0 font-sans text-[17px] md:text-[18px] leading-[1.55] text-fg-body">
            {project.description}
          </p>
          {project.highlights && project.highlights.length > 0 && (
            <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
              {project.highlights.map((fact) => (
                <li
                  key={fact}
                  className="flex items-baseline gap-2.5 font-sans text-[15px] leading-[1.5] text-fg-muted"
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-1.5 h-1.5 bg-fg translate-y-[-2px]"
                  />
                  {fact}
                </li>
              ))}
            </ul>
          )}
          {project.quickstart && (
            <pre className="m-0 w-full bg-surface border border-border px-4 py-3 font-mono text-[13px] leading-[1.6] text-fg whitespace-pre-wrap break-words">
              <span className="text-fg-subtle select-none" aria-hidden="true">
                ${" "}
              </span>
              {project.quickstart}
            </pre>
          )}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
            {repo && (
              <ButtonLink variant="primary" href={repo}>
                {project.github ? "View on GitHub" : "Visit the project"}
              </ButtonLink>
            )}
            {post && (
              <ButtonLink variant="link" href={`/blog/${post.slug}`}>
                Why I built it
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
      {others.length > 0 && (
        <p className="m-0 pt-3.5 border-t border-border font-mono text-[13px] leading-[1.7] text-fg-subtle">
          Also building, for myself:{" "}
          {others.map((p, i) => {
            const href = p.url ?? p.github;
            return (
              <span key={p.slug}>
                {i > 0 && " · "}
                {href ? (
                  <a href={href} className={linkClasses}>
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </span>
            );
          })}
        </p>
      )}
    </HomeBand>
  );
}
