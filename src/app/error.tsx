"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20 min-h-[60vh] flex items-center">
      <div className="font-mono flex flex-col gap-6">
        {/* Command */}
        <p className="text-[13px] text-text-3">
          <span className="text-accent mr-2">❯</span>
          process exited with code 1
        </p>

        {/* Error block */}
        <div className="border border-border rounded-sm overflow-hidden">
          <div className="bg-bg-card border-b border-border px-4 py-2">
            <span className="text-[10px] text-text-3 tracking-widest uppercase">stderr</span>
          </div>
          <div className="px-4 py-5 flex flex-col gap-2">
            <p className="text-[14px]">
              <span className="text-accent">Error:</span>{" "}
              <span className="text-text-1">an unexpected error occurred</span>
            </p>
            {error.digest && (
              <p className="text-[13px] text-text-3">
                digest: <span className="text-text-2">{error.digest}</span>
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <p className="text-[12px] text-text-3 tracking-widest uppercase">recovery options</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={reset}
              className="text-[13px] text-text-2 hover:text-accent transition-colors duration-150 flex items-center gap-2 w-fit"
            >
              <span className="text-accent">→</span>
              try again
            </button>
            <a
              href="/"
              className="text-[13px] text-text-2 hover:text-accent transition-colors duration-150 flex items-center gap-2"
            >
              <span className="text-accent">→</span>
              ~/home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
