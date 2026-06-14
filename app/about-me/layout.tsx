import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Easin Arafat",
  description:
    "Learn about Easin Arafat - Application Security Engineer at Startise working on xCloud. MIST graduate, former President of MIST Cyber Security Club, security researcher (n0_arafat_n0) with 9 CVEs and peer-reviewed Elsevier research.",
  alternates: {
    canonical: "https://www.arafatops.com/about-me",
  },
  openGraph: {
    title: "About Easin Arafat | Application Security Engineer",
    description:
      "Learn about Easin Arafat - Application Security Engineer at Startise working on xCloud. MIST graduate specializing in application security, DevSecOps, and AI/ML.",
    url: "https://www.arafatops.com/about-me",
  },
};

function StructuredData() {
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": "https://www.arafatops.com/about-me/#profilepage",
    url: "https://www.arafatops.com/about-me",
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

export default function AboutMeLayout({
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
