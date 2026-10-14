import type { Meta, StoryObj } from "@storybook/react";
import { Tape } from "../components/ui/Tape";

const meta: Meta<typeof Tape> = {
  title: "UI/Tape",
  component: Tape,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    tilt: { control: "select", options: [0, 1, 2] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tape>;

export const Default: Story = {
  args: { children: "Writing", tilt: 0, size: "md" },
};

/** Neighbouring tapes cycle through the tilts so they never all lean one way. */
export const TiltCycle: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-4">
      <Tape tilt={0}>Writing</Tape>
      <Tape tilt={1}>Building</Tape>
      <Tape tilt={2}>Next talk</Tape>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6 p-4">
      <Tape size="sm">Essay</Tape>
      <Tape size="md" tilt={1}>
        Built by me
      </Tape>
      <Tape size="lg" tilt={2}>
        That&apos;s me, mid-talk
      </Tape>
    </div>
  ),
};
