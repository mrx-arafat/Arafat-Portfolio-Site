import type { ReactElement } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Chip } from "@/components/open-circuit";
import type { Post } from "@/lib/blog";
import styles from "@/app/blogs/reading.module.css";

interface PostCardProps {
  post: Post;
  highlightTag?: string;
}

/** A readable index entry with one stretched title link and independent tag links. */
export function PostCard({ post, highlightTag }: PostCardProps): ReactElement {
  return (
    <article className={styles.post}>
      <div className={styles.metadata}>
        <Chip>{post.category}</Chip>
        <time dateTime={post.date}>{post.date}</time>
        <span>{post.readTime}</span>
      </div>
      <h3>
        <Link className="oc-stretched" href={`/blogs/${post.category}/${post.slug}`}>
          {post.title}
        </Link>
      </h3>
      <p>{post.description}</p>
      <div className={styles.tags}>
        {post.tags.slice(0, 4).map((tag) => (
          <Link key={tag} href={`/blogs/tag/${encodeURIComponent(tag)}`}>
            {tag === highlightTag ? <mark>#{tag}</mark> : `#${tag}`}
          </Link>
        ))}
      </div>
      <span className={styles.readPrompt} aria-hidden="true">
        cat post.md <ArrowRight size={16} />
      </span>
    </article>
  );
}
