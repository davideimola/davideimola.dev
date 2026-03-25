import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/GiscusComments",
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
type Story = StoryObj;

// GiscusComments renders null when NEXT_PUBLIC_GISCUS_REPO_ID /
// NEXT_PUBLIC_GISCUS_CATEGORY_ID env vars are not set (as in Storybook).
// This story documents the configured state with a placeholder.
export const NotConfigured: Story = {
  render: () => (
    <div className="mt-16 pt-10 border-t border-border">
      <p className="font-mono text-[11px] text-text-3">
        // GiscusComments — renders when NEXT_PUBLIC_GISCUS_REPO_ID and
        NEXT_PUBLIC_GISCUS_CATEGORY_ID are set
      </p>
    </div>
  ),
};
