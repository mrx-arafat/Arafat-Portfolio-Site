import type { CSSProperties, ReactElement, ReactNode } from "react";
import Link from "next/link";

import { AGENTIC_WORK_PROJECTS } from "@/components/agentic-work/content";
import { AgenticProjectVisual } from "@/components/agentic-work/visuals";
import { MissionControl } from "@/components/dashboard/mission-control";
import { CircuitTrace, DecryptPhoto, Keycap, SectionHeading } from "@/components/open-circuit";
import articlesData from "@/data/articles.json";
import cveData from "@/data/cve.json";
import extracurricularData from "@/data/extracurricular.json";
import skillsData from "@/data/skills.json";
import type { ActivityItem, ContributionDay, GithubStats } from "@/lib/github-activity";
import { getMediumArticles, latestMediumArticle } from "@/lib/medium-articles";

import { LiveActivity, type RecentPost } from "./live-activity";
import styles from "./root-workbench.module.css";

interface DashboardClientProps {
  caseStudies: ReactNode;
  latestPosts: ReactNode;
  recentPosts: readonly RecentPost[];
  activity: ActivityItem[];
  /** Live GitHub totals; null when no token is configured, and the card then shows only measured local numbers. */
  stats: GithubStats | null;
}

const count = (value: number): string => value.toLocaleString("en-US");

/**
 * Agent runs live on his machine, out of the site's reach, so the card estimates them from the live pull
 * request count. The ratio was measured over the 30 days to 2026-10-28: 1,178 Claude Code and Codex runs
 * for 609 pull requests. The card marks the result with "~" because it is an estimate.
 */
const AGENT_RUNS_PER_PULL_REQUEST = 1178 / 609;

const shortDate = (date: string): string => new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

/** Thirty days of output as a load monitor: one bar per day, the peak day lit. The caption carries the data as text. */
function ActivityBars({ days, activeDays }: { days: readonly ContributionDay[]; activeDays: number }): ReactElement {
  const peak = days.reduce((top, day) => (day.count > top.count ? day : top), days[0]);
  return (
    <figure className={styles.nowLoad}>
      <div className={styles.nowBars} aria-hidden="true">
        {days.map(day => <span key={day.date} data-peak={day === peak || undefined} style={{ "--load": `${Math.max(3, Math.round((day.count / Math.max(1, peak.count)) * 100))}%` } as CSSProperties} />)}
      </div>
      <figcaption><span>{activeDays}/{days.length} days active</span><span>peak {count(peak.count)} on {shortDate(peak.date)}</span></figcaption>
    </figure>
  );
}

const MEDIUM_ARTICLE_COUNT = getMediumArticles(articlesData).length;

const FIELD_GROUPS = [
  { title: "I build communities", ids: ["leadership", "mist-leetcon"] },
  { title: "I make security a team sport", ids: ["ctf-competitions", "flaghunt", "cyber-drill", "cyber-threats"] },
  { title: "I do go outside", ids: ["sports", "hobbies"] },
].map(group => ({ ...group, entries: extracurricularData.filter(item => group.ids.includes(item.id)) }));

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/mrx-arafat" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/e4rafat" },
  { label: "Facebook", href: "https://www.facebook.com/e4rafat" },
  { label: "Instagram", href: "https://www.instagram.com/e4rafat/" },
  { label: "Medium", href: "https://medium.com/@easinxarafat" },
  { label: "TryHackMe", href: "https://tryhackme.com/p/KingBOB" },
] as const;

/** Present my work, evidence and writing in one server-rendered workbench. */
export default function DashboardClient({ caseStudies, latestPosts, recentPosts, activity, stats }: DashboardClientProps): ReactElement {
  const days = stats?.days ?? [];
  const contributions = days.reduce((sum, day) => sum + day.count, 0);
  // Rounded to tens, so the estimate never reads as an exact count.
  const agentRuns = stats ? Math.round((stats.pullRequests * AGENT_RUNS_PER_PULL_REQUEST) / 10) * 10 : 0;
  return (
    <main className={`oc-shell oc-home ${styles.home}`}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <span className={styles.arrivalTrace} data-intro-trace aria-hidden="true" />
        <div className={styles.identity}>
          <p><strong>Easin Arafat</strong><span>Application Security Engineer at Startise</span></p>
          <a href="#work-title" className={styles.currentFocus}>Current focus <span>agentic AI systems <span aria-hidden="true">/</span></span></a>
        </div>

        <div className={styles.heroLayout}>
          <div className={styles.heroType}>
            <h1 id="hero-title" tabIndex={-1} className={styles.heroTitle}>
              <span className="oc-sr">Easin Arafat: </span>
              <span>The future is agentic.</span>
              <span className={styles.root}>I&apos;m already running it.<span className="oc-cursor" aria-hidden="true" /></span>
            </h1>
            <p className={styles.heroThesis}>I make it safe to ship.</p>
            <div className={styles.heroBody}>
              <p className={styles.heroCopy}>I&apos;m an Application Security Engineer at Startise. I run AI coding agents in parallel, design the review gates that keep them honest, and break my own systems before anyone else gets the chance.</p>
              <div className={styles.heroSignature}><span>{cveData.items.length} CVEs disclosed / {stats ? count(stats.publicRepos) : "100+"} public repos / AI agents at work every day</span><Link href="/projects">See the work <span aria-hidden="true">-&gt;</span></Link></div>
            </div>
          </div>

          <div className={styles.portraitBay}>
            <p className={styles.portraitNote}>The operator behind the fleet.</p>
            <DecryptPhoto priority />
            <p className={styles.portraitFootnote}>Security sets the guardrails.<br />The fleet carries the work.</p>
          </div>

          <section className={styles.nowPanel} aria-labelledby="now-title">
            <p className={styles.nowChrome}><span id="now-title">arafat@ops:~/output <span className={styles.nowWindow}>last 30 days</span></span><span className={styles.nowLive}>live</span></p>
            <div className={styles.nowScreen}>
              <dl className={styles.nowStats}>
                {days.length > 0 && <div><dt>contributions</dt><dd>{count(contributions)}</dd></div>}
                {stats && <div><dt>pull requests</dt><dd>{count(stats.pullRequests)}</dd></div>}
                {agentRuns > 0 && <div><dt>AI agent runs</dt><dd>~{count(agentRuns)}</dd></div>}
                {days.length === 0 && <div><dt>CVEs disclosed</dt><dd>{cveData.items.length}</dd></div>}
              </dl>
              {days.length > 0 && <ActivityBars days={days} activeDays={days.filter(day => day.count > 0).length} />}
              <p className={styles.nowPrompt} aria-hidden="true">$ tail -f ~/activity</p>
              <LiveActivity initial={activity} posts={recentPosts} />
              <p className={styles.nowPrompt} aria-hidden="true">$ <span className="oc-cursor" /></p>
            </div>
          </section>
        </div>

        <div className={styles.heroBaseline}><span>A finding is only done when the fix ships.</span><span aria-hidden="true">idea -&gt; build -&gt; verify -&gt; ship</span></div>
        <div className="oc-keyrack">
          <Keycap href="/about" command="$ ./about_me.sh --role">WHAT I DO</Keycap>
          <Keycap href="#universe" command="$ ./skills.sh --view" variant="primary">MY SKILLS</Keycap>
          <Keycap href="/contact" command="$ ./connect.sh --secure">CONTACT ME</Keycap>
        </div>
      </section>

      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="work-title">
          <SectionHeading path="work" note="my answer to repetitive work" />
          <div className={styles.sectionLead}>
            <h2 className={styles.workTitle} id="work-title">I got tired of waiting.<br /><span>So I built it.</span></h2>
            <div className={styles.leadAside}>
              <nav className={styles.toolRack} aria-label="Tools I built">
                <p className={styles.nowPrompt} aria-hidden="true">$ ls ~/tools</p>
                <ul>{AGENTIC_WORK_PROJECTS.map(project => <li key={project.id}><a href={`#work-${project.id}`}><span>{project.name}<b aria-hidden="true">/</b></span><span>{project.language}</span></a></li>)}</ul>
              </nav>
              <p>I want context that sticks, sessions that survive, and changes I can inspect.<br /><strong>So I built the tools.</strong></p>
            </div>
          </div>

          <figure className={styles.architecture}>
            <figcaption>I make the rules.</figcaption>
            <dl className={styles.signalChain}>
              <div><dt>Intent</dt><dd>I set the direction.</dd></div>
              <div><dt>Context</dt><dd>I keep useful knowledge close.</dd></div>
              <div><dt>Action</dt><dd>I put the tools to work.</dd></div>
              <div><dt>Review</dt><dd>I inspect the result.</dd></div>
            </dl>
            <p className={styles.foundation}><span>I take security personally.</span><Link href="/security-research">Check my findings <span aria-hidden="true">-&gt;</span></Link></p>
          </figure>

          <div>
            <div className={styles.indexHeading}><h3>I made these.</h3><a href="https://github.com/mrx-arafat">Check my GitHub <span aria-hidden="true">-&gt;</span></a></div>
            {AGENTIC_WORK_PROJECTS.map(project => (
              <article key={project.id} id={`work-${project.id}`} className={styles.project}>
                <div className={styles.projectCopy}>
                  <p className={styles.projectRole}>{project.role}</p>
                  <h3>{project.name}</h3>
                  <p className={styles.projectSummary}>{project.summary}</p>
                  <div className={styles.projectLinks}>
                    <a href={project.repositoryUrl} aria-label={`Source for ${project.name} on GitHub`}>Source <span aria-hidden="true">-&gt;</span></a>
                    {project.productUrl && <a href={project.productUrl} aria-label={`Open project: ${project.name}`}>Open project <span aria-hidden="true">-&gt;</span></a>}
                    {project.docsUrl && <a href={project.docsUrl} aria-label={`Docs for ${project.name}`}>Docs <span aria-hidden="true">-&gt;</span></a>}
                  </div>
                </div>
                <div className={styles.projectCapture}><AgenticProjectVisual projectId={project.id} /></div>
              </article>
            ))}
          </div>

          <div className={styles.caseStudyIntro}><p>A closer look at my work</p><h3>I made two things.<br />Then kept going.</h3><p>I built TermStream for persistent coding sessions and Second Brain.Deck for connected knowledge. Here is what I wanted, what I built, and why.</p></div>
          {caseStudies}
          <Link className={`oc-route ${styles.archiveLink}`} href="/projects">See everything I built <span aria-hidden="true">-&gt;</span></Link>
        </section>

        <section className="oc-zone" aria-labelledby="proof-title">
          <SectionHeading path="proof" note="my claims have links" title={<>I keep receipts.<br />You can check.</>} id="proof-title" />
          <div className={styles.evidenceSpread}>
            <article className={styles.securityRecord}>
              <p className={styles.recordLabel}>I disclose responsibly / Patchstack</p>
              <h3><span>{cveData.items.length} CVEs.</span><br />I said it<br />was broken.</h3>
              <p>I found broken access control, IDOR, and data exposure in WordPress plugins. I bring that same suspicion to every system I build.</p>
              <Link className="oc-route" href="/security-research">cd security-research -&gt;</Link>
            </article>
            <article className="oc-research">
              <p className="oc-research-label">I CO-AUTHORED / ELSEVIER ARRAY</p>
              <h3>Adaptive UI for Mobile Banking - Enhancing UX through Machine Learning</h3>
              <div className="oc-research-meta"><span>Elsevier Array</span><span>Q1 journal</span><span>Impact factor 4.5</span><span>Open access</span></div>
              <p className="oc-doi">DOI: 10.1016/j.array.2026.100901</p>
              <Link className="oc-route" href="/featured">cd featured -&gt;</Link>
            </article>
          </div>
          <ul className={styles.recognition} aria-label="Recognition">
            <li><span aria-hidden="true">-&gt;</span><div><strong>The Daily Star</strong><small>They wrote about me</small></div></li>
            <li><span aria-hidden="true">*</span><div><strong>URC 2021</strong><small>My team won globally</small></div></li>
            <li><span aria-hidden="true">~</span><div><strong>Top 1% TryHackMe</strong><small>I play to win</small></div></li>
          </ul>
        </section>

        <section className="oc-zone" aria-labelledby="writing-title">
          <SectionHeading path="write" note="my brain, in public" />
          <div className="oc-writing-head"><h2 className="oc-section-title" id="writing-title">I think loudly.<br />In writing.</h2><p className="oc-writing-intro"><strong>{MEDIUM_ARTICLE_COUNT} Medium articles.</strong> I write about AI, security, business, psychology, and whatever else refuses to leave my head.</p></div>
          <article className={styles.mediumEssay} aria-labelledby="medium-title">
            <div className={styles.essayMargin}><p>My latest Medium essay</p><time dateTime={latestMediumArticle.publishDate}>{latestMediumArticle.publishDate}</time><span>I have interests outside work.</span></div>
            <div><h3 id="medium-title"><a href={latestMediumArticle.url}>{latestMediumArticle.title}<span className={styles.essayArrow} aria-hidden="true"> -&gt;</span></a></h3><p>{latestMediumArticle.description}</p><a className="oc-route" href={latestMediumArticle.url}>Read on Medium <span aria-hidden="true">-&gt;</span></a></div>
          </article>
          <div className={styles.writingArchive}><p className={styles.archiveLabel}>More things I had to say</p>{latestPosts}</div>
        </section>

        <section className="oc-zone" aria-labelledby="beyond-title">
          <SectionHeading path="etc" note="I leave the keyboard, too" title={<>I have range.<br />Apparently.</>} id="beyond-title" />
          <div className="oc-beyond-layout">
            <article className="oc-rover-story">
              <p className="oc-year">2021<span className="oc-sr">:</span></p><h3>I helped take a rover<br />to a global title.</h3><p><span className="oc-soft">My team won URC 2021.</span><br />I led software and communication for MIST Mongol Barota at the University Rover Challenge.</p>
              <svg className="oc-rover-art" viewBox="0 0 440 190" fill="none" aria-hidden="true"><path d="M0 168 50 158 92 166 140 150 190 159 240 153 286 170 335 155 380 162 440 150" stroke="var(--oc-line)" /><path d="m95 136 37-37h143l42 37M135 100l16-42h87l29 42M162 59V41h51v18M188 41V14m0 6h48m0-6v13M117 120h176M218 60l-4 40M154 70h33v19h-39M230 75l24 18M165 120l-12 24m99-24 14 24" stroke="currentColor" strokeWidth="2" /><path d="m142 143 24-18h84l26 18" stroke="var(--oc-amber)" strokeWidth="2" /><g stroke="currentColor" strokeWidth="3"><circle cx="105" cy="145" r="25" /><circle cx="181" cy="149" r="22" /><circle cx="284" cy="145" r="25" /></g><g stroke="var(--oc-line)"><circle cx="105" cy="145" r="15" /><circle cx="181" cy="149" r="12" /><circle cx="284" cy="145" r="15" /><path d="M105 120v50m-25-25h50m51-18v44m-22-22h44m81-29v50m-25-25h50M330 20v60m-30-30h60" /></g><circle cx="330" cy="50" r="17" stroke="var(--oc-line)" /><path d="M12 185h410" stroke="var(--oc-line)" strokeDasharray="2 8" /></svg>
            </article>
            <div className="oc-field-notes"><p>I build communities, read, compete, and occasionally remember the world has an outside.</p>{FIELD_GROUPS.map((group, index) => <details key={group.title} open={index === 0}><summary>{group.title}</summary><div className="oc-detail-copy">{group.entries.map(entry => <p key={entry.id}><strong>{entry.title}</strong><br />{entry.description}</p>)}</div></details>)}</div>
          </div>
        </section>

        <section className="oc-zone oc-universe" id="universe" aria-labelledby="universe-title"><SectionHeading path="skills" note="my skills need their own orbit" /><h2 className="oc-section-title" id="universe-title">I needed more<br />than one planet.</h2><p className="oc-universe-intro">{skillsData.skills.length} skill modules. {skillsData.categories.length} domains. I gave them a universe.</p><MissionControl /></section>
        <section className={`oc-contact ${styles.contact}`} aria-labelledby="contact-title"><p className="oc-command">$ ./connect.sh --secure</p><h2 id="contact-title">Make it difficult.<br /><span>I get bored.</span></h2><p className={styles.contactCopy}>Give me a stubborn security problem, a tool that should exist, or an idea with some nerve. I like having something to prove.</p><Keycap href="/contact" command="$ ./connect.sh --secure" variant="primary">TALK TO ME</Keycap><nav className="oc-social-links" aria-label="Find Arafat online">{SOCIALS.map(social => <a href={social.href} key={social.label}>{social.label} -&gt;</a>)}</nav></section>
      </CircuitTrace>
    </main>
  );
}
