import tokens from "@davideimola/brand/tokens.json";

// Shared design tokens for the newsletter email components, read from the brand's light
// palette (ADR-0004) so the inbox never drifts from the site. Email is always light: a
// dark body does not survive mail clients (iCloud strips it and auto-inverts). No hover,
// no motion, and custom fonts are often stripped, so every stack falls back to a system
// face. The red rule holds here too: nothing is red at rest.
const light = tokens.color.light;

export const emailColors = {
  /** Paper: the page ground, set by the layout. */
  bg: light.bg,
  /** White: buttons' text on ink, chips. */
  surface: light.surface,
  /** Hairlines and rules. */
  border: light.border,
  /** Ink: titles, links, the primary button, tapes. */
  text1: light.fg,
  /** Long-form body text. */
  text2: light["fg-body"],
  /** Meta, captions, mono labels. */
  text3: light["fg-subtle"],
  /** Inline code ground. */
  inline: light["surface-inline"],
  /** Tape colours. */
  tapeBg: light["tape-bg"],
  tapeFg: light["tape-fg"],
} as const;

export const emailFonts = {
  sans: "'Schibsted Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  label: "'Barlow Condensed', 'Arial Narrow', sans-serif",
} as const;
