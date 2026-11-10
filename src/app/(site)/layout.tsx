import { Footer } from "../../components/layout";
import { MAIN_CONTENT_ID, SiteShell } from "../../components/layout/SiteShell";
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
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
    </SiteShell>
  );
}
