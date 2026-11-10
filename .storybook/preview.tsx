import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { MotionGlobalConfig } from "motion/react";
import "../src/app/globals.css";

// Under the test runner axe checks every story, and a story caught halfway
// through a ScrollReveal fade reads as low contrast. Tests see the end state;
// the Storybook UI keeps the motion.
if (import.meta.env.MODE === "test") {
  MotionGlobalConfig.skipAnimations = true;
}

// The brand tokens key the dark palette off data-theme on <html>, so the
// toolbar switch sets exactly what the site's ThemeToggle sets.
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  return Story();
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // The ground comes from the tokens (body background), not from Storybook.
    backgrounds: { disable: true },
    // Accessibility violations fail the story's test, so they fail CI.
    a11y: {
      test: "error",
    },
  },
  globalTypes: {
    theme: {
      description: "Brand theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light (paper)" },
          { value: "dark", title: "Dark (night)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [withTheme],
};

export default preview;
