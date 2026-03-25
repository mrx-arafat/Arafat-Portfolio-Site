import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Technical skills of Easin Arafat - Application Security, Penetration Testing, DevSecOps, Web Development, Cloud Security, AI/ML, and more.",
  alternates: {
    canonical: "https://profile.arafatops.com/skills",
  },
  openGraph: {
    title: "Skills | Easin Arafat",
    description:
      "Technical skills of Easin Arafat - Application Security, Penetration Testing, DevSecOps, Web Development, and more.",
    url: "https://profile.arafatops.com/skills",
  },
};

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
