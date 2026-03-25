"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { ReactNode } from "react";

// Detect back/forward navigation before components mount.
// popstate fires synchronously before Next.js re-renders the page.
let _skipAnimation = false;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    _skipAnimation = true;
    setTimeout(() => {
      _skipAnimation = false;
    }, 2000);
  });
}

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ScrollReveal({ children, delay = 0, className = "" }: ScrollRevealProps) {
  // Captured once at mount — never changes for this instance's lifetime
  const [skip] = useState(() => _skipAnimation);

  if (skip) {
    // Back/forward navigation: render immediately visible, no animation
    return (
      <motion.div initial={false} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
