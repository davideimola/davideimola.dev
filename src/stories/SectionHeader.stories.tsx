import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeader } from "../components/ui/SectionHeader";

const meta: Meta<typeof SectionHeader> = {
  title: "UI/SectionHeader",
  component: SectionHeader,
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
type Story = StoryObj<typeof SectionHeader>;

export const WithSeeAll: Story = {
  args: {
    title: "Projects",
    seeAllHref: "/projects",
    seeAllLabel: "All projects →",
  },
};

export const WithoutSeeAll: Story = {
  args: {
    title: "What I do",
  },
};

export const LatestWriting: Story = {
  args: {
    title: "Latest writing",
    seeAllHref: "/blog",
    seeAllLabel: "All posts →",
  },
};

export const RecentTalks: Story = {
  args: {
    title: "Recent talks",
    seeAllHref: "/speaking",
    seeAllLabel: "All talks →",
  },
};
