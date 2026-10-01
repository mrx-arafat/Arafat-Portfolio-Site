import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";

import skillsData from "@/data/skills.json";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

const PAGE_URL = absoluteUrl("/skills");

// Counts come from data/skills.json, the same source the page renders.
const totalSkills = skillsData.skills.length;
const totalCategories = skillsData.categories.length;

export const metadata: Metadata = pageMetadata({
  title: "Skills: Security, Cloud, AI and Automation",
  description: `${totalSkills} skills across ${totalCategories} categories, from application security and cloud infrastructure to AI agents, automation and testing, mapped to the work they support.`,
  path: "/skills",
  ogCard: {
    category: "skills",
    meta: `${totalSkills} skills / ${totalCategories} categories`,
    prompt: "ls skills/ --by-category",
  },
});

const structuredData = {
  "@context": "https://schema.org",
  "@id": `${PAGE_URL}/#breadcrumb`,
  ...breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Skills", path: "/skills" },
  ]),
};

export default function SkillsLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <>
      <JsonLd data={structuredData} />
      {children}
    </>
  );
}
