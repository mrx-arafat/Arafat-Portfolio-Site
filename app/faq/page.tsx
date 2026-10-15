import type { ReactElement } from "react";

import { CircuitTrace, Keycap, PageHeader, SectionHeading } from "@/components/open-circuit";
import faq from "@/data/faq.json";

import { FaqAccordion } from "./faq-accordion";
import styles from "./faq.module.css";

/** Browse frequently asked questions with native, keyboard-operable disclosures. */
export default function Faq(): ReactElement {
  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <PageHeader command="$ man arafat" note="my name / supporting evidence included" title={<>I brought<br /><span className="oc-green">the receipts.</span></>} description="I work on xCloud at Startise, have disclosed 9 CVEs and co-authored a Q1 journal paper. Apparently that raises questions. I put the answers here." />
      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="manual-heading">
          <SectionHeading path="faq" title="I saved you the search." id="manual-heading" note="my answers / expand for specifics" />
          <div className={styles.manual}>
            <div className={styles.manualNote}>
              <p className="oc-small oc-soft">MAN ARAFAT / MY RECEIPTS</p>
              <p>My work.<br />My research.<br />My receipts.</p>
              <span className="oc-small oc-muted">{faq.length} answers / I kept these handy</span>
            </div>
            <FaqAccordion items={faq} />
          </div>
        </section>
        <section className="oc-zone" aria-labelledby="next-heading">
          <SectionHeading path="faq/next" title="I can answer that, too." id="next-heading" note="my inbox handles the follow-ups" />
          <div className={styles.keys}>
            <Keycap href="/contact" variant="primary" command="$ ./connect.sh --secure">Ask me directly</Keycap>
            <Keycap href="/about" command="$ ./about_me.sh --role">See what I do</Keycap>
          </div>
        </section>
      </CircuitTrace>
    </main>
  );
}
