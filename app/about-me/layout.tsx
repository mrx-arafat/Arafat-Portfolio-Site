import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Easin Arafat",
  description:
    "Learn about Easin Arafat - Application Security Engineer at Startise working on xCloud. MIST graduate specializing in application security, DevSecOps, AI/ML, and production-grade security solutions.",
  alternates: {
    canonical: "https://profile.arafatops.com/about-me",
  },
  openGraph: {
    title: "About Easin Arafat | Application Security Engineer",
    description:
      "Learn about Easin Arafat - Application Security Engineer at Startise working on xCloud. MIST graduate specializing in application security, DevSecOps, and AI/ML.",
    url: "https://profile.arafatops.com/about-me",
  },
};

export default function AboutMeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
