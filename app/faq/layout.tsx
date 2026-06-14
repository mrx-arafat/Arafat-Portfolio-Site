import type { Metadata } from "next";
import faq from "@/data/faq.json";

export const metadata: Metadata = {
  title: "FAQ — Easin Arafat",
  description:
    "Frequently asked questions about Easin Arafat — Application Security Engineer at Startise, MIST graduate, security researcher (n0_arafat_n0) with 9 CVEs and peer-reviewed Elsevier research.",
  alternates: {
    canonical: "https://www.arafatops.com/faq",
  },
  openGraph: {
    title: "FAQ | Easin Arafat",
    description:
      "Frequently asked questions about Easin Arafat — Application Security Engineer, security researcher, and published author.",
    url: "https://www.arafatops.com/faq",
  },
};

function StructuredData() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://www.arafatops.com/faq/#faq",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

export default function FaqLayout({
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
