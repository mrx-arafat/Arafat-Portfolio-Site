import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import type { ReactElement } from "react";

import { MdxContent } from "@/components/mdx-content";
import { Chip, CircuitTrace, Keycap, PageHeader, Prose, SectionHeading } from "@/components/open-circuit";
import { pageMetadata } from "@/lib/seo";

import styles from "./blog-api.module.css";

// Operator reference for the token-protected publish endpoint, not content
// meant to rank: kept out of the index, links still followed.
export const metadata: Metadata = pageMetadata({
  title: "Blog Publish API",
  description:
    "API reference for publishing posts to arafatops.com - endpoints, auth, fields, and examples.",
  path: "/docs/blog-api",
  noindex: true,
});

/** Render the repository's publishing manual as a readable operator reference. */
export default function BlogApiDocsPage(): ReactElement {
  // Single source of truth: the repo markdown doc, read at build time
  const doc = fs.readFileSync(
    path.join(process.cwd(), "docs", "api", "blog-publish.md"),
    "utf8"
  );

  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <PageHeader command="$ man blog-publish" note="my blog / my publishing instructions" title={<>I write.<br /><span className="oc-green">I ship.</span></>} description="My publishing routine: draft, read back, preview, publish. Token authentication gets you in. Good prose is still your problem.">
        <div className={styles.chips}><Chip>My API uses tokens</Chip><Chip tone="amber">I start with drafts</Chip></div>
      </PageHeader>
      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="reference-heading">
          <SectionHeading path="docs/blog-api" title="Read my fine print." id="reference-heading" note="my routine / draft / read back / preview / publish" />
          <div className={styles.reference}>
            <div className={styles.index}>
              <h3 id="index-heading">My section shortcuts</h3>
              <nav aria-label="Blog API reference sections">
                <a href="#authentication">Authentication <span aria-hidden="true">-&gt;</span></a>
                <a href="#the-full-workflow">The full workflow <span aria-hidden="true">-&gt;</span></a>
                <a href="#errors">Errors <span aria-hidden="true">-&gt;</span></a>
                <a href="#draft-preview">Draft preview <span aria-hidden="true">-&gt;</span></a>
                <a href="#recommended-ai-workflow">Recommended AI workflow <span aria-hidden="true">-&gt;</span></a>
              </nav>
              <Keycap href="/blogs" command="$ cd ~/blogs">Read what I published</Keycap>
            </div>
            <article className={styles.document}>
              <div className={styles.fileLabel}><span>docs/api/blog-publish.md</span><span>MY REFERENCE / READ ONLY</span></div>
              <Prose className={styles.body}><MdxContent source={doc} title="Blog Publish API" /></Prose>
            </article>
          </div>
        </section>
      </CircuitTrace>
    </main>
  );
}
