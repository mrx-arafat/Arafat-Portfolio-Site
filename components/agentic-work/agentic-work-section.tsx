import { ArrowUpRight, Github } from "lucide-react";
import { SectionHeading } from "@/components/open-circuit";

import { AGENTIC_WORK_PROJECTS } from "./content";
import { AgenticProjectVisual } from "./visuals";
import styles from "./agentic-work.module.css";

/** Explain the operator's tooling through original, source-backed schematics. */
export function AgenticWorkSection(): React.ReactElement {
  return (
    <section className={`oc-zone ${styles.section}`} aria-labelledby="agentic-work-heading">
      <SectionHeading path="work/agentic" note="I made these for me / you can have a look" title={<>I built the<br />toolbox, too.</>} id="agentic-work-heading" />
      <div className={styles.operatorRail}>
        <p><span>I have standards</span><strong>My shortcuts.<br />My standards.</strong></p>
        <div className={styles.railLinks}><span>Context</span><span>Parallel work</span><span className={styles.reviewLabel}>Independent review</span></div>
      </div>
      <div className={styles.projects}>
        {AGENTIC_WORK_PROJECTS.map((project) => (
          <article key={project.id} id={`agentic-${project.id}`} className={styles.project} aria-labelledby={`agentic-${project.id}-title`}>
            <div className={styles.projectCopy}>
              <p className={styles.role}>{project.role}</p>
              <h3 id={`agentic-${project.id}-title`}>{project.name}</h3>
              <p className={styles.summary}>{project.summary}</p>
              <div className={styles.projectLinks}>
                <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className={styles.repositoryButton} aria-label={`Source on GitHub: ${project.name}`}><Github size={18} aria-hidden="true" /><span>Source on GitHub</span><ArrowUpRight size={18} aria-hidden="true" /></a>
                {project.productUrl && <a href={project.productUrl} target="_blank" rel="noopener noreferrer" className={styles.linkButton} aria-label={`Open project: ${project.name}`}>Open project<ArrowUpRight size={16} aria-hidden="true" /></a>}
                <a href={project.docsUrl} target="_blank" rel="noopener noreferrer" className={styles.linkButton} aria-label={`Read the docs: ${project.name}`}>Read the docs<ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
            </div>
            <AgenticProjectVisual projectId={project.id} />
          </article>
        ))}
      </div>
    </section>
  );
}
