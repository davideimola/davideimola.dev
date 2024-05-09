/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#212125",
        secondary: "#27272B",
        alternative: "#999",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
