import { isValidElement, type ReactElement, type ReactNode } from "react";
import { CopyButton } from "./CopyButton";

interface CodeProps {
  className?: string;
  children?: ReactNode;
  "data-title"?: string;
}

interface CodeBlockProps {
  children?: ReactElement<CodeProps>;
}

function extractLanguage(className?: string): string {
  if (!className) return "text";
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : "text";
}

/**
 * The plain text of a code element. rehype-prism-plus wraps every line in a
 * `<span class="code-line">` (and tokens in further spans), so the children are
 * a tree, not a string: walk it.
 */
function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return extractText(node.props.children);
  return "";
}

const PROMPT = "$ ";

/**
 * A ```console fence: a shell session where lines starting with `$ ` are
 * commands and everything else is their output. Rendered as a session (a muted
 * `$` before each command, output in a quieter ink) rather than as code, and the copy button copies the commands only.
 */
function TerminalBlock({ text, title }: { text: string; title?: string }) {
  const lines = text.replace(/\n$/, "").split("\n");
  const commands = lines
    .filter((line) => line.startsWith(PROMPT))
    .map((line) => line.slice(PROMPT.length))
    .join("\n");

  return (
    <div className="my-6 border border-border overflow-hidden">
      <div className="flex items-center gap-3 bg-surface border-b border-border px-5 py-2.5">
        <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-fg-subtle">
          {title ?? "terminal"}
        </span>
        {commands && <CopyButton code={commands} label="commands" />}
      </div>
      <pre className="m-0 overflow-x-auto px-5 py-4 bg-surface text-[14px] leading-[1.6] border-0">
        <code>
          {lines.map((line, i) => {
            const key = `${i}-${line}`;
            if (!line.startsWith(PROMPT)) {
              return (
                <span key={key} className="block text-fg-muted">
                  {line || " "}
                </span>
              );
            }
            return (
              <span key={key} className="block text-fg">
                <span aria-hidden="true" className="text-fg-subtle select-none">
                  ${" "}
                </span>
                {line.slice(PROMPT.length)}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

export function CodeBlock({ children }: CodeBlockProps) {
  const language = extractLanguage(children?.props?.className);
  const code = extractText(children?.props?.children);

  if (language === "console") {
    return <TerminalBlock text={code} title={children?.props?.["data-title"]} />;
  }

  return (
    <div className="my-6 border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-surface border-b border-border px-5 py-2.5">
        <span className="font-mono text-[12px] text-fg-subtle">{language}</span>
        <CopyButton code={code} />
      </div>
      {/* Code */}
      <pre className="m-0 overflow-x-auto px-5 py-4 bg-surface text-[14px] leading-[1.6] border-0">
        {children}
      </pre>
    </div>
  );
}
