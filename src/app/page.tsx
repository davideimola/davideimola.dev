import { JsonLd } from "../components/ui/JsonLd";
import {
  ConnectSection,
  HeroSection,
  ProjectsSection,
  TalksSection,
  WhatIDoSection,
  WritingSection,
} from "../components/sections";

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Davide Imola",
  url: "https://davideimola.dev",
  jobTitle: "Tech Lead",
  worksFor: { "@type": "Organization", name: "RedCarbon" },
  sameAs: [
    "https://github.com/davideimola",
    "https://www.linkedin.com/in/davideimola/",
    "https://bsky.app/profile/davideimola.dev",
  ],
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Davide Imola",
  url: "https://davideimola.dev",
  description:
    "Tech Lead at RedCarbon. Software engineer focused on backend, infrastructure, and security. Conference speaker on DevOps, GitOps, and Go.",
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={PERSON_SCHEMA} />
      <JsonLd data={WEBSITE_SCHEMA} />
      <HeroSection />
      <WhatIDoSection />
      <ProjectsSection />
      <TalksSection />
      <WritingSection />
      <ConnectSection />
    </>
  );
}
