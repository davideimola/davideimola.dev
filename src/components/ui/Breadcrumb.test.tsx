import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("renders linked items as anchors", () => {
    render(
      <Breadcrumb items={[{ label: "Newsletter", href: "/newsletter" }, { label: "July" }]} />
    );
    const link = screen.getByRole("link", { name: "Newsletter" });
    expect(link).toHaveAttribute("href", "/newsletter");
  });

  it("renders the last item as the current page, not a link", () => {
    render(
      <Breadcrumb items={[{ label: "Newsletter", href: "/newsletter" }, { label: "July" }]} />
    );
    expect(screen.queryByRole("link", { name: "July" })).toBeNull();
    expect(screen.getByText("July")).toHaveAttribute("aria-current", "page");
  });

  it("has accessible nav landmark with label", () => {
    render(<Breadcrumb items={[{ label: "Newsletter", href: "/newsletter" }]} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("draws no terminal prompt", () => {
    const { container } = render(<Breadcrumb items={[{ label: "Blog", href: "/blog" }]} />);
    expect(container.textContent).not.toContain("❯");
  });
});
