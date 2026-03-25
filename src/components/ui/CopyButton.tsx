"use client";

import { useState } from "react";

interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="font-mono text-[10px] text-text-3 transition-colors duration-150 hover:text-text-2"
      aria-label="Copy code"
    >
      {copied ? "copied!" : "copy"}
    </button>
  );
}
