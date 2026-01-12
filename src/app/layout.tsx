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
import { CommandMenu } from "~/app/_components/command-menu";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Davide Imola - Software Engineer & Tech Speaker",
  description:
    "Software Engineer from Verona building secure infrastructure at RedCarbon. Organizing Open Source Day in Florence and speaking about GitOps, Kubernetes, and cloud-native development.",
  keywords:
    "Davide Imola, Software Engineer, Verona, RedCarbon, GitOps, Kubernetes, Go, Platform Engineering, DevOps, Tech Speaker, Open Source Day",
  authors: [{ name: "Davide Imola" }],
  creator: "Davide Imola",
  openGraph: {
    title: "Davide Imola - Software Engineer & Tech Speaker",
    description:
      "Software Engineer from Verona. Building secure infrastructure with Kubernetes and Go. Organizing Open Source Day in Florence.",
    url: "https://davideimola.dev",
    siteName: "Davide Imola",
    type: "website",
    images: [
      {
        url: "/og?title=Davide%20Imola&subtitle=Software%20Engineer%20%26%20Tech%20Speaker",
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
      "Software Engineer from Verona. Building infrastructure with Kubernetes and Go. Speaking at conferences across Europe.",
    images: [
      "/og?title=Davide%20Imola&subtitle=Software%20Engineer%20%26%20Tech%20Speaker",
    ],
  },
  icons: [{ rel: "icon", url: "/favicon.svg?v=2", type: "image/svg+xml" }],
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
        <PersonStructuredData />
        <WebsiteStructuredData />
      </head>
      <body className="bg-[#0D0D0D] text-gray-100 antialiased">
        <ScrollProgress />
        <CommandMenu />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
