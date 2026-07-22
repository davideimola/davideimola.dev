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
import { PERSON_SCHEMA } from "../../lib/schema";

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Davide Imola",
  url: "https://davideimola.dev",
  description:
    "Tech Lead at RedCarbon, building AI agents for cybersecurity. Conference speaker on AI, security, and Go. Co-founder of Schrödinger Hat.",
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={PERSON_SCHEMA} />
      <JsonLd data={WEBSITE_SCHEMA} />
      <HeroSection />
      <WhatIDoSection />
      <WritingSection />
      <NewsletterSection />
      <TalksSection />
      <ProjectsSection />
      <ConnectSection />
    </>
  );
}
