import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";

import { PERSON } from "@/app/components/StructuredData";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  PERSON_ID,
  PORTRAIT_ID,
  PORTRAIT_SHARE_PATH,
  SITE_URL,
  absoluteUrl,
  isoDateTime,
  pageMetadata,
} from "@/lib/seo";

const PAGE_URL = absoluteUrl("/about");

export const metadata: Metadata = pageMetadata({
  title: "About Easin Arafat - Security, Platform and AI Automation",
  description:
    "Easin Arafat is an Application Security Engineer at Startise working on xCloud. See how he approaches security research, platform operations and AI automation.",
  path: "/about",
  type: "profile",
  ogImage: PORTRAIT_SHARE_PATH,
});

/** Bump dateModified when the About content or its metadata changes. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${PAGE_URL}/#profilepage`,
      url: PAGE_URL,
      name: "About Easin Arafat",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${PAGE_URL}/#breadcrumb` },
      dateCreated: isoDateTime("2025-04-08"),
      dateModified: isoDateTime("2026-10-27"),
      mainEntity: PERSON,
      primaryImageOfPage: { "@id": PORTRAIT_ID },
      about: { "@id": PERSON_ID },
    },
    {
      "@id": `${PAGE_URL}/#breadcrumb`,
      ...breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]),
    },
  ],
};

export default function AboutLayout({
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
