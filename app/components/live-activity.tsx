"use client";

import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";

import type { ActivityItem } from "@/lib/github-activity";

import styles from "./root-workbench.module.css";

export interface RecentPost {
  title: string;
  href: string;
  /** `YYYY-MM-DD`, authored in Dhaka. */
  date: string;
}

const POLL_MS = 60_000;

/**
 * Compact age such as "4m", "18h" or "3d". Before the browser knows the time it shows the month and
 * day straight from the timestamp, so the server render and the first client render are identical.
 */
function age(iso: string, now: number | null): string {
  if (now === null) return iso.slice(5, 10);
  const minutes = Math.max(0, Math.floor((now - Date.parse(iso)) / 60_000));
  if (minutes < 60) return `${Math.max(1, minutes)}m`;
  const hours = Math.floor(minutes / 60);
  return hours < 48 ? `${hours}h` : `${Math.floor(hours / 24)}d`;
}

/** Public GitHub activity merged with new posts, refreshed while the page is visible. */
export function LiveActivity({ initial, posts }: { initial: ActivityItem[]; posts: readonly RecentPost[] }): ReactElement {
  const [github, setGithub] = useState(initial);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    async function refresh(): Promise<void> {
      if (document.visibilityState === "visible") {
        try {
          const response = await fetch("/api/now");
          const data = response.ok ? (await response.json()) as { items: ActivityItem[] } : null;
          if (active && data && data.items.length > 0) setGithub(data.items);
        } catch {
          // Keep the last good list; every line is still a real link.
        }
      }
      if (active) setNow(Date.now());
    }
    // Switch from dates to ages as soon as the page is interactive, before the first refresh returns.
    const clock = setTimeout(() => setNow(Date.now()), 0);
    void refresh();
    const timer = setInterval(() => void refresh(), POLL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => { active = false; clearTimeout(clock); clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, []);

  const stream = useMemo(() => [
    ...github,
    ...posts.map(post => ({ id: post.href, verb: "published", repo: "arafatops.com", text: post.title, href: post.href, at: `${post.date}T09:00:00+06:00` })),
  ].sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, 4), [github, posts]);

  // On wide layouts the card has a fixed height and lines that do not fit wrap into a clipped column.
  // Those lines are made inert so keyboard focus and screen readers never land on a link nobody can see.
  const list = useRef<HTMLOListElement>(null);
  const [clippedFrom, setClippedFrom] = useState<number | null>(null);
  useEffect(() => {
    const element = list.current;
    if (!element) return;
    const measure = (): void => {
      const index = Array.from(element.children).findIndex(item => (item as HTMLElement).offsetLeft > element.clientWidth / 2);
      setClippedFrom(index === -1 ? null : index);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const frame = requestAnimationFrame(measure);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [stream]);

  return (
    <ol ref={list} className={styles.nowStream} aria-label="Latest public activity">
      {stream.map((item, index) => (
        <li key={item.id} inert={clippedFrom !== null && index >= clippedFrom}>
          <a href={item.href} {...(item.href.startsWith("http") && { rel: "noopener" })}>
            <time dateTime={item.at}>{age(item.at, now)}</time>
            <span className={styles.nowEvent}><span className={styles.nowVerb}>{item.verb}</span> {item.repo}</span>
            {item.text && <span className={styles.nowText}>{item.text}</span>}
          </a>
        </li>
      ))}
    </ol>
  );
}
