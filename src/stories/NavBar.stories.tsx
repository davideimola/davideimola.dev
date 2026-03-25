import type { Meta, StoryObj } from "@storybook/react";
import { NavBar } from "../components/layout/NavBar";

const meta: Meta<typeof NavBar> = {
  title: "Layout/NavBar",
  component: NavBar,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
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
    <div style={{ background: "#080807", minHeight: "200px" }}>
      <NavBar onSearchOpen={() => {}} />
      <div style={{ paddingTop: "80px", paddingLeft: "32px", color: "#9A948E", fontSize: "13px" }}>
        Page content below the fixed navbar…
      </div>
    </div>
  ),
};
