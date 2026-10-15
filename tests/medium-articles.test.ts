import { describe, expect, it } from "vitest";

import archive from "@/data/articles.json";
import { getMediumArticles, latestMediumArticle } from "@/lib/medium-articles";

describe("Medium archive refresh", () => {
  it("puts the verified recent essays first and preserves the existing archive", () => {
    const articles = getMediumArticles(archive);

    expect(articles.slice(0, 2).map((article) => article.publishDate)).toEqual([
      "2026-10-05",
      "2026-07-03",
    ]);
    expect(articles.slice(2)).toEqual(archive);
    expect(latestMediumArticle.url).toBe(
      "https://medium.com/@easinxarafat/a-relationship-wont-fix-you-honestly-that-s-the-good-news-dd4b4b0fadbb",
    );
    expect(latestMediumArticle.readTime).toBe("");
  });

  it("keeps one article when the archive repeats a refreshed URL with tracking", () => {
    const articles = getMediumArticles([
      {
        ...latestMediumArticle,
        id: "older-copy",
        url: `${latestMediumArticle.url}/?source=rss#reading`,
      },
      ...archive,
    ]);

    expect(articles.map((article) => article.id)).toEqual([
      "medium-dd4b4b0fadbb",
      "medium-685804b73390",
      ...archive.map((article) => article.id),
    ]);
  });
});
