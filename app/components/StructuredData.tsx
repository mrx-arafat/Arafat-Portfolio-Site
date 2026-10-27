import type { ReactElement } from "react";
import { JsonLd } from "@/components/seo/json-ld";
import cveData from "@/data/cve.json";
import {
  PERSON_ID,
  PORTRAIT_HEIGHT,
  PORTRAIT_ID,
  PORTRAIT_URL,
  PORTRAIT_WIDTH,
  PROFILE_URLS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

/** Stable node ids. Per-page structured data references these, so keep them fixed. */
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

export const PERSON = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Easin Arafat",
  givenName: "Easin",
  familyName: "Arafat",
  alternateName: [
    "Sheikh Easin Arafat",
    "KingBOB",
    "e4rafat",
    "mrx-arafat",
    "easinxarafat",
    "n0_arafat_n0",
  ],
  url: SITE_URL,
  image: {
    "@type": "ImageObject",
    "@id": PORTRAIT_ID,
    url: PORTRAIT_URL,
    contentUrl: PORTRAIT_URL,
    caption: "Easin Arafat, Application Security Engineer at Startise",
    width: PORTRAIT_WIDTH,
    height: PORTRAIT_HEIGHT,
  },
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
  sameAs: PROFILE_URLS,
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
    "Easin Arafat is an Application Security Engineer at Startise, working on the xCloud hosting platform, with a current focus on agentic AI systems and the review gates that keep AI coding agents honest. MIST graduate and former President of the MIST Cyber Security Club.",
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
    "Agentic AI Systems",
    "AI Coding Agents",
    "AI Agent Security",
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

/**
 * Sitewide structured data: only the entities that are true on every URL
 * (the person, the website, and the works that credit the person). Page-specific nodes such as ProfilePage and
 * BreadcrumbList belong to the route that renders them.
 */
export default function StructuredData(): ReactElement {
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
    "@graph": [PERSON, website, agency, paper],
  };

  return <JsonLd data={graph} />;
}
