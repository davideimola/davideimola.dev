import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeader } from "../components/ui/SectionHeader";

const meta: Meta<typeof SectionHeader> = {
  title: "UI/SectionHeader",
  component: SectionHeader,
  parameters: {
    layout: "padded",
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

export const Subsection: Story = {
  args: {
    title: "2025",
    variant: "subsection",
  },
};

export const SubsectionWithLink: Story = {
  args: {
    title: "2024",
    variant: "subsection",
    seeAllHref: "#",
    seeAllLabel: "See all →",
  },
};

/** Neighbouring sections alternate the tape's tilt. */
export const AlternatingTilt: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <SectionHeader title="Latest writing" seeAllHref="/blog" seeAllLabel="All posts →" tilt={0} />
      <SectionHeader title="Talks" seeAllHref="/sharing" seeAllLabel="All talks →" tilt={1} />
      <SectionHeader
        title="Projects"
        seeAllHref="/projects"
        seeAllLabel="All projects →"
        tilt={2}
      />
    </div>
  ),
};
