import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CircuitTrace, PageHeader, SectionHeading, StatusTag } from "@/components/open-circuit";
import cveData from "@/data/cve.json";
import { CveExplorer, type CveItem } from "./cve-explorer";
import styles from "./security-research.module.css";

const items = cveData.items as CveItem[];

/** Connect the research method to the original, filterable disclosure records. */
export default function SecurityResearch(): React.ReactElement {
  const published = items.filter((item) => item.status === "published").length;
  const highest = Math.max(...items.map((item) => item.cvss));
  const categories = new Set(items.map((item) => item.type)).size;

  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <div className={styles.topline}>
        <Link href="/" className="oc-route"><ArrowLeft size={16} aria-hidden="true" />Back to dashboard</Link>
        <StatusTag tone="warn">RESPONSIBLY DISCLOSED</StatusTag>
      </div>
      <div className={styles.heroGrid}>
        <PageHeader command="$ cat ~/security/disclosures.log" title={<>I found {items.length} flaws.<br /><span className="oc-green">My name&apos;s on them.</span></>} description={<>I disclosed {items.length} WordPress plugin flaws through Patchstack. {published} published CVEs, with the original advisories below. I like my bragging independently checkable.</>} />
        <aside className={styles.dossier} aria-labelledby="researcher-heading">
          <p className="oc-command">Yes, that&apos;s me.</p>
          <h2 id="researcher-heading">{cveData.researcher.handle}</h2>
          <p className={styles.dossierNote}>My WordPress disclosures</p>
          <dl className={styles.registerFacts}>
            <div><dt>Total findings</dt><dd>{String(items.length).padStart(2, "0")}</dd></div>
            <div><dt>Published CVEs</dt><dd>{String(published).padStart(2, "0")}</dd></div>
            <div><dt>Peak CVSS</dt><dd>{highest.toFixed(1)}</dd></div>
            <div><dt>Attack classes</dt><dd>{String(categories).padStart(2, "0")}</dd></div>
          </dl>
          <a href={cveData.researcher.profile} target="_blank" rel="noopener noreferrer" className="oc-route">Patchstack VDP<ArrowUpRight size={18} aria-hidden="true" /></a>
        </aside>
      </div>
      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="method-heading">
          <SectionHeading path="security/reproduce" title="I make the bug repeat itself." note="I do the paperwork, too" id="method-heading" />
          <ol className={styles.methodStrip} aria-label="Research method">
            <li><span>REPRODUCE</span><p>I reproduce the flaw.</p></li>
            <li><span>DOCUMENT</span><p>I document the impact.</p></li>
            <li><span>DISCLOSE</span><p>I coordinate disclosure.</p></li>
            <li><span>VERIFY</span><p>I follow the fix through to a safer release.</p></li>
          </ol>
        </section>
        <section className="oc-zone" aria-labelledby="archive-heading">
          <SectionHeading path="security/disclosures" title="I kept the receipts." note="every finding / my name attached" id="archive-heading" />
          <p className={styles.archiveIntro}>I found them. You can inspect them. Pick a category and open the original advisory; published and reserved records stay labelled.</p>
          <CveExplorer items={items} />
        </section>
      </CircuitTrace>
    </main>
  );
}
