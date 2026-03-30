import type { Metadata } from "next";
import { ScrollReveal } from "../../../components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "RedCarbon — Case Study",
  description:
    "How I joined a 3-person cybersecurity startup and helped grow the engineering team to 10+, from Software Engineer to Tech Lead.",
  openGraph: {
    title: "RedCarbon — Case Study · Davide Imola",
    description:
      "How I joined a 3-person cybersecurity startup and helped grow the engineering team to 10+, from Software Engineer to Tech Lead.",
    url: "https://davideimola.dev/projects/redcarbon",
    images: [
      {
        url: "https://davideimola.dev/og?title=RedCarbon&category=case+study",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const START_YEAR = 2022;

function getYearsAtRedCarbon(): number {
  return new Date().getFullYear() - START_YEAR;
}

const STATS = [
  { value: "3 → 10+", label: "team size" },
  { value: `${getYearsAtRedCarbon()}+`, label: "years" },
  { value: "SE → TL", label: "role progression" },
  { value: "Series A", label: "funding achieved" },
];

export default function RedCarbonCaseStudy() {
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
            <span className="text-accent mr-2">❯</span>cat ./projects/redcarbon.md
          </p>
          <h1 className="font-mono text-[32px] sm:text-[40px] font-bold text-text-1 tracking-[-0.03em] leading-none mb-3">
            RedCarbon
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="font-mono text-[12px] text-accent">// Tech Lead</span>
            <span className="font-mono text-[12px] text-text-3">2022 – present</span>
            <a
              href="https://redcarbon.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
            >
              redcarbon.ai →
            </a>
          </div>
          <p className="font-sans text-[16px] text-text-2 leading-relaxed">
            I joined RedCarbon as one of its first engineers when the company was barely formed. Over
            four years, the team has grown from 3 to 10+ people, the platform now processes 500k+
            alerts monthly, and the company has reached Series A funding. I'm Tech Lead of a team I
            helped build from scratch — in a domain I had to teach myself, on a codebase I helped
            design.
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

      {/* Context */}
      <ScrollReveal>
        <section className="mb-12">
          <h2 className="font-mono text-[14px] font-semibold text-text-1 mb-4 flex items-center gap-2">
            <span className="text-accent text-[10px]">{`//`}</span>
            The context
          </h2>
          <div className="flex flex-col gap-4">
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              RedCarbon had just been founded when I joined. The team was three people: one
              Engineering Manager handling the backend, two frontend engineers. I was hired to help
              the EM scale up the backend side — a Go microservices platform powering an AI-driven
              Security Operations Center product.
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              It looked like a natural next step. It wasn't.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* The challenge */}
      <ScrollReveal>
        <section className="mb-12 border-t border-border pt-10">
          <h2 className="font-mono text-[14px] font-semibold text-text-1 mb-4 flex items-center gap-2">
            <span className="text-accent text-[10px]">{`//`}</span>
            The challenge
          </h2>
          <div className="flex flex-col gap-4">
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              My background was DevOps — infrastructure, pipelines, containers. I knew how systems
              run. What I didn't know was how a product is built: how to read a business requirement,
              how to model a domain, how to make tradeoffs that matter to a customer.
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              The domain made this harder. Cybersecurity at the SOC level is a complex, specialized
              field. Threat detection, alert correlation, incident response workflows — I had to
              learn the theory and the practice simultaneously while shipping production code.
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              I had to stop thinking in infrastructure terms and start thinking in product and domain
              terms. That shift took time and it was uncomfortable. I wouldn't trade it.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* What I built */}
      <ScrollReveal>
        <section className="mb-12 border-t border-border pt-10">
          <h2 className="font-mono text-[14px] font-semibold text-text-1 mb-6 flex items-center gap-2">
            <span className="text-accent text-[10px]">{`//`}</span>
            What I built
          </h2>
          <div className="flex flex-col gap-6">
            {[
              {
                title: "Engineering culture & process",
                body: "The team had no structured workflow. I introduced Jira and Linear for task management, standups and sprint planning, and a shared understanding of what 'done' means. Small changes with outsized impact on predictability.",
              },
              {
                title: "Infrastructure as code",
                body: "I brought my DevOps background to bear on the cloud layer. Migrated infrastructure management to Pulumi on GCP — code-first, version-controlled, reproducible. No more manual configuration drift.",
              },
              {
                title: "GitOps on Kubernetes",
                body: "Kubernetes and GitOps were already part of the stack when I joined. I took ownership of that layer, deepened it, and brought the same expertise I'd been developing independently — eventually speaking about it at KCD Italy, Incontro DevOps, and other conferences.",
              },
              {
                title: "Observability from zero",
                body: "The platform had no monitoring. I built the full Grafana + Prometheus stack — dashboards, alerts, service-level indicators. For the first time the team could see what was actually happening in production.",
              },
              {
                title: "Go backend & hiring",
                body: "I grew into Go microservices development and became one of the primary contributors to the backend platform. As the team needed to grow, I helped the EM with interviews and hiring — learning to build a team, not just join one.",
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

      {/* Evolution to Tech Lead */}
      <ScrollReveal>
        <section className="mb-12 border-t border-border pt-10">
          <h2 className="font-mono text-[14px] font-semibold text-text-1 mb-4 flex items-center gap-2">
            <span className="text-accent text-[10px]">{`//`}</span>
            From engineer to Tech Lead
          </h2>
          <div className="flex flex-col gap-4">
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              As the product matured, we split into two teams with distinct contexts. I took
              technical ownership of one team and the overall engineering direction of the
              department. The role came with a different kind of responsibility: not just what to
              build, but how the whole team builds it.
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              I work closely with the PM on roadmap and planning, and interface directly with
              C-level stakeholders — translating business requirements into technical decisions, and
              translating technical constraints back into product language. Domain-Driven Design
              became my foundation for this: having a shared ubiquitous language between engineers
              and business stakeholders is not a luxury, it's what prevents costly
              misunderstandings.
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              My approach to leadership is deliberate: I avoid micromanagement. Senior engineers
              own their architectural decisions — I set direction and remove blockers. Where I focus
              is on mentorship: helping juniors grow and, over time, positioning senior engineers to
              become future team leaders themselves. If I do my job right, I make myself
              replaceable.
            </p>
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
              Engineering skills get you in the door. Domain understanding keeps you relevant.
              Knowing how a business makes money — and what it needs to stay alive — changes how you
              write every line of code.
            </p>
            <p className="font-sans text-[15px] text-text-2 leading-relaxed">
              The hardest part of being a tech lead is not the technical decisions. It's learning
              when to decide and when to trust the people on your team to decide. I'm still learning
              that balance.
            </p>
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
