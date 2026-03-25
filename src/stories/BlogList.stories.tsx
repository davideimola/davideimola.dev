import type { Meta, StoryObj } from "@storybook/react";
import { BlogList } from "../components/sections/BlogList";

const meta: Meta<typeof BlogList> = {
  title: "Sections/BlogList",
  component: BlogList,
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
type Story = StoryObj<typeof BlogList>;

const mockPosts = [
  {
    slug: "securing-secrets-in-the-gitops-era",
    title: "Securing Secrets in the GitOps Era",
    excerpt: "How to handle secrets safely in a GitOps workflow using Sealed Secrets and SOPS.",
    category: "Technical",
    tags: ["GitOps", "Kubernetes", "Security"],
    date: "2024-03-15",
    readingTime: "6 min read",
    featured: false,
    content: "",
  },
  {
    slug: "ai-will-not-secure-your-codebase",
    title: "AI will not secure your codebase",
    excerpt: "Why AI tools are not a silver bullet for security and what you should do instead.",
    category: "Technical",
    tags: ["AI", "Security", "Git"],
    date: "2025-03-10",
    readingTime: "7 min read",
    featured: true,
    content: "",
  },
  {
    slug: "2025-retrospective-2026-outlook",
    title: "2025 Retrospective & 2026 Outlook",
    excerpt: "Looking back at 2025 and what I want to focus on in 2026.",
    category: "Personal",
    tags: ["Retrospective", "Year Review", "Career"],
    date: "2025-12-31",
    readingTime: "8 min read",
    featured: true,
    content: "",
  },
];

export const Default: Story = {
  args: { posts: mockPosts },
};

export const FilteredByTag: Story = {
  args: { posts: mockPosts.slice(0, 2), activeTag: "security" },
};

export const FilteredByCategory: Story = {
  args: {
    posts: mockPosts.filter((p) => p.category === "Technical"),
    activeCategory: "Technical",
  },
};

export const NoResults: Story = {
  args: { posts: [], activeTag: "typescript" },
};
