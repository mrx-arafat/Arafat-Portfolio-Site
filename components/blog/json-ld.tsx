import type { Post } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";
import {
  PERSON_REF,
  breadcrumbSchema,
  type Crumb,
  type JsonLdNode,
} from "@/components/seo/json-ld";

interface PostListSchema {
  type: "Blog" | "CollectionPage";
  name: string;
  description: string;
  /** Site path of the listing page. */
  path: string;
  /** Posts in the order the page shows them. */
  posts: Post[];
  breadcrumbs: Crumb[];
}

/** Structured data for a page that lists posts: the page, its ItemList and breadcrumbs. */
export function postListSchema(list: PostListSchema): JsonLdNode {
  const url = absoluteUrl(list.path);
  const itemListId = `${url}#posts`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": list.type,
        "@id": url,
        url,
        name: list.name,
        description: list.description,
        inLanguage: "en",
        author: PERSON_REF,
        publisher: PERSON_REF,
        mainEntity: { "@id": itemListId },
      },
      {
        "@type": "ItemList",
        "@id": itemListId,
        numberOfItems: list.posts.length,
        itemListElement: list.posts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: post.title,
          url: absoluteUrl(`/blogs/${post.category}/${post.slug}`),
        })),
      },
      breadcrumbSchema(list.breadcrumbs),
    ],
  };
}
