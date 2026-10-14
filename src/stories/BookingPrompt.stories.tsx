import type { Meta, StoryObj } from "@storybook/react";
import { BookingPrompt } from "../components/ui/BookingPrompt";

const meta: Meta<typeof BookingPrompt> = {
  title: "UI/BookingPrompt",
  component: BookingPrompt,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BookingPrompt>;

// Shown when the calendar has no public dates (empty upcoming).
export const NoUpcoming: Story = {
  args: {
    message: "No public dates right now. Want me at your event?",
  },
};

// Shown when there are no engagements at all yet.
export const NoEngagements: Story = {
  args: {
    message: "I speak about Go, security & open source. Let's talk.",
  },
};
