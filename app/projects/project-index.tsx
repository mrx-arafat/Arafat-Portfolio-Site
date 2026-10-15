import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Chip, SectionHeading } from "@/components/open-circuit";

import type { GithubRepo } from "./projects-data";
import styles from "./projects.module.css";

interface ProjectIndexProps {
  projects: readonly GithubRepo[];
}

/** Keep the complete build log readable independently of the carousel. */
export function ProjectIndex({ projects }: ProjectIndexProps): React.ReactElement {
  return (
    <section className="oc-zone" id="project-index" aria-labelledby="project-index-heading">
      <SectionHeading path="work/index" note={`${projects.length} projects / yes, I kept going`} title="I kept building." id="project-index-heading" />
      <ol className={styles.index}>
        {projects.map((project, index) => (
          <li key={project.id} className={styles.indexRow}>
            <span className={styles.ordinal} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <div className={styles.titleRow}>
                <h3>{project.name}</h3>
                <Chip tone="muted">{project.language}</Chip>
              </div>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.links}>
                {project.caseStudyPath && <Link href={project.caseStudyPath} className="oc-route">{project.name} case study <ArrowUpRight size={16} aria-hidden="true" /></Link>}
                {project.html_url && <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="oc-route" aria-label={`Source on GitHub: ${project.name}`}><Github size={16} aria-hidden="true" />Source on GitHub</a>}
                {project.docs_url && <a href={project.docs_url} target="_blank" rel="noopener noreferrer" className="oc-route" aria-label={`Read the docs: ${project.name}`}>Read the docs <ArrowUpRight size={16} aria-hidden="true" /></a>}
                {project.homepage && <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="oc-route" aria-label={`Open project: ${project.name}`}>Open project <ArrowUpRight size={16} aria-hidden="true" /></a>}
                {!project.html_url && <span className="oc-small oc-muted">Source not publicly available</span>}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
