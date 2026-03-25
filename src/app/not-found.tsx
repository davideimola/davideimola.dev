import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page not found",
  description: "This page does not exist.",
};

const SUGGESTIONS = [
  { label: "/blog", href: "/blog" },
  { label: "/about", href: "/about" },
  { label: "/speaking", href: "/speaking" },
  { label: "/now", href: "/now" },
];

export default function NotFound() {
  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20 min-h-[60vh] flex items-center">
      <div className="font-mono flex flex-col gap-6">
        {/* Command */}
        <p className="text-[13px] text-text-3">
          <span className="text-accent mr-2">❯</span>
          GET /this-page-does-not-exist
        </p>

        {/* Error block */}
        <div className="border border-border rounded-sm overflow-hidden">
          <div className="bg-bg-card border-b border-border px-4 py-2">
            <span className="text-[10px] text-text-3 tracking-widest uppercase">stderr</span>
          </div>
          <div className="px-4 py-5 flex flex-col gap-2">
            <p className="text-[14px]">
              <span className="text-accent">Error:</span>{" "}
              <span className="text-text-1">page not found</span>
            </p>
            <p className="text-[13px] text-text-3">
              code: <span className="text-text-2">404</span>
            </p>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-col gap-3">
          <p className="text-[12px] text-text-3 tracking-widest uppercase">
            suggestion: try one of these instead
          </p>
          <ul className="flex flex-col gap-2">
            {SUGGESTIONS.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  className="text-[13px] text-text-2 hover:text-accent transition-colors duration-150 flex items-center gap-2"
                >
                  <span className="text-accent">→</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Home link */}
        <p className="text-[12px] text-text-3">
          or go back to{" "}
          <a href="/" className="text-text-2 hover:text-accent transition-colors duration-150">
            ~/home
          </a>
        </p>
      </div>
    </div>
  );
}
