import type { Meta, StoryObj } from "@storybook/react";
import { BuildingSection } from "../components/sections/BuildingSection";
import { CommunitySection } from "../components/sections/CommunitySection";
import { HeroSection } from "../components/sections/HeroSection";
import { NewsletterSection } from "../components/sections/NewsletterSection";
import { StageSection } from "../components/sections/StageSection";
import { WritingSection } from "../components/sections/WritingSection";
import type { BlogPost, Project, Talk } from "../lib/content";

const meta: Meta = {
  title: "Sections/Home",
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const post = (slug: string, title: string, date: string, topic: string): BlogPost => ({
  slug,
  title,
  date,
  topic,
  excerpt: "",
  category: "Technical",
  tags: [],
  readingTime: "8 min read",
  content: "",
  heroImage: `/images/blog/${slug}/cover.svg`,
});

const project = (slug: string, title: string, extra: Partial<Project> = {}): Project => ({
  slug,
  title,
  status: "active",
  period: "2026–present",
  featured: false,
  tags: [],
  description: "",
  ...extra,
});

const talk = (
  slug: string,
  date: string,
  event: string,
  title: string,
  location: string
): Talk => ({
  slug,
  event,
  type: "Conference",
  date,
  location,
  tags: [],
  session: { title, format: "Talk" },
});

export const Hero: Story = {
  render: () => <HeroSection flagship={{ title: "Argus", href: "#" }} />,
};

// Without the drawing: the cover is prepared on the server from public/.
export const Building: Story = {
  render: () => (
    <BuildingSection
      project={project("argus", "Argus", {
        github: "https://github.com/argusappsec/argus",
        description:
          "Open-source AI security review agent written in Go. It runs real scanners and reasons about their findings like an analyst would.",
        highlights: [
          "Semgrep, Gitleaks and OSV-Scanner, run as tools",
          "In the terminal, on pull requests, over MCP",
          "Go, Apache 2.0, early and honest about it",
        ],
        quickstart: "docker run -it -p 8080:8080 ghcr.io/argusappsec/argus",
      })}
      post={{ slug: "introducing-argus" }}
      others={[
        project("tsundoku", "tsundoku", { url: "#" }),
        project("kanpai", "kanpai"),
        project("bindex", "bindex"),
      ]}
    />
  ),
};

export const Writing: Story = {
  render: () => (
    <WritingSection
      posts={[
        post(
          "ai-agent-sessions-data-store",
          "AI Agent Sessions Are a Data Store Nobody Designed",
          "2026-10-14",
          "ai-security"
        ),
        post("introducing-argus", "Introducing Argus", "2026-07-30", "ai-security"),
        post(
          "i-built-a-tool-i-dont-use",
          "I Built a Tool I Don't Use",
          "2026-07-08",
          "engineering"
        ),
      ]}
      topics={[
        { slug: "ai-security", label: "AI and security", count: 5 },
        { slug: "engineering", label: "Engineering and Go", count: 5 },
        { slug: "looking-back", label: "Looking back", count: 4 },
      ]}
      total={14}
    />
  ),
};

const stage = (upcoming: boolean[]) =>
  [
    talk(
      "golab",
      "2026-11-01",
      "GoLab 2026",
      "Securing Go for Production: Best Practices, Supply Chain, Testing",
      "Bologna, Italy"
    ),
    talk(
      "reactjsday",
      "2026-11-19",
      "reactjsday 2026",
      "AI Won't Design Your System. You Have To.",
      "Verona, Italy"
    ),
    talk(
      "ctc",
      "2026-09-26",
      "ComeToCode 2026",
      "Il security engineer che già AI",
      "Pignola, Italy"
    ),
  ].map((t, i) => ({ talk: t, upcoming: upcoming[i] }));

export const OnStage: Story = {
  render: () => (
    <StageSection
      quote="What you learn, you must share."
      stage={stage([true, true, false])}
      spokenAt={["GoLab", "KCD Italy", "WeAreDevelopers World Congress"]}
      talkCount={32}
    />
  ),
};

// Nothing scheduled: the same three cards, all from the archive.
export const OnStageBetweenTalks: Story = {
  render: () => (
    <StageSection
      quote="What you learn, you must share."
      stage={stage([false, false, false])}
      spokenAt={["ComeToCode", "GoLab"]}
      talkCount={32}
    />
  ),
};

export const Community: Story = {
  render: () => (
    <CommunitySection
      association={{
        title: "Schrodinger Hat",
        description:
          "The non-profit open source association I co-founded and run. 20k+ people reached, 100+ speakers at events across Europe.",
        href: "#",
      }}
      events={[
        { title: "Open Source Day", line: "4 editions, 2023 to 2026, in Florence.", href: "#" },
        { title: "Meetups", line: "10 since 2023, in Milan, Florence and Verona." },
      ]}
    />
  ),
};

export const Newsletter: Story = {
  render: () => <NewsletterSection />,
};
