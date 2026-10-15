import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { PostCard } from "@/components/blog/post-card";
import { Chip, CircuitTrace, Keycap, PageHeader, SectionHeading } from "@/components/open-circuit";
import styles from "../../reading.module.css";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams(): Promise<{ tag: string }[]> {
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

export default async function TagPage({ params }: Props): Promise<ReactElement> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = await getPostsByTag(decoded);
  if (posts.length === 0) notFound();

  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/blogs">cd ..</Link><span aria-hidden="true">/</span><span aria-current="page">tag / {decoded}</span>
      </nav>
      <PageHeader
        command={`$ grep -r "#${decoded}" ~/blogs`}
        title="I tagged my opinions."
        description="Even my tangents have an index. I made it easy to keep up."
        note="my words, with labels"
      />
      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="tag-posts-heading">
          <SectionHeading path="write/connections" title="I have receipts for that." note="my posts, connected" id="tag-posts-heading" />
          <div className={styles.thread}>
            <Chip>{posts.length} post{posts.length === 1 ? "" : "s"}</Chip>
            <p>These are my <strong>#{decoded}</strong> posts. I made the connection; you get the links.</p>
          </div>
          <ol className={styles.postList}>
            {posts.map((post) => (
              <li key={`${post.category}/${post.slug}`}><PostCard post={post} highlightTag={decoded} /></li>
            ))}
          </ol>
          <div className={styles.actions}>
            <Keycap href="/blogs" command="$ cd ~/blogs">Back to all writing</Keycap>
          </div>
        </section>
      </CircuitTrace>
    </main>
  );
}
