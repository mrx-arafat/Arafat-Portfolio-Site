import {
  JsonLd,
  PERSON_REF,
  breadcrumbSchema,
} from "@/components/seo/json-ld";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { CircuitTrace, Keycap, PageHeader } from "@/components/open-circuit";
import { ClientWorkArchive } from "@/components/client-work/client-work-archive";
import { AgenticWorkSection } from "@/components/agentic-work/agentic-work-section";

import ProjectsClient from "./projects-client";
import { ProjectIndex } from "./project-index";
import { ORDERED_PROJECTS, PROJECTS_DESCRIPTION } from "./projects-data";
import styles from "./projects.module.css";

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
          "@type": project.html_url ? "SoftwareSourceCode" : "SoftwareApplication",
          name: project.name,
          description: project.description,
          ...(project.caseStudyPath
            ? { url: absoluteUrl(project.caseStudyPath) }
            : project.homepage || project.html_url
              ? { url: project.homepage || project.html_url }
              : {}),
          ...(project.html_url ? { codeRepository: project.html_url } : {}),
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
      <main className={`oc-shell oc-page ${styles.page}`}>
        <PageHeader
          command="$ ./list_projects.sh --sort=latest"
          title={<>I got bored.<br /><span className="oc-green">You got software.</span></>}
          description="I've shipped 40+ projects. Persistent terminals, connected knowledge, policy checks and reading tools. If I want something to work differently, I tend to build it."
        >
          <div className="mt-7 max-w-sm pr-2 pb-2">
            <Keycap href="#client-work" command="$ ls ~/work/selected">Explore the case studies</Keycap>
          </div>
        </PageHeader>
        <CircuitTrace>
          <AgenticWorkSection />
          <ClientWorkArchive />
          <ProjectsClient projects={ORDERED_PROJECTS} />
          <ProjectIndex projects={ORDERED_PROJECTS} />
        </CircuitTrace>
      </main>
    </>
  );
}
