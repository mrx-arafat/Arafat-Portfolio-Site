import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ExternalLink,
  Github,
  Mail,
  Search,
  ServerCog,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import {
  LINKS,
  OPERATING_AREAS,
  OPERATING_PRINCIPLES,
  PROFILE,
  PROOF,
  WORK_TRACKS,
  type ProofItem,
  type WorkTrack,
} from "@/components/about/content";

const labelClass =
  "font-mono text-[10px] uppercase tracking-[0.24em] text-terminal-green";

const TRACK_ICONS: Record<WorkTrack["id"], LucideIcon> = {
  secure: ShieldCheck,
  operate: ServerCog,
  automate: Bot,
};

const PROOF_ICONS: Record<ProofItem["id"], LucideIcon> = {
  security: ShieldCheck,
  research: Search,
  systems: Github,
  aiflowiz: Bot,
};

function ProofLink({ item }: { item: ProofItem }): React.ReactElement {
  const Icon = PROOF_ICONS[item.id];
  const content = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center border border-terminal-green/25 text-terminal-green">
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-slate-950 dark:text-slate-100">
          {item.label}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-700 dark:text-slate-300">
          {item.description}
        </span>
      </span>
      {item.isExternal ? (
        <ExternalLink size={15} aria-hidden="true" className="shrink-0 text-slate-500" />
      ) : (
        <ArrowRight size={15} aria-hidden="true" className="shrink-0 text-slate-500" />
      )}
    </>
  );
  const className =
    "group flex min-h-20 items-center gap-4 border border-terminal-green/15 bg-surface-raised p-4 transition-colors hover:border-terminal-green/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/60";

  if (item.isExternal) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}

function OperatingAreas(): React.ReactElement {
  return (
    <div className="border border-terminal-green/20 bg-surface-raised">
      <div className="flex items-center justify-between border-b border-terminal-green/15 px-5 py-4 sm:px-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
          What I work across now
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-terminal-green">Three areas</span>
      </div>

      <ol className="grid sm:grid-cols-3">
        {OPERATING_AREAS.map((area, index) => (
          <li
            key={area.id}
            className={`flex flex-col p-5 sm:p-6 ${index > 0 ? "border-t border-terminal-green/15 sm:border-l sm:border-t-0" : ""}`}
          >
            <p className="text-sm font-medium leading-5 text-slate-950 dark:text-slate-100">{area.title}</p>
            <p className="mt-2 text-xs leading-5 text-slate-700 dark:text-slate-300">{area.description}</p>
            <span className="mt-auto pt-5">
              <span className="inline-block border border-terminal-green/20 px-2 py-1 font-mono text-[10px] leading-4 text-terminal-green">
                {area.proof}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function WorkTrackRow({ track, index }: { track: WorkTrack; index: number }): React.ReactElement {
  const Icon = TRACK_ICONS[track.id];

  return (
    <article className="relative grid gap-6 border-t border-terminal-green/15 py-8 first:border-t-0 lg:grid-cols-[3.25rem_minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-8 lg:py-10">
      <div className="flex items-start gap-3 lg:block">
        <span className="grid h-9 w-9 shrink-0 place-items-center border border-terminal-green/30 font-mono text-[10px] text-terminal-green">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="mt-3 grid h-9 w-9 place-items-center border border-terminal-green/15 text-terminal-green lg:block lg:border-0 lg:pt-3">
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>

      <div>
        <p className="font-mono text-[10px] tracking-[0.18em] text-terminal-green">{track.command}</p>
        <h3 className="mt-3 text-xl font-medium leading-snug tracking-tight text-slate-950 dark:text-slate-100">
          {track.title}
        </h3>
        <p className="mt-5 border-l border-terminal-green/25 pl-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {track.input}
        </p>
      </div>

      <div className="grid gap-px border border-terminal-green/15 bg-terminal-green/15 sm:grid-cols-2">
        <div className="bg-surface-raised p-5 sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">What happens next</p>
          <p className="mt-3 text-sm leading-6 text-slate-900 dark:text-slate-100">{track.action}</p>
        </div>
        <div className="bg-surface-deep p-5 sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">What stays visible</p>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{track.outcome}</p>
        </div>
      </div>
    </article>
  );
}

export default function AboutMe(): React.ReactElement {
  return (
    <main className="min-h-screen bg-surface-deep text-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-16 sm:px-8 lg:px-10">
        <section aria-labelledby="about-heading" className="grid gap-10 pb-20 lg:grid-cols-12 lg:items-stretch lg:gap-14">
          <div className="lg:col-span-6">
            <p className={labelClass}>{PROFILE.command}</p>
            <h1 id="about-heading" className="mt-5 max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
              {PROFILE.headline}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              {PROFILE.introduction}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={LINKS.projects} className="inline-flex min-h-11 items-center justify-center gap-2 bg-terminal-green px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-surface-deep transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green focus-visible:ring-offset-2 focus-visible:ring-offset-surface-deep">
                Inspect selected systems <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href={LINKS.security} className="inline-flex min-h-11 items-center justify-center gap-2 border border-terminal-green/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-terminal-green transition-colors hover:border-terminal-green/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/60">
                Review security research <Search size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="flex lg:col-span-6 lg:h-full lg:flex-col">
            <OperatingAreas />
            <div className="mt-4 border border-terminal-green/15 bg-surface-raised p-5">
              <p className={labelClass}>$ production --current</p>
              <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">Role</dt>
                  <dd className="mt-1 text-xs leading-5 text-slate-800 dark:text-slate-200">Application Security Engineer</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">Platform</dt>
                  <dd className="mt-1 text-xs leading-5 text-slate-800 dark:text-slate-200">xCloud at Startise</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">Public record</dt>
                  <dd className="mt-1 text-xs leading-5 text-slate-800 dark:text-slate-200">9 Patchstack records</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">Working rule</dt>
                  <dd className="mt-1 text-xs leading-5 text-slate-800 dark:text-slate-200">Evidence and approval before impact</dd>
                </div>
              </dl>
            </div>
          </aside>
        </section>

        <section aria-labelledby="proof-heading" className="border-y border-terminal-green/15 py-7">
          <div className="grid gap-4 lg:grid-cols-[13rem_1fr] lg:items-center">
            <div>
              <p className={labelClass}>$ proof --openable</p>
              <h2 id="proof-heading" className="mt-2 text-xl font-medium tracking-tight">Open the record.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PROOF.map((item) => (
                <ProofLink key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="tracks-heading" className="py-24">
          <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-16">
            <div>
              <p className={labelClass}>$ work --production</p>
              <h2 id="tracks-heading" className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                One operating model, shown as three readable paths.
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-700 dark:text-slate-300">
                Start with the signal. Follow what I do next. See the proof or operational outcome that should remain inspectable afterward.
              </p>
            </div>
            <div className="border-b border-terminal-green/15">
              {WORK_TRACKS.map((track, index) => (
                <WorkTrackRow key={track.id} track={track} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-12 border-t border-terminal-green/15 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div aria-labelledby="trajectory-heading">
            <p className={labelClass}>$ trajectory --builder-to-operator</p>
            <h2 id="trajectory-heading" className="mt-4 text-3xl font-medium tracking-tight">
              A security foundation that grew into systems work.
            </h2>
            <div className="mt-9 grid gap-0 border-y border-terminal-green/15 sm:grid-cols-3">
              {[
                ["Builder", "Full-stack projects made the product context tangible."],
                ["Researcher", "Offensive security and disclosure work made risk concrete."],
                ["Operator", "Platform reliability and AI workflows made the delivery system the product."],
              ].map(([title, body], index) => (
                <article key={title} className="border-b border-terminal-green/15 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <span className="font-mono text-[10px] text-terminal-green">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-sm font-semibold text-slate-950 dark:text-slate-100">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-700 dark:text-slate-300">{body}</p>
                </article>
              ))}
            </div>
          </div>

          <aside aria-labelledby="principles-heading" className="border border-terminal-green/15 bg-surface-raised p-6 sm:p-8">
            <p className={labelClass}>$ safeguards --always-on</p>
            <h2 id="principles-heading" className="mt-4 text-2xl font-medium tracking-tight">How the work stays trustworthy.</h2>
            <ul className="mt-7 space-y-5">
              {OPERATING_PRINCIPLES.map((principle) => (
                <li key={principle.title} className="flex gap-3">
                  <CheckCircle2 size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-terminal-green" />
                  <span>
                    <strong className="text-sm text-slate-950 dark:text-slate-100">{principle.title}. </strong>
                    <span className="text-sm leading-6 text-slate-700 dark:text-slate-300">{principle.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section aria-labelledby="contact-heading" className="border-t border-terminal-green/15 py-24 text-center">
          <p className={labelClass}>$ next --real-work</p>
          <h2 id="contact-heading" className="mx-auto mt-4 max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl">
            Bring the system, not just the symptom.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-700 dark:text-slate-300">
            We can map what is failing, what needs to stay controlled, and the shortest useful path to a verified result.
          </p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a href={LINKS.aiflowiz} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 border border-terminal-green/25 px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-slate-800 transition-colors hover:border-terminal-green/60 hover:text-terminal-green focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/60 dark:text-slate-200">
              <Bot size={15} aria-hidden="true" /> Explore AIFlowiz
            </a>
            <Link href={LINKS.contact} className="inline-flex min-h-11 items-center justify-center gap-2 bg-terminal-green px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-surface-deep transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green focus-visible:ring-offset-2 focus-visible:ring-offset-surface-deep">
              <Mail size={15} aria-hidden="true" /> Start a conversation
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
