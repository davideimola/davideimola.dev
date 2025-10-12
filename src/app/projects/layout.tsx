import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Davide Imola",
  description:
    "Explore Davide Imola's projects including OSDay conference, Schrodinger Hat community, and open-source contributions.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
