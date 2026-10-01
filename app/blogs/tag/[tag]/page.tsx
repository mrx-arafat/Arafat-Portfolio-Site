import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { PostCard } from "@/components/blog/post-card";
import { TerminalHeader } from "@/components/blog/terminal-header";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  // Tag listings are thin and overlap the category pages, so they stay out
  // of the index; links on them are still followed.
  return pageMetadata({
    title: `Posts tagged ${decoded}`,
    description: `Posts tagged ${decoded} on Easin Arafat's blog: essays on security research, engineering, business, psychology and life, newest first.`,
    path: `/blogs/tag/${tag}`,
    ogCard: { category: "tag", path: "blogs", prompt: `grep -r "#${decoded}" ./` },
    noindex: true,
  });
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = await getPostsByTag(decoded);
  if (posts.length === 0) notFound();

  return (
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots">
      <div className="max-w-5xl mx-auto">
        <TerminalHeader path="~/blogs" command={`grep -r "#${decoded}" ./`} />

        <div className="flex items-center mb-3">
          <Link
            href="/blogs"
            className="inline-flex items-center text-terminal-green hover:text-terminal-green/80 mr-4 bg-surface-raised px-3 py-2 rounded-md border border-terminal-green/20 hover:border-terminal-green/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ..</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-terminal-green to-terminal-soft">
            <span aria-hidden="true" className="bracket-open text-terminal-green/70" />#{decoded}
            <span aria-hidden="true" className="bracket-close text-terminal-green/70" />
          </h1>
          <span className="ml-3 text-terminal-green/40 font-mono text-sm">
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </span>
        </div>
        <p className="text-terminal-green/60 text-sm leading-relaxed mb-8">
          Posts tagged {decoded}, newest first.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostCard key={`${post.category}/${post.slug}`} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
