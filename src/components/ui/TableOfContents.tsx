"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "../../lib/content";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-4">
        {"// "} on this page
      </p>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${item.id}`}
              className={`block font-mono text-[12px] no-underline leading-relaxed py-0.5 transition-colors duration-150 ${
                activeId === item.id ? "text-accent" : "text-text-3 hover:text-text-2"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
