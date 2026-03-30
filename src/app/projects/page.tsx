import type { Metadata } from "next";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { PageHero } from "../../components/ui/PageHero";
import { ScrollReveal } from "../../components/ui/ScrollReveal";
import { SectionHeader } from "../../components/ui/SectionHeader";
import type { Project } from "../../lib/content";
import { getAllProjects, getOssContributions } from "../../lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Open source tools, communities, and side projects I've built or contribute to.",
  openGraph: {
    title: "Projects — Davide Imola",
    description: "Open source tools, communities, and side projects I've built or contribute to.",
    url: "https://davideimola.dev/projects",
    images: [
      {
        url: "https://davideimola.dev/og?title=Projects&category=open+source",
        width: 1200,
        height: 630,
      },
    ],
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
      <PageHero
        command="ls ./projects"
        title="Projects"
        description="Open source tools, communities, and things I build in public."
      />

      {/* Projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <ScrollReveal key={project.slug} delay={i * 80}>
            <Card className="h-full">
              <div className="flex flex-col gap-4 h-full">
                {/* TOP — period + optional badge */}
                <div
                  className={`flex items-start gap-3 ${project.status !== "active" ? "justify-between" : "justify-end"}`}
                >
                  {project.status !== "active" && (
                    <Badge variant={statusVariant(project.status)}>
                      {statusLabel(project.status)}
                    </Badge>
                  )}
                  <span className="font-mono text-[11px] text-text-3 shrink-0">
                    {project.period}
                  </span>
                </div>

                {/* TOP — title + role */}
                <div className="flex items-baseline gap-2">
                  <h2 className="font-mono text-[17px] font-semibold text-text-1 group-hover:text-accent transition-colors duration-200">
                    {project.title}
                  </h2>
                  {project.role && (
                    <span className="font-mono text-[11px] text-text-3">// {project.role}</span>
                  )}
                </div>

                {/* MIDDLE — description (grows) */}
                <p className="font-sans text-[14px] text-text-2 leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* BOTTOM — tags */}
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[11px] text-text-3">
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>

                {/* BOTTOM — links */}
                {(project.url || project.github || project.caseStudy) && (
                  <div className="flex items-center gap-4">
                    {project.caseStudy && (
                      <a
                        href={project.caseStudy}
                        className="font-mono text-[11px] text-accent hover:text-accent-hover transition-colors duration-150"
                      >
                        Read case study →
                      </a>
                    )}
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
            </Card>
          </ScrollReveal>
        ))}
      </div>

      {/* OSS Contributions */}
      <section className="mt-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="OSS Contributions" className="mb-2" />
          <p className="font-sans text-[14px] text-text-2 mb-8 -mt-6">
            Projects I've contributed to — bug fixes, features, and documentation.
          </p>
        </ScrollReveal>
        <ul className="flex flex-col divide-y divide-border">
          {oss.map((item, i) => (
            <ScrollReveal key={item.name} delay={i * 60}>
              <li className="py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <span className="font-mono text-[14px] text-text-1 w-36 shrink-0">{item.name}</span>
                <span className="font-sans text-[13px] text-text-2 flex-1">{item.description}</span>
                <div className="flex flex-wrap gap-x-2 gap-y-1 shrink-0">
                  {item.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[11px] text-text-3">
                      #{tag.toLowerCase()}
                    </span>
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
            </ScrollReveal>
          ))}
        </ul>
      </section>
    </div>
  );
}
