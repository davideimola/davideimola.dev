import "~/styles/globals.css";
import "~/styles/prism-theme.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import {
  PersonStructuredData,
  WebsiteStructuredData,
} from "~/app/_components/structured-data";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Davide Imola - Software Engineer & Tech Speaker",
    description:
      "Personal website of Davide Imola, Software Engineer, conference organizer, and tech speaker.",
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} font-sans`}>
      <head>
        <PersonStructuredData />
        <WebsiteStructuredData />
      </head>
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}
