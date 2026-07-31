import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientWorkDetail } from "@/components/client-work/client-work-detail";
import {
  CLIENT_PROJECTS,
  getClientProject,
} from "@/components/client-work/content";

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

  return {
    title: `${project.title} Case Study`,
    description: project.summary,
    alternates: {
      canonical: `https://www.arafatops.com${project.detailPath}`,
    },
    openGraph: {
      title: `${project.title} Case Study | Easin Arafat`,
      description: project.summary,
      url: `https://www.arafatops.com${project.detailPath}`,
      images: [{ url: project.slides[0].image }],
    },
  };
}

export default async function ClientWorkPage({
  params,
}: ClientWorkPageProps): Promise<React.ReactElement> {
  const { projectId } = await params;
  const project = getClientProject(projectId);
  if (!project) notFound();

  return <ClientWorkDetail project={project} />;
}
