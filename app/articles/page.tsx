import {
  JsonLd,
  PERSON_REF,
  breadcrumbSchema,
} from "@/components/seo/json-ld";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import ArticlesClient, { type UnifiedArticle } from "./articles-client";
import { ARTICLES_DESCRIPTION } from "./seo";
import articlesData from "@/data/articles.json";

export const revalidate = 300;

const PAGE_URL = absoluteUrl("/articles");
const ITEM_LIST_ID = `${PAGE_URL}#articles`;

/** The page, the articles it lists in display order, and its place in the site. */
function articlesSchema(items: UnifiedArticle[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "Articles",
        description: ARTICLES_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        author: PERSON_REF,
        mainEntity: { "@id": ITEM_LIST_ID },
      },
      {
        "@type": "ItemList",
        "@id": ITEM_LIST_ID,
        numberOfItems: items.length,
        itemListElement: items.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: article.title,
          url:
            article.source === "native"
              ? absoluteUrl(article.url)
              : article.url,
        })),
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Articles", path: "/articles" },
      ]),
    ],
  };
}

export default async function ArticlesPage(): Promise<React.ReactElement> {
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
  const items = [...medium, ...native];

  return (
    <>
      <JsonLd data={articlesSchema(items)} />
      <ArticlesClient items={items} />
    </>
  );
}
