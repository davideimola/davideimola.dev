import type { Metadata } from "next";
import { ScrollReveal } from "../../../components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Schrodinger Hat — Case Study",
  description:
    "How I joined an open source community as an unknown and, through contribution and hard work, became a co-founder and admin member.",
  openGraph: {
    title: "Schrodinger Hat — Case Study · Davide Imola",
    description:
      "How I joined an open source community as an unknown and, through contribution and hard work, became a co-founder and admin member.",
    url: "https://davideimola.dev/projects/schrodinger-hat",
    images: [
      {
        url: "https://davideimola.dev/og?title=Schrodinger+Hat&category=case+study",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const STATS = [
  { value: "20k+", label: "community presences" },
  { value: "100+", label: "speakers" },
  { value: "5", label: "OS Day editions" },
  { value: "49h", label: "content produced" },
];

export default function SchrodingerHatCaseStudy() {
  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      {/* Back */}
      <ScrollReveal>
        <a
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150 mb-12"
        >
          ← Back to projects
        </a>
      </ScrollReveal>

      {/* Header */}
      <ScrollReveal>
        <header className="mb-14">
          <p className="font-mono text-[13px] text-text-3 mb-4">
            <span className="text-accent mr-2">❯</span>cat ./projects/schrodinger-hat.md
          </p>
          <h1 className="font-mono text-[32px] sm:text-[40px] font-bold text-text-1 tracking-[-0.03em] leading-none mb-3">
            Schrodinger Hat
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="font-mono text-[12px] text-accent">// Co-founder & Admin Member</span>
            <span className="font-mono text-[12px] text-text-3">2022 – present</span>
            <a
              href="https://schrodinger-hat.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
            >
              schrodinger-hat.org →
            </a>
          </div>
          <p className="font-sans text-[16px] text-text-2 leading-relaxed">
            I didn't found Schrodinger Hat. I joined it as an unknown, worked hard, and earned my
            place — to the point of becoming a co-founder and one of the principal members of the
            organization. This is the story of what happens when a developer decides to leave the
            comfort zone and build something with others.
          </p>
        </header>
      </ScrollReveal>

      {/* Stats */}
      <ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14 border-t border-b border-border py-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-mono text-[22px] font-bold text-text-1 leading-none">
                {stat.value}
              </span>
              <span className="font-mono text-[10px] text-text-3 tracking-widest uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* The beginning */}
      <ScrollReveal>
        <section className="mb-12">
          <h2 className="font-mono text-[14px] font-semibold text-text-1 mb-4 flex items-center gap-2">
            <span className="text-accent text-[10px]">{`//`}</span>
            Starting from the last row
          </h2>
          <div className="flex flex-col gap-4">
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              Schrodinger Hat was founded in 2021 by a small group of developers who put out a call
              to action: come build an international open source community with us. I saw it in 2022
              and thought: why not? It was an uncomfortable choice — I was shy, not particularly
              public-facing, and had no experience running anything beyond a codebase.
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              I joined as the last person in. No role, no title, no authority. Just the willingness
              to contribute and see what happened.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* The work */}
      <ScrollReveal>
        <section className="mb-12 border-t border-border pt-10">
          <h2 className="font-mono text-[14px] font-semibold text-text-1 mb-4 flex items-center gap-2">
            <span className="text-accent text-[10px]">{`//`}</span>
            The work nobody tells you about
          </h2>
          <div className="flex flex-col gap-4">
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              Running a non-profit community looks like organizing events and writing code. In
              reality, it's also finance management, sponsor acquisition, speaker outreach,
              newsletter campaigns, social media strategy, logistics, and contracts. None of these
              appear in any engineering job description.
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              Open Source Day is our flagship conference — a full-day, free event in Florence.
              Keeping it free means finding the money elsewhere. I've sat across from companies and
              made the case for a sponsorship worth thousands of euros. That's not a skill you learn
              by writing Go code.
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              Over time, through consistent contribution, I became a socio fondatore — a co-founder
              in the formal sense — and an admin member of the organization. I didn't start there.
              I earned it.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Skills unlocked */}
      <ScrollReveal>
        <section className="mb-12 border-t border-border pt-10">
          <h2 className="font-mono text-[14px] font-semibold text-text-1 mb-6 flex items-center gap-2">
            <span className="text-accent text-[10px]">{`//`}</span>
            Skills I didn't expect to develop
          </h2>
          <div className="flex flex-col gap-5">
            {[
              {
                title: "Public speaking",
                body: "I was shy. Schrodinger Hat pushed me onto stages. Once you've pitched a conference to a corporate sponsor, speaking at a meetup feels easy. Now it's one of the things I actively seek out.",
              },
              {
                title: "Selling ideas",
                body: "Finding sponsors taught me how to communicate value to people who don't speak engineering. That same skill translates directly to selling a technical decision to a C-level or a PM — understanding their concerns, framing the solution in their language.",
              },
              {
                title: "Finance & logistics",
                body: "Managing a budget of €7–10k per event, negotiating with vendors, tracking costs — it made me more commercially aware as an engineer. I now understand why business constraints exist, not just that they exist.",
              },
              {
                title: "Cross-functional collaboration",
                body: "A community is made of people with very different skills. Designers, marketers, speakers, sponsors, volunteers. Learning to work with all of them — and coordinate without authority — is the best preparation for leading an engineering team.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-2 border-l border-border pl-5">
                <span className="font-mono text-[13px] font-medium text-text-1">{item.title}</span>
                <p className="font-sans text-[14px] text-text-2 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Open Source Day */}
      <ScrollReveal>
        <section className="mb-12 border-t border-border pt-10">
          <h2 className="font-mono text-[14px] font-semibold text-text-1 mb-4 flex items-center gap-2">
            <span className="text-accent text-[10px]">{`//`}</span>
            Open Source Day
          </h2>
          <div className="flex flex-col gap-4">
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              Five editions. Free admission. Florence. Hundreds of developers, students, and
              professionals who come because they want to be part of something — not because their
              company paid for it.
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              The feedback we hear most often is that Open Source Day feels like a community, not a
              conference. That's intentional. Every logistical choice — from the schedule to the
              hallway layout — is made with one question: does this help people connect?
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              It's the project I'm most proud of. And the one that costs me the most sleep.
            </p>
            <a
              href="https://osday.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150 self-start"
            >
              osday.dev →
            </a>
          </div>
        </section>
      </ScrollReveal>

      {/* What I learned */}
      <ScrollReveal>
        <section className="mb-14 border-t border-border pt-10">
          <h2 className="font-mono text-[14px] font-semibold text-text-1 mb-4 flex items-center gap-2">
            <span className="text-accent text-[10px]">{`//`}</span>
            What I learned
          </h2>
          <div className="flex flex-col gap-4">
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              Community can change your career in ways no job posting can. The company where I'm
              now Tech Lead — I found through a connection I made at a community event. Not through
              LinkedIn. Not through a recruiter. Through showing up consistently and building
              relationships with people who care about the same things.
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              The comfort zone is a slow trap. It feels safe because nothing is changing — but
              nothing is growing either. Joining Schrodinger Hat was uncomfortable. So was speaking
              on stage for the first time, and cold-calling sponsors, and managing a budget I'd
              never managed before. Every one of those discomforts made me better at the things that
              matter.
            </p>
            <blockquote className="border-l-2 border-accent pl-5 py-1 mt-2">
              <p className="font-mono text-[14px] text-text-1 leading-snug">
                The community is open to everyone.
                <br />
                <span className="text-text-2 text-[13px]">
                  Anyone can contribute, volunteer, and grow — regardless of where they start.
                </span>
              </p>
            </blockquote>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer CTA */}
      <ScrollReveal>
        <div className="border-t border-border pt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-mono text-[12px] text-text-3">
            Want to talk about this?{" "}
            <a
              href="/contact"
              className="text-text-2 hover:text-accent transition-colors duration-150"
            >
              Get in touch →
            </a>
          </p>
          <a
            href="/projects"
            className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
          >
            ← All projects
          </a>
        </div>
      </ScrollReveal>
    </div>
  );
}
