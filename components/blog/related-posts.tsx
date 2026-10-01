import type { ReactElement } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { Post } from "@/lib/blog";

/** Compact cards linking to other posts, shown under an article. */
export function RelatedPosts({ posts }: { posts: Post[] }): ReactElement | null {
  if (posts.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-terminal-green font-semibold tracking-wide text-sm uppercase mb-4">
        Keep reading
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={`${post.category}/${post.slug}`}
            href={`/blogs/${post.category}/${post.slug}`}
            className="group bg-surface-raised rounded-xl border border-terminal-green/20 hover:border-terminal-green/50 p-4 transition-colors"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-terminal-green/40 text-xs font-mono mb-1">
              <span>{post.category}</span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {post.readTime}
              </span>
            </div>
            <h3 className="text-terminal-green/80 group-hover:text-terminal-green text-sm font-medium transition-colors">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
