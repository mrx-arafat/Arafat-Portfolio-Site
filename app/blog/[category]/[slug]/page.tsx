import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { getAllPosts, getPost } from "@/lib/blog";
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
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) notFound();

  const published = await getAllPosts();
  const index = published.findIndex(
    (p) => p.category === category && p.slug === slug
  );
  const newer = index > 0 ? published[index - 1] : null;
  const older = index < published.length - 1 ? published[index + 1] : null;

  return (
    <main className="min-h-screen bg-[#121212] text-[#2ed573] p-4 md:p-8 grid-dots">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader
          path={`~/blog/${category}/${slug}`}
          command="cat index.mdx"
        />

        <div className="flex items-center mb-8">
          <Link
            href={`/blog/${category}`}
            className="inline-flex items-center text-[#2ed573] hover:text-[#2ed573]/80 bg-[#0f0f0f] px-3 py-2 rounded-md border border-[#2ed573]/20 hover:border-[#2ed573]/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ..</span>
          </Link>
        </div>

        <article className="bg-[#0f0f0f] rounded-2xl border border-[#2ed573]/20 p-6 md:p-10">
          <header className="mb-8 border-b border-[#2ed573]/10 pb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href={`/blog/${category}`}
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#2ed573]/10 text-[#2ed573] border border-[#2ed573]/20 hover:bg-[#2ed573]/20 transition-colors"
              >
                cd blog/{category}
              </Link>
              <span className="flex items-center gap-1 text-[#2ed573]/40 text-xs font-mono">
                <Calendar size={11} />
                {post.date}
              </span>
              <span className="flex items-center gap-1 text-[#2ed573]/40 text-xs font-mono">
                <Clock size={11} />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-[#2ed573] leading-tight mb-3">
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
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-[#2ed573]/10">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="text-xs font-mono text-[#2ed573]/60 bg-[#0a0a0a] border border-[#2ed573]/15 hover:border-[#2ed573]/40 hover:text-[#2ed573] rounded px-2 py-1 transition-colors"
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
              href={`/blog/${older.category}/${older.slug}`}
              className="group bg-[#0f0f0f] rounded-xl border border-[#2ed573]/20 hover:border-[#2ed573]/50 p-4 transition-colors"
            >
              <div className="flex items-center gap-1 text-[#2ed573]/40 text-xs font-mono mb-1">
                <ArrowLeft size={12} /> older
              </div>
              <div className="text-[#2ed573]/80 group-hover:text-[#2ed573] text-sm font-medium transition-colors">
                {older.title}
              </div>
            </Link>
          ) : (
            <div></div>
          )}
          {newer && (
            <Link
              href={`/blog/${newer.category}/${newer.slug}`}
              className="group bg-[#0f0f0f] rounded-xl border border-[#2ed573]/20 hover:border-[#2ed573]/50 p-4 text-right transition-colors"
            >
              <div className="flex items-center justify-end gap-1 text-[#2ed573]/40 text-xs font-mono mb-1">
                newer <ArrowRight size={12} />
              </div>
              <div className="text-[#2ed573]/80 group-hover:text-[#2ed573] text-sm font-medium transition-colors">
                {newer.title}
              </div>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
