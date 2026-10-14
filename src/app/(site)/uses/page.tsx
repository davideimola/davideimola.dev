import type { Metadata } from "next";
import { Marker } from "../../../components/ui/Marker";
import { Tape } from "../../../components/ui/Tape";

export const metadata: Metadata = {
  title: "Uses",
  description: "Hardware, software, and tools I use daily to build and think.",
  openGraph: {
    title: "Uses · Davide Imola",
    description: "Hardware, software, and tools I use daily to build and think.",
    url: "https://davideimola.dev/uses",
    images: [
      { url: "https://davideimola.dev/og?title=Uses&category=tools", width: 1200, height: 630 },
    ],
  },
};

const HARDWARE = [
  {
    category: "Computing",
    items: [
      {
        name: 'MacBook Pro 14" M5 Pro (2026)',
        description: "Primary machine. Fast enough that I've stopped thinking about performance.",
      },
      {
        name: "UGREEN RevoDok Max 213 · 13-in-1 Thunderbolt 4",
        description:
          "The desk hub. One cable docks the MacBook: dual 4K display, 90W charging, and every peripheral at once.",
      },
    ],
  },
  {
    category: "Display and video",
    items: [
      {
        name: 'Samsung LU28R550 · 28" 4K UHD',
        description: "3840×2160, 60Hz, HDR10, 99% sRGB.",
      },
      {
        name: 'Dell S2722QC · 27" 4K UHD',
        description:
          "Second display, rotated to portrait for long docs and code review. USB-C hub, 3840×2160, 60Hz.",
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
        description:
          "Split mechanical keyboard, Cherry MX Brown switches. Takes a week to adapt, worth it.",
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
        description:
          "For sketching ideas, annotating, and thinking visually when the screen isn't enough.",
      },
      {
        name: "Paper and pen",
        description: "Still the fastest way to think. Always on the desk.",
      },
    ],
  },
];

const SOFTWARE = [
  {
    category: "Editor and terminal",
    items: [
      {
        name: "Cursor",
        description: "Primary code editor. Custom extensions, Vim keybindings.",
      },
      {
        name: "Claude Code",
        description:
          "AI coding workflow. How this site was built. Changes how you think about development.",
      },
      {
        name: "iTerm2 + oh-my-zsh",
        description: "Terminal setup. Unchanged for years, which means it works.",
      },
    ],
  },
  {
    category: "Browser and productivity",
    items: [
      {
        name: "Arc",
        description: "Main browser. Spaces keep work and personal contexts separate.",
      },
      {
        name: "Raycast",
        description:
          "Replaced Spotlight. Launcher, clipboard history, snippets. Faster than I expected.",
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
        description: "Current PostgreSQL GUI. Looking for something better; suggestions welcome.",
      },
    ],
  },
  {
    category: "Design and diagrams",
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
        description:
          "Visual Git client. GitKraken Ambassador. I use it for history and complex operations.",
      },
      {
        name: "CLI + GitLens",
        description:
          "For day-to-day commits and quick operations. GitLens in Cursor for inline blame.",
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
    items: [
      "Kubernetes",
      "Flux",
      "Pulumi",
      "NATS",
      "GitHub Actions",
      "PostgreSQL",
      "Prometheus",
      "Grafana",
    ],
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

type Group = (typeof HARDWARE)[number];

function ItemList({ groups }: { groups: Group[] }) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.category} className="flex flex-col gap-3.5">
          <span className="font-mono text-[12px] text-fg-subtle mt-1.5">{group.category}</span>
          {group.items.map((item, i) => (
            <div
              key={item.name}
              className={`flex flex-col gap-0.5 ${
                i < group.items.length - 1 ? "pb-3 border-b border-border" : "pb-3"
              }`}
            >
              <span className="font-sans font-semibold text-[16px] text-fg">{item.name}</span>
              {item.description && (
                <span className="font-sans text-[14px] leading-[1.45] text-fg-muted">
                  {item.description}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default function UsesPage() {
  // The pull quote is the desk's oldest tool, read from the list rather than restated.
  const paper = HARDWARE.flatMap((g) => g.items).find((i) => i.name === "Paper and pen");
  const half = Math.ceil(HARDWARE.length / 2);

  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-10">
      <header className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-16 items-end">
        <div className="flex flex-col gap-5">
          <Tape tilt={0}>Uses</Tape>
          <h1 className="m-0 font-sans font-bold text-fg text-[42px] sm:text-[56px] lg:text-[72px] leading-[0.98] tracking-[-0.045em]">
            What's on the <Marker>desk.</Marker>
          </h1>
          <p className="m-0 font-sans text-[18px] sm:text-[20px] leading-[1.5] text-fg-muted">
            Hardware, software, and tools I use daily to build and think.
          </p>
        </div>
        {paper && (
          <p className="relative m-0 pl-5 font-sans font-semibold text-[20px] sm:text-[22px] leading-[1.3] tracking-[-0.02em] text-fg">
            <span
              aria-hidden="true"
              className="absolute left-0 top-[9px] w-[9px] h-[9px] bg-fg rounded-[2px]"
            />
            {paper.name}: {paper.description.charAt(0).toLowerCase()}
            {paper.description.slice(1)}
          </p>
        )}
      </header>

      <section className="mt-10 pt-7 border-t border-rule grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
        <div className="flex flex-col gap-3.5">
          <Tape as="h2" tilt={1}>
            Hardware
          </Tape>
          <ItemList groups={HARDWARE.slice(0, half)} />
        </div>
        <div className="flex flex-col gap-3.5 lg:pt-[37px]">
          <ItemList groups={HARDWARE.slice(half)} />
        </div>
        <div className="flex flex-col gap-3.5">
          <Tape as="h2" tilt={2}>
            Software
          </Tape>
          <ItemList groups={SOFTWARE} />
          <p className="m-0 font-mono text-[12px] leading-[1.6] text-fg-subtle">
            Cursor extensions: {CURSOR_EXTENSIONS.join(" · ")}
          </p>
        </div>
      </section>

      <section className="mt-11 pt-6 border-t border-rule grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6 md:gap-14">
        <Tape as="h2" tilt={0} className="self-start">
          The stack
        </Tape>
        <dl className="m-0 grid grid-cols-[110px_minmax(0,1fr)] sm:grid-cols-[140px_minmax(0,1fr)] gap-x-6 gap-y-2.5 font-sans text-[16px] text-fg">
          {DEV_STACK.map((row) => (
            <div key={row.category} className="contents">
              <dt className="font-mono text-[13px] text-fg-subtle pt-0.5">{row.category}</dt>
              <dd className="m-0">
                {row.items.map((item, i) => (
                  <span key={typeof item === "string" ? item : item.name}>
                    {i > 0 && " · "}
                    {typeof item === "string" ? (
                      item
                    ) : (
                      <>
                        {item.name}
                        {item.note && <span className="text-fg-subtle"> ({item.note})</span>}
                      </>
                    )}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
