import tokens from "@davideimola/brand/tokens.json";
import { describe, expect, it } from "vitest";
import { giscusThemeCss } from "./giscus-theme";

describe("giscusThemeCss", () => {
  it("takes every colour from the brand tokens of its mode", () => {
    const light = giscusThemeCss("light");
    const dark = giscusThemeCss("dark");
    expect(light).toContain(`--di-bg: ${tokens.color.light.bg};`);
    expect(light).toContain(`--di-rule: ${tokens.color.light.rule};`);
    expect(dark).toContain(`--di-bg: ${tokens.color.dark.bg};`);
    expect(dark).toContain(`--di-fg: ${tokens.color.dark.fg};`);
  });

  it("loads the brand fonts first, since the iframe cannot see the site's", () => {
    expect(giscusThemeCss("light").startsWith('@import url("https://fonts.googleapis.com/')).toBe(
      true
    );
  });

  it("keeps red off the controls: the accent is ink", () => {
    expect(giscusThemeCss("light")).toContain("--color-accent-fg: var(--di-fg);");
  });
});
