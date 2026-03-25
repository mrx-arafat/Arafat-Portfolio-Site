import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Easin Arafat - Application Security Engineer at Startise. Available for cybersecurity consulting, collaboration, and speaking engagements.",
  alternates: {
    canonical: "https://profile.arafatops.com/contact",
  },
  openGraph: {
    title: "Contact | Easin Arafat",
    description:
      "Get in touch with Easin Arafat - Application Security Engineer at Startise.",
    url: "https://profile.arafatops.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
