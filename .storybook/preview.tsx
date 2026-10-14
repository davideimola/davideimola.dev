import type { Decorator, Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

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
    a11y: {
      test: "todo",
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
