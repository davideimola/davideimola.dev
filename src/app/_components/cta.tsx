"use client";

import Link from "next/link";
import { type ReactNode } from "react";

interface CTAProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly variant?: "primary" | "secondary";
  readonly external?: boolean;
  readonly className?: string;
}

export function CTA({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: CTAProps) {
  const baseClasses = "text-sm font-semibold transition-colors";

  const variantClasses = {
    primary:
      "rounded-md bg-[#C91F37] px-6 py-3 text-white shadow-sm hover:bg-[#D3381C]",
    secondary: "text-[#d4cfc9] hover:text-[#C91F37]",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (external) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
      >
        {children} <span aria-hidden="true">→</span>
      </Link>
    );
  }

  return (
    <Link href={href} className={combinedClasses}>
      {children}
    </Link>
  );
}
