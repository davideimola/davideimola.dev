// Shared design tokens for the newsletter email components. Email is a SEPARATE, light
// design language from the (dark) site: no hover, no motion, custom fonts get stripped
// (mono falls back to system mono, sans to system sans), images are often blocked. These
// values echo the brand's light-surface lockup and match the Kit wrapper template
// (docs/newsletter/kit-email-template.html). Keep in sync with the inline palette in
// emails/newsletter-issue.tsx.
export const emailColors = {
  border: "#E1DBD3",
  // Light-surface equivalent of the site's --border-mid: a touch darker than `border`,
  // used for the ghost button outline so it reads as clickable on the #EDE8E1 wrapper.
  borderMid: "#CDC5B9",
  text1: "#1A1816",
  text2: "#48423C",
  text3: "#6E6862",
  accent: "#C91F37",
} as const;

export const emailFonts = {
  mono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  sans: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const;
