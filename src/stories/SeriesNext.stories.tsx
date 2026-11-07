import type { Meta, StoryObj } from "@storybook/react";
import { SeriesNext } from "../components/ui/SeriesNext";

const meta: Meta<typeof SeriesNext> = {
  title: "UI/SeriesNext",
  component: SeriesNext,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SeriesNext>;

export const Upcoming: Story = {
  args: {
    total: 4,
    next: {
      number: 2,
      title: "Assume the Injection Succeeds: Put the Control on the Egress",
      short: "Put the control on the egress",
      date: "2026-12-17",
      slug: null,
    },
  },
};

export const Published: Story = {
  args: {
    total: 4,
    next: {
      number: 2,
      title: "Assume the Injection Succeeds: Put the Control on the Egress",
      short: "Put the control on the egress",
      date: "2026-12-17",
      slug: "assume-the-injection-succeeds",
    },
  },
};
