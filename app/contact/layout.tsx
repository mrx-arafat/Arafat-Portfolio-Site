import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";

import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { SITE_URL, absoluteUrl, pageMetadata } from "@/lib/seo";

const PAGE_URL = absoluteUrl("/contact");
const DESCRIPTION =
  "Reach Easin Arafat about application security, platform operations or AI automation. Send a message through the contact form and it goes to his inbox.";

export const metadata: Metadata = pageMetadata({
  title: "Contact Easin Arafat - Start a Conversation",
  description: DESCRIPTION,
  path: "/contact",
  ogCard: {
    category: "contact",
    meta: "Security, platform and AI automation",
    prompt: "contact --arafat",
  },
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${PAGE_URL}/#contactpage`,
      url: PAGE_URL,
      name: "Contact Easin Arafat",
      description: DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${PAGE_URL}/#breadcrumb` },
      about: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@id": `${PAGE_URL}/#breadcrumb`,
      ...breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    },
  ],
};

export default function ContactLayout({
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
