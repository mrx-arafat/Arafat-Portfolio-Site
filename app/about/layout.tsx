import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Easin Arafat",
  description:
    "About Easin Arafat - Application Security Engineer specializing in cybersecurity research, offensive security, web development, and automation.",
  alternates: {
    canonical: "https://profile.arafatops.com/about-me",
  },
  openGraph: {
    title: "About | Easin Arafat",
    description:
      "About Easin Arafat - Application Security Engineer specializing in cybersecurity, web development, and automation.",
    url: "https://profile.arafatops.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
