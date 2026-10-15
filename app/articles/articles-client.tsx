"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Copy, Pause, Play, Share2 } from "lucide-react";
import { Chip, CircuitTrace, Keycap, PageHeader, SectionHeading, useMotion } from "@/components/open-circuit";
import { ArticleIndex } from "./article-index";
import styles from "./articles.module.css";
import reading from "../blogs/reading.module.css";

export interface UnifiedArticle {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  readTime: string;
  /** External Medium URL, or internal /blogs/... path for native posts. */
  url: string;
  imageUrl: string;
  tags: string[];
  source: "native" | "medium";
}

/** An article reading desk and a complete, independently reachable archive. */
export default function ArticlesClient({ items: posts }: { items: UnifiedArticle[] }): React.ReactElement {
  const { isMotionEnabled } = useMotion();
  const [currentPost, setCurrentPost] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");
  const elapsedRef = useRef(0);
  const article = posts[currentPost];
  const isAutoRunning = isAutoAdvancing && isMotionEnabled && !isHoverPaused && !isFocusPaused;

  const showPost = (index: number): void => {
    if (index === currentPost) return;
    elapsedRef.current = 0;
    setCountdown(10);
    setCopyMessage("");
    setCurrentPost(index);
  };

  useEffect(() => {
    if (!isAutoRunning || posts.length < 2) return;
    // The one-second tick is the visible ten-second rotation countdown.
    const timer = setInterval(() => {
      elapsedRef.current += 1;
      if (elapsedRef.current < 10) {
        setCountdown(10 - elapsedRef.current);
        return;
      }
      elapsedRef.current = 0;
      setCountdown(10);
      setCopyMessage("");
      setCurrentPost((index) => (index + 1) % posts.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [isAutoRunning, posts.length]);

  useEffect(() => {
    if (posts.length < 2) return;
    for (const index of [(currentPost + 1) % posts.length, (currentPost - 1 + posts.length) % posts.length]) {
      if (posts[index]?.imageUrl) {
        const image = new window.Image();
        image.src = posts[index].imageUrl;
      }
    }
  }, [currentPost, posts]);

  const articleShareUrl = (item: UnifiedArticle): string =>
    item.source === "native" ? `${window.location.origin}${item.url}` : item.url;

  const copyLink = async (): Promise<void> => {
    if (!article) return;
    try {
      await navigator.clipboard.writeText(articleShareUrl(article));
      setCopyMessage("Link copied.");
    } catch (error) {
      console.error("Could not copy article link:", error);
      setCopyMessage("Could not copy. Open the article and copy its address.");
    }
  };

  return (
    <main className={`oc-shell oc-page ${reading.page} ${styles.page}`}>
      <nav className={reading.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/">cd ..</Link><span aria-hidden="true">/</span><span aria-current="page">articles</span>
      </nav>
      <PageHeader
        command="$ ./view_articles.sh --display=latest"
        title={<>I wrote it. You&apos;re welcome.<span className="oc-green" aria-hidden="true">_</span></>}
        description="My essays live here and on Medium. My opinions were never going to fit in a bio."
      >
        <div className={reading.actions}>
          <Keycap href="/blogs" command="$ cd ~/blogs" variant="primary">View All Blogs</Keycap>
          <Keycap href="#article-index" command="$ ls --all">All articles</Keycap>
        </div>
      </PageHeader>
      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="article-desk-heading">
          <SectionHeading path="read" title="I picked the words. You pick the tab." note="my writing, your next read" id="article-desk-heading" />
          {article ? (
            <div
              className={styles.desk}
              onMouseEnter={() => setIsHoverPaused(true)}
              onMouseLeave={() => setIsHoverPaused(false)}
              onFocusCapture={() => setIsFocusPaused(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusPaused(false);
              }}
            >
              <article className={styles.spread} id="selected-article">
                <Link
                  className={styles.cover}
                  href={article.url}
                  target={article.source === "medium" ? "_blank" : undefined}
                  rel={article.source === "medium" ? "noopener noreferrer" : undefined}
                  aria-label={`Read Full Article: ${article.title}${article.source === "medium" ? " (opens in a new tab)" : ""}`}
                >
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1120px) 35vw, 90vw"
                      priority
                      unoptimized={article.imageUrl.startsWith("/api/")}
                    />
                  ) : (
                    <span className={styles.noCover}><BookOpen size={48} aria-hidden="true" />No preview available</span>
                  )}
                </Link>
                <div>
                  <div className={reading.metadata}>
                    <Chip tone={article.source === "native" ? "green" : "amber"}>{article.source === "native" ? "On this site" : "Medium"}</Chip>
                    <time dateTime={article.publishDate}>{article.publishDate}</time>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className={styles.title}>{article.title}</h3>
                  <p className={styles.description}>{article.description}</p>
                  <div className={styles.tags}>
                    {article.tags.map((tag) => <Chip key={tag} tone="muted">#{tag}</Chip>)}
                  </div>
                  <div className={styles.tools}>
                    <Link
                      href={article.url}
                      className={`oc-keycap oc-primary ${styles.readKey}`}
                      target={article.source === "medium" ? "_blank" : undefined}
                      rel={article.source === "medium" ? "noopener noreferrer" : undefined}
                    >
                      <strong>Read Full Article</strong>
                      <code>{article.source === "native" ? "$ cat post.md" : "Read on Medium / new tab"}</code>
                    </Link>
                    <button type="button" onClick={copyLink} className={styles.control}><Copy size={16} aria-hidden="true" />Copy Link</button>
                    <button
                      type="button"
                      className={styles.control}
                      onClick={() => {
                        const text = `Check out this article: ${article.title} - ${articleShareUrl(article)}`;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
                      }}
                    ><Share2 size={16} aria-hidden="true" />Share</button>
                  </div>
                  <p role="status" className={styles.feedback}>{copyMessage}</p>
                </div>
              </article>

              <div className={styles.transport}>
                <div className={styles.arrows}>
                  <button type="button" className={styles.control} onClick={() => showPost((currentPost - 1 + posts.length) % posts.length)} disabled={posts.length < 2} aria-label="Previous post" aria-controls="selected-article"><ArrowLeft size={18} aria-hidden="true" />Prev</button>
                  <span className={styles.position} aria-live={isAutoRunning ? "off" : "polite"}>{currentPost + 1} / {posts.length}</span>
                  <button type="button" className={styles.control} onClick={() => showPost((currentPost + 1) % posts.length)} disabled={posts.length < 2} aria-label="Next post" aria-controls="selected-article">Next<ArrowRight size={18} aria-hidden="true" /></button>
                </div>
                <button
                  type="button"
                  className={styles.control}
                  disabled={!isMotionEnabled || posts.length < 2}
                  aria-pressed={isAutoAdvancing && isMotionEnabled}
                  onClick={() => setIsAutoAdvancing((value) => !value)}
                >
                  {isAutoAdvancing && isMotionEnabled ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                  {!isMotionEnabled ? "Motion paused" : isAutoAdvancing ? `Auto (${countdown}s)` : "Paused"}
                </button>
              </div>
              <p className={styles.feedback}>Hover or focus here to pause rotation.</p>
              <div className={styles.jump}>
                <label htmlFor="article-select">Jump to article</label>
                <select id="article-select" value={currentPost} onChange={(event) => showPost(Number(event.target.value))} aria-controls="selected-article">
                  {posts.map((post, index) => <option key={post.id} value={index}>{index + 1}. {post.title}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className={styles.empty}>
              <h3>No articles found</h3>
              <p>My articles aren&apos;t showing up. Try loading them again.</p>
              <Keycap onClick={() => window.location.reload()} command="$ ./view_articles.sh --retry">Retry Connection</Keycap>
            </div>
          )}
        </section>
        <ArticleIndex items={posts} />
      </CircuitTrace>
    </main>
  );
}
