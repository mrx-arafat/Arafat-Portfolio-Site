import { ArrowUpRight, FileText } from "lucide-react";
import { Chip, CircuitTrace, PageHeader, SectionHeading, StatusTag } from "@/components/open-circuit";
import featured from "@/data/featured.json";
import styles from "./featured.module.css";

interface Item {
  id: string;
  title: string;
  venue: string;
  badges: string[];
  meta: string;
  summary: string;
  role?: string;
  authors?: string;
  doi?: string;
  url?: string;
}

interface Profile {
  id: string;
  label: string;
  handle: string;
  url: string;
}

const research = featured.research as Item[];
const press = featured.press as Item[];
const speaking = featured.speaking as Item[];
const recognition = featured.recognition as Item[];
const profiles = featured.profiles as Profile[];

function EvidenceSection({ title, path, note, items }: { title: string; path: string; note: string; items: Item[] }): React.ReactElement | null {
  if (items.length === 0) return null;
  return (
    <section className="oc-zone" aria-labelledby={`${path}-heading`}>
      <SectionHeading path={`proof/${path}`} title={title} note={note} id={`${path}-heading`} />
      <div className={styles.ledger}>
        {items.map((item) => (
          <article key={item.id} className={styles.record}>
            <div className={styles.recordMeta}><p>{item.venue}</p><p>{item.meta}</p></div>
            <div>
              <div className={styles.badges}>{item.badges.map((badge) => <Chip key={badge} tone="amber">{badge}</Chip>)}</div>
              <h3>{item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}<ArrowUpRight size={20} aria-hidden="true" /></a> : item.title}</h3>
              {item.role && <p className="oc-soft">{item.role}</p>}
              {item.authors && <p className={styles.authors}>{item.authors}</p>}
              <p className={styles.summary}>{item.summary}</p>
              {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="oc-route">View <ArrowUpRight size={16} aria-hidden="true" /></a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Open the research file, then follow its wider trail of public evidence. */
export default function Featured(): React.ReactElement {
  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <PageHeader command="$ cat research.md press.md recognition.md" title={<>I come<br /><span className="oc-green">with citations.</span></>} description="I co-authored a Q1 paper in Elsevier Array, made The Daily Star and won URC 2021 with MIST Mongol Barota. Even my ego has references." />
      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="research-heading">
          <SectionHeading path="proof/research" title="I got peer-reviewed." note="Q1 / Elsevier Array" id="research-heading" />
          {research.map((item) => (
            <article key={item.id} className={styles.paper} aria-labelledby={`${item.id}-title`}>
              <div className={styles.fileBar}><span><FileText size={16} aria-hidden="true" />research.md</span><StatusTag>OPEN ACCESS</StatusTag></div>
              <div className={styles.paperBody}>
                <div className={styles.badges}>{item.badges.map((badge) => <Chip key={badge} tone="amber">{badge}</Chip>)}</div>
                <h3 id={`${item.id}-title`}>{item.title}</h3>
                <div className={styles.publication}><strong>{item.venue}</strong><span>{item.meta}</span></div>
                {item.doi && <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.doi}><span>DOI / persistent record</span><strong>{item.doi}</strong><ArrowUpRight size={24} aria-hidden="true" /></a>}
                <p className={styles.summary}>{item.summary}</p>
                {item.role && <p className={styles.role}>{item.role}</p>}
                {item.authors && <p className={styles.authors}>{item.authors}</p>}
                {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className={`oc-keycap ${styles.paperKey}`}><strong>Read Paper</strong><code>Open the published research</code></a>}
              </div>
            </article>
          ))}
        </section>
        <EvidenceSection title="I made the paper." path="press" note="The Daily Star / yes, that one" items={press} />
        <EvidenceSection title="I get people in the room." path="events" note="MIST LEETCON 2023 / 3,500+ participants" items={speaking} />
        <EvidenceSection title="I brought home a world title." path="recognition" note="URC 2021 / MIST Mongol Barota" items={recognition} />
        <section className="oc-zone" aria-labelledby="profiles-heading">
          <SectionHeading path="proof/profiles" title="I left a few more receipts." id="profiles-heading" />
          <ul className={styles.profiles}>{profiles.map((profile) => <li key={profile.id}><a href={profile.url} target="_blank" rel="noopener noreferrer"><strong>{profile.label}</strong><span>@{profile.handle}</span><ArrowUpRight size={18} aria-hidden="true" /></a></li>)}</ul>
        </section>
      </CircuitTrace>
    </main>
  );
}
