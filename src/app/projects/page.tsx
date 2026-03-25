import type { Metadata } from "next";
import { Badge } from "../../components/ui/Badge";
import { getAllProjects } from "../../lib/content";
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="group relative bg-bg-card border border-border rounded-sm p-6 flex flex-col gap-4 transition-[border-color,background] duration-200 hover:border-border-hover hover:bg-bg-hover overflow-hidden after:absolute after:inset-0 after:bg-accent-glow after:opacity-0 after:transition-opacity after:duration-200 hover:after:opacity-100"
          >
            <div className="relative z-10 flex flex-col gap-4 h-full">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <Badge variant={statusVariant(project.status)}>
                  {statusLabel(project.status)}
                </Badge>
                <span className="font-mono text-[11px] text-text-3 shrink-0">{project.period}</span>
              </div>

              {/* Title & description */}
              <div className="flex-1">
                <h2 className="font-mono text-[17px] font-semibold text-text-1 mb-2 group-hover:text-accent transition-colors duration-200">
                  {project.title}
                </h2>
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
    </div>
  );
}
