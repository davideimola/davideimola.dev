import { ScrollReveal } from "../ui";

const PILLARS = [
  {
    command: "$ engineer",
    title: "Engineering & Architecture",
    description:
      "Building resilient backend systems and infrastructure. Focused on Go, Kubernetes, and platform engineering. Believer in simplicity as the ultimate sophistication.",
  },
  {
    command: "$ lead",
    title: "Tech Leadership",
    description:
      "Tech Lead at RedCarbon. Bridging product and engineering — from architecture decisions to team growth and delivery.",
  },
  {
    command: "$ speaker",
    title: "Conference Speaker",
    description:
      "Co-founder of Schrodinger Hat. Speaking at conferences across Europe on DevOps, GitOps, Go, and security.",
  },
];

export function WhatIDoSection() {
  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[860px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <h2 className="font-mono text-[11px] font-medium text-text-3 tracking-[0.12em] uppercase mb-12">
            <span className="text-accent mr-2">{"// "}</span>what I do
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, i) => (
            <ScrollReveal key={pillar.command} delay={i * 100}>
              <div>
                <p className="font-mono text-[12px] text-accent tracking-[0.04em] mb-3">
                  {pillar.command}
                </p>
                <h3 className="font-mono text-[14px] font-medium text-text-1 mb-3">
                  {pillar.title}
                </h3>
                <p className="font-sans text-[14px] text-text-2 leading-relaxed">
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
