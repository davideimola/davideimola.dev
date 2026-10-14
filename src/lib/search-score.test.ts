import { describe, expect, it } from "vitest";
import { searchScore } from "./search-score";

describe("searchScore", () => {
  it("drops a result whose words only contain the letters scattered", () => {
    expect(searchScore("go", "About", "Who I am, what I do, and how I got here.")).toBeGreaterThan(
      0
    );
    expect(searchScore("go", "Uses", "Hardware, software, and tools I use daily.")).toBe(0);
  });

  it("ranks a title hit above a description hit", () => {
    const title = searchScore("go", "Securing Go for Production");
    const description = searchScore("go", "About", "how I got here");
    expect(title).toBeGreaterThan(description);
  });

  it("puts a title that starts with the query first", () => {
    expect(searchScore("argus", "Argus", "AI security review")).toBe(1);
    expect(searchScore("argus", "Introducing Argus")).toBeLessThan(1);
  });

  it("needs every word of the query", () => {
    expect(searchScore("go secur", "Securing Go for Production", "supply chain")).toBeGreaterThan(
      0
    );
    expect(searchScore("go rust", "Securing Go for Production")).toBe(0);
  });

  it("lets an empty query through", () => {
    expect(searchScore("  ", "Anything")).toBe(1);
  });
});
