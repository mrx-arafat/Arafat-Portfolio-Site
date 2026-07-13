import { getAllPosts } from "@/lib/blog";
import ArticlesClient, { type UnifiedArticle } from "./articles-client";
import articlesData from "@/data/articles.json";

export const revalidate = 300;

export default async function ArticlesPage() {
  const native: UnifiedArticle[] = (await getAllPosts()).map((post) => ({
    id: `native-${post.category}-${post.slug}`,
    title: post.title,
    description: post.description,
    publishDate: post.date,
    readTime: post.readTime,
    url: `/blogs/${post.category}/${post.slug}`,
    imageUrl:
      post.cover ??
      `/api/og?size=card&title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}&meta=${encodeURIComponent(`${post.date} · ${post.readTime}`)}`,
    tags: post.tags,
    source: "native",
  }));

  const medium: UnifiedArticle[] = articlesData.map((article) => ({
    ...article,
    source: "medium" as const,
  }));

  // Medium archive first, then native site posts after it's exhausted
  return <ArticlesClient items={[...medium, ...native]} />;
}
