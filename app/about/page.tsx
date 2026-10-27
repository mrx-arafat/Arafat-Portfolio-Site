import type { ReactElement } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { LINKS, OPERATING_AREAS, OPERATING_PRINCIPLES, PROFILE, PROOF, WORK_TRACKS } from "@/components/about/content";
import { OperatorPortrait } from "@/components/about/operator-portrait";
import { Chip, CircuitTrace, Keycap, PageHeader, SectionHeading } from "@/components/open-circuit";

import styles from "./about.module.css";

/** Read Arafat's work, public evidence and delivery principles. */
export default function AboutMe(): ReactElement {
  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <div className={styles.introduction}>
        <div>
          <PageHeader command={PROFILE.command} note="my name / my receipts" title={<><span className="oc-sr">Easin Arafat: </span>I earned the ego.<br /><span className="oc-green">Here&apos;s the paperwork.</span></>} description={PROFILE.introduction} />
          <p className={styles.statement}>{PROFILE.headline}</p>
          <div className={styles.keys}>
            <Keycap href={LINKS.projects} command="$ ls ~/projects" variant="primary">See what I built</Keycap>
            <Keycap href={LINKS.security} command="$ ls ~/security-research">See what I found</Keycap>
          </div>
        </div>
        <div className={styles.identity}>
          <OperatorPortrait />
          <dl className={styles.identityRecord}>
            <div><dt>My day job</dt><dd>Application Security Engineer</dd></div>
            <div><dt>Where I work</dt><dd>{PROFILE.context}</dd></div>
            <div><dt>What has my attention</dt><dd>{PROFILE.focus}</dd></div>
            <div><dt>What I insist on</dt><dd>Evidence and approval before impact</dd></div>
          </dl>
        </div>
      </div>
      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="areas-heading">
          <SectionHeading path="about/context" title="I have range." id="areas-heading" note="my work / security / platforms / AI" />
          <ul className={styles.areas}>
            {OPERATING_AREAS.map((area) => (
              <li key={area.id}><h3>{area.title}</h3><p>{area.description}</p><Chip>{area.proof}</Chip></li>
            ))}
          </ul>
        </section>
        <section className="oc-zone" aria-labelledby="tracks-heading">
          <SectionHeading path="about/process" title="I don't ship on vibes." id="tracks-heading" note="my review comes before release" />
          <p className={styles.sectionIntro}>I set the outcome, bound the work and keep the evidence visible. I like a clever solution. I still make it pass review.</p>
          <div className={styles.tracks}>
            {WORK_TRACKS.map((track) => (
              <article key={track.id} className={styles.track}>
                <div className={styles.trackHeading}>
                  <p className="oc-small oc-soft">{track.command}</p>
                  <h3>{track.title}</h3>
                  <p className={styles.input}><span className="oc-small oc-amber">Input / </span>{track.input}</p>
                </div>
                <dl className={styles.trackStory}>
                  <div><dt>What I do</dt><dd>{track.action}</dd></div>
                  <div><dt>What I leave you with</dt><dd>{track.outcome}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>
        <section className="oc-zone" aria-labelledby="proof-heading">
          <SectionHeading path="about/proof" title="I put it on the record." id="proof-heading" note="my disclosures / my research / my code" />
          <ul className={styles.proof}>
            {PROOF.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className={styles.proofLink} target={item.isExternal ? "_blank" : undefined} rel={item.isExternal ? "noopener noreferrer" : undefined}>
                  <strong>{item.label}</strong><span>{item.description}</span><ArrowUpRight aria-hidden="true" size={22} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className={`oc-zone ${styles.trajectory}`} aria-labelledby="trajectory-heading">
          <div>
            <SectionHeading path="about/trajectory" title="I kept adding responsibilities." id="trajectory-heading" note="my career / apparently one discipline wasn't enough" />
            <p className={styles.sectionIntro}>I started with products, followed the security questions and took on platform operations. I want systems that survive production. Apparently that requires knowing more than one thing.</p>
            <ol className={styles.timeline}>
              <li><h3>I build.</h3><p>Full-stack projects taught me what the product actually needs.</p></li>
              <li><h3>I investigate.</h3><p>Offensive security and disclosure work taught me where confidence needs evidence.</p></li>
              <li><h3>I keep it running.</h3><p>Platform reliability and AI workflows made the delivery system part of what I build.</p></li>
            </ol>
          </div>
          <section className={styles.principles} aria-labelledby="principles-heading">
            <p className="oc-command">$ safeguards --always-on</p>
            <h2 id="principles-heading">I have standards.<br />They apply to my work.</h2>
            <ul>{OPERATING_PRINCIPLES.map((principle) => (
              <li key={principle.title}><Check size={18} aria-hidden="true" /><p><strong>{principle.title}.</strong> {principle.body}</p></li>
            ))}</ul>
          </section>
        </section>
        <section className="oc-zone" aria-labelledby="contact-heading">
          <SectionHeading path="about/next" title="I like a difficult brief." id="contact-heading" note="my inbox / your interesting problem" />
          <p className={styles.sectionIntro}>Show me the system, the constraints and what success needs to look like. I work across application security, platforms and AI tooling. Give me something worth thinking about.</p>
          <div className={styles.keys}>
            <Keycap href={LINKS.contact} command="$ ./connect.sh --secure" variant="primary">Open a channel</Keycap>
            <Keycap href={LINKS.aiflowiz} command="AIFlowiz / review-gated automation">Explore AIFlowiz</Keycap>
          </div>
        </section>
      </CircuitTrace>
    </main>
  );
}
