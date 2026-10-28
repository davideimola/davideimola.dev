import { describe, expect, it } from "vitest";
import { OG_VERSION, ogImageUrl } from "./og-url";

describe("ogImageUrl", () => {
  it("spells spaces as %20, never as +", () => {
    const url = ogImageUrl({ title: "Davide Imola" });
    expect(url).toContain("title=Davide%20Imola");
    expect(url).not.toContain("+");
  });

  it("carries the cache version so a redrawn card gets a new URL", () => {
    expect(new URL(ogImageUrl({ title: "Now" })).searchParams.get("v")).toBe(OG_VERSION);
  });

  it("round-trips title, category and path through the query string", () => {
    const params = new URL(
      ogImageUrl({ title: "C++ & Go: a story", category: "Technical", path: "/blog" })
    ).searchParams;
    expect(params.get("title")).toBe("C++ & Go: a story");
    expect(params.get("category")).toBe("Technical");
    expect(params.get("path")).toBe("/blog");
  });

  it("leaves out the parameters it was not given", () => {
    const params = new URL(ogImageUrl({ title: "Davide Imola" })).searchParams;
    expect(params.has("category")).toBe(false);
    expect(params.has("path")).toBe(false);
  });
});
