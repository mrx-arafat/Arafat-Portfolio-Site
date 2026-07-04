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
    url: `/blog/${post.category}/${post.slug}`,
    imageUrl: post.cover ?? "",
    tags: post.tags,
    source: "native",
  }));

  const medium: UnifiedArticle[] = articlesData.map((article) => ({
    ...article,
    source: "medium" as const,
  }));

  // Native posts lead — they're the fresh, canonical content
  return <ArticlesClient items={[...native, ...medium]} />;
}
