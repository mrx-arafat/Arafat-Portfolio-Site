import type { ReactElement } from "react";
import { SectionHeading } from "@/components/open-circuit";
import type { Post } from "@/lib/blog";
import { PostCard } from "./post-card";
import styles from "@/app/blogs/reading.module.css";

/** Compact cards linking to other posts, shown under an article. */
export function RelatedPosts({ posts }: { posts: Post[] }): ReactElement | null {
  if (posts.length === 0) return null;

  return (
    <section className="oc-zone" aria-labelledby="related-posts-heading">
      <SectionHeading path="read/related" title="I wrote more. Naturally." note="my other essays" id="related-posts-heading" />
      <ol className={styles.postList}>
        {posts.map((post) => (
          <li key={`${post.category}/${post.slug}`}><PostCard post={post} /></li>
        ))}
      </ol>
    </section>
  );
}
