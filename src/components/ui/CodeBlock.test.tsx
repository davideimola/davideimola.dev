import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./CodeBlock";

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  return writeText;
}

describe("CodeBlock", () => {
  it("copies the plain text of a highlighted block, not an empty string", () => {
    const writeText = mockClipboard();
    render(
      <CodeBlock>
        <code className="language-go">
          <span className="code-line">
            <span className="token keyword">package</span> main{"\n"}
          </span>
          <span className="code-line">func main() {"{}"}</span>
        </code>
      </CodeBlock>
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy copy" }));

    expect(writeText).toHaveBeenCalledWith("package main\nfunc main() {}");
  });

  describe("console fence", () => {
    const session = "$ go run .\nDelete returned no error.\n$ sqlite3 app.db 'select 1;'\n1\n";

    it("renders the fence title in the window bar", () => {
      render(
        <CodeBlock>
          <code className="language-console" data-title="~/blog-examples/adk">
            {session}
          </code>
        </CodeBlock>
      );

      expect(screen.getByText("~/blog-examples/adk")).toBeInTheDocument();
    });

    it("draws the $ prompt as decoration and keeps the output as its own lines", () => {
      const { container } = render(
        <CodeBlock>
          <code className="language-console">{session}</code>
        </CodeBlock>
      );

      // The prompt from the source is replaced by a muted, unselectable one that
      // screen readers skip, so selecting a line copies the command alone.
      const prompts = container.querySelectorAll('[aria-hidden="true"].select-none');
      expect(prompts).toHaveLength(2);
      for (const prompt of prompts) expect(prompt.textContent?.trim()).toBe("$");
      expect(screen.getByText("go run .")).toBeInTheDocument();
      expect(screen.getByText("Delete returned no error.")).toBeInTheDocument();
    });

    it("copies the commands only, without the output", () => {
      const writeText = mockClipboard();
      render(
        <CodeBlock>
          <code className="language-console">{session}</code>
        </CodeBlock>
      );

      fireEvent.click(screen.getByRole("button", { name: "Copy commands" }));

      expect(writeText).toHaveBeenCalledWith("go run .\nsqlite3 app.db 'select 1;'");
    });

    it("offers no copy button when the session holds output only", () => {
      render(
        <CodeBlock>
          <code className="language-console">{"just output\n"}</code>
        </CodeBlock>
      );

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });
});
