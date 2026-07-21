import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { getAllPosts, getAdjacentPosts, getPost, isPreviewMode } from "@/lib/blog";
import { MdxContent } from "@/components/mdx-content";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) return {};
  const ogImage =
    post.cover ??
    `/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(category)}`;
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://www.arafatops.com/blogs/${category}/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) notFound();

  const preview = await isPreviewMode();

  const published = await getAllPosts();
  const { older, newer } = getAdjacentPosts(published, category, slug);

  const baseUrl = "https://www.arafatops.com";
  const postUrl = `${baseUrl}/blogs/${category}/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: postUrl,
        datePublished: post.date,
        keywords: post.tags.join(", "),
        articleSection: category,
        image:
          post.cover ??
          `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(category)}`,
        author: {
          "@type": "Person",
          "@id": `${baseUrl}/#person`,
          name: "Easin Arafat",
          url: baseUrl,
        },
        publisher: {
          "@type": "Person",
          "@id": `${baseUrl}/#person`,
          name: "Easin Arafat",
          url: baseUrl,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Blog", item: `${baseUrl}/blogs` },
          { "@type": "ListItem", position: 2, name: category, item: `${baseUrl}/blogs/${category}` },
          { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-terminal-green leading-tight mb-3">
              {post.title}
            </h1>
            <p className="text-[#c9d1d9]/80 text-sm md:text-base leading-relaxed">
              {post.description}
            </p>
          </header>

          <div className="blog-prose">
            <MdxContent source={post.content} />
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
      </div>
    </main>
  );
}
