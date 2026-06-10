import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Easin Arafat's personal dashboard - Application Security Engineer at Startise. View projects, blogs, skills, and get in touch.",
  alternates: {
    canonical: "https://www.arafatops.com/dashboard",
  },
  openGraph: {
    title: "Dashboard | Easin Arafat",
    description:
      "Easin Arafat's personal dashboard - Application Security Engineer at Startise.",
    url: "https://www.arafatops.com/dashboard",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
