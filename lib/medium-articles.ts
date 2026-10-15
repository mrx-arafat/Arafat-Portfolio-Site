export interface MediumArticle {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  readTime: string;
  url: string;
  imageUrl: string;
  tags: string[];
}

export const MEDIUM_FEED_URL = "https://medium.com/feed/@easinxarafat";
export const MEDIUM_CHECKED_AT = "2026-10-15";

// Check the public feed during portfolio refreshes; keep older archive entries.
// RSS supplies no reading time, so these records leave it empty.
const recentMediumArticles: MediumArticle[] = [
  {
    id: "medium-dd4b4b0fadbb",
    title: "A Relationship Won't Fix You. Honestly? That's the Good News.",
    description:
      "Why romance cannot carry an entire life, and how friendships, personal interests and a sense of agency create something worth sharing with another person.",
    publishDate: "2026-10-05",
    readTime: "",
    url: "https://medium.com/@easinxarafat/a-relationship-wont-fix-you-honestly-that-s-the-good-news-dd4b4b0fadbb",
    imageUrl: "https://miro.medium.com/v2/resize:fit:739/0*tnXxE6kcmxfWqE4C",
    tags: ["relationships", "thoughts"],
  },
  {
    id: "medium-685804b73390",
    title: "What DARK Reveals About Choice, Desire, and the Cycles We Can't Break",
    description:
      "A reading of DARK through desire, family history and free will, asking why recognizing a destructive pattern does not necessarily let us escape it.",
    publishDate: "2026-07-03",
    readTime: "",
    url: "https://medium.com/@easinxarafat/what-dark-reveals-about-choice-desire-and-the-cycles-we-cant-break-685804b73390",
    imageUrl: "https://miro.medium.com/v2/resize:fit:958/0*IXJg-Trnpo7JGO9b.jpg",
    tags: ["dark"],
  },
];

export const latestMediumArticle: MediumArticle = recentMediumArticles[0];

/** Add verified recent posts while keeping each Medium destination only once. */
export function getMediumArticles(archive: readonly MediumArticle[]): MediumArticle[] {
  const seen = new Set<string>();
  return [...recentMediumArticles, ...archive].filter((article) => {
    const key = article.url.split(/[?#]/, 1)[0].replace(/\/+$/, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
