import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CircuitTrace, Keycap, PageHeader, SectionHeading, StatusTag } from "@/components/open-circuit";

import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page does not exist on arafatops.com. Head back to the dashboard or browse projects, security research and the blog.",
  robots: { index: false, follow: true },
};

const SECTIONS = [
  { href: "/", command: "cd ~", note: "My very own homepage" },
  { href: "/about", command: "cd ~/about", note: "My backstory, with receipts" },
  { href: "/projects", command: "cd ~/projects", note: "Things I actually shipped" },
  { href: "/security-research", command: "cd ~/security-research", note: "My nine CVEs" },
  { href: "/blogs", command: "cd ~/blogs", note: "My thoughts, published" },
  { href: "/contact", command: "cd ~/contact", note: "Your chance to reach me" },
] as const;

/** Recover a missing path with a terminal readout and real navigation links. */
export default function NotFound(): ReactElement {
  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <div className={styles.missing}>
        <div>
          <PageHeader command="$ cd ./requested-page" note="exit 404 / I have better links" title={<>I&apos;m here.<br /><span className="oc-green">Page isn&apos;t.</span></>} description="I can't find a page at this address. My projects, research, and writing make a better destination than this error. Pick your next obsession below." />
          <div className={styles.returnKey}><Keycap href="/" variant="primary" command="$ cd ~">Take me back to Arafat</Keycap></div>
        </div>
        <div className={styles.readout}>
          <div className={styles.readoutHeader}><span className="oc-small">~/404</span><StatusTag tone="warn">I OWE YOU A PAGE</StatusTag></div>
          <p className={styles.exitCode} aria-hidden="true">404<span>_</span></p>
          <p className={styles.error}>lookup: ./requested-page:<br />I have no page here</p>
          <p className={styles.recovery}>My ego survived.<br /><span className="oc-soft">My working links are below.</span></p>
        </div>
      </div>
      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="available-heading">
          <SectionHeading path="available" title="My better addresses." id="available-heading" note="my work / worth the detour" />
          <nav aria-label="Main sections">
            <ul className={styles.routes}>
              {SECTIONS.map((section) => (
                <li key={section.href}><Link href={section.href}><span className={styles.command}>{section.command}</span><span className={styles.note}>{section.note}</span><ArrowRight size={20} aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </nav>
        </section>
      </CircuitTrace>
    </main>
  );
}
