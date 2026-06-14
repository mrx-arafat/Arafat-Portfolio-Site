import type { Metadata } from "next";
import cveData from "@/data/cve.json";

export const metadata: Metadata = {
  title: "Security Research & CVEs",
  description:
    "9 CVEs and security vulnerabilities discovered and disclosed by Easin Arafat (n0_arafat_n0), Application Security Engineer at Startise. Responsible disclosure via Patchstack VDP covering Broken Access Control, IDOR, and Sensitive Data Exposure in WordPress plugins.",
  keywords:
    "Easin Arafat CVE, n0_arafat_n0, Easin Arafat security researcher, Patchstack researcher, WordPress CVE, Broken Access Control, IDOR, Sensitive Data Exposure, CVE-2025-62039, CVE-2025-58680, CVE-2025-59562, CVE-2025-58981, CVE-2025-64277, CVE-2025-62932, CVE-2025-62931, responsible disclosure, Application Security Engineer Bangladesh",
  alternates: {
    canonical: "https://www.arafatops.com/security-research",
  },
  openGraph: {
    title: "Security Research & CVEs | Easin Arafat (n0_arafat_n0)",
    description:
      "9 published CVEs disclosed by Easin Arafat via Patchstack — Broken Access Control, IDOR, and Sensitive Data Exposure in WordPress plugins.",
    url: "https://www.arafatops.com/security-research",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Research & CVEs | Easin Arafat (n0_arafat_n0)",
    description:
      "9 published CVEs disclosed by Easin Arafat via Patchstack responsible disclosure.",
  },
};

function StructuredData() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.arafatops.com/security-research/#cve-collection",
    name: "Security Research & CVEs by Easin Arafat",
    description:
      "Catalog of CVEs and security vulnerabilities discovered and responsibly disclosed by Easin Arafat (n0_arafat_n0).",
    url: "https://www.arafatops.com/security-research",
    author: { "@id": "https://www.arafatops.com/#person" },
    about: { "@id": "https://www.arafatops.com/#person" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cveData.items.length,
      itemListElement: cveData.items.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${c.cve !== "Reserved" ? c.cve + " — " : ""}${c.software} ${c.affected} ${c.type}`,
        url: c.url,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
    />
  );
}

export default function SecurityResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData />
      {children}
    </>
  );
}
