import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { Footer, NavBar } from "../components/layout";
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
    default: "Davide Imola — Software Engineer & Speaker",
    template: "%s | Davide Imola",
  },
  description:
    "Tech Lead at RedCarbon. Software engineer focused on backend, infrastructure, and security. Conference speaker on DevOps, GitOps, and Go.",
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
        alt: "Davide Imola — Software Engineer & Speaker",
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
        { url: "https://davideimola.dev/rss.xml", title: "Davide Imola — Blog" },
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
      <body className="min-h-full flex flex-col antialiased">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
