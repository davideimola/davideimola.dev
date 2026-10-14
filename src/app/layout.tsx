import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";
import { UmamiAnalytics } from "@/components/analytics/UmamiAnalytics";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

// The brand's three families (docs/brand.md, "Typography"). The variables are
// wired into the brand's `--di-font-family-*` tokens in globals.css.
const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

// Tape labels only, always bold and uppercase.
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Davide Imola · Software Engineer & Speaker",
    template: "%s | Davide Imola",
  },
  description:
    "Tech Lead at RedCarbon, building AI agents for cybersecurity. Conference speaker on AI, security, and Go. Co-founder of Schrödinger Hat.",
  metadataBase: new URL("https://davideimola.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://davideimola.dev",
    siteName: "Davide Imola",
    images: [
      {
        url: "https://davideimola.dev/og?title=Davide+Imola",
        width: 1200,
        height: 630,
        alt: "Davide Imola · Software Engineer & Speaker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@davideimola",
    images: ["https://davideimola.dev/og?title=Davide+Imola"],
  },
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "https://davideimola.dev/rss.xml", title: "Davide Imola · Blog" },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: THEME_INIT_SCRIPT sets data-theme on <html>
    // before React hydrates, on purpose.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${schibstedGrotesk.variable} ${ibmPlexMono.variable} ${barlowCondensed.variable} h-full`}
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: a constant string from src/lib/theme.ts, no user input
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        {/* Without JavaScript the marker never hears it scrolled into view:
            show it drawn instead of leaving the page without its one red gesture. */}
        <noscript
          // biome-ignore lint/security/noDangerouslySetInnerHtml: a constant style rule, no user input
          dangerouslySetInnerHTML={{ __html: "<style>.marker-stroke{stroke-dashoffset:0}</style>" }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <UmamiAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
