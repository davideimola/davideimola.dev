import type { ReactNode } from "react";

interface StdoutPanelProps {
  /** Content of the panel body. Provide your own padding wrapper. */
  children: ReactNode;
  /** Header label, uppercased in the title bar. Defaults to "stdout". */
  label?: string;
  className?: string;
}

/**
 * A bordered card with a terminal-style title bar, used for success/output states
 * (contact + subscribe forms, the newsletter confirmation page). Keeps the "stdout"
 * chrome in one place instead of repeated inline.
 */
export function StdoutPanel({ children, label = "stdout", className = "" }: StdoutPanelProps) {
  return (
    <div className={`border border-border rounded-sm overflow-hidden ${className}`}>
      <div className="bg-bg-card border-b border-border px-4 py-2">
        <span className="font-mono text-[10px] text-text-3 tracking-widest uppercase">{label}</span>
      </div>
      {children}
    </div>
  );
}
