import type { ReactElement } from "react";
import { JsonLd } from "@/components/seo/json-ld";
import cveData from "@/data/cve.json";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

/** Stable node ids. Per-page structured data references these, so keep them fixed. */
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PROFILE_PAGE_ID = `${SITE_URL}/#profilepage`;

const CVE_ID_PATTERN = /^CVE-\d{4}-\d+$/;

/**
 * One award line per disclosure, derived from data/cve.json so the list
 * cannot drift from the rest of the site. Entries whose CVE id has not been
 * published yet are labelled as reserved instead of carrying an id.
 */
const cveAwards: string[] = cveData.items.map((item) => {
  const id = CVE_ID_PATTERN.test(item.cve) ? item.cve : "CVE reserved";
  return `${id} - ${item.software} ${item.affected} ${item.type} (CVSS ${item.cvss.toFixed(1)})`;
});

/**
 * Sitewide structured data: only the entities that are true on every URL
 * (the person, the website, and the works that credit the person). Page-specific nodes such as ProfilePage and
 * BreadcrumbList belong to the route that renders them.
 */
export default function StructuredData(): ReactElement {
  const person = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Easin Arafat",
    givenName: "Easin",
    familyName: "Arafat",
    alternateName: [
      "KingBOB",
      "e4rafat",
      "mrx-arafat",
      "easinxarafat",
      "n0_arafat_n0",
    ],
    url: SITE_URL,
    image: `${SITE_URL}/images/profile.webp`,
    jobTitle: "Application Security Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Startise",
      url: "https://startise.com/",
      description: "Technology company building xCloud hosting platform",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Military Institute of Science and Technology (MIST)",
      description: "Leading technical university in Bangladesh",
    },
    memberOf: {
      "@type": "Organization",
      name: "MIST Cyber Security Club",
      description:
        "Military Institute of Science and Technology Cyber Security Club",
    },
    sameAs: [
      "https://github.com/mrx-arafat",
      "https://www.linkedin.com/in/e4rafat",
      "https://www.facebook.com/e4rafat",
      "https://www.instagram.com/e4rafat/",
      "https://medium.com/@easinxarafat",
      "https://tryhackme.com/p/KingBOB",
      "https://x.com/easinxarafat",
      "https://www.goodreads.com/e4rafat",
      "https://doi.org/10.1016/j.array.2026.100901",
      "https://vdp.patchstack.com/database/researchers/c4d8ecc2-c599-4f6f-bfca-2d2d755117e8",
      "https://aiflowiz.com/",
    ],
    mainEntityOfPage: { "@id": PROFILE_PAGE_ID },
    subjectOf: [
      {
        "@type": "NewsArticle",
        headline:
          "The need for cybersecurity education in Bangladeshi universities",
        url: "https://www.thedailystar.net/campus/skills/news/the-need-cybersecurity-education-bangladeshi-universities-3580471",
        publisher: { "@type": "Organization", name: "The Daily Star" },
      },
    ],
    description:
      "Easin Arafat is an Application Security Engineer at Startise, working on the xCloud hosting platform. MIST graduate and Former President of MIST Cyber Security Club. Specializing in application security, penetration testing, DevSecOps, web development, and AI/ML.",
    knowsAbout: [
      "Application Security",
      "Cybersecurity",
      "Penetration Testing",
      "Web Development",
      "DevSecOps",
      "Secure Coding",
      "Docker",
      "Cloud Security",
      "AI and Machine Learning",
      "Automation",
      "Vulnerability Research",
      "CVE Disclosure",
      "WordPress Security",
      "Responsible Disclosure",
    ],
    nationality: {
      "@type": "Country",
      name: "Bangladesh",
    },
    award: cveAwards,
    knowsLanguage: ["English", "Bengali"],
    seeks: {
      "@type": "Demand",
      name: "Security research and responsible disclosure",
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: "arafatops",
    description:
      "Official portfolio website of Easin Arafat, Application Security Engineer at Startise.",
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };

  // `founder` and `author` are properties of the organization and the paper,
  // not of a Person, so these facts live on their own nodes pointing back.
  const agency = {
    "@type": "Organization",
    "@id": "https://aiflowiz.com/#organization",
    name: "AIFlowiz",
    url: "https://aiflowiz.com/",
    description: "AI automation agency founded by Easin Arafat",
    founder: { "@id": PERSON_ID },
  };

  const paper = {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1016/j.array.2026.100901",
    name: "Adaptive User Interface for Mobile Banking Apps: Enhancing UX through Machine Learning",
    url: "https://doi.org/10.1016/j.array.2026.100901",
    author: { "@id": PERSON_ID },
    isPartOf: {
      "@type": "Periodical",
      name: "Array",
      publisher: { "@type": "Organization", name: "Elsevier" },
    },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [person, website, agency, paper],
  };

  return <JsonLd data={graph} />;
}
