import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
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
import { TerminalHeader } from "@/components/blog/terminal-header";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
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

export default async function PostPage({ params }: Props) {
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
        author: PERSON_REF,
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
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots">
      <JsonLd data={jsonLd} />
      <div className="max-w-4xl mx-auto">
        {preview && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-2 font-mono text-xs text-amber-300">
            <span>
              {post.draft ? "● DRAFT PREVIEW" : "● PREVIEW MODE"} — visible only via your preview link
            </span>
            <a
              href="/api/blog/preview?exit=1"
              className="rounded border border-amber-400/40 px-2 py-0.5 hover:bg-amber-400/20 transition-colors"
            >
              exit preview
            </a>
          </div>
        )}
        <TerminalHeader
          path={`~/blogs/${category}/${slug}`}
          command="cat index.mdx"
        />

        <div className="flex items-center mb-8">
          <Link
            href={`/blogs/${category}`}
            className="inline-flex items-center text-terminal-green hover:text-terminal-green/80 bg-surface-raised px-3 py-2 rounded-md border border-terminal-green/20 hover:border-terminal-green/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ..</span>
          </Link>
        </div>

        <article className="bg-surface-raised rounded-2xl border border-terminal-green/20 p-6 md:p-10">
          <header className="mb-8 border-b border-terminal-green/10 pb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href={`/blogs/${category}`}
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded bg-terminal-green/10 text-terminal-green border border-terminal-green/20 hover:bg-terminal-green/20 transition-colors"
              >
                cd blog/{category}
              </Link>
              <span className="flex items-center gap-1 text-terminal-green/40 text-xs font-mono">
                <Calendar size={11} />
                {post.date}
              </span>
              <span className="flex items-center gap-1 text-terminal-green/40 text-xs font-mono">
                <Clock size={11} />
                {post.readTime}
              </span>
              <Link
                href="/about"
                rel="author"
                className="flex items-center gap-1 text-terminal-green/60 hover:text-terminal-green text-xs font-mono transition-colors"
              >
                <User size={11} />
                by {SITE_NAME}
              </Link>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-terminal-green leading-tight mb-3">
              {post.title}
            </h1>
            <p className="text-[#c9d1d9]/80 text-sm md:text-base leading-relaxed">
              {post.description}
            </p>
          </header>

          <div className="blog-prose">
            <MdxContent source={post.content} title={post.title} />
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-terminal-green/10">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blogs/tag/${encodeURIComponent(tag)}`}
                  className="text-xs font-mono text-terminal-green/60 bg-surface-deep border border-terminal-green/15 hover:border-terminal-green/40 hover:text-terminal-green rounded px-2 py-1 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* Prev / next */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {older ? (
            <Link
              href={`/blogs/${older.category}/${older.slug}`}
              className="group bg-surface-raised rounded-xl border border-terminal-green/20 hover:border-terminal-green/50 p-4 transition-colors"
            >
              <div className="flex items-center gap-1 text-terminal-green/40 text-xs font-mono mb-1">
                <ArrowLeft size={12} /> older
              </div>
              <div className="text-terminal-green/80 group-hover:text-terminal-green text-sm font-medium transition-colors">
                {older.title}
              </div>
            </Link>
          ) : (
            <div></div>
          )}
          {newer && (
            <Link
              href={`/blogs/${newer.category}/${newer.slug}`}
              className="group bg-surface-raised rounded-xl border border-terminal-green/20 hover:border-terminal-green/50 p-4 text-right transition-colors"
            >
              <div className="flex items-center justify-end gap-1 text-terminal-green/40 text-xs font-mono mb-1">
                newer <ArrowRight size={12} />
              </div>
              <div className="text-terminal-green/80 group-hover:text-terminal-green text-sm font-medium transition-colors">
                {newer.title}
              </div>
            </Link>
          )}
        </div>

        <RelatedPosts posts={related} />
      </div>
    </main>
  );
}
