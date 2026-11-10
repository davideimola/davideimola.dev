import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/blog",
  useRouter: () => ({ push: vi.fn() }),
}));

import { MAIN_CONTENT_ID, SiteShell } from "./SiteShell";

describe("SiteShell", () => {
  it("opens with a skip link to the page's main content, ahead of the NavBar", () => {
    render(
      <SiteShell items={[]}>
        <main id={MAIN_CONTENT_ID}>Page</main>
      </SiteShell>
    );

    const skip = screen.getByRole("link", { name: "Skip to content" });
    expect(skip).toHaveAttribute("href", `#${MAIN_CONTENT_ID}`);
    // First in document order, so it is the first thing Tab reaches.
    expect(document.body.querySelector("a")).toBe(skip);
    expect(document.getElementById(MAIN_CONTENT_ID)).not.toBeNull();
  });
});
