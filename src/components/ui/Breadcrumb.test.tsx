import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("renders the command and prompt", () => {
    render(
      <Breadcrumb command="cat" items={[{ label: "blog", href: "/blog" }, { label: "post.mdx" }]} />
    );
    expect(screen.getByText("❯")).toBeInTheDocument();
    expect(screen.getByText(/cat ~\//)).toBeInTheDocument();
  });

  it("renders linked items as anchors", () => {
    render(
      <Breadcrumb command="cat" items={[{ label: "blog", href: "/blog" }, { label: "post.mdx" }]} />
    );
    const link = screen.getByRole("link", { name: "blog" });
    expect(link).toHaveAttribute("href", "/blog");
  });

  it("renders the last item as plain text, not a link", () => {
    render(
      <Breadcrumb command="cat" items={[{ label: "blog", href: "/blog" }, { label: "post.mdx" }]} />
    );
    expect(screen.queryByRole("link", { name: "post.mdx" })).toBeNull();
    expect(screen.getByText("post.mdx")).toBeInTheDocument();
  });

  it("has accessible nav landmark with label", () => {
    render(<Breadcrumb command="cat" items={[{ label: "blog", href: "/blog" }]} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("defaults command to 'cat' when not provided", () => {
    render(<Breadcrumb items={[{ label: "blog", href: "/blog" }]} />);
    expect(screen.getByText(/cat ~\//)).toBeInTheDocument();
  });
});
