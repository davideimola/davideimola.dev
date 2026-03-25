import type { Metadata } from "next";
import { PageHero } from "../../components/ui/PageHero";
import { ScrollReveal } from "../../components/ui/ScrollReveal";
import { SectionHeader } from "../../components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Uses",
  description: "Hardware, software, and tools I use daily to build and think.",
  openGraph: {
    title: "Uses — Davide Imola",
    description: "Hardware, software, and tools I use daily to build and think.",
    url: "https://davideimola.dev/uses",
    images: [{ url: "https://davideimola.dev/og?title=Uses&category=tools", width: 1200, height: 630 }],
  },
};

const HARDWARE = [
  {
    category: "Computing",
    items: [
      {
        name: "MacBook Pro 14\" M5 Pro (2026)",
        description: "Primary machine. Fast enough that I've stopped thinking about performance.",
      },
    ],
  },
  {
    category: "Display & Video",
    items: [
      {
        name: "Samsung LU28R550 — 28\" 4K UHD",
        description: "3840×2160, 60Hz, HDR10, 99% sRGB. USB-C connected.",
      },
      {
        name: "Aukey Webcam",
        description: "External webcam for calls, talks, and workshops.",
      },
    ],
  },
  {
    category: "Input",
    items: [
      {
        name: "Kinesis Freestyle Edge",
        description: "Split mechanical keyboard, Cherry MX Brown switches. Takes a week to adapt, worth it.",
      },
      {
        name: "Logitech MX Vertical",
        description: "Ergonomic vertical mouse. Saved my wrist.",
      },
    ],
  },
  {
    category: "Audio",
    items: [
      {
        name: "Audio-Technica ATH-M50x",
        description: "Professional monitor headphones. Daily driver for focus work and calls.",
      },
      {
        name: "Elgato Wave:3",
        description: "USB condenser mic, 24-bit/96kHz. For talks, podcasts, and remote meetings.",
      },
    ],
  },
  {
    category: "Workspace",
    items: [
      {
        name: "Flexispot E5 Pro",
        description: "Height-adjustable standing desk with memory presets.",
      },
      {
        name: "Secretlab Titan Evo 2022",
        description: "Chair with 4-way lumbar support. Long sessions, no back pain.",
      },
    ],
  },
  {
    category: "Sketching",
    items: [
      {
        name: "iPad Pro + Apple Pencil",
        description: "For sketching ideas, annotating, and thinking visually when the screen isn't enough.",
      },
      {
        name: "Paper & pen",
        description: "Still the fastest way to think. Always on the desk.",
      },
    ],
  },
];

const SOFTWARE = [
  {
    category: "Editor & Terminal",
    items: [
      {
        name: "Cursor",
        description: "Primary code editor. Custom extensions, Vim keybindings.",
      },
      {
        name: "Claude Code",
        description: "AI coding workflow. How this site was built. Changes how you think about development.",
      },
      {
        name: "iTerm2 + oh-my-zsh",
        description: "Terminal setup. Unchanged for years — means it works.",
      },
    ],
  },
  {
    category: "Browser & Productivity",
    items: [
      {
        name: "Arc",
        description: "Main browser. Spaces keep work and personal contexts separate.",
      },
      {
        name: "Raycast",
        description: "Replaced Spotlight. Launcher, clipboard history, snippets — faster than I expected.",
      },
      {
        name: "1Password",
        description: "Password manager. Non-negotiable, especially working in security.",
      },
      {
        name: "Notion",
        description: "Notes, docs, project tracking. Everything that isn't code.",
      },
      {
        name: "pgAdmin",
        description: "Current PostgreSQL GUI. Looking for something better — suggestions welcome.",
      },
    ],
  },
  {
    category: "Design & Diagrams",
    items: [
      {
        name: "diagrams.net",
        description: "Go-to for architecture diagrams, flows, and system design sketches.",
      },
    ],
  },
  {
    category: "Git",
    items: [
      {
        name: "GitKraken",
        description: "Visual Git client. GitKraken Ambassador — I use it for history and complex operations.",
      },
      {
        name: "CLI + GitLens",
        description: "For day-to-day commits and quick operations. GitLens in Cursor for inline blame.",
      },
    ],
  },
];

const CURSOR_EXTENSIONS = [
  "Vim",
  "GitLens",
  "Go support",
  "Tailwind CSS IntelliSense",
  "Docker",
  "Kubernetes",
  "SonarQube for IDE",
  "Material Icon Theme",
  "JetBrains Keymap",
];

const DEV_STACK = [
  {
    category: "Languages",
    items: ["Go", "TypeScript", "Python"],
  },
  {
    category: "Frameworks",
    items: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    category: "Infrastructure",
    items: ["Kubernetes", "Flux", "Pulumi", "NATS", "GitHub Actions", "PostgreSQL", "Prometheus", "Grafana"],
  },
  {
    category: "Cloud",
    items: [
      { name: "Google Cloud Platform", note: "current" },
      { name: "AWS", note: "previously" },
    ],
  },
  {
    category: "Services",
    items: [
      { name: "GitHub", note: null },
      { name: "Vercel", note: null },
      { name: "Figma", note: null },
    ],
  },
];

export default function UsesPage() {
  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="ls ./uses"
        title="Uses"
        className="mb-16"
        description={
          <>
            Hardware, software, and tools I use daily to build and think. Inspired by{" "}
            <a
              href="https://uses.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-1 hover:text-accent transition-colors duration-150"
            >
              uses.tech
            </a>
            .
          </>
        }
      />

      {/* Hardware */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Hardware" />
        </ScrollReveal>
        <div className="flex flex-col gap-10">
          {HARDWARE.map((section, si) => (
            <ScrollReveal key={section.category} delay={si * 40}>
              <div>
                <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-4">
                  {section.category}
                </p>
                <div className="flex flex-col gap-4">
                  {section.items.map((item) => (
                    <div key={item.name} className="flex flex-col gap-0.5">
                      <span className="font-mono text-[13px] font-medium text-text-1 flex items-center gap-2">
                        <span className="text-accent text-[10px]">//</span>
                        {item.name}
                      </span>
                      <span className="font-sans text-[13px] text-text-3 pl-5">
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Software */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Software" />
        </ScrollReveal>
        <div className="flex flex-col gap-10">
          {SOFTWARE.map((section, si) => (
            <ScrollReveal key={section.category} delay={si * 40}>
              <div>
                <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-4">
                  {section.category}
                </p>
                <div className="flex flex-col gap-4">
                  {section.items.map((item) => (
                    <div key={item.name} className="flex flex-col gap-0.5">
                      <span className="font-mono text-[13px] font-medium text-text-1 flex items-center gap-2">
                        <span className="text-accent text-[10px]">//</span>
                        {item.name}
                      </span>
                      <span className="font-sans text-[13px] text-text-3 pl-5">
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Cursor extensions */}
        <ScrollReveal>
          <div className="mt-10">
            <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-4">
              Cursor extensions
            </p>
            <div className="flex flex-wrap gap-2">
              {CURSOR_EXTENSIONS.map((ext) => (
                <span
                  key={ext}
                  className="font-mono text-[11px] text-text-2 border border-border rounded-[2px] px-2 py-1"
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Dev stack */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Dev stack" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEV_STACK.map((section, si) => (
            <ScrollReveal key={section.category} delay={si * 40}>
              <div>
                <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-3">
                  {section.category}
                </p>
                <ul className="flex flex-col gap-2">
                  {section.items.map((item) => {
                    const name = typeof item === "string" ? item : item.name;
                    const note = typeof item === "string" ? null : item.note;
                    return (
                      <li
                        key={name}
                        className="font-mono text-[12px] text-text-2 flex items-center gap-2"
                      >
                        <span className="text-accent text-[10px]">—</span>
                        {name}
                        {note && (
                          <span className="text-text-3 text-[10px]">({note})</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <ScrollReveal>
        <div className="pt-8 border-t border-border">
          <p className="font-sans text-[13px] text-text-3">
            Something changed?{" "}
            <a
              href="https://www.linkedin.com/in/davideimola/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-2 hover:text-accent transition-colors duration-150"
            >
              Let me know →
            </a>
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
