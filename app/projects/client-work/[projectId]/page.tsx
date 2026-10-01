import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  JsonLd,
  PERSON_REF,
  breadcrumbSchema,
} from "@/components/seo/json-ld";
import { ClientWorkDetail } from "@/components/client-work/client-work-detail";
import {
  CLIENT_PROJECTS,
  type ClientProject,
  getClientProject,
} from "@/components/client-work/content";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

interface ClientWorkPageProps {
  params: Promise<{ projectId: string }>;
}

export function generateStaticParams(): Array<{ projectId: string }> {
  return CLIENT_PROJECTS.map((project) => ({ projectId: project.id }));
}

export async function generateMetadata({
  params,
}: ClientWorkPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const project = getClientProject(projectId);
  if (!project) return {};

  return pageMetadata({
    title: `${project.title} Case Study`,
    description: project.metaDescription,
    path: project.detailPath,
    ogImage: project.slides[0].image,
    type: "article",
  });
}

/** The case study as a creative work by the site's author, and its place under Projects. */
function caseStudySchema(project: ClientProject): Record<string, unknown> {
  const url = absoluteUrl(project.detailPath);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#case-study`,
        url,
        name: `${project.title} Case Study`,
        description: project.metaDescription,
        image: project.slides.map((slide) => absoluteUrl(slide.image)),
        inLanguage: "en",
        author: PERSON_REF,
        about: {
          "@type": "Thing",
          name: project.title,
          description: project.summary,
          url: project.deploymentUrl,
        },
        isPartOf: { "@id": absoluteUrl("/projects") },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
        { name: project.title, path: project.detailPath },
      ]),
    ],
  };
}

export default async function ClientWorkPage({
  params,
}: ClientWorkPageProps): Promise<React.ReactElement> {
  const { projectId } = await params;
  const project = getClientProject(projectId);
  if (!project) notFound();

  return (
    <>
      <JsonLd data={caseStudySchema(project)} />
      <ClientWorkDetail project={project} />
    </>
  );
}
