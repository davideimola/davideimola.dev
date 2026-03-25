import { getFeaturedProjects } from "../../lib/content";
import { Badge, Card, ScrollReveal, SectionHeader } from "../ui";

export function ProjectsSection() {
  const projects = getFeaturedProjects();

  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[860px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <SectionHeader title="Projects" seeAllHref="/projects" seeAllLabel="All projects →" />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 100}>
              <Card href={project.url ?? `/projects/${project.slug}`} className="h-full">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant={project.status === "coming-soon" ? "coming-soon" : "active"}>
                    {project.status === "coming-soon"
                      ? "Coming soon"
                      : `${project.tags[0]} · Active`}
                  </Badge>
                </div>
                <h3 className="font-mono text-[16px] font-semibold text-text-1 mb-2">
                  {project.title}
                </h3>
                <p className="font-sans text-[13px] text-text-2 leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="category">
                      {tag}
                    </Badge>
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
