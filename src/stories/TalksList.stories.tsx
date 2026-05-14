import type { Meta, StoryObj } from "@storybook/react";
import { TalksList } from "../components/sections/TalksList";
import type { Talk } from "../lib/content";

const meta: Meta<typeof TalksList> = {
  title: "Sections/TalksList",
  component: TalksList,
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
type Story = StoryObj<typeof TalksList>;

const mockTalks: Talk[] = [
  {
    slug: "go-concurrency-patterns-golab-2024",
    event: "GoLab",
    date: "2024-10-28",
    location: "Florence, Italy",
    type: "Conference",
    tags: ["Go", "Concurrency", "Backend"],
    session: {
      title: "Concurrency Patterns in Go You Should Know",
      format: "Talk",
      slides: "https://speakerdeck.com/davideimola/example",
      video: "https://youtube.com/watch?v=example",
    },
  },
  {
    slug: "gitops-security-kcd-2024",
    event: "KCD Italy",
    date: "2024-06-14",
    location: "Milan, Italy",
    type: "Conference",
    tags: ["GitOps", "Security", "Kubernetes"],
    session: {
      title: "GitOps Security: Protecting Your Supply Chain",
      format: "Talk",
      slides: "https://speakerdeck.com/davideimola/example2",
    },
  },
  {
    slug: "platform-engineering-panel-2023",
    event: "Incontro DevOps Italia",
    date: "2023-11-10",
    location: "Bologna, Italy",
    type: "Meetup",
    tags: ["Platform Engineering", "DevOps"],
    session: {
      title: "Platform Engineering: State of the Art",
      format: "Panel",
      coSpeaker: "Mario Rossi",
    },
  },
  {
    slug: "open-source-day-2023",
    event: "Open Source Day 2023",
    date: "2023-03-28",
    location: "Florence, Italy",
    type: "Conference",
    organizer: true,
    tags: ["Open Source", "Community"],
  },
];

export const Default: Story = {
  args: { talks: mockTalks },
  parameters: {
    nextjs: { navigation: { searchParams: {} } },
  },
};

export const FilteredByTag: Story = {
  args: { talks: mockTalks },
  parameters: {
    nextjs: { navigation: { searchParams: { tag: "go" } } },
  },
};

export const NoResults: Story = {
  args: { talks: mockTalks },
  parameters: {
    nextjs: { navigation: { searchParams: { tag: "rust" } } },
  },
};
