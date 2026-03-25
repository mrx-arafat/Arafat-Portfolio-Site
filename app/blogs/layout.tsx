import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read articles by Easin Arafat on cybersecurity, application security, penetration testing, DevSecOps, and web development.",
  alternates: {
    canonical: "https://profile.arafatops.com/blogs",
  },
  openGraph: {
    title: "Blog | Easin Arafat",
    description:
      "Read articles by Easin Arafat on cybersecurity, application security, penetration testing, and DevSecOps.",
    url: "https://profile.arafatops.com/blogs",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
