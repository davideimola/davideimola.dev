"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "About", href: "/about" },
  {
    name: "Work",
    href: "#",
    hasDropdown: true,
    items: [
      { name: "Projects", href: "/projects" },
      { name: "Experience", href: "/experience" },
      { name: "Uses", href: "/uses" },
    ],
  },
  { name: "Blog", href: "/blog" },
  { name: "Speaking", href: "/speaking" },
  { name: "Contact", href: "/contact" },
];

// Mobile work accordion component
function MobileWorkAccordion({
  item,
  isWorkActive,
  pathname,
  onClose,
}: Readonly<{
  item: (typeof navigation)[1];
  isWorkActive: boolean;
  pathname: string;
  onClose: () => void;
}>) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.hasDropdown || !item.items) return null;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium transition-all duration-300 ${
          isWorkActive
            ? "bg-gray-800 text-[#C91F37]"
            : "text-gray-300 hover:bg-gray-800 hover:text-[#C91F37]"
        }`}
      >
        {item.name}
        <svg
          className={`h-5 w-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-1 ml-4 space-y-1">
          {item.items.map((subItem) => (
            <Link
              key={subItem.name}
              href={subItem.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ${
                pathname === subItem.href
                  ? "bg-gray-800 text-[#C91F37]"
                  : "text-gray-400 hover:bg-gray-800 hover:text-[#C91F37]"
              }`}
              onClick={onClose}
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workDropdownOpen, setWorkDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Check if current page is in Work section
  const isWorkActive =
    pathname === "/projects" ||
    pathname === "/experience" ||
    pathname === "/uses";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0A0A0A]/95 backdrop-blur-sm transition-all duration-300">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="group flex items-center gap-2 text-xl font-bold text-gray-100 transition-colors hover:text-[#C91F37]"
            >
              <span className="font-playfair">Davide Imola</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden space-x-8 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              // Handle dropdown items
              if (item.hasDropdown && item.items) {
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setWorkDropdownOpen(true)}
                    onMouseLeave={() => setWorkDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all duration-300 ${
                        isWorkActive
                          ? "border-b-2 border-[#C91F37] text-[#C91F37]"
                          : "text-gray-300 hover:translate-y-[-1px] hover:text-[#C91F37]"
                      }`}
                    >
                      {item.name}
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${
                          workDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </button>

                    {/* Dropdown menu - gap removed with pt-2 on parent div */}
                    {workDropdownOpen && (
                      <div className="absolute top-full left-0 pt-2">
                        <div className="w-48 rounded-lg border border-gray-800 bg-[#0A0A0A] py-2 shadow-xl">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                pathname === subItem.href
                                  ? "bg-gray-800 text-[#C91F37]"
                                  : "text-gray-300 hover:bg-gray-800 hover:text-[#C91F37]"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Regular links
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "border-b-2 border-[#C91F37] text-[#C91F37]"
                      : "text-gray-300 hover:translate-y-[-1px] hover:text-[#C91F37]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 border-t border-gray-800 bg-[#0A0A0A] px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;

                // Handle dropdown items
                if (item.hasDropdown && item.items) {
                  return (
                    <MobileWorkAccordion
                      key={item.name}
                      item={item}
                      isWorkActive={isWorkActive}
                      pathname={pathname}
                      onClose={() => setMobileMenuOpen(false)}
                    />
                  );
                }

                // Regular links
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block rounded-md px-3 py-2 text-base font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-gray-800 text-[#C91F37]"
                        : "text-gray-300 hover:translate-x-1 hover:bg-gray-800 hover:text-[#C91F37]"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
