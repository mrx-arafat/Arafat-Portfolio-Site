import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SectionHeading, StatusTag } from "@/components/open-circuit";

import { CLIENT_PROJECTS } from "./content";
import { ProjectSignalChain } from "./project-signal-chain";
import styles from "./client-work.module.css";

/** Connect each selected system's story, schematic and authentic product view. */
export function ClientWorkArchive(): React.ReactElement {
  return (
    <section id="client-work" className="oc-zone scroll-mt-24" aria-labelledby="client-work-heading">
      <SectionHeading path="work/selected" title="I built them. They're right here." note="my work / actual screens included" id="client-work-heading" />
      <p className={styles.introduction}>Here are TermStream and Second Brain.Deck. I brought the actual screens. My portfolio can afford evidence.</p>
      {CLIENT_PROJECTS.map((project) => (
        <article key={project.id} className={styles.archiveRecord} aria-labelledby={`${project.id}-archive-heading`}>
          <div className={styles.archiveCopy}>
            <StatusTag>I SHIPPED THIS</StatusTag>
            <h3 id={`${project.id}-archive-heading`}><Link href={project.detailPath}>{project.title}</Link></h3>
            <p>{project.summary}</p>
            <div className={styles.links}>
              <Link href={project.detailPath} className="oc-route">View case study<ArrowRight size={16} aria-hidden="true" /></Link>
              <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer" className="oc-route">Open live project<ExternalLink size={16} aria-hidden="true" /></a>
            </div>
            <ProjectSignalChain project={project} />
          </div>
          <Link href={project.detailPath} className={styles.archivePreview} aria-label={`View ${project.title} case study preview`}>
            <div className={styles.screenshot}><Image src={project.slides[0].image} alt="" fill sizes="(min-width: 1120px) 600px, (min-width: 640px) 50vw, 100vw" className="object-contain" priority /></div>
            <span className={styles.previewCaption}>Real product / {project.title} <ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
        </article>
      ))}
    </section>
  );
}
