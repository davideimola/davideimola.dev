import type { Metadata } from "next";
import { Badge } from "../../components/ui/Badge";
import { getAllProjects, getOssContributions } from "../../lib/content";
import type { Project } from "../../lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Open source tools, communities, and side projects I've built or contribute to.",
  openGraph: {
    title: "Projects — Davide Imola",
    description: "Open source tools, communities, and side projects I've built or contribute to.",
    url: "https://davideimola.dev/projects",
  },
};

function statusLabel(status: Project["status"]): string {
  if (status === "coming-soon") return "Coming soon";
  if (status === "archived") return "Archived";
  return "Active";
}

function statusVariant(status: Project["status"]): "active" | "coming-soon" | "category" {
  if (status === "coming-soon") return "coming-soon";
  if (status === "archived") return "category";
  return "active";
}

export default function ProjectsPage() {
  const projects = getAllProjects();
  const oss = getOssContributions();

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <header className="mb-12">
        <p className="font-mono text-[13px] text-text-3 mb-4">
          <span className="text-accent mr-2">❯</span>ls ./projects
        </p>
        <h1 className="font-mono text-[32px] sm:text-[40px] font-bold text-text-1 tracking-[-0.03em] leading-none mb-3">
          Projects
        </h1>
        <p className="font-sans text-[15px] text-text-2">
          Open source tools, communities, and things I build in public.
        </p>
      </header>

      {/* Main projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="group relative bg-bg-card border border-border rounded-sm p-6 flex flex-col gap-4 transition-[border-color,background] duration-200 hover:border-border-hover hover:bg-bg-hover overflow-hidden after:absolute after:inset-0 after:bg-accent-glow after:opacity-0 after:transition-opacity after:duration-200 hover:after:opacity-100"
          >
            <div className="relative z-10 flex flex-col gap-4 h-full">
              {/* Status + period */}
              <div className="flex items-start justify-between gap-3">
                <Badge variant={statusVariant(project.status)}>
                  {statusLabel(project.status)}
                </Badge>
                <span className="font-mono text-[11px] text-text-3 shrink-0">{project.period}</span>
              </div>

              {/* Title & description */}
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <h2 className="font-mono text-[17px] font-semibold text-text-1 group-hover:text-accent transition-colors duration-200">
                    {project.title}
                  </h2>
                  {project.role && (
                    <span className="font-mono text-[11px] text-text-3">// {project.role}</span>
                  )}
                </div>
                <p className="font-sans text-[13px] text-text-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="category">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Links */}
              {(project.url || project.github) && (
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
                    >
                      Website →
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* OSS Contributions */}
      <section className="mt-16 pt-10 border-t border-border">
        <h2 className="font-mono text-[11px] text-text-3 tracking-[0.06em] mb-6">
          OSS CONTRIBUTIONS
        </h2>
        <p className="font-sans text-[14px] text-text-2 mb-8">
          Projects I've contributed to — bug fixes, features, and documentation.
        </p>
        <ul className="flex flex-col divide-y divide-border">
          {oss.map((item) => (
            <li key={item.name} className="py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span className="font-mono text-[14px] text-text-1 w-36 shrink-0">{item.name}</span>
              <span className="font-sans text-[13px] text-text-2 flex-1">{item.description}</span>
              <div className="flex items-center gap-2 shrink-0">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="category">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
                  >
                    Website →
                  </a>
                )}
                <a
                  href={item.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
                >
                  GitHub →
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
