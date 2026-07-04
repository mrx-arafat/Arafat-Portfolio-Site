import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllTags, getPostsByTag } from "@/lib/blog";
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
  return {
    title: `#${decoded}`,
    description: `Posts tagged ${decoded}.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = await getPostsByTag(decoded);
  if (posts.length === 0) notFound();

  return (
    <main className="min-h-screen bg-[#121212] text-[#2ed573] p-4 md:p-8 grid-dots">
      <div className="max-w-5xl mx-auto">
        <TerminalHeader path="~/blog" command={`grep -r "#${decoded}" ./`} />

        <div className="flex items-center mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#2ed573] hover:text-[#2ed573]/80 mr-4 bg-[#0f0f0f] px-3 py-2 rounded-md border border-[#2ed573]/20 hover:border-[#2ed573]/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ..</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2ed573] to-[#7bed9f]">
            <span className="text-[#2ed573]/70">[</span>#{decoded}
            <span className="text-[#2ed573]/70">]</span>
          </h1>
          <span className="ml-3 text-[#2ed573]/40 font-mono text-sm">
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostCard key={`${post.category}/${post.slug}`} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
