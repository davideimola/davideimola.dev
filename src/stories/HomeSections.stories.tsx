import type { Meta, StoryObj } from "@storybook/react";
import { BuildingSection } from "../components/sections/BuildingSection";
import { HeroSection } from "../components/sections/HeroSection";
import { InPublicSection } from "../components/sections/InPublicSection";
import { NewsletterSection } from "../components/sections/NewsletterSection";
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

const communities = [
  {
    title: "Schrödinger Hat",
    description: "International open source community I co-founded.",
    href: "#",
  },
  {
    title: "Open Source Day",
    description: "The open source conference I co-organise in Florence.",
    href: "#",
  },
];

export const InPublic: Story = {
  render: () => (
    <InPublicSection
      quote="What you learn, you must share."
      stage={[
        {
          talk: talk(
            "golab",
            "2026-11-01",
            "GoLab 2026",
            "Securing Go for Production",
            "Bologna, Italy"
          ),
          upcoming: true,
        },
        {
          talk: talk(
            "ctc",
            "2026-09-26",
            "ComeToCode 2026",
            "Il security engineer che già AI",
            "Pignola, Italy"
          ),
          upcoming: false,
        },
      ]}
      spokenAt={["GoLab", "KCD Italy", "WeAreDevelopers World Congress"]}
      communities={communities}
      talkCount={32}
    />
  ),
};

export const Newsletter: Story = {
  render: () => <NewsletterSection />,
};
