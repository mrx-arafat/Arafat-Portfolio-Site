import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import {
  countWords,
  getAllPosts,
  getAdjacentPosts,
  getCategoryInfo,
  getPost,
  getRelatedPosts,
  isPreviewMode,
  type Post,
} from "@/lib/blog";
import { SITE_NAME, SITE_URL, absoluteUrl, isoDateTime, ogImageUrl, pageMetadata } from "@/lib/seo";
import { MdxContent } from "@/components/mdx-content";
import { JsonLd, PERSON_REF, breadcrumbSchema } from "@/components/seo/json-ld";
import { RelatedPosts } from "@/components/blog/related-posts";
import { CircuitTrace, Prose, StatusTag } from "@/components/open-circuit";
import styles from "../../reading.module.css";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams(): Promise<{ category: string; slug: string }[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ category: p.category, slug: p.slug }));
}

export const revalidate = 300;
export const dynamicParams = true;

/** Uploaded cover, or the generated terminal card when the post has none. */
function socialImage(post: Post): string {
  return (
    post.cover ??
    ogImageUrl({
      title: post.title,
      category: post.category,
      path: `blogs/${post.category}`,
    })
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) return {};
  // No "updated" column yet, so the publish date doubles as the modified date.
  const publishedAt = isoDateTime(post.date);
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blogs/${category}/${slug}`,
    ogImage: socialImage(post),
    type: "article",
    publishedTime: publishedAt,
    modifiedTime: publishedAt,
  });
}

export default async function PostPage({ params }: Props): Promise<ReactElement> {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) notFound();

  const preview = await isPreviewMode();

  const published = await getAllPosts();
  const { older, newer } = getAdjacentPosts(published, category, slug);
  const related = getRelatedPosts(published, post, { avoid: [older, newer] });

  const categoryInfo = getCategoryInfo(category);
  const postPath = `/blogs/${category}/${slug}`;
  const postUrl = absoluteUrl(postPath);
  const publishedAt = isoDateTime(post.date);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: postUrl,
        datePublished: publishedAt,
        dateModified: publishedAt,
        inLanguage: "en",
        wordCount: countWords(post.content),
        keywords: post.tags.join(", "),
        articleSection: categoryInfo.label,
        // Covers may be stored as site-relative paths; structured data needs absolute URLs.
        image: new URL(socialImage(post), SITE_URL).href,
        author: { ...PERSON_REF, "@type": "Person", name: SITE_NAME, url: absoluteUrl("/about") },
        publisher: PERSON_REF,
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blogs" },
        { name: categoryInfo.label, path: `/blogs/${category}` },
        { name: post.title, path: postPath },
      ]),
    ],
  };

  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <JsonLd data={jsonLd} />
      {preview && (
        <div className={styles.preview}>
          <span>
            {post.draft ? "● DRAFT PREVIEW" : "● PREVIEW"} - visible only via your preview link
          </span>
          <a href="/api/blog/preview?exit=1">exit preview</a>
        </div>
      )}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/blogs">blogs</Link>
        <span className={styles.breadcrumbItem}>
          <span aria-hidden="true">/</span>
          <Link href={`/blogs/${category}`}>{category}</Link>
        </span>
        <span className={styles.breadcrumbItem} aria-current="page">
          <span aria-hidden="true">/</span>reading
        </span>
      </nav>

      <article aria-labelledby="post-title">
        <header className={`oc-page-header ${styles.postHeader}`}>
          <p className="oc-command">
            <span className={styles.shortCommand}>$ cat index.mdx</span>
            <span className={styles.fullCommand}>
              {`$ cat ~/blogs/${category}/${slug}/index.mdx`}
              <span className="oc-page-note"> # I put my name on this</span>
            </span>
          </p>
          <h1 id="post-title">{post.title}</h1>
          <div className="oc-page-description">I wrote this. You can take notes.</div>
        </header>
        <div className={styles.readingLayout}>
          <aside className={styles.record} aria-label="About this article">
            <dl>
              <div>
                <dt>Written by</dt>
                <dd><Link href="/about" rel="author">{SITE_NAME}</Link></dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd><time dateTime={post.date}>{post.date}</time></dd>
              </div>
              <div>
                <dt>Reading time</dt>
                <dd>{post.readTime}</dd>
              </div>
              <div>
                <dt>Directory</dt>
                <dd><Link href={`/blogs/${category}`}>{categoryInfo.label}</Link></dd>
              </div>
            </dl>
          </aside>
          <div className={styles.readingPaper}>
            <Prose className={styles.prose}>
              <MdxContent
                source={post.content}
                title={post.title}
                codeTheme={{ light: "github-light-high-contrast", dark: "github-dark-high-contrast" }}
              />
            </Prose>
            {post.tags.length > 0 && (
              <nav className={styles.postTags} aria-label="Article tags">
                <StatusTag tone="neutral">My topics</StatusTag>
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/blogs/tag/${encodeURIComponent(tag)}`}>#{tag}</Link>
                  ))}
                </div>
              </nav>
            )}
            <nav className={styles.adjacent} aria-label="Adjacent posts">
              {older && (
                <Link href={`/blogs/${older.category}/${older.slug}`}>
                  <span>&lt;- older</span>
                  <strong>{older.title}</strong>
                </Link>
              )}
              {newer && (
                <Link href={`/blogs/${newer.category}/${newer.slug}`}>
                  <span>newer -&gt;</span>
                  <strong>{newer.title}</strong>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </article>

      <CircuitTrace><RelatedPosts posts={related} /></CircuitTrace>
    </main>
  );
}
