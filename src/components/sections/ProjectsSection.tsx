import { getFeaturedProjects } from "../../lib/content";
import { Badge, Card, ScrollReveal, SectionHeader } from "../ui";
import type { Project } from "../../lib/content";

function statusVariant(status: Project["status"]): "coming-soon" | "category" {
  return status === "coming-soon" ? "coming-soon" : "category";
}

export function ProjectsSection() {
  const projects = getFeaturedProjects();

  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <SectionHeader title="Projects" seeAllHref="/projects" seeAllLabel="All projects →" />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 100}>
              <Card href={project.url ?? `/projects/${project.slug}`} className="h-full">
                {project.status !== "active" && (
                  <div className="mb-3">
                    <Badge variant={statusVariant(project.status)}>
                      {project.status === "coming-soon" ? "Coming soon" : "Archived"}
                    </Badge>
                  </div>
                )}
                <h3 className="font-mono text-[16px] font-semibold text-text-1 mb-2">
                  {project.title}
                </h3>
                <p className="font-sans text-[13px] text-text-2 leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-x-2 gap-y-1 mt-auto">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[11px] text-text-3">
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
