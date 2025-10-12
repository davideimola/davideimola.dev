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
    default: "bg-gray-800 text-gray-400 ring-gray-700",
    accent: "bg-[#C91F37]/10 text-[#C91F37] ring-[#C91F37]/20",
    success: "bg-green-500/10 text-green-400 ring-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
    muted: "bg-gray-700/50 text-gray-300 ring-gray-600",
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return <span className={combinedClasses}>{children}</span>;
}
