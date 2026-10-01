import type { ReactElement } from "react";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

/** Id of the sitewide Person node emitted by the root layout. */
export const PERSON_REF = { "@id": `${SITE_URL}/#person` };

export type JsonLdNode = Record<string, unknown>;

export interface Crumb {
  name: string;
  /** Site path starting with "/". */
  path: string;
}

/** Inline JSON-LD script. `<` is escaped so content can never close the tag. */
export function JsonLd({ data }: { data: JsonLdNode }): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** BreadcrumbList node for a trail of site paths, first item is the root. */
export function breadcrumbSchema(trail: Crumb[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
