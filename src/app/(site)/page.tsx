import {
  ConnectSection,
  HeroSection,
  NewsletterSection,
  ProjectsSection,
  TalksSection,
  WhatIDoSection,
  WritingSection,
} from "../../components/sections";
import { JsonLd } from "../../components/ui/JsonLd";
import { getAllProjects, getAllTalks, getRecentPosts } from "../../lib/content";
import { pickBuildingProject, pickRotatingCard } from "../../lib/home-cards";
import { PERSON_SCHEMA } from "../../lib/schema";
import { getShowcase } from "../../lib/shelf";

// Hourly, like /now: the rotating card under the hero turns over on its own
// when a talk passes or the reading changes, without a deploy.
export const revalidate = 3600;

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Davide Imola",
  url: "https://davideimola.dev",
  description:
    "Tech Lead at RedCarbon, building AI agents for cybersecurity. Conference speaker on AI, security, and Go. Co-founder of Schrödinger Hat.",
};

export default async function HomePage() {
  const [latestPost] = getRecentPosts(1);
  const { document: shelf } = await getShowcase();
  const rotating = pickRotatingCard({
    talks: getAllTalks(),
    reading: shelf.now,
    today: new Date(),
  });

  return (
    <>
      <JsonLd data={PERSON_SCHEMA} />
      <JsonLd data={WEBSITE_SCHEMA} />
      <HeroSection
        latestPost={latestPost ?? null}
        project={pickBuildingProject(getAllProjects())}
        rotating={rotating}
      />
      <WhatIDoSection />
      <WritingSection />
      <NewsletterSection />
      <TalksSection />
      <ProjectsSection />
      <ConnectSection />
    </>
  );
}
