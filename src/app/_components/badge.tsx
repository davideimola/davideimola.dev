"use client";

import { type ReactNode } from "react";

interface BadgeProps {
  readonly children: ReactNode;
  readonly variant?: "default" | "accent" | "success" | "warning" | "muted";
  readonly size?: "sm" | "md";
  readonly className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center rounded-full font-medium ring-1";

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-xs",
  };

  const variantClasses = {
    default: "bg-[#2A2725] text-[#a39e98] ring-[#3E3B38]",
    accent: "bg-[#C91F37]/15 text-[#E6E4E0] ring-[#C91F37]/40",
    success: "bg-green-500/15 text-[#E6E4E0] ring-green-500/40",
    warning: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
    muted: "bg-[#3e3b38]/50 text-[#d4cfc9] ring-gray-600",
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return <span className={combinedClasses}>{children}</span>;
}
