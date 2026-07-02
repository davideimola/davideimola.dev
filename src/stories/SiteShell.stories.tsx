import type { Meta, StoryObj } from "@storybook/react";
import { SiteShell } from "../components/layout/SiteShell";
import type { SearchItem } from "../lib/search";

const meta: Meta<typeof SiteShell> = {
  title: "Layout/SiteShell",
  component: SiteShell,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
    // SiteShell renders CommandPalette, which calls useRouter from next/navigation
    nextjs: { appDirectory: true },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SiteShell>;

const sampleItems: SearchItem[] = [
  { id: "page-home", type: "page", title: "Home", description: "davideimola.dev", href: "/" },
  {
    id: "page-blog",
    type: "page",
    title: "Blog",
    description: "Articles on engineering, security, and open source.",
    href: "/blog",
  },
  {
    id: "post-ai-will-not-secure-your-codebase",
    type: "post",
    title: "AI will not secure your codebase",
    description: "Why AI tools are not a silver bullet for security.",
    href: "/blog/ai-will-not-secure-your-codebase",
    meta: "Technical",
  },
  {
    id: "project-schrodinger-hat",
    type: "project",
    title: "Schrodinger Hat",
    description: "Open source community and events about software development.",
    href: "https://schroedinger-hat.org",
    meta: "Active",
  },
];

// SiteShell wires together NavBar, the ⌘K command palette, and the page content.
// Press ⌘K / Ctrl+K (or use the navbar search button) to open the palette.
export const Default: Story = {
  args: {
    items: sampleItems,
    children: (
      <main className="bg-bg min-h-screen pt-24 px-4 sm:px-8">
        <div className="max-w-[640px] mx-auto">
          <p className="font-mono text-[13px] text-accent mb-3">❯ whoami</p>
          <h1 className="font-mono text-[24px] text-text-1 mb-4">Page content goes here</h1>
          <p className="font-sans text-[14px] leading-relaxed text-text-2">
            This is the children slot of SiteShell. Press ⌘K (or Ctrl+K) to toggle the command
            palette, or click the search control in the navbar.
          </p>
        </div>
      </main>
    ),
  },
};
