import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Read articles by Easin Arafat on cybersecurity, application security, penetration testing, DevSecOps, and web development.",
  alternates: {
    canonical: "https://www.arafatops.com/articles",
  },
  openGraph: {
    title: "Articles | Easin Arafat",
    description:
      "Read articles by Easin Arafat on cybersecurity, application security, penetration testing, and DevSecOps.",
    url: "https://www.arafatops.com/articles",
  },
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
