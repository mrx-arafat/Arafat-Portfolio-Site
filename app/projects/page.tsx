import {
  JsonLd,
  PERSON_REF,
  breadcrumbSchema,
} from "@/components/seo/json-ld";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

import ProjectsClient from "./projects-client";
import { ORDERED_PROJECTS, PROJECTS_DESCRIPTION } from "./projects-data";

const PAGE_URL = absoluteUrl("/projects");
const ITEM_LIST_ID = `${PAGE_URL}#projects`;

/** The page, the projects it lists, and its place in the site. */
const projectsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": PAGE_URL,
      url: PAGE_URL,
      name: "Projects",
      description: PROJECTS_DESCRIPTION,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      author: PERSON_REF,
      mainEntity: { "@id": ITEM_LIST_ID },
    },
    {
      "@type": "ItemList",
      "@id": ITEM_LIST_ID,
      numberOfItems: ORDERED_PROJECTS.length,
      itemListElement: ORDERED_PROJECTS.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareSourceCode",
          name: project.name,
          description: project.description,
          url: project.caseStudyPath
            ? absoluteUrl(project.caseStudyPath)
            : project.html_url,
          codeRepository: project.html_url,
          programmingLanguage: project.language,
        },
      })),
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
    ]),
  ],
};

export default function ProjectsPage(): React.ReactElement {
  return (
    <>
      <JsonLd data={projectsSchema} />
      <ProjectsClient projects={ORDERED_PROJECTS} />
    </>
  );
}
