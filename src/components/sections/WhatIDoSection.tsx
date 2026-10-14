import { ScrollReveal, SectionHeader } from "../ui";

const PILLARS = [
  {
    title: "Engineering & Architecture",
    description:
      "Building resilient backend systems and infrastructure. Focused on Go, Kubernetes, and platform engineering. Believer in simplicity as the ultimate sophistication.",
  },
  {
    title: "Tech Leadership",
    description:
      "Tech Lead at RedCarbon, leading platform engineering. I make the technical calls across the whole platform, from frontend to infrastructure, and build the AI agents on top, coordinating with the AI and security teams while still shipping code.",
  },
  {
    title: "Conference Speaker",
    description:
      "Co-founder of Schrodinger Hat and co-organizer of Open Source Day. Speaking at conferences across Europe on AI, security, Go, and DevOps.",
  },
];

export function WhatIDoSection() {
  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[1136px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <SectionHeader title="What I do" tilt={1} />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, i) => (
            <ScrollReveal key={pillar.title} delay={i * 100}>
              <div className="border-t border-fg pt-5">
                <h3 className="font-sans text-[22px] font-bold tracking-[-0.025em] leading-[1.2] text-fg mb-3">
                  {pillar.title}
                </h3>
                <p className="font-sans text-[16px] text-fg-muted leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
