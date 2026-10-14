"use client";

import { useState } from "react";

interface CopyButtonProps {
  code: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export function CopyButton({
  code,
  label = "copy",
  copiedLabel = "copied!",
  className = "",
}: CopyButtonProps) {
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
      className={`font-mono text-[12px] text-fg-subtle transition-colors duration-150 hover:text-fg-muted ${className}`}
      aria-label={`Copy ${label}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
