export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.arafatops.com/#person",
    name: "Easin Arafat",
    givenName: "Easin",
    familyName: "Arafat",
    alternateName: ["KingBOB", "e4rafat", "mrx-arafat", "easinxarafat"],
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
      "https://aiflowiz.com/",
    ],
    mainEntityOfPage: {
      "@type": "ProfilePage",
      "@id": "https://www.arafatops.com/",
    },
    subjectOf: {
      "@type": "Article",
      headline:
        "The need for cybersecurity education in Bangladeshi universities",
      url: "https://www.thedailystar.net/campus/skills/news/the-need-cybersecurity-education-bangladeshi-universities-3580471",
      publisher: { "@type": "Organization", name: "The Daily Star" },
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
    ],
    nationality: {
      "@type": "Country",
      name: "Bangladesh",
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
        name: "Blog",
        item: "https://www.arafatops.com/blogs",
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "Skills",
        item: "https://www.arafatops.com/skills",
      },
      {
        "@type": "ListItem",
        position: 7,
        name: "Contact",
        item: "https://www.arafatops.com/contact",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
