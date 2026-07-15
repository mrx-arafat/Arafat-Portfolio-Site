import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, PenLine } from "lucide-react";
import { getAllPosts, getAllNotes, getCategories } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";
import { TerminalHeader } from "@/components/blog/terminal-header";
import articlesData from "@/data/articles.json";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Security research, engineering, business, psychology, and life — essays and daily notes by Easin Arafat.",
  alternates: {
    canonical: "https://www.arafatops.com/blogs",
    types: { "application/rss+xml": "https://www.arafatops.com/blogs/rss.xml" },
  },
};

export const revalidate = 300;

export default async function BlogIndex() {
  const posts = await getAllPosts();
  const notes = (await getAllNotes()).slice(0, 3);
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots">
      <div className="max-w-5xl mx-auto">
        <TerminalHeader path="~/blogs" command="./read.sh --all --sort=latest" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-terminal-green hover:text-terminal-green/80 mr-4 bg-surface-raised px-3 py-2 rounded-md border border-terminal-green/20 hover:border-terminal-green/40 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span className="text-sm">cd ..</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-terminal-green to-terminal-soft">
              <span className="text-terminal-green/70">[</span>
              BLOG
              <span className="text-terminal-green/70">]</span>
            </h1>
          </div>
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-terminal-green text-sm bg-surface-raised px-3 py-2 rounded-md border border-terminal-green/30 hover:border-terminal-green/60 transition-colors"
          >
            <PenLine size={16} />
            <span>Daily Notes</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/blogs/${cat.name}`}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-raised text-terminal-green/70 border border-terminal-green/20 hover:text-terminal-green hover:border-terminal-green/50 transition-colors"
            >
              cd {cat.name}/ <span className="text-terminal-green/40">({cat.count})</span>
            </Link>
          ))}
        </div>

        {/* Essays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {posts.map((post) => (
            <PostCard key={`${post.category}/${post.slug}`} post={post} />
          ))}
        </div>

        {/* Latest notes strip */}
        {notes.length > 0 && (
          <div className="mb-10 bg-surface-raised rounded-2xl border border-terminal-green/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-terminal-green font-semibold tracking-wide text-sm">
                LATEST NOTES
              </span>
              <Link
                href="/notes"
                className="flex items-center gap-1 text-terminal-green/60 hover:text-terminal-green text-xs font-mono transition-colors"
              >
                cd notes <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.slug}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="text-terminal-green/40 font-mono text-xs whitespace-nowrap">
                    {note.date}
                  </span>
                  <span className="text-terminal-green/80">{note.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medium archive */}
        <div className="bg-surface-raised rounded-2xl border border-terminal-green/20 p-5">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={16} className="text-terminal-green/60" />
            <span className="text-terminal-green font-semibold tracking-wide text-sm">
              ARCHIVE — ON MEDIUM
            </span>
          </div>
          <p className="text-terminal-green/40 text-xs font-mono mb-4">
            older writing lives on Medium — new posts are native
          </p>
          <div className="space-y-1">
            {articlesData.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-terminal-green/5 transition-colors"
              >
                <span className="text-terminal-green/40 font-mono text-xs whitespace-nowrap">
                  {article.publishDate}
                </span>
                <span className="text-terminal-green/70 group-hover:text-terminal-green text-sm flex-1 transition-colors">
                  {article.title}
                </span>
                <ExternalLink
                  size={12}
                  className="text-terminal-green/30 group-hover:text-terminal-green/60 flex-shrink-0 transition-colors"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
