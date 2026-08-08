import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { UmamiAnalytics } from "@/components/analytics/UmamiAnalytics";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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
    <html lang="en" className={`${jetbrainsMono.variable} ${ibmPlexSans.variable} h-full`}>
      {/* `print:light-ground` flips the design tokens for paper. It has to sit on
          <body> rather than on <html>; the print palette in globals.css says
          why. */}
      <body className="min-h-full flex flex-col antialiased print:light-ground">
        {children}
        <UmamiAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
