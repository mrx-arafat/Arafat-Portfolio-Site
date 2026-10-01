import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";

import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import faq from "@/data/faq.json";
import { SITE_URL, absoluteUrl, pageMetadata } from "@/lib/seo";

const PAGE_URL = absoluteUrl("/faq");

export const metadata: Metadata = pageMetadata({
  title: "Who Is Easin Arafat? FAQ on His Work, CVEs and Research",
  description:
    "Who is Easin Arafat, what does he do, and what has he disclosed and published? Short answers on his role at Startise, security research and background.",
  path: "/faq",
  ogCard: {
    category: "faq",
    meta: `${faq.length} questions, short answers`,
    prompt: 'cat faq.md --about="Easin Arafat"',
  },
});

/** The only FAQPage node for this route: a second one is reported as a duplicate. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}/#faq`,
      url: PAGE_URL,
      name: "Frequently asked questions about Easin Arafat",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${PAGE_URL}/#breadcrumb` },
      about: { "@id": `${SITE_URL}/#person` },
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@id": `${PAGE_URL}/#breadcrumb`,
      ...breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "FAQ", path: "/faq" },
      ]),
    },
  ],
};

export default function FaqLayout({
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
