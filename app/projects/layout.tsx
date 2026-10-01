import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

import { PROJECTS_DESCRIPTION } from "./projects-data";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: PROJECTS_DESCRIPTION,
  path: "/projects",
  ogCard: { prompt: "./list_projects.sh --sort=latest" },
});

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return children;
}
