import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getCategories, getCategoryInfo } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { postListSchema } from "@/components/blog/json-ld";
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
  const info = getCategoryInfo(category);
  return pageMetadata({
    title: info.title,
    description: info.description,
    path: `/blogs/${category}`,
    ogCard: { category, prompt: "ls --sort=latest" },
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const posts = (await getAllPosts()).filter((p) => p.category === category);
  if (posts.length === 0) notFound();

  const info = getCategoryInfo(category);
  const path = `/blogs/${category}`;

  return (
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots">
      <JsonLd
        data={postListSchema({
          type: "CollectionPage",
          name: info.title,
          description: info.description,
          path,
          posts,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blogs" },
            { name: info.label, path },
          ],
        })}
      />
      <div className="max-w-5xl mx-auto">
        <TerminalHeader
          path={`~/blogs/${category}`}
          command={`ls --sort=latest`}
        />

        <div className="flex items-center mb-3">
          <Link
            href="/blogs"
            className="inline-flex items-center text-terminal-green hover:text-terminal-green/80 mr-4 bg-surface-raised px-3 py-2 rounded-md border border-terminal-green/20 hover:border-terminal-green/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ..</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-terminal-green to-terminal-soft uppercase">
            <span aria-hidden="true" className="bracket-open text-terminal-green/70" />
            {info.label}
            <span aria-hidden="true" className="bracket-close text-terminal-green/70" />
          </h1>
          <span className="ml-3 text-terminal-green/40 font-mono text-sm">
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </span>
        </div>
        <p className="text-terminal-green/60 text-sm leading-relaxed mb-8">
          {info.tagline}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
