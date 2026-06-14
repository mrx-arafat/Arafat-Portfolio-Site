import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Featured — Research, Press & Recognition",
  description:
    "Published research, press features, and recognition of Easin Arafat — Application Security Engineer at Startise. Peer-reviewed Elsevier (Array, Q1) publication on Adaptive UI for mobile banking, The Daily Star feature, MIST LEETCON, and University Rover Challenge global championship.",
  keywords:
    "Easin Arafat research, Sheikh Easin Arafat, Easin Arafat Array Elsevier, Adaptive User Interface mobile banking, Easin Arafat Daily Star, Easin Arafat MIST LEETCON, University Rover Challenge MIST, Easin Arafat publications, Easin Arafat press, n0_arafat_n0",
  alternates: {
    canonical: "https://www.arafatops.com/featured",
  },
  openGraph: {
    title: "Featured — Research, Press & Recognition | Easin Arafat",
    description:
      "Peer-reviewed Elsevier (Array Q1) research, Daily Star feature, MIST LEETCON, and URC global championship.",
    url: "https://www.arafatops.com/featured",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Featured — Research, Press & Recognition | Easin Arafat",
    description:
      "Peer-reviewed Elsevier research, press features, and recognition of Easin Arafat.",
  },
};

function StructuredData() {
  const scholarlyArticle = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1016/j.array.2026.100901",
    headline:
      "Adaptive User Interface for Mobile Banking Apps: Enhancing UX through Machine Learning",
    name: "Adaptive User Interface for Mobile Banking Apps: Enhancing UX through Machine Learning",
    author: [
      { "@type": "Person", name: "Khaled Hasan" },
      { "@type": "Person", name: "Md Rashid Ul Islam" },
      { "@type": "Person", name: "Sheikh Easin Arafat", sameAs: "https://www.arafatops.com" },
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
    sameAs: "https://doi.org/10.1016/j.array.2026.100901",
    datePublished: "2026",
    isAccessibleForFree: true,
    about: ["Machine Learning", "Adaptive User Interface", "Mobile Banking", "User Experience"],
  };

  const newsArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline:
      "The need for cybersecurity education in Bangladeshi universities",
    url: "https://www.thedailystar.net/campus/skills/news/the-need-cybersecurity-education-bangladeshi-universities-3580471",
    publisher: { "@type": "Organization", name: "The Daily Star" },
    about: { "@id": "https://www.arafatops.com/#person" },
    mentions: { "@id": "https://www.arafatops.com/#person" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(scholarlyArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticle) }}
      />
    </>
  );
}

export default function FeaturedLayout({
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
