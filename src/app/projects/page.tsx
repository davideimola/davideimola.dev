"use client";

import { PageLayout } from "~/app/_components/page-layout";
import { PageHero } from "~/app/_components/page-hero";
import { SectionHeader } from "~/app/_components/section-header";
import { ProjectCard } from "~/app/_components/project-card";
import { CTA as CtaButton } from "~/app/_components/cta";
import { BackToTop } from "~/app/_components/back-to-top";
import { projects } from "~/content/projects";

export default function Projects() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <PageLayout>
      <BackToTop />
      <PageHero
        title="My Projects"
        subtitle="「Building communities, organizing conferences, and contributing
        to open-source projects that make technology more accessible and
        sustainable.」"
      />

      {/* Featured Projects */}
      <section className="bg-gray-900/30 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Featured Projects"
            subtitle="Main community initiatives and conferences"
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant="featured"
                showHighlights={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Other Projects */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader title="Other Projects & Contributions" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
              Let&apos;s Collaborate
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              Interested in collaborating on open-source projects, organizing
              community events, or building something together?
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <CtaButton href="/contact" variant="primary">
                Get in touch
              </CtaButton>
              <CtaButton
                href="https://github.com/davideimola"
                variant="secondary"
                external
              >
                View on GitHub
              </CtaButton>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
