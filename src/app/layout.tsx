import "~/styles/globals.css";
import "~/styles/prism-theme.css";
import "~/styles/japanese-patterns.css";
import "~/styles/animations.css";

import { type Metadata } from "next";
import { Geist, Noto_Sans_JP, Playfair_Display } from "next/font/google";

import {
  PersonStructuredData,
  WebsiteStructuredData,
} from "~/app/_components/structured-data";
import { Analytics } from "~/app/_components/analytics";
import { ScrollProgress } from "~/app/_components/scroll-progress";

export const metadata: Metadata = {
  title: "Davide Imola - Software Engineer & Tech Speaker",
  description:
    "Personal website of Davide Imola, Software Engineer, conference organizer, and tech speaker. Explore my projects, experiences, and technical insights.",
  keywords:
    "Davide Imola, Software Engineer, Developer, Tech Speaker, Conference Organizer, Full Stack Developer",
  authors: [{ name: "Davide Imola" }],
  creator: "Davide Imola",
  openGraph: {
    title: "Davide Imola - Software Engineer & Tech Speaker",
    description:
      "Personal website of Davide Imola, Software Engineer, conference organizer, and tech speaker.",
    url: "https://davideimola.dev",
    siteName: "Davide Imola",
    type: "website",
    images: [
      {
        url: "https://davideimola.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Davide Imola - Software Engineer & Tech Speaker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Davide Imola - Software Engineer & Tech Speaker",
    description:
      "Personal website of Davide Imola, Software Engineer, conference organizer, and tech speaker.",
    images: ["https://davideimola.dev/og-image.png"],
  },
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "icon", url: "/favicon.png", type: "image/png" },
    { rel: "icon", url: "/favicon.ico" },
  ],
  alternates: {
    types: {
      "application/rss+xml": [
        {
          url: "/rss.xml",
          title: "Davide Imola - Technical Blog RSS Feed",
        },
      ],
    },
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${notoSansJP.variable} ${playfair.variable} scroll-smooth font-sans`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="icon" type="image/png" href="/favicon.png?v=2" />
        <link rel="icon" href="/favicon.ico?v=2" />
        <PersonStructuredData />
        <WebsiteStructuredData />
      </head>
      <body className="bg-[#0A0A0A] text-gray-100 antialiased">
        <ScrollProgress />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
