import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getCategories } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";
import { TerminalHeader } from "@/components/blog/terminal-header";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ category: c.name }));
}

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)}`,
    description: `Essays on ${category} by Easin Arafat.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const posts = (await getAllPosts()).filter((p) => p.category === category);
  if (posts.length === 0) notFound();

  return (
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots">
      <div className="max-w-5xl mx-auto">
        <TerminalHeader
          path={`~/blogs/${category}`}
          command={`ls --sort=latest`}
        />

        <div className="flex items-center mb-8">
          <Link
            href="/blogs"
            className="inline-flex items-center text-terminal-green hover:text-terminal-green/80 mr-4 bg-surface-raised px-3 py-2 rounded-md border border-terminal-green/20 hover:border-terminal-green/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ..</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-terminal-green to-terminal-soft uppercase">
            <span className="text-terminal-green/70">[</span>
            {category}
            <span className="text-terminal-green/70">]</span>
          </h1>
          <span className="ml-3 text-terminal-green/40 font-mono text-sm">
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
