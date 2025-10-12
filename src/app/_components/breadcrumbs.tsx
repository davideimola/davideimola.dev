"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      {/* Home */}
      <Link
        href="/"
        className="flex items-center text-gray-500 transition-colors hover:text-[#C91F37]"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {/* Breadcrumb items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-gray-600" aria-hidden="true" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-500 transition-colors hover:text-[#C91F37]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`${
                  isLast
                    ? "font-medium text-gray-300"
                    : "text-gray-500"
                }`}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

