import { memo } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import type { UnifiedArticle } from "./articles-client";

const TITLE_LINK_CLASS =
  "block py-2.5 underline-offset-4 transition-colors hover:text-terminal-soft hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green motion-reduce:transition-none";

interface ArticleIndexProps {
  items: UnifiedArticle[];
}

/**
 * List every article as a real link, so none of them depends on the carousel
 * to be reached. Memoized: the carousel above re-renders every second for its
 * countdown and this list only changes with its items.
 */
export const ArticleIndex = memo(function ArticleIndex({
  items,
}: ArticleIndexProps): React.ReactElement {
  return (
    <section id="article-index" aria-labelledby="article-index-heading">
      <div className="mb-6 mt-16 border-b border-terminal-green/25 pb-5 sm:mt-20">
        <p className="font-mono text-xs text-terminal-green/60">
          FULL INDEX / {items.length} ARTICLES
        </p>
        <h2
          id="article-index-heading"
          className="mt-2 text-2xl font-bold text-terminal-green sm:text-3xl"
        >
          All articles
        </h2>
      </div>

      <ol className="divide-y divide-terminal-green/10 rounded-lg border border-terminal-green/10 bg-surface-night shadow-[0_0_15px_rgba(46,213,115,0.1)]">
        {items.map((article, index) => (
          <li
            key={article.id}
            className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 px-4 pb-4 pt-2 sm:px-6"
          >
            <span
              aria-hidden="true"
              className="pt-3.5 font-mono text-xs text-terminal-green/60"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="break-words text-base font-bold text-terminal-green md:text-lg">
                {article.source === "native" ? (
                  <Link href={article.url} className={TITLE_LINK_CLASS}>
                    {article.title}
                  </Link>
                ) : (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={TITLE_LINK_CLASS}
                  >
                    {article.title}
                    <ExternalLink
                      size={14}
                      aria-hidden="true"
                      className="ml-2 inline"
                    />
                  </a>
                )}
              </h3>
              <p className="text-sm leading-relaxed text-terminal-green/80">
                {article.description}
              </p>
              <p className="mt-2 font-mono text-xs text-terminal-green/60">
                <time dateTime={article.publishDate}>{article.publishDate}</time>
                {" / "}
                {article.readTime}
                {" / "}
                {article.source === "native" ? "On this site" : "Medium"}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
});
