import type { Meta, StoryObj } from "@storybook/react";
import type { Talk } from "../lib/content";
import { TalksList } from "../components/sections/TalksList";

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
    title: "Concurrency Patterns in Go You Should Know",
    event: "GOLab",
    date: "2024-10-28",
    location: "Florence, Italy",
    type: "Conference",
    role: "Speaker",
    tags: ["Go", "Concurrency", "Backend"],
    slides: "https://speakerdeck.com/davideimola/example",
    video: "https://youtube.com/watch?v=example",
    coSpeaker: undefined,
  },
  {
    slug: "gitops-security-kcd-2024",
    title: "GitOps Security: Protecting Your Supply Chain",
    event: "KCD Italy",
    date: "2024-06-14",
    location: "Milan, Italy",
    type: "Conference",
    role: "Speaker",
    tags: ["GitOps", "Security", "Kubernetes"],
    slides: "https://speakerdeck.com/davideimola/example2",
    video: undefined,
    coSpeaker: undefined,
  },
  {
    slug: "platform-engineering-panel-2023",
    title: "Platform Engineering: State of the Art",
    event: "Incontro DevOps Italia",
    date: "2023-11-10",
    location: "Bologna, Italy",
    type: "Meetup",
    role: "Guest",
    tags: ["Platform Engineering", "DevOps"],
    slides: undefined,
    video: undefined,
    coSpeaker: "Mario Rossi",
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
