import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/blog/some-post" }));

import { isActiveLink, NAV_LINKS, NavBar } from "./NavBar";

describe("NAV_LINKS", () => {
  it("carries Writing, Built, Talks and About, in that order", () => {
    expect(NAV_LINKS.map((l) => [l.label, l.href])).toEqual([
      ["Writing", "/blog"],
      ["Built", "/projects"],
      ["Talks", "/sharing"],
      ["About", "/about"],
    ]);
  });
});

describe("isActiveLink", () => {
  it("matches the section and its children, not its prefixes", () => {
    expect(isActiveLink("/blog", "/blog")).toBe(true);
    expect(isActiveLink("/blog/post", "/blog")).toBe(true);
    expect(isActiveLink("/blogroll", "/blog")).toBe(false);
    expect(isActiveLink(null, "/blog")).toBe(false);
  });
});

describe("NavBar", () => {
  it("marks the current section with aria-current", () => {
    render(<NavBar />);
    expect(screen.getByRole("link", { name: "Writing" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  });
});
