import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar } from "lucide-react";
import { getAllNotes } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { MdxContent } from "@/components/mdx-content";
import { TerminalHeader } from "@/components/blog/terminal-header";

export const metadata: Metadata = pageMetadata({
  title: "Daily Notes",
  description:
    "Daily notes by Easin Arafat: short, unpolished entries on security, philosophy, business and life, logged between the longer essays on the blog.",
  path: "/notes",
  ogCard: { category: "notes", prompt: "tail -f daily.log" },
});

export const revalidate = 300;

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader path="~/notes" command="tail -f daily.log" />

        <div className="flex items-center mb-8">
          <Link
            href="/blogs"
            className="inline-flex items-center text-terminal-green hover:text-terminal-green/80 mr-4 bg-surface-raised px-3 py-2 rounded-md border border-terminal-green/20 hover:border-terminal-green/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ../blog</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-terminal-green to-terminal-soft uppercase">
            <span aria-hidden="true" className="bracket-open text-terminal-green/70" />
            Daily notes
            <span aria-hidden="true" className="bracket-close text-terminal-green/70" />
          </h1>
        </div>

        {notes.length === 0 ? (
          <div className="bg-surface-raised rounded-2xl border border-terminal-green/20 p-8 text-center">
            <div className="font-mono text-terminal-green/60 text-sm mb-2">
              $ cat /dev/notes
            </div>
            <div className="text-terminal-green/40 font-mono text-xs">
              No notes yet — first one lands soon.
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {notes.map((note) => (
              <article
                key={`${note.date}-${note.slug}`}
                className="bg-surface-raised rounded-2xl border border-terminal-green/20 p-6"
              >
                <header className="flex flex-wrap items-center gap-3 mb-4 border-b border-terminal-green/10 pb-3">
                  <span className="flex items-center gap-1 text-terminal-green/40 text-xs font-mono">
                    <Calendar size={11} />
                    {note.date}
                  </span>
                  <h2 className="text-terminal-green font-bold">{note.title}</h2>
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-terminal-green/50 bg-surface-deep border border-terminal-green/10 rounded px-1.5 py-0.5"
                    >
                      #{tag}
                    </span>
                  ))}
                </header>
                <div className="blog-prose text-sm">
                  <MdxContent source={note.content} title={note.title} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
