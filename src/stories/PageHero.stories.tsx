import type { Meta, StoryObj } from "@storybook/react";
import { PageHero } from "../components/ui/PageHero";

const meta: Meta<typeof PageHero> = {
  title: "UI/PageHero",
  component: PageHero,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHero>;

export const Default: Story = {
  args: {
    label: "Built by me",
    title: "Projects",
    description: "Open source tools, communities, and things I build in public.",
  },
};

export const WithLongDescription: Story = {
  args: {
    label: "Talks",
    title: "Speaking",
    description:
      "I speak about the engineering problems I face day to day: Go, platform engineering, GitOps, security, and building open source communities. I like talks that are concrete, honest about tradeoffs, and leave the audience with something they can apply the next day.",
  },
};

export const WithChildren: Story = {
  args: {
    label: "Now",
    title: "Now",
    description: "A snapshot of what I'm focused on right now, updated when something changes.",
    children: (
      <p className="font-mono text-meta text-fg-subtle mt-4">
        Last updated: <span className="text-fg-muted">March 2026</span>
        {" · "}
        <a href="/about" className="text-inherit hover:text-accent">
          what is this?
        </a>
      </p>
    ),
  },
};

export const About: Story = {
  args: {
    label: "About",
    title: "About",
    description:
      "Tech Lead, platform engineer, open source builder. I believe what you learn must be shared.",
  },
};
