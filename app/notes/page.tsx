import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar } from "lucide-react";
import { getAllNotes } from "@/lib/blog";
import { MdxContent } from "@/components/mdx-content";
import { TerminalHeader } from "@/components/blog/terminal-header";

export const metadata: Metadata = {
  title: "Daily Notes",
  description:
    "Short daily notes — raw thoughts on security, philosophy, business, and life by Easin Arafat.",
};

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <main className="min-h-screen bg-[#121212] text-[#2ed573] p-4 md:p-8 grid-dots">
      <div className="max-w-3xl mx-auto">
        <TerminalHeader path="~/notes" command="tail -f daily.log" />

        <div className="flex items-center mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#2ed573] hover:text-[#2ed573]/80 mr-4 bg-[#0f0f0f] px-3 py-2 rounded-md border border-[#2ed573]/20 hover:border-[#2ed573]/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ../blog</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2ed573] to-[#7bed9f]">
            <span className="text-[#2ed573]/70">[</span>
            DAILY_NOTES
            <span className="text-[#2ed573]/70">]</span>
          </h1>
        </div>

        {notes.length === 0 ? (
          <div className="bg-[#0f0f0f] rounded-2xl border border-[#2ed573]/20 p-8 text-center">
            <div className="font-mono text-[#2ed573]/60 text-sm mb-2">
              $ cat /dev/notes
            </div>
            <div className="text-[#2ed573]/40 font-mono text-xs">
              No notes yet — first one lands soon.
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {notes.map((note) => (
              <article
                key={`${note.date}-${note.slug}`}
                className="bg-[#0f0f0f] rounded-2xl border border-[#2ed573]/20 p-6"
              >
                <header className="flex flex-wrap items-center gap-3 mb-4 border-b border-[#2ed573]/10 pb-3">
                  <span className="flex items-center gap-1 text-[#2ed573]/40 text-xs font-mono">
                    <Calendar size={11} />
                    {note.date}
                  </span>
                  <h2 className="text-[#2ed573] font-bold">{note.title}</h2>
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-[#2ed573]/50 bg-[#0a0a0a] border border-[#2ed573]/10 rounded px-1.5 py-0.5"
                    >
                      #{tag}
                    </span>
                  ))}
                </header>
                <div className="blog-prose text-sm">
                  <MdxContent source={note.content} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
