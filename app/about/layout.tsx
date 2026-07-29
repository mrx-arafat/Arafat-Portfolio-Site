import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Easin Arafat",
  description:
    "Easin Arafat is an Application Security Engineer at Startise, security researcher, systems builder, and founder of AIFlowiz. Explore his work across xCloud, application security, DevOps, and secure AI automation.",
  alternates: {
    canonical: "https://www.arafatops.com/about",
  },
  openGraph: {
    title: "About Easin Arafat | Application Security Engineer",
    description:
      "Application security, product engineering, platform operations, and secure AI automation by Easin Arafat, founder of AIFlowiz.",
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
