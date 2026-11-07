import type { Meta, StoryObj } from "@storybook/react";
import { SeriesParts } from "../components/ui/SeriesParts";
import type { ResolvedSeries } from "../lib/series";

const series: ResolvedSeries = {
  slug: "four-boundaries",
  title: "Agent Security at the Four Boundaries",
  parts: [
    {
      number: 1,
      title: "Crypto-shredding Agent Sessions: Firestore TTL + One Cloud KMS Key per User",
      short: "Crypto-shredding agent sessions",
      date: "2026-12-03",
      slug: "crypto-shredding-agent-sessions",
    },
    {
      number: 2,
      title: "Assume the Injection Succeeds: Put the Control on the Egress",
      short: "Put the control on the egress",
      date: "2026-12-17",
      slug: "assume-the-injection-succeeds",
    },
    {
      number: 3,
      title: "One Agent, One Identity: Least Privilege for AI Agents on GKE",
      short: "One agent, one identity",
      date: "2027-01-14",
      slug: null,
    },
    {
      number: 4,
      title: "The Prompt Is Not a Control",
      short: "The Prompt Is Not a Control",
      date: "2027-01-28",
      slug: null,
    },
  ],
};

const meta: Meta<typeof SeriesParts> = {
  title: "UI/SeriesParts",
  component: SeriesParts,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-[240px]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SeriesParts>;

export const FirstPart: Story = { args: { series, current: 1 } };

export const MiddlePart: Story = { args: { series, current: 2 } };

export const WithoutLabel: Story = { args: { series, current: 2, label: false } };
