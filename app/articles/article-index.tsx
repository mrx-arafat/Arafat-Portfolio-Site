import { memo } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/open-circuit";
import type { UnifiedArticle } from "./articles-client";
import styles from "./articles.module.css";
import reading from "../blogs/reading.module.css";

interface ArticleIndexProps {
  items: UnifiedArticle[];
}

/** Keep every article reachable independently of the reading desk's rotation. */
export const ArticleIndex = memo(function ArticleIndex({ items }: ArticleIndexProps): React.ReactElement {
  return (
    <section id="article-index" className="oc-zone" aria-labelledby="article-index-heading">
      <SectionHeading path="articles" note={`my writing / ${items.length} articles`} title="I kept the evidence." id="article-index-heading" />
      <ol className={reading.postList}>
        {items.map((article, index) => (
          <li key={article.id} className={styles.indexEntry}>
            <span aria-hidden="true" className={styles.indexNumber}>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3 className={styles.indexTitle}>
                {article.source === "native" ? (
                  <Link href={article.url}>{article.title}</Link>
                ) : (
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}<ExternalLink size={16} aria-hidden="true" />
                    <span className="oc-sr"> (opens in a new tab)</span>
                  </a>
                )}
              </h3>
              <p className={styles.indexDescription}>{article.description}</p>
              <p className={reading.metadata}>
                <time dateTime={article.publishDate}>{article.publishDate}</time>
                <span>{article.readTime}</span>
                <span>{article.source === "native" ? "On this site" : "Medium"}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
});
