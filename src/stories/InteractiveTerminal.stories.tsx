import type { Meta, StoryObj } from "@storybook/react";
import { InteractiveTerminal } from "../components/sections/InteractiveTerminal";
import type { TerminalData } from "../lib/terminal";

const MOCK_DATA: TerminalData = {
  posts: [
    {
      slug: "i-built-a-tool-i-dont-use",
      title: "I Built a Tool I Don't Use",
      date: "2026-07-08",
      category: "Personal",
    },
    {
      slug: "stop-prompting-start-thinking",
      title: "Stop Prompting. Start Thinking.",
      date: "2026-04-20",
      category: "Technical",
    },
    {
      slug: "ai-will-not-secure-your-codebase",
      title: "AI Will Not Secure Your Codebase",
      date: "2025-11-02",
      category: "Technical",
    },
  ],
  talks: [
    {
      event: "reactjsday 2026",
      title: "AI Won't Design Your System. You Have To.",
      date: "2026-11-19",
      location: "Verona, Italy",
      upcoming: true,
    },
    {
      event: "GoLab 2024",
      title: "Go + DDD",
      date: "2024-11-11",
      location: "Florence, Italy",
      upcoming: false,
    },
  ],
  projects: [
    {
      title: "Argus",
      description: "AI security review agent",
      status: "active",
      href: "https://github.com/argusappsec/argus",
    },
    {
      title: "Open Source Day",
      description: "Yearly open source conference in Florence",
      status: "active",
      href: "https://osday.dev",
    },
  ],
};

const meta: Meta<typeof InteractiveTerminal> = {
  title: "Sections/InteractiveTerminal",
  component: InteractiveTerminal,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
    nextjs: { appDirectory: true },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InteractiveTerminal>;

export const Default: Story = {
  args: {
    data: MOCK_DATA,
  },
};
