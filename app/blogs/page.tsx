import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { ReactElement } from "react";
import { getAllPosts, getAllNotes, getCategories } from "@/lib/blog";
import { getMediumArticles } from "@/lib/medium-articles";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { postListSchema } from "@/components/blog/json-ld";
import { PostCard } from "@/components/blog/post-card";
import { Chip, CircuitTrace, Keycap, PageHeader, SectionHeading } from "@/components/open-circuit";
import styles from "./reading.module.css";
import articlesData from "@/data/articles.json";

const DESCRIPTION =
  "Essays by Easin Arafat on security research, software engineering, business, psychology and life, plus short daily notes. New writing is published here first.";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: DESCRIPTION,
  path: "/blogs",
  ogCard: { category: "blog", prompt: "./read.sh --all --sort=latest" },
});

export const revalidate = 300;

export default async function BlogIndex(): Promise<ReactElement> {
  const posts = await getAllPosts();
  const notes = (await getAllNotes()).slice(0, 3);
  const categories = await getCategories();

  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <JsonLd
        data={postListSchema({
          type: "Blog",
          name: "Easin Arafat - Blog",
          description: DESCRIPTION,
          path: "/blogs",
          posts,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blogs" },
          ],
        })}
      />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/">cd ~</Link><span aria-hidden="true">/</span><span aria-current="page">blogs</span>
      </nav>
      <PageHeader
        command="$ ./read.sh --all --sort=latest"
        title={<>I have opinions. Plural.<span className="oc-green" aria-hidden="true">_</span></>}
        description="Security, engineering, business, life, psychology. I have range. The categories are for your convenience."
      >
        <div className={styles.actions}>
          <Keycap href="/notes" command="$ cat ~/notes" variant="primary">Daily Notes</Keycap>
          <Keycap href="/articles" command="$ ls ~/articles">All articles</Keycap>
        </div>
      </PageHeader>

      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="writing-heading">
          <SectionHeading path="write" title="I said what I said." note="my name is on it" id="writing-heading" />
          <nav className={styles.directory} aria-label="Writing categories">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/blogs/${cat.name}`}>
                cd {cat.name}/ <span>{cat.count} {cat.count === 1 ? "post" : "posts"} <span aria-hidden="true">-&gt;</span></span>
              </Link>
            ))}
          </nav>
          <ol className={`${styles.postList} ${styles.leadList}`}>
            {posts.map((post) => (
              <li key={`${post.category}/${post.slug}`}><PostCard post={post} /></li>
            ))}
          </ol>
        </section>

        <div className={styles.lowerSplit}>
          {notes.length > 0 && (
            <section className="oc-zone" aria-labelledby="latest-notes-heading">
              <SectionHeading path="notes" title="I had another thought." note="I kept this one short" id="latest-notes-heading" />
              <ul className={styles.notes}>
                {notes.map((note) => (
                  <li key={note.slug}>
                    <time dateTime={note.date}>{note.date}</time>
                    <span>{note.title}</span>
                  </li>
                ))}
              </ul>
              <Link href="/notes" className="oc-route">cd notes <ArrowRight size={16} aria-hidden="true" /></Link>
            </section>
          )}
          <section className="oc-zone" aria-labelledby="medium-archive-heading">
            <SectionHeading path="write/medium" title="I was already on Medium." note="I brought the links" id="medium-archive-heading" />
            <p className={styles.intro}>My writing on Medium. Same name. Same lack of restraint. I publish new posts here first.</p>
            <div className={styles.metadata}><Chip tone="muted">On Medium</Chip></div>
            <ol className={styles.archive}>
              {getMediumArticles(articlesData).map((article) => (
                <li key={article.id}>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <time dateTime={article.publishDate}>{article.publishDate}</time>
                    <strong>{article.title}</strong>
                    <ExternalLink size={18} aria-hidden="true" />
                    <span className="oc-sr"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </CircuitTrace>
    </main>
  );
}
