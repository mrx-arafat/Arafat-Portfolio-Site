import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { Post } from "@/lib/blog";

/** Essay card for blog index / category / tag listings. */
export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.category}/${post.slug}`}
      className="group block bg-surface-raised rounded-2xl border border-terminal-green/20 hover:border-terminal-green/50 hover:shadow-[0_0_18px_rgba(46,213,115,0.2)] transition-all duration-300 p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded bg-terminal-green/10 text-terminal-green border border-terminal-green/20">
          {post.category}
        </span>
        <span className="flex items-center gap-1 text-terminal-green/40 text-xs font-mono">
          <Calendar size={11} />
          {post.date}
        </span>
        <span className="flex items-center gap-1 text-terminal-green/40 text-xs font-mono">
          <Clock size={11} />
          {post.readTime}
        </span>
      </div>
      <h2 className="text-lg font-bold text-terminal-green mb-2 leading-snug group-hover:text-terminal-soft transition-colors">
        {post.title}
      </h2>
      <p className="text-terminal-green/60 text-sm leading-relaxed mb-3">
        {post.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-terminal-green/50 bg-surface-deep border border-terminal-green/10 rounded px-1.5 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1 text-terminal-green/50 text-xs font-mono group-hover:text-terminal-green transition-colors">
          cat post.md
          <ArrowRight
            size={12}
            className="transform group-hover:translate-x-1 transition-transform"
          />
        </span>
      </div>
    </Link>
  );
}
