import type { Meta, StoryObj } from "@storybook/react";
import { LinkTile } from "../components/ui/LinkTile";

const meta: Meta<typeof LinkTile> = {
  title: "UI/LinkTile",
  component: LinkTile,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LinkTile>;

export const External: Story = {
  render: () => (
    <div className="w-[340px] sm:w-[480px]">
      <LinkTile label="GitHub" hint="@davideimola" href="https://github.com/davideimola" />
    </div>
  ),
};

export const Internal: Story = {
  render: () => (
    <div className="w-[340px] sm:w-[480px]">
      <LinkTile label="Blog" hint="articles & notes" href="/blog" />
    </div>
  ),
};

export const WithoutHint: Story = {
  render: () => (
    <div className="w-[340px] sm:w-[480px]">
      <LinkTile label="Contact" href="/contact" />
    </div>
  ),
};

export const Stacked: Story = {
  render: () => (
    <div className="w-[340px] sm:w-[480px] flex flex-col gap-3">
      <LinkTile
        label="LinkedIn"
        hint="in/davideimola"
        href="https://www.linkedin.com/in/davideimola/"
      />
      <LinkTile label="GitHub" hint="@davideimola" href="https://github.com/davideimola" />
      <LinkTile label="Book a call" hint="cal.com/davideimola" href="https://cal.com/davideimola" />
      <LinkTile label="Blog" hint="articles & notes" href="/blog" />
    </div>
  ),
};
