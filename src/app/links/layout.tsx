import { MotionConfig } from "motion/react";
import { ThemeToggle } from "../../components/ui/ThemeToggle";

// Standalone layout: no NavBar/Footer, so the link-in-bio stays one short
// column on a phone. The page draws its own header with the mark and the
// wordmark; the theme toggle sits in the corner. MotionConfig is provided
// here because this route lives outside the (site) group and its SiteShell.
export default function LinksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MotionConfig reducedMotion="user">
      <div data-print-hide="" className="fixed top-3 right-3 z-10">
        <ThemeToggle />
      </div>
      <main className="flex-1 flex flex-col">{children}</main>
    </MotionConfig>
  );
}
