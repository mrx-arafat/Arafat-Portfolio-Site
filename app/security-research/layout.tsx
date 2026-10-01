import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";

import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import cveData from "@/data/cve.json";
import { SITE_URL, absoluteUrl, pageMetadata } from "@/lib/seo";

const PAGE_URL = absoluteUrl("/security-research");

// Counts come from data/cve.json so the title, description and social card
// cannot drift from the archive the page renders.
const findings = cveData.items;
const totalFindings = findings.length;
const publishedCves = findings.filter(
  (item) => item.status === "published",
).length;

export const metadata: Metadata = pageMetadata({
  title: `Security Research: ${publishedCves} WordPress Plugin CVEs`,
  description: `${totalFindings} WordPress plugin vulnerabilities disclosed via Patchstack by Easin Arafat (${cveData.researcher.handle}), ${publishedCves} with published CVEs: access control, IDOR and data exposure.`,
  path: "/security-research",
  ogCard: {
    category: "security",
    meta: `${totalFindings} findings / ${publishedCves} published CVEs`,
    prompt: `ls disclosures/ --researcher ${cveData.researcher.handle}`,
  },
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${PAGE_URL}/#cve-collection`,
      url: PAGE_URL,
      name: "Security Research & CVEs by Easin Arafat",
      description: `Catalog of CVEs and security vulnerabilities discovered and responsibly disclosed by Easin Arafat (${cveData.researcher.handle}).`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${PAGE_URL}/#breadcrumb` },
      author: { "@id": `${SITE_URL}/#person` },
      about: { "@id": `${SITE_URL}/#person` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: totalFindings,
        itemListElement: findings.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${item.cve !== "Reserved" ? `${item.cve}: ` : ""}${item.software} ${item.affected} ${item.type}`,
          // Reserved entries have no advisory yet and all point at the
          // researcher profile; list URLs must be unique, so they carry none.
          ...(item.status === "published" && { url: item.url }),
        })),
      },
    },
    {
      "@id": `${PAGE_URL}/#breadcrumb`,
      ...breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Security Research", path: "/security-research" },
      ]),
    },
  ],
};

export default function SecurityResearchLayout({
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
