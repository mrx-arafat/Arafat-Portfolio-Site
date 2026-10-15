import type { ReactElement } from "react";

import styles from "./faq.module.css";

interface FaqItem { q: string; a: string }

/** Render the FAQ as native disclosures, with the first answer already open. */
export function FaqAccordion({ items }: { items: FaqItem[] }): ReactElement {
  return (
    <div className={styles.entries}>
      {items.map((item, index) => (
        <details key={item.q} className={styles.entry} open={index === 0}>
          <summary><span>{item.q}</span><span className={styles.indicator} aria-hidden="true" /></summary>
          <div className={styles.answer}><span className={styles.entryLabel} aria-hidden="true">DESCRIPTION</span><p>{item.a}</p></div>
        </details>
      ))}
    </div>
  );
}
