import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getAllNotes } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { MdxContent } from "@/components/mdx-content";
import { Chip, CircuitTrace, PageHeader, Prose, StatusTag } from "@/components/open-circuit";
import styles from "./notes.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Daily Notes",
  description:
    "Daily notes by Easin Arafat: short, unpolished entries on security, philosophy, business and life, logged between the longer essays on the blog.",
  path: "/notes",
  ogCard: { category: "notes", prompt: "tail -f daily.log" },
});

export const revalidate = 300;

/** Keep the daily log quiet, chronological and comfortable to read. */
export default async function NotesPage(): Promise<React.ReactElement> {
  const notes = await getAllNotes();

  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <PageHeader command="$ tail -f daily.log" title={<>I have thoughts.<br /><span className="oc-green">Obviously.</span></>} description="I write about security, philosophy, business and life. These are the shorter entries. I didn't think every opinion needed a full essay.">
        <Link href="/blogs" className="oc-route mt-5"><ArrowLeft size={16} aria-hidden="true" />cd ../blog</Link>
      </PageHeader>
      {notes.length === 0 ? (
        <div className={styles.empty}>
          <StatusTag tone="neutral">I&apos;M THINKING</StatusTag>
          <p className="oc-command mt-4">$ cat /dev/notes</p>
          <p className="oc-muted mt-3">Nothing logged here yet. I have plenty to say on the blog.</p>
        </div>
      ) : (
        <CircuitTrace className={styles.log}>
          {notes.map((note) => (
            <article key={`${note.date}-${note.slug}`} className={`oc-zone ${styles.entry}`} aria-labelledby={`note-${note.date}-${note.slug}`}>
              <header className={styles.entryHeader}>
                <p className="oc-command">$ ls ~/notes/<time dateTime={note.date}>{note.date}</time></p>
                <h2 id={`note-${note.date}-${note.slug}`}>{note.title}</h2>
                {note.tags.length > 0 && <ul className={styles.tags} aria-label="Note tags">{note.tags.map((tag) => <li key={tag}><Chip tone="muted">#{tag}</Chip></li>)}</ul>}
              </header>
              <Prose className={styles.reading}><MdxContent source={note.content} title={note.title} /></Prose>
              <p className={styles.endmark} aria-hidden="true">[ end of entry ]</p>
            </article>
          ))}
        </CircuitTrace>
      )}
    </main>
  );
}
