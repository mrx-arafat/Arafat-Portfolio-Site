import type { ClientProject } from "./content";
import styles from "./client-work.module.css";

/** Map the real walkthrough stages as connected, readable system elements. */
export function ProjectSignalChain({ project }: { project: ClientProject }): React.ReactElement {
  return (
    <figure className={styles.schematic}>
      <figcaption className={styles.schematicCaption}>Signal chain / {project.title} walkthrough</figcaption>
      <ol className={styles.signalChain}>
        {project.slides.map((slide, index) => <li key={slide.id}><span className={styles.signalNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{slide.title}</span></li>)}
      </ol>
    </figure>
  );
}
