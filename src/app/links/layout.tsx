import { MotionConfig } from "motion/react";

// Standalone layout: no NavBar/Footer. MotionConfig is provided here because
// this route lives outside the (site) group and its SiteShell.
export default function LinksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MotionConfig reducedMotion="user">
      <main className="flex-1">{children}</main>
    </MotionConfig>
  );
}
