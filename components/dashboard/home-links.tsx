import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ClientProject } from "@/components/client-work/content";
import type { Post } from "@/lib/blog";

const LATEST_POST_COUNT = 5;

/** Pair each case study with an existing capture of its real interface. */
export function CaseStudiesPanel({ projects }: { projects: readonly ClientProject[] }): ReactElement {
  return (
    <div aria-label="Case studies">
      <div className="oc-case-label"><span>I BUILT IT / HERE&apos;S THE TOUR</span><span aria-hidden="true">v</span></div>
      {projects.map((project, index) => (
        <article key={project.id} className={"oc-case-study" + (index % 2 ? " oc-reverse" : "")}>
          <div className="oc-case-copy">
            <h3><Link prefetch={false} href={project.detailPath}>{project.title}</Link></h3>
            <p>{project.summary}</p>
            <Link className="oc-route" prefetch={false} href={project.detailPath}>Explore {project.title} <span aria-hidden="true">-&gt;</span></Link>
            <a className="oc-route" href={project.deploymentUrl}>Open {project.deploymentLabel} <span aria-hidden="true">-&gt;</span></a>
          </div>
          {project.slides[0] && (
            <figure className="oc-case-figure">
              <div className="relative aspect-[16/10] w-full"><Image src={project.slides[0].image} alt={project.slides[0].alt} fill sizes="(min-width: 640px) 44vw, 85vw" className="object-contain" /></div>
              <figcaption className="oc-small oc-muted">I built this view. {project.slides[0].caption}</figcaption>
            </figure>
          )}
        </article>
      ))}
    </div>
  );
}

/** Preserve the existing latest-post selection and archive fallback in a reading-first index. */
export function LatestPostsPanel({ posts }: { posts: readonly Post[] }): ReactElement {
  const linkable = posts.filter(post => post.category && post.slug);
  const latest = linkable.slice(0, LATEST_POST_COUNT);
  const categories = Array.from(new Set(linkable.map(post => post.category)));
  return <div><h3 className="oc-sr">More from me</h3>{latest.length > 0 ? <ol className="oc-posts">{latest.map(post => <li key={post.category + "/" + post.slug}><Link className="oc-post-link" prefetch={false} href={"/blogs/" + post.category + "/" + post.slug}><time dateTime={post.date}>{post.date}</time><span className="oc-post-title">{post.title}</span><span className="oc-post-arrow" aria-hidden="true">-&gt;</span></Link></li>)}</ol> : <p className="oc-muted">My archive is taking its time. Read everything in ~/blogs.</p>}{categories.length > 0 && <nav className="oc-category-links" aria-label="Blog categories">{categories.map(name => <Link key={name} prefetch={false} href={"/blogs/" + name}>cd {name}/ -&gt;</Link>)}</nav>}<Link className="oc-route" href="/blogs">cd blogs -&gt;</Link></div>;
}
