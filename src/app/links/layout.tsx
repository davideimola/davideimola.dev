import { MotionConfig } from "motion/react";
import { Mark, Wordmark } from "../../components/ui/BrandMark";
import { ThemeToggle } from "../../components/ui/ThemeToggle";

// Standalone layout: no NavBar/Footer, so the link-in-bio stays one short
// column on a phone. It still wears the brand: the S mark and the bold
// wordmark lead home, and the theme toggle is here too. MotionConfig is
// provided here because this route lives outside the (site) group and its
// SiteShell.
export default function LinksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MotionConfig reducedMotion="user">
      <header
        data-print-hide=""
        className="max-w-[520px] w-full mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between"
      >
        <a
          href="https://davideimola.dev"
          aria-label="davide imola, home"
          className="flex items-center gap-2.5 text-fg no-underline"
        >
          <Mark cut="s" size={28} />
          <Wordmark weight="bold" width={132} />
        </a>
        <ThemeToggle />
      </header>
      <main className="flex-1">{children}</main>
    </MotionConfig>
  );
}
