"use client";

import { IconArrowUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";

// The floating way back up on long pages: a 44px square framed in ink, the
// same shape as the NavBar's mobile menu button, filling with ink on hover
// like a ghost Button. An icon, not a mono "top" label.
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50 flex items-center justify-center w-11 h-11 border border-fg bg-bg text-fg hover:bg-fg hover:text-bg transition-colors duration-150 cursor-pointer"
    >
      <IconArrowUp size={20} stroke={1.75} aria-hidden="true" />
    </button>
  );
}
