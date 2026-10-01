import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

import { ARTICLES_DESCRIPTION } from "./seo";

export const metadata: Metadata = pageMetadata({
  title: "Articles",
  description: ARTICLES_DESCRIPTION,
  path: "/articles",
  ogCard: { prompt: "./view_articles.sh --display=latest" },
});

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return children;
}
