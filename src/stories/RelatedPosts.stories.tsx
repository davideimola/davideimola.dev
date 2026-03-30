import type { Meta, StoryObj } from "@storybook/react";
import { RelatedPosts } from "../components/ui/RelatedPosts";

const meta: Meta<typeof RelatedPosts> = {
  title: "UI/RelatedPosts",
  component: RelatedPosts,
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
type Story = StoryObj<typeof RelatedPosts>;

const mockPosts = [
  {
    slug: "securing-secrets-in-the-gitops-era",
    title: "Securing Secrets in the GitOps Era",
    excerpt: "How to handle secrets safely in a GitOps workflow.",
    category: "Security",
    tags: ["GitOps", "Security", "Kubernetes"],
    date: "2024-03-15",
    readingTime: "6 min read",
    content: "",
  },
  {
    slug: "ai-will-not-secure-your-codebase",
    title: "AI will not secure your codebase",
    excerpt: "Why AI tools are not a silver bullet for security.",
    category: "Security",
    tags: ["AI", "Security"],
    date: "2025-03-10",
    readingTime: "7 min read",
    content: "",
  },
  {
    slug: "level-up-your-rdbms-productivity-in-go",
    title: "Level up your RDBMS productivity in Go",
    excerpt: "Practical patterns for working with relational databases in Go.",
    category: "Engineering",
    tags: ["Go", "Database"],
    date: "2023-11-20",
    readingTime: "8 min read",
    content: "",
  },
];

export const ThreePosts: Story = {
  args: { posts: mockPosts },
};

export const TwoPosts: Story = {
  args: { posts: mockPosts.slice(0, 2) },
};

export const Empty: Story = {
  args: { posts: [] },
};
