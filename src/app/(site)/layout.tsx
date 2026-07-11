import { Footer } from "../../components/layout";
import { SiteShell } from "../../components/layout/SiteShell";
import { buildSearchIndex } from "../../lib/search";

// Layout for the regular site: NavBar + ⌘K palette + Footer. Standalone
// routes (e.g. /links) live outside this group and render without chrome.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchItems = buildSearchIndex();

  return (
    <SiteShell items={searchItems}>
      <main className="flex-1">{children}</main>
      <Footer />
    </SiteShell>
  );
}
