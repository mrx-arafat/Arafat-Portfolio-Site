import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Easin Arafat",
  description:
    "Easin Arafat builds security, infrastructure, and controlled AI automation for production systems. Explore his work across xCloud, application security research, platform operations, and AIFlowiz.",
  alternates: {
    canonical: "https://www.arafatops.com/about",
  },
  openGraph: {
    title: "About Easin Arafat | Application Security Engineer",
    description:
      "Security, infrastructure, and controlled AI automation for production systems by Easin Arafat.",
    url: "https://www.arafatops.com/about",
  },
};

function StructuredData() {
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": "https://www.arafatops.com/about/#profilepage",
    url: "https://www.arafatops.com/about",
    name: "About Easin Arafat",
    dateModified: "2026-06-15",
    mainEntity: { "@id": "https://www.arafatops.com/#person" },
    about: { "@id": "https://www.arafatops.com/#person" },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
    />
  );
}

export default function AboutLayout({
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
