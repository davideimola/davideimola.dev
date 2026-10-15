import type { Metadata } from "next";
import Link from "next/link";
import { ShelfNow } from "../../../components/sections/ShelfNow";
import { Marker } from "../../../components/ui/Marker";
import { Tape } from "../../../components/ui/Tape";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm working on, learning, and thinking about right now.",
  openGraph: {
    title: "Now · Davide Imola",
    description: "What I'm working on, learning, and thinking about right now.",
    url: "https://davideimola.dev/now",
    images: [
      { url: "https://davideimola.dev/og?title=Now&category=now", width: 1200, height: 630 },
    ],
  },
};

// Hand-written: change it with the prose below.
const LAST_UPDATED = "October 2026";

// The prose here is updated by hand, but the shelf strip is read out of the
// library on every revalidation, so the page follows /shelf's cadence.
export const revalidate = 3600;

const LEARNING = [
  {
    kicker: "Learning",
    title: "Working with AI",
    body: 'Until recently the answer was "write more code". Now it is knowing when and how to use AI: agents, tools, prompting patterns.',
  },
  {
    kicker: "Learning",
    title: "Security, daily practice",
    body: "SOC teams, threat models, secure architectures. Outbox pattern, event integrity, secure-by-design API boundaries. Less course, more practice.",
  },
  {
    kicker: "Building for myself",
    title: "A second brain",
    body: "tsundoku for the library, bindex for the Pokémon cards, kanpai for the wine, an Obsidian vault for what I write. In daily use and never finished, which is the point.",
  },
];

// What I read and play comes from the library through ShelfNow, so it is not
// restated here.
const PERSONAL = [
  {
    title: "JuJutsu",
    body: "Hontai Yōshin-ryū. Back on the mat after the summer break, yellow belt, working towards orange.",
  },
];

const inlineLink = "text-fg border-b border-fg no-underline hover:text-accent hover:border-accent";

function Band({
  tape,
  tilt,
  first = false,
  children,
}: {
  tape: string;
  tilt: 0 | 1 | 2;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6 md:gap-14 ${
        first ? "pt-12 md:pt-[52px]" : "mt-12 md:mt-[52px] pt-10 md:pt-11 border-t border-rule"
      }`}
    >
      <Tape tilt={tilt} className="self-start">
        {tape}
      </Tape>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function NowPage() {
  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-12">
      <header className="flex flex-col gap-[22px] max-w-[900px]">
        <Tape tilt={0}>Now</Tape>
        <h1 className="m-0 font-sans font-bold text-fg text-[42px] sm:text-[56px] lg:text-[72px] leading-[0.98] tracking-[-0.045em]">
          What I'm focused on <Marker>right now.</Marker>
        </h1>
        <p className="m-0 font-sans text-[18px] sm:text-[21px] leading-[1.55] text-fg-muted max-w-[720px]">
          I'm a Tech Lead at RedCarbon, working from Verona, Italy. I'm open to talks and workshops,
          and I'm not looking for a new role.
        </p>
        <p className="m-0 font-mono text-[14px] text-fg-subtle">
          Updated {LAST_UPDATED} · a{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className={inlineLink}
          >
            /now page
          </a>
          , rewritten when something changes
        </p>
      </header>

      <Band tape="At work" tilt={1} first>
        <div className="flex flex-col gap-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="m-0 font-sans font-bold text-[22px] md:text-[24px] tracking-[-0.025em] text-fg">
                Learning to lead people
              </h2>
              <p className="m-0 font-sans text-[17px] leading-[1.6] text-fg-body">
                Still a Tech Lead, and more and more of the job is people, even if nobody made it
                official. I'm learning how to approach each person, how to split the work, and how
                to understand what someone needs to do their best. Most of it I'm figuring out as I
                go.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="m-0 font-sans font-bold text-[22px] md:text-[24px] tracking-[-0.025em] text-fg">
                <Link href="/projects" className="no-underline text-fg hover:text-accent">
                  Argus
                </Link>
              </h2>
              <p className="m-0 font-sans text-[17px] leading-[1.6] text-fg-body">
                Open-source AI agent for security code reviews, written in Go. It now runs two ways:
                as a colleague that runs real scanners and reasons about the findings, or as a
                toolbox, an MCP server that hands those scanners to the AI you already use, so your
                own Claude does the reasoning and Argus needs no model of its own.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-border">
            {LEARNING.map((item, i) => (
              <div
                key={item.title}
                className={`flex flex-col gap-1.5 pt-5 ${
                  i === 0
                    ? "md:pr-6"
                    : `border-t md:border-t-0 md:border-l border-border mt-5 md:mt-0 ${
                        i === LEARNING.length - 1 ? "md:pl-6" : "md:px-6"
                      }`
                }`}
              >
                <span className="font-mono text-[12px] text-fg-subtle">{item.kicker}</span>
                <span className="font-sans font-bold text-[18px] text-fg">{item.title}</span>
                <span className="font-sans text-[15px] leading-[1.5] text-fg-muted">
                  {item.body}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Band>

      <Band tape="Community" tilt={2}>
        <div className="flex flex-col gap-2 max-w-[760px]">
          <h2 className="m-0 font-sans font-bold text-[22px] md:text-[24px] tracking-[-0.025em] text-fg">
            Schrodinger Hat Branches
          </h2>
          <p className="m-0 font-sans text-[17px] leading-[1.6] text-fg-body">
            Schrodinger Hat's distributed arm: free local meetups, each run by people on the ground.
            I lead the program, spinning up new chapters and keeping the active ones moving. Rome,
            Verona, Milan, Florence launching now. Looking abroad next.
          </p>
          <a
            href="https://schroedinger-hat.org"
            target="_blank"
            rel="noopener noreferrer"
            className={`self-start font-mono text-[14px] ${inlineLink}`}
          >
            schroedinger-hat.org
          </a>
        </div>
      </Band>

      <Band tape="Off the clock" tilt={0}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 lg:gap-12">
          {/* What the library says is open. Renders nothing when it has nothing. */}
          <ShelfNow />
          <ul className="m-0 p-0 list-none flex flex-col gap-3.5">
            {PERSONAL.map((item) => (
              <li key={item.title} className="flex flex-col gap-[3px]">
                <span className="font-sans font-bold text-[17px] text-fg">{item.title}</span>
                <span className="font-sans text-[14px] leading-[1.5] text-fg-muted">
                  {item.body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Band>
    </div>
  );
}
