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
            ? "bg-[#2A2725] text-[#C91F37]"
            : "text-[#d4cfc9] hover:bg-[#2A2725] hover:text-[#C91F37]"
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
                  ? "bg-[#2A2725] text-[#C91F37]"
                  : "text-[#a39e98] hover:bg-[#2A2725] hover:text-[#C91F37]"
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
    <header className="sticky top-0 z-50 border-b border-[#2A2725] bg-[#0D0D0D]/95 backdrop-blur-sm transition-all duration-300">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="group flex items-center gap-3 text-xl font-bold text-gray-100 transition-colors hover:text-[#C91F37]"
            >
              <div className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-105">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 323 323"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                >
                  <g transform="matrix(1,0,0,1,-684.632281,-1763.290055)">
                    <g transform="matrix(1,0,0,1,665,1743)">
                      <path
                        d="M253.825,212.5C253.856,252.774 251.255,269.219 267.821,281.032C282.441,291.457 304.964,283.81 301.413,288.458C300.531,289.612 281.867,308.824 264.254,319.087C256.751,323.46 235.553,336.522 202.458,341.174C199.163,341.637 197.702,341.803 198.28,338.467C199.061,333.956 200.027,326.66 203.574,325.81C221.899,321.419 234.927,320.202 264.578,300.605C270.566,296.648 258.068,297.132 247.807,282.263C243.895,276.593 243.138,291.692 222.404,299.237C214.716,302.035 189.191,301.6 183.833,332.556C183.449,334.775 183.983,342.356 179.498,342.43C108.725,343.599 59.197,289.357 59.9,287.532C61.132,284.335 114.667,290.922 139.374,283.099C235.833,252.554 229.125,93.454 126.446,76.872C117.817,75.478 68.689,75.818 61.527,76.206C59.994,76.289 59.284,75.198 60.729,73.675C68.633,65.341 104.115,26.101 167.517,20.719C181.18,19.559 181.748,20.838 182.369,23.529C184.168,31.336 184.42,55.398 212.574,61.114C245.988,67.897 242.566,86.712 247.356,81.37C254.511,73.389 253.536,72.31 262.792,66.985C265.858,65.221 268.21,64.713 265.358,62.683C231.54,38.609 202.116,38.727 200.885,35.335C195.967,21.776 199.398,21.344 200.502,21.46C261.164,27.833 301.985,73.025 301.583,75.541C301.269,77.503 262.915,68.402 254.883,101.59C254.16,104.577 253.779,104.517 253.825,212.5ZM99.986,59.737C100.617,60.284 100.076,60.549 100.668,61.062C100.721,61.109 100.784,61.163 101.554,61.097C172.471,54.974 215.772,109.624 221.793,162.464C233.262,263.11 155.823,308.788 102.521,301.777C95.553,300.86 107.802,307.502 108.748,308.068C133.013,322.595 166.412,327.97 168.437,326.409C170.156,325.084 175.161,293.801 208.575,286.885C240.089,280.363 238.483,260.486 238.44,233.5C238.244,110.037 239.281,106.029 236.514,98.495C226.737,71.871 206.702,80.491 189.783,68.1C172.115,55.161 169.396,38.492 169.084,37.644C167.671,33.795 142.765,39.682 126.636,45.843C116.204,49.828 100.216,59.524 99.986,59.737Z"
                        fill="currentColor"
                      />
                      <path
                        d="M191.747,193.528C190.705,200.327 187.291,243.685 145.367,264.216C130.022,271.73 118.233,271.776 79.5,271.519C75.878,271.495 76.613,269.536 76.613,244.5C76.618,92.658 76.535,92.221 77.607,91.756C78.238,91.482 116.663,91.289 121.449,91.952C163.315,97.75 196.893,132.308 191.747,193.528ZM176.761,189.524C176.807,188.174 176.982,186.83 177.028,185.48C178.624,138.667 150.373,108.012 114.492,106.77C93.105,106.03 92.513,106.656 92.134,108.408C92.016,108.949 92.092,252.664 92.108,253.529C92.158,256.316 94.54,256.189 109.499,256.053C169.91,255.501 175.383,199.681 176.761,189.524Z"
                        fill="currentColor"
                      />
                      <path
                        d="M326.742,182.503C325.42,130.69 308.38,111.123 296.617,93.44C295.39,91.596 297.277,91.273 312.496,91.577C317.291,91.673 326.944,112.517 331.016,122.688C349.283,168.306 344.771,227.157 315.579,269.558C314.753,270.758 313.853,272.065 297.482,271.576C294.087,271.474 297.008,269.79 300.505,264.503C322.001,232.009 325.7,209.153 326.742,182.503Z"
                        fill="currentColor"
                      />
                      <path
                        d="M35.737,164.527C35.207,170.515 27.981,219.238 62.876,267.232C63.35,267.884 66.247,270.391 64.492,271.484C64.375,271.557 49.055,271.452 48.518,271.371C42.171,270.414 -2.032,195.61 32.984,116.712C44.112,91.636 47.097,91.616 49.502,91.6C61.41,91.518 66.252,90.971 64.645,93.572C58.402,103.68 42.718,118.572 35.737,164.527Z"
                        fill="currentColor"
                      />
                      <path
                        d="M284.818,153.5C284.848,176.264 284.834,269.125 284.787,269.559C284.422,272.901 269.23,270.411 269.19,252.501C269.163,240.98 268.876,114.951 269.3,108.49C270.311,93.099 284.609,90.232 284.784,93.431C285.046,98.229 284.844,98.213 284.818,153.5Z"
                        fill="currentColor"
                      />
                    </g>
                  </g>
                </svg>
              </div>
              <span className="font-playfair hidden sm:block">
                Davide Imola
              </span>
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
                          : "text-[#d4cfc9] hover:translate-y-[-1px] hover:text-[#C91F37]"
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
                        <div className="w-48 rounded-lg border border-[#2A2725] bg-[#0D0D0D] py-2 shadow-xl">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                pathname === subItem.href
                                  ? "bg-[#2A2725] text-[#C91F37]"
                                  : "text-[#d4cfc9] hover:bg-[#2A2725] hover:text-[#C91F37]"
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
                      : "text-[#d4cfc9] hover:translate-y-[-1px] hover:text-[#C91F37]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <button
              type="button"
              className="p-2 text-[#d4cfc9] transition-colors hover:text-[#C91F37]"
              onClick={() =>
                document.dispatchEvent(new CustomEvent("openCommandMenu"))
              }
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-[#a39e98] hover:bg-[#2A2725] hover:text-[#d4cfc9]"
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
            <div className="space-y-1 border-t border-[#2A2725] bg-[#0D0D0D] px-2 pt-2 pb-3 sm:px-3">
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
                        ? "bg-[#2A2725] text-[#C91F37]"
                        : "text-[#d4cfc9] hover:translate-x-1 hover:bg-[#2A2725] hover:text-[#C91F37]"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-[#d4cfc9] transition-all duration-300 hover:translate-x-1 hover:bg-[#2A2725] hover:text-[#C91F37]"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.dispatchEvent(new CustomEvent("openCommandMenu"));
                }}
              >
                Search
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
