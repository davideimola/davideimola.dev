"use client";

import { type ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

interface PageLayoutProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <>
      <Header />
      <main className={`bg-[#0A0A0A] ${className}`}>{children}</main>
      <Footer />
    </>
  );
}
