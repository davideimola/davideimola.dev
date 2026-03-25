"use client";

import { type ReactNode, useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ScrollReveal({ children, delay = 0, className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.remove("revealed");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const tryReveal = () => {
      if (el.classList.contains("revealed")) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("revealed");
      } else {
        observer.observe(el);
      }
    };

    // Immediate check for first render
    tryReveal();

    // Delayed check to handle Next.js scroll restoration on back/forward nav,
    // which happens asynchronously after the component mounts.
    const timer = setTimeout(tryReveal, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
