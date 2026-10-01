import type { ReactElement, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Layers, PenLine } from "lucide-react";

import type { ClientProject } from "@/components/client-work/content";
import type { Post } from "@/lib/blog";

const LATEST_POST_COUNT = 5;

const ROW =
  "group relative rounded-xl px-3 py-3 transition-colors hover:bg-terminal-green/5";

/** Stretched link: the title alone is the anchor text, the whole row is the hit area. */
const ROW_LINK =
  "text-sm font-medium text-terminal-green after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-terminal-green/60";

interface PanelProps {
  icon: ReactNode;
  title: string;
  href: string;
  command: string;
  children: ReactNode;
}

/** Dashboard panel shell matching the Extracurricular card: icon, label, `cd` link. */
function Panel({ icon, title, href, command, children }: PanelProps): ReactElement {
  return (
    <section className="bg-surface-raised rounded-2xl overflow-hidden border border-terminal-green/20">
      <div className="p-4 flex items-center justify-between gap-3 border-b border-terminal-green/10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-terminal-green/20 rounded-md flex items-center justify-center border border-terminal-green/30">
            {icon}
          </div>
          <h2 className="text-terminal-green font-medium uppercase">{title}</h2>
        </div>
        <Link
          href={href}
          prefetch={false}
          className="-my-2 flex items-center gap-1.5 whitespace-nowrap py-2 text-terminal-green/80 text-xs font-mono transition-colors hover:text-terminal-green"
        >
          <span>{command}</span>
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
      {children}
    </section>
  );
}

/** Home dashboard panel linking each client case study. Server-rendered, no client JS. */
export function CaseStudiesPanel({
  projects,
}: {
  projects: readonly ClientProject[];
}): ReactElement {
  return (
    <Panel
      icon={<Layers size={14} className="text-terminal-green" aria-hidden="true" />}
      title="Case studies"
      href="/projects"
      command="cd projects"
    >
      <ul className="p-2 grid grid-cols-1 md:grid-cols-2 gap-1">
        {projects.map((project) => (
          <li key={project.id} className={ROW}>
            <Link href={project.detailPath} prefetch={false} className={ROW_LINK}>
              {project.title}
            </Link>
            <p className="mt-1 text-terminal-green/80 text-xs leading-relaxed">
              {project.summary}
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/**
 * Home dashboard panel linking the newest essays and every blog category.
 * Expects `posts` newest first; renders without rows when none are available.
 */
export function LatestPostsPanel({
  posts,
}: {
  posts: readonly Post[];
}): ReactElement {
  const linkable = posts.filter((post) => post.category && post.slug);
  const latest = linkable.slice(0, LATEST_POST_COUNT);
  const categories = Array.from(new Set(linkable.map((post) => post.category)));

  return (
    <Panel
      icon={<PenLine size={14} className="text-terminal-green" aria-hidden="true" />}
      title="Latest posts"
      href="/blogs"
      command="cd blogs"
    >
      {latest.length > 0 ? (
        <ul className="p-2">
          {latest.map((post) => (
            <li
              key={`${post.category}/${post.slug}`}
              className={`${ROW} flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3`}
            >
              <time
                dateTime={post.date}
                className="whitespace-nowrap text-terminal-green/80 font-mono text-xs"
              >
                {post.date}
              </time>
              <Link
                href={`/blogs/${post.category}/${post.slug}`}
                prefetch={false}
                className={`${ROW_LINK} sm:flex-1 sm:min-w-0`}
              >
                {post.title}
              </Link>
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="hidden sm:block self-center flex-shrink-0 text-terminal-green/0 transition-colors group-hover:text-terminal-green/50"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-4 text-terminal-green/80 text-xs font-mono">
          No posts loaded right now - the full archive lives in ~/blogs.
        </p>
      )}
      {categories.length > 0 && (
        <ul
          aria-label="Blog categories"
          className="flex flex-wrap gap-2 px-4 pt-3 pb-4 border-t border-terminal-green/10"
        >
          {categories.map((name) => (
            <li key={name}>
              <Link
                href={`/blogs/${name}`}
                prefetch={false}
                className="block rounded-lg bg-surface-deep px-3 py-2 text-xs font-mono text-terminal-green/80 border border-terminal-green/20 transition-colors hover:text-terminal-green hover:border-terminal-green/50"
              >
                cd {name}/
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
