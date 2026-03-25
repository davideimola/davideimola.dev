import type { ReactElement } from "react";
import { CopyButton } from "./CopyButton";

interface CodeProps {
  className?: string;
  children?: string;
}

interface CodeBlockProps {
  children?: ReactElement<CodeProps>;
}

function extractLanguage(className?: string): string {
  if (!className) return "text";
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : "text";
}

function extractCode(children?: ReactElement<CodeProps>): string {
  return children?.props?.children ?? "";
}

export function CodeBlock({ children }: CodeBlockProps) {
  const language = extractLanguage(children?.props?.className);
  const code = extractCode(children);

  return (
    <div className="my-6 rounded-sm border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-bg-card border-b border-border px-4 py-2">
        <span className="font-mono text-[10px] text-text-3 tracking-[0.06em]">{language}</span>
        <CopyButton code={typeof code === "string" ? code : ""} />
      </div>
      {/* Code */}
      <pre className="m-0 overflow-x-auto px-4 py-4 bg-bg-card text-[13px] leading-relaxed rounded-none border-0">
        {children}
      </pre>
    </div>
  );
}
