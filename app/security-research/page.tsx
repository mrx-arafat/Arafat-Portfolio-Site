import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  FileSearch,
  ShieldCheck,
} from "lucide-react";
import cveData from "@/data/cve.json";
import { CveExplorer, type CveItem } from "./cve-explorer";
import styles from "./security-research.module.css";

const items = cveData.items as CveItem[];

export default function SecurityResearch() {
  const published = items.filter((item) => item.status === "published").length;
  const highest = Math.max(...items.map((item) => item.cvss));
  const categories = new Set(items.map((item) => item.type)).size;

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />

      <section className={styles.hero}>
        <div className={styles.heroTopline}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>
          <span className={styles.availability}>
            <span /> Research file / active
          </span>
        </div>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>
              <FileSearch size={16} />
              Vulnerability research / {cveData.researcher.handle}
            </div>
            <h1>
              <span className={styles.statementLead}>A record of</span>
              <span className={styles.statementFocus}>vulnerabilities</span>
              <span className={styles.statementTail}>found and reported.</span>
            </h1>
            <p>
              My work follows the evidence: reproduce the flaw, document the impact,
              coordinate disclosure, and stay on the case until users have a safer
              release.
            </p>

            <a
              href={cveData.researcher.profile}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.profileButton}
            >
              <span className={styles.profileButtonIcon}>
                <ShieldCheck size={20} />
              </span>
              <span>
                <small>Verified researcher profile</small>
                Patchstack VDP
              </span>
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className={styles.dossier}>
            <div className={styles.dossierHeader}>
              <div>
                <span>Disclosure dossier</span>
                <strong>FIELD NOTES / 2025</strong>
              </div>
              <span className={styles.dossierStatus}>verified record</span>
            </div>

            <div className={styles.dossierCount} aria-hidden="true">
              <span>09</span>
              <small>findings</small>
            </div>

            <div className={styles.caseList}>
              {items.slice(0, 3).map((item, index) => (
                <div className={styles.caseRow} key={item.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{item.cve}</strong>
                    <small>{item.software}</small>
                  </div>
                  <b>{item.cvss.toFixed(1)}</b>
                </div>
              ))}
            </div>

            <div className={styles.disclosurePath}>
              <span>discover</span>
              <i />
              <span>verify</span>
              <i />
              <span>disclose</span>
              <i />
              <span>patch</span>
            </div>

            <div className={styles.dossierStamp} aria-hidden="true">
              <ShieldCheck size={18} />
              coordinated
            </div>
          </div>
        </div>

        <div className={styles.stats}>
          <div>
            <strong>{String(items.length).padStart(2, "0")}</strong>
            <span>Total findings</span>
          </div>
          <div>
            <strong>{String(published).padStart(2, "0")}</strong>
            <span>Published CVEs</span>
          </div>
          <div>
            <strong>{highest.toFixed(1)}</strong>
            <span>Peak CVSS</span>
          </div>
          <div>
            <strong>{String(categories).padStart(2, "0")}</strong>
            <span>Attack classes</span>
          </div>
        </div>
      </section>

      <section className={styles.archive}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionIndex}>01 / DISCLOSURES</span>
            <h2>Vulnerability archive</h2>
          </div>
          <p>
            Each ticket is a case file. Select a category, then open the advisory
            for the full technical record.
          </p>
        </div>

        <CveExplorer items={items} />
      </section>

      <div className="sr-only">
        <h2>CVEs Discovered by Easin Arafat (n0_arafat_n0)</h2>
        <p>
          Easin Arafat, Application Security Engineer at Startise, is a security
          researcher credited on the Patchstack Vulnerability Disclosure Program
          under the handle n0_arafat_n0. He has responsibly disclosed security
          vulnerabilities spanning Broken Access Control, Insecure Direct Object
          Reference, and Sensitive Data Exposure.
        </p>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.cve !== "Reserved" ? `${item.cve}: ` : ""}
              {item.software} {item.affected}: {item.type} (CVSS {item.cvss},{" "}
              {item.severity}) reported by Easin Arafat via Patchstack.
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
