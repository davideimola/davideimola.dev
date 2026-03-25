import type { Meta, StoryObj } from "@storybook/react";
import { PageHero } from "../components/ui/PageHero";

const meta: Meta<typeof PageHero> = {
  title: "UI/PageHero",
  component: PageHero,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHero>;

export const Default: Story = {
  args: {
    command: "ls ./projects",
    title: "Projects",
    description: "Open source tools, communities, and things I build in public.",
  },
};

export const WithLongDescription: Story = {
  args: {
    command: "ls ./speaking",
    title: "Speaking",
    description:
      "I speak about the engineering problems I face day to day — Go, platform engineering, GitOps, security, and building open source communities. I like talks that are concrete, honest about tradeoffs, and leave the audience with something they can apply the next day.",
  },
};

export const WithChildren: Story = {
  args: {
    command: "cat ./now.md",
    title: "Now",
    description: "A snapshot of what I'm focused on right now — updated when something changes.",
    children: (
      <p
        style={{
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#7E7874",
          marginTop: "16px",
        }}
      >
        Last updated: <span style={{ color: "#9A948E" }}>March 2026</span>
        {" · "}
        <a href="#" style={{ color: "inherit" }}>
          what is this?
        </a>
      </p>
    ),
  },
};

export const CatCommand: Story = {
  args: {
    command: "cat ./about.md",
    title: "About",
    description:
      "Tech Lead, platform engineer, open source builder. I believe what you learn must be shared.",
  },
};
