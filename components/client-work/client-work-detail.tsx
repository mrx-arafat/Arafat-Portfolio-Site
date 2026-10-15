import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { CircuitTrace, Keycap, PageHeader, SectionHeading, StatusTag } from "@/components/open-circuit";

import { CLIENT_WORK_CTA, type ClientProject } from "./content";
import { ProjectSignalChain } from "./project-signal-chain";
import { ProjectWalkthrough } from "./project-walkthrough";
import styles from "./client-work.module.css";

interface ClientWorkDetailProps {
  project: ClientProject;
}

/** Follow a system from its real need through the delivered product. */
export function ClientWorkDetail({ project }: ClientWorkDetailProps): React.ReactElement {
  return (
    <main className={`oc-shell oc-page ${styles.detailPage}`}>
      <div className={styles.detailTopline}>
        <Link href="/projects" className="oc-route"><ArrowLeft size={16} aria-hidden="true" />Back to project archive</Link>
        <StatusTag tone="neutral">MY BUILD / {project.title}</StatusTag>
      </div>
      <article aria-labelledby={`${project.id}-heading`}>
        <PageHeader command={`$ cat ~/work/${project.id}/README`} title={project.headline} description={project.intro} id={`${project.id}-heading`} className={styles.detailHeader}>
          <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer" className="oc-route mt-4">{project.deploymentLabel}<ExternalLink size={16} aria-hidden="true" /></a>
        </PageHeader>
        <ProjectSignalChain project={project} />
        <CircuitTrace>
          <section className="oc-zone" aria-labelledby={`${project.id}-brief-heading`}>
            <SectionHeading path={`work/${project.id}/brief`} title="I had a problem. I built the fix." note="my design decisions / on display" id={`${project.id}-brief-heading`} />
            <div className={styles.brief}>
              <div><h3>I wanted this.</h3><p>{project.need}</p></div>
              <div><h3>I built this.</h3><ol className={styles.delivery}>{project.delivery.map((item) => <li key={item}>{item}</li>)}</ol></div>
            </div>
          </section>
          <section className="oc-zone" aria-labelledby={`${project.id}-walkthrough-heading`}>
            <SectionHeading path={`work/${project.id}/screens`} title="I kept the receipts." note="my product / use arrows or swipe" id={`${project.id}-walkthrough-heading`} />
            <ProjectWalkthrough project={project} />
          </section>
          <section className={styles.cta} aria-labelledby={`${project.id}-cta-heading`}>
            <div>
              <StatusTag>{CLIENT_WORK_CTA.eyebrow}</StatusTag>
              <h2 id={`${project.id}-cta-heading`}>{CLIENT_WORK_CTA.title}</h2>
              <p>{CLIENT_WORK_CTA.body}</p>
            </div>
            <Keycap href={CLIENT_WORK_CTA.href} command="$ ./connect.sh --secure" variant="primary" className={styles.ctaKey}>{CLIENT_WORK_CTA.label}</Keycap>
          </section>
        </CircuitTrace>
      </article>
    </main>
  );
}
