import type { Meta, StoryObj } from "@storybook/react";
import { PostNavigation } from "../components/ui/PostNavigation";

const meta: Meta<typeof PostNavigation> = {
  title: "UI/PostNavigation",
  component: PostNavigation,
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
type Story = StoryObj<typeof PostNavigation>;

const mockPost = (slug: string, title: string) => ({
  slug,
  title,
  excerpt: "",
  category: "Engineering",
  tags: ["Go"],
  date: "2025-01-01",
  readingTime: "5 min read",
  content: "",
});

export const BothDirections: Story = {
  args: {
    prev: mockPost("securing-secrets-in-the-gitops-era", "Securing Secrets in the GitOps Era"),
    next: mockPost("ai-will-not-secure-your-codebase", "AI will not secure your codebase"),
  },
};

export const OnlyPrev: Story = {
  args: {
    prev: mockPost("securing-secrets-in-the-gitops-era", "Securing Secrets in the GitOps Era"),
    next: null,
  },
};

export const OnlyNext: Story = {
  args: {
    prev: null,
    next: mockPost("ai-will-not-secure-your-codebase", "AI will not secure your codebase"),
  },
};
