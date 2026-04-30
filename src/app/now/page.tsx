import type { Metadata } from "next";
import { PageHero } from "../../components/ui/PageHero";
import { ScrollReveal } from "../../components/ui/ScrollReveal";
import { SectionHeader } from "../../components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm working on, learning, and thinking about right now.",
  openGraph: {
    title: "Now — Davide Imola",
    description: "What I'm working on, learning, and thinking about right now.",
    url: "https://davideimola.dev/now",
    images: [
      { url: "https://davideimola.dev/og?title=Now&category=status", width: 1200, height: 630 },
    ],
  },
};

const LAST_UPDATED = "April 2026";

export default function NowPage() {
  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="cat ./now.md"
        title="Now"
        description="A snapshot of what I'm focused on right now — updated when something changes."
      >
        <p className="font-mono text-[12px] text-text-3 mt-4">
          Last updated: <span className="text-text-2">{LAST_UPDATED}</span>
          {" · "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-150"
          >
            what is this?
          </a>
        </p>
      </PageHero>

      {/* Status card */}
      <ScrollReveal>
        <div className="mb-14 border border-border rounded-sm overflow-hidden">
          <div className="bg-bg-card border-b border-border px-4 py-2">
            <span className="font-mono text-[10px] text-text-3 tracking-widest uppercase">
              ~/status
            </span>
          </div>
          <ul className="px-4 py-4 flex flex-col gap-3">
            {[
              { key: "Role", value: "Tech Lead @ RedCarbon", last: false },
              { key: "Location", value: "Verona, Italy", last: false },
              { key: "Speaking", value: "Open to talks and workshops", last: false },
              { key: "Status", value: "Not looking for new roles", last: true },
            ].map((item) => (
              <li key={item.key} className="flex items-baseline gap-3 font-mono text-[13px]">
                <span className="text-border-mid select-none">{item.last ? "└──" : "├──"}</span>
                <span className="text-text-3 w-20 shrink-0">{item.key}</span>
                <span className="text-text-1">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>

      {/* At work */}
      <section className="mb-14 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="At work" />
        </ScrollReveal>

        <div className="flex flex-col gap-8">
          <ScrollReveal>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[13px] font-medium text-text-1 flex items-center gap-2">
                <span className="text-accent text-[10px]">//</span>
                Tech Lead at RedCarbon
              </span>
              <p className="font-sans text-[14px] text-text-2 leading-relaxed pl-5">
                I'm navigating the hardest part of the Tech Lead transition: the duality between
                deep product work and people work. When I'm building, I go full focus — and that
                makes it hard to context-switch into mentoring mode. I haven't found the right
                balance yet. I'm working on it.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[13px] font-medium text-text-1 flex items-center gap-2">
                <span className="text-accent text-[10px]">//</span>
                Building Worky
              </span>
              <p className="font-sans text-[14px] text-text-2 leading-relaxed pl-5">
                Open-source tool for running workshops. Born out of a real need — managing
                participants, materials, and flow during live sessions is harder than it looks. Work
                in progress.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ScrollReveal delay={120}>
              <div className="border border-border rounded-sm p-4 flex flex-col gap-1.5 h-full">
                <span className="font-mono text-[12px] font-medium text-text-1 flex items-center gap-2">
                  <span className="text-accent text-[10px]">//</span>
                  Learning to work with AI
                </span>
                <p className="font-sans text-[13px] text-text-3 leading-relaxed pl-5">
                  Until recently, the answer was "write more code." Now I'm building the meta-skill
                  of knowing when and how to use AI — agents, tools, prompting patterns. A new way
                  of thinking about work.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={180}>
              <div className="border border-border rounded-sm p-4 flex flex-col gap-1.5 h-full">
                <span className="font-mono text-[12px] font-medium text-text-1 flex items-center gap-2">
                  <span className="text-accent text-[10px]">//</span>
                  Security — daily practice
                </span>
                <p className="font-sans text-[13px] text-text-3 leading-relaxed pl-5">
                  SOC teams, threat models, secure architectures. Outbox pattern, event integrity,
                  secure-by-design API boundaries. Less course, more daily practice.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="border border-border rounded-sm p-4 flex flex-col gap-1.5 h-full">
                <span className="font-mono text-[12px] font-medium text-text-1 flex items-center gap-2">
                  <span className="text-accent text-[10px]">//</span>
                  Reading
                </span>
                <p className="font-sans text-[13px] text-text-3 leading-relaxed pl-5">
                  Fournier's <span className="text-text-2">The Manager's Path</span> and Larson's{" "}
                  <span className="text-text-2">An Elegant Puzzle</span>, in parallel. Career map
                  plus systems thinking — testing what holds against the Tech Lead transition I'm
                  actually living.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SH Branches — standalone, no section header overhead */}
      <ScrollReveal>
        <div className="mb-14 border-t border-border pt-10">
          <div className="border-l-2 border-accent pl-6 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[13px] font-medium text-text-1">
                Schrodinger Hat Branches
              </span>
              <span className="font-mono text-[10px] text-accent tracking-[0.06em]">
                co-organizer
              </span>
            </div>
            <p className="font-sans text-[14px] text-text-2 leading-relaxed">
              Schrodinger Hat's distributed arm — free local meetups, each run by people on the
              ground. I lead the program: spinning up new chapters and keeping the active ones
              moving. Rome, Verona, Milan, Florence launching now. Looking abroad next.
            </p>
            <a
              href="https://schrodinger-hat.it"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150 self-start"
            >
              schrodinger-hat.it →
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* Personal */}
      <section className="mb-14 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Personal" />
        </ScrollReveal>

        {/* D&D — full entry, worth the space */}
        <ScrollReveal>
          <div className="flex flex-col gap-2 mb-8">
            <span className="font-mono text-[13px] font-medium text-text-1 flex items-center gap-2">
              <span className="text-accent text-[10px]">//</span>
              D&D — playing and building
            </span>
            <p className="font-sans text-[14px] text-text-2 leading-relaxed pl-5">
              Currently playing <span className="text-text-1">Krug the Touchy</span> — a half-orc
              barbarian folk hero who ran an inn and rages if you don't finish his food. The DM
              reset the character sheets mid-campaign so I'm technically human now, but I miss Krug.
            </p>
            <p className="font-sans text-[14px] text-text-2 leading-relaxed pl-5">
              The longer campaign on hold features{" "}
              <span className="text-text-1">Thalion Melora</span>, a half-elf bard who wields a
              violin as a psychic weapon and heals through sound waves. Favourite character I've
              ever played. Meanwhile I'm writing my own campaign to DM — world, NPCs, encounters.
              Surprisingly addictive.
            </p>
          </div>
        </ScrollReveal>

        {/* Compact grid for shorter items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Pokémon cards",
              context: "Building the Pokédex in rare and full-art. A long game — emphasis on long.",
            },
            {
              label: "JuJutsu",
              context: "Hontai Yōshin-ryū. White belt. First kata for yellow belt exam.",
            },
            {
              label: "Crimson Desert",
              context:
                "A vast, living open world pulling me in hard. Clunky controls and thin characters, but the immersion wins.",
            },
          ].map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 60}>
              <div className="border border-border rounded-sm p-4 flex flex-col gap-1.5 h-full">
                <span className="font-mono text-[12px] font-medium text-text-1 flex items-center gap-2">
                  <span className="text-accent text-[10px]">//</span>
                  {item.label}
                </span>
                <p className="font-sans text-[12px] text-text-3 leading-relaxed pl-5">
                  {item.context}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <ScrollReveal>
        <div className="pt-8 border-t border-border">
          <p className="font-sans text-[13px] text-text-3">
            This page is inspired by the{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-2 hover:text-accent transition-colors duration-150"
            >
              /now movement
            </a>
            . Want to know more about me?{" "}
            <a
              href="/about"
              className="text-text-2 hover:text-accent transition-colors duration-150"
            >
              /about →
            </a>
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
