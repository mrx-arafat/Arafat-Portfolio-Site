import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore projects by Easin Arafat - security tools, web applications, and open source contributions. Application Security Engineer at Startise.",
  alternates: {
    canonical: "https://profile.arafatops.com/projects",
  },
  openGraph: {
    title: "Projects | Easin Arafat",
    description:
      "Explore projects by Easin Arafat - security tools, web applications, and open source contributions.",
    url: "https://profile.arafatops.com/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
