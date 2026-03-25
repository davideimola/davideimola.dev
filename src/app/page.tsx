import {
  ConnectSection,
  HeroSection,
  ProjectsSection,
  TalksSection,
  WhatIDoSection,
  WritingSection,
} from "../components/sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhatIDoSection />
      <ProjectsSection />
      <TalksSection />
      <WritingSection />
      <ConnectSection />
    </>
  );
}
