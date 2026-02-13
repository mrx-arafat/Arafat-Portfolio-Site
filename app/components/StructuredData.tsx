export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Easin Arafat",
    url: "http://profile.arafatbytes.live",
    image: "http://profile.arafatbytes.live/images/profile.webp",
    jobTitle: "Application Security Engineer",
    worksFor: [
      {
        "@type": "Organization",
        name: "Startise",
        description: "Application Security Company",
      },
      {
        "@type": "Organization",
        name: "MIST Cyber Security Club",
        description:
          "Military Institute of Science and Technology Cyber Security Club",
      },
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Military Institute of Science and Technology (MIST)",
      description: "Leading technical university in Bangladesh",
    },
    sameAs: [
      "https://github.com/mrx-arafat",
      "https://www.linkedin.com/in/e4rafat",
      "https://www.facebook.com/e4rafat",
      "https://www.instagram.com/e4rafat/",
      "https://medium.com/@easinxarafat",
      "https://tryhackme.com/p/KingBOB",
    ],
    description:
      "Application Security Engineer at Startise and member of MIST Cyber Security Club. Leading cybersecurity expert in Bangladesh specializing in application security, web development, and business solutions.",
    knowsAbout: [
      "Application Security",
      "Cybersecurity",
      "Web Development",
      "Penetration Testing",
      "Secure Coding",
      "MIST Cyber Security Club",
    ],
    nationality: {
      "@type": "Country",
      name: "Bangladesh",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
