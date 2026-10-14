import type { Meta, StoryObj } from "@storybook/react";
import { HowIWorkSection } from "../components/sections/HowIWorkSection";
import { InPublicSection } from "../components/sections/InPublicSection";
import { NewsletterSection } from "../components/sections/NewsletterSection";
import { TopicsSection } from "../components/sections/TopicsSection";
import type { BlogPost } from "../lib/content";

const meta: Meta = {
  title: "Sections/Home",
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const post = (slug: string, title: string, date: string): BlogPost => ({
  slug,
  title,
  date,
  excerpt: "",
  category: "Technical",
  tags: [],
  readingTime: "5 min read",
  content: "",
});

export const HowIWork: Story = {
  render: () => (
    <HowIWorkSection
      quote="What you learn, you must share."
      gloss="Knowledge shared is not knowledge lost: it's knowledge multiplied."
      principles={[
        { title: "Decisions get written down.", body: "ADRs sit in the repo next to the code." },
        { title: "I publish what I learn.", body: "Including what did not work." },
        { title: "Then I go say it out loud.", body: "On stage and in workshops." },
      ]}
    />
  ),
};

export const ByTopic: Story = {
  render: () => (
    <TopicsSection
      groups={[
        {
          slug: "ai-security",
          label: "AI and security",
          posts: [
            post("argus", "Introducing Argus", "2026-07-30"),
            post("prompt", "Stop Prompting. Start Thinking.", "2026-04-17"),
          ],
        },
        {
          slug: "engineering",
          label: "Engineering and Go",
          posts: [post("tool", "I Built a Tool I Don't Use", "2026-07-08")],
        },
        {
          slug: "looking-back",
          label: "Looking back",
          posts: [post("retro", "2025 Retrospective", "2025-12-31")],
        },
      ]}
    />
  ),
};

export const InPublic: Story = {
  render: () => (
    <InPublicSection
      communities={[
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
      ]}
      spokenAt={["GoLab", "KCD Italy", "WeAreDevelopers World Congress"]}
    />
  ),
};

export const Newsletter: Story = {
  render: () => <NewsletterSection />,
};
