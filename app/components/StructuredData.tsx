export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.arafatops.com/#person",
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
    url: "https://www.arafatops.com",
    image: "https://www.arafatops.com/images/profile.webp",
    jobTitle: "Application Security Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Startise",
      url: "https://startise.com/",
      description: "Technology company building xCloud hosting platform",
    },
    founder: {
      "@type": "Organization",
      name: "AIFlowiz",
      url: "https://aiflowiz.com/",
      description: "AI automation agency founded by Easin Arafat",
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
    mainEntityOfPage: {
      "@type": "ProfilePage",
      "@id": "https://www.arafatops.com/",
    },
    subjectOf: [
      {
        "@type": "NewsArticle",
        headline:
          "The need for cybersecurity education in Bangladeshi universities",
        url: "https://www.thedailystar.net/campus/skills/news/the-need-cybersecurity-education-bangladeshi-universities-3580471",
        publisher: { "@type": "Organization", name: "The Daily Star" },
      },
    ],
    workExample: {
      "@type": "ScholarlyArticle",
      name: "Adaptive User Interface for Mobile Banking Apps: Enhancing UX through Machine Learning",
      sameAs: "https://doi.org/10.1016/j.array.2026.100901",
      isPartOf: {
        "@type": "Periodical",
        name: "Array",
        publisher: { "@type": "Organization", name: "Elsevier" },
      },
    },
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
    award: [
      "CVE-2025-62039 — AI ChatBot with ChatGPT and Content Generator by AYS ≤ 2.6.6 Sensitive Data Exposure (CVSS 7.5)",
      "CVE-2025-58680 — Gutentor ≤ 3.5.2 Broken Access Control (CVSS 6.5)",
      "CVE-2025-64277 — ChatBot ≤ 7.3.9 Broken Access Control (CVSS 5.3)",
      "CVE-2025-59562 — Academy LMS ≤ 3.3.4 IDOR (CVSS 5.5)",
      "CVE-2025-58981 — Accessibility Checker by Equalize Digital ≤ 1.30.0 IDOR (CVSS 5.4)",
      "CVE-2025-62932 — Table Block by RioVizual ≤ 3.0.1 Broken Access Control (CVSS 4.3)",
      "CVE-2025-62931 — MSN Partner Hub ≤ 2.9 Broken Access Control (CVSS 4.3)",
    ],
    knowsLanguage: ["English", "Bengali"],
    seeks: {
      "@type": "Demand",
      name: "Security research and responsible disclosure",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.arafatops.com/#website",
    url: "https://www.arafatops.com",
    name: "Easin Arafat - Portfolio",
    description:
      "Official portfolio website of Easin Arafat, Application Security Engineer at Startise.",
    publisher: {
      "@id": "https://www.arafatops.com/#person",
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": "https://www.arafatops.com/#profilepage",
    url: "https://www.arafatops.com",
    name: "Easin Arafat — Application Security Engineer",
    dateModified: "2026-06-15",
    mainEntity: { "@id": "https://www.arafatops.com/#person" },
    about: { "@id": "https://www.arafatops.com/#person" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.arafatops.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dashboard",
        item: "https://www.arafatops.com/dashboard",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "About",
        item: "https://www.arafatops.com/about-me",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Projects",
        item: "https://www.arafatops.com/projects",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Security Research",
        item: "https://www.arafatops.com/security-research",
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "Featured",
        item: "https://www.arafatops.com/featured",
      },
      {
        "@type": "ListItem",
        position: 7,
        name: "Articles",
        item: "https://www.arafatops.com/articles",
      },
      {
        "@type": "ListItem",
        position: 8,
        name: "Skills",
        item: "https://www.arafatops.com/skills",
      },
      {
        "@type": "ListItem",
        position: 9,
        name: "Contact",
        item: "https://www.arafatops.com/contact",
      },
      {
        "@type": "ListItem",
        position: 10,
        name: "FAQ",
        item: "https://www.arafatops.com/faq",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
