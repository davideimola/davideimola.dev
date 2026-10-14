import type { ReactNode } from "react";

interface StdoutPanelProps {
  /** Content of the panel body. Provide your own padding wrapper. */
  children: ReactNode;
  /** Header label, uppercased in the title bar. Defaults to "stdout". */
  label?: string;
  className?: string;
}

/**
 * A block on the surface with a mono title bar (the same bar code blocks wear), used for success/output states
 * (contact + subscribe forms, the newsletter confirmation page). Keeps the "stdout"
 * chrome in one place instead of repeated inline.
 */
export function StdoutPanel({ children, label = "stdout", className = "" }: StdoutPanelProps) {
  return (
    <div className={`bg-surface border border-border ${className}`}>
      <div className="border-b border-border px-4 py-2.5">
        <span className="font-mono text-[12px] text-fg-subtle tracking-[0.06em] uppercase">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
