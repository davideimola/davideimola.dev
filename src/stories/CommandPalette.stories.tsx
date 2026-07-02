import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CommandPalette } from "../components/layout/CommandPalette";
import type { SearchItem } from "../lib/search";

const meta: Meta<typeof CommandPalette> = {
  title: "Layout/CommandPalette",
  component: CommandPalette,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
    // CommandPalette calls useRouter from next/navigation (App Router)
    nextjs: { appDirectory: true },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

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
    id: "page-projects",
    type: "page",
    title: "Projects",
    description: "Open source tools, communities, and side projects.",
    href: "/projects",
  },
  {
    id: "post-securing-secrets-in-the-gitops-era",
    type: "post",
    title: "Securing Secrets in the GitOps Era",
    description: "How to handle secrets safely in a GitOps workflow.",
    href: "/blog/securing-secrets-in-the-gitops-era",
    meta: "Technical",
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
  {
    id: "talk-secure-your-supply-chain",
    type: "talk",
    title: "Secure Your Software Supply Chain",
    description: "ComeToCode",
    href: "/sharing",
    meta: "2026",
  },
];

// Stateful wrapper so the palette can be closed (backdrop / esc) and reopened.
function CommandPaletteDemo({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-[13px] text-text-2 border border-border rounded-sm px-4 py-2 hover:text-text-1 hover:bg-bg-hover transition-colors duration-150"
      >
        Open command palette (⌘K)
      </button>
      <CommandPalette open={open} onClose={() => setOpen(false)} items={items} />
    </div>
  );
}

export const Open: Story = {
  render: () => <CommandPaletteDemo items={sampleItems} />,
};

// With no items, typing shows the empty state.
// Hidden feature: easter-egg commands like "whoami" or "hire me" still work.
export const EmptyIndex: Story = {
  render: () => <CommandPaletteDemo items={[]} />,
};
