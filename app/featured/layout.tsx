import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";

import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { SITE_URL, absoluteUrl, pageMetadata } from "@/lib/seo";

const PAGE_URL = absoluteUrl("/featured");
const PAPER_URL = "https://doi.org/10.1016/j.array.2026.100901";

export const metadata: Metadata = pageMetadata({
  title: "Published Research, Press & Recognition",
  description:
    "Co-authored research in Array (Elsevier, Q1), a feature in The Daily Star, organizing MIST LEETCON 2023 and a University Rover Challenge 2021 global title.",
  path: "/featured",
  ogCard: {
    category: "featured",
    meta: "Array (Elsevier) / The Daily Star / URC 2021",
    prompt: "cat research.md press.md recognition.md",
  },
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // Same node id as the sitewide paper entry, so the two merge.
      // No datePublished: only the publication year is on record, and a bare
      // year is not a valid datetime for structured data.
      "@type": "ScholarlyArticle",
      "@id": PAPER_URL,
      headline:
        "Adaptive User Interface for Mobile Banking Apps: Enhancing UX through Machine Learning",
      name: "Adaptive User Interface for Mobile Banking Apps: Enhancing UX through Machine Learning",
      author: [
        { "@type": "Person", name: "Khaled Hasan" },
        { "@type": "Person", name: "Md Rashid Ul Islam" },
        { "@id": `${SITE_URL}/#person` },
        { "@type": "Person", name: "Iyolita Islam" },
      ],
      isPartOf: {
        "@type": "Periodical",
        name: "Array",
        publisher: { "@type": "Organization", name: "Elsevier" },
      },
      identifier: {
        "@type": "PropertyValue",
        propertyID: "DOI",
        value: "10.1016/j.array.2026.100901",
      },
      sameAs: PAPER_URL,
      isAccessibleForFree: true,
      about: [
        "Machine Learning",
        "Adaptive User Interface",
        "Mobile Banking",
        "User Experience",
      ],
    },
    {
      "@type": "NewsArticle",
      headline:
        "The need for cybersecurity education in Bangladeshi universities",
      url: "https://www.thedailystar.net/campus/skills/news/the-need-cybersecurity-education-bangladeshi-universities-3580471",
      publisher: { "@type": "Organization", name: "The Daily Star" },
      about: { "@id": `${SITE_URL}/#person` },
      mentions: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@id": `${PAGE_URL}/#breadcrumb`,
      ...breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Featured", path: "/featured" },
      ]),
    },
  ],
};

export default function FeaturedLayout({
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
