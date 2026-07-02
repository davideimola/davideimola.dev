import {
  ConnectSection,
  HeroSection,
  ProjectsSection,
  TalksSection,
  WhatIDoSection,
  WritingSection,
} from "../components/sections";
import { JsonLd } from "../components/ui/JsonLd";
import { PERSON_SCHEMA } from "../lib/schema";

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
      <WritingSection />
      <TalksSection />
      <ProjectsSection />
      <ConnectSection />
    </>
  );
}
