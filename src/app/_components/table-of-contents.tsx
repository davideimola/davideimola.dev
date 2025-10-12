"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = doc.querySelectorAll("h2, h3");

    const items: TOCItem[] = Array.from(headingElements).map(
      (heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        const text = heading.textContent ?? "";

        // Generate or use existing ID
        let id = heading.id;
        if (!id) {
          id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }

        return { id, text, level };
      },
    );

    setHeadings(items);

    // Add IDs to actual DOM headings with a small delay to ensure DOM is ready
    setTimeout(() => {
      const actualHeadings = document.querySelectorAll(
        ".blog-content h2, .blog-content h3",
      );
      actualHeadings.forEach((heading, index) => {
        if (items[index]) {
          heading.id = items[index].id;
        }
      });
    }, 100);
  }, [content]);

  useEffect(() => {
    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" },
    );

    const headingElements = document.querySelectorAll(
      ".blog-content h2, .blog-content h3",
    );
    headingElements.forEach((heading) => observer.observe(heading));

    return () => {
      headingElements.forEach((heading) => observer.unobserve(heading));
    };
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 hidden max-h-[calc(100vh-8rem)] lg:block">
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#C91F37]" />
          <h2 className="text-sm font-semibold tracking-wide text-gray-300 uppercase">
            Table of Contents
          </h2>
        </div>

        <ul className="scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600 max-h-[calc(100vh-16rem)] space-y-2 overflow-y-auto pr-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`block text-sm transition-colors ${
                  activeId === heading.id
                    ? "font-semibold text-[#C91F37]"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
