import type { Meta, StoryObj } from "@storybook/react";
import { NavBar } from "../components/layout/NavBar";

const meta: Meta<typeof NavBar> = {
  title: "Layout/NavBar",
  component: NavBar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Default: Story = {
  args: {
    onSearchOpen: () => alert("⌘K pressed — command palette would open"),
  },
};

export const WithPageContent: Story = {
  render: () => (
    <div className="bg-bg min-h-[200px]">
      <NavBar onSearchOpen={() => {}} />
      <div className="pt-20 px-8 font-sans text-fg-muted text-[13px]">
        Page content below the fixed navbar…
      </div>
    </div>
  ),
};
