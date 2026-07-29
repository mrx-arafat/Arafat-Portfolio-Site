import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  BookOpen,
  Code2,
  ExternalLink,
  Github,
  Mail,
  Search,
  ServerCog,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import {
  CAPABILITY_PIPELINES,
  EVIDENCE,
  EVOLUTION,
  LINKS,
  OPERATING_PRINCIPLES,
  PROFILE,
  type CapabilityPipeline,
  type EvidenceItem,
} from "@/components/about/content";

const PIPELINE_ICONS: Record<CapabilityPipeline["id"], LucideIcon> = {
  build: Code2,
  secure: ShieldCheck,
  operate: ServerCog,
  automate: Bot,
};

const EVIDENCE_ICONS: Record<EvidenceItem["id"], LucideIcon> = {
  github: Github,
  security: ShieldCheck,
  research: BookOpen,
  aiflowiz: Bot,
};

const SKYLINE = [
  { height: 5.5, width: 3.5 },
  { height: 8.5, width: 4.25 },
  { height: 6.5, width: 3 },
  { height: 11, width: 5 },
  { height: 7.5, width: 3.75 },
  { height: 13, width: 4.5 },
  { height: 9, width: 3.25 },
  { height: 6, width: 4.75 },
  { height: 10, width: 3.5 },
  { height: 7, width: 5.25 },
] as const;

const labelClass =
  "font-mono text-[10px] uppercase tracking-[0.28em] text-terminal-green";

function SkylineBackdrop(): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-surface-night via-surface-deep/95 to-surface-deep" />
      <div className="absolute left-1/2 top-16 h-56 w-56 -translate-x-1/2 rounded-full bg-terminal-green/[0.06] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 px-2 opacity-50 dark:opacity-70">
        {SKYLINE.map((building, index) => (
          <span
            key={`${building.height}-${index}`}
            className="block bg-surface-night"
            style={{
              height: `${building.height}rem`,
              width: `${building.width}rem`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function EvidenceLink({ item }: { item: EvidenceItem }): React.ReactElement {
  const Icon = EVIDENCE_ICONS[item.id];
  const className =
    "group flex min-h-20 items-center justify-between gap-4 border border-terminal-green/15 bg-surface-raised px-5 py-4 transition-colors duration-200 hover:border-terminal-green/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/60";
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center border border-terminal-green/20 text-terminal-green">
          <Icon size={18} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
            {item.label}
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {item.description}
          </span>
        </span>
      </span>
      {item.isExternal ? (
        <ExternalLink
          size={16}
          aria-hidden="true"
          className="shrink-0 text-slate-500 transition-colors group-hover:text-terminal-green"
        />
      ) : (
        <ArrowRight
          size={16}
          aria-hidden="true"
          className="shrink-0 text-slate-500 transition-colors group-hover:text-terminal-green"
        />
      )}
    </>
  );

  if (item.isExternal) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
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

export default function AboutMe(): React.ReactElement {
  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-deep text-slate-900 dark:text-slate-100">
      <SkylineBackdrop />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-16 sm:px-8 lg:px-10">
        <section
          aria-labelledby="about-heading"
          className="grid gap-10 pb-24 lg:grid-cols-12 lg:gap-12"
        >
          <div className="lg:col-span-7">
            <p className={labelClass}>{PROFILE.command}</p>
            <h1
              id="about-heading"
              className="mt-5 max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl"
            >
              {PROFILE.headline}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              {PROFILE.introduction}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={LINKS.projects}
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-terminal-green px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-surface-deep transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green focus-visible:ring-offset-2 focus-visible:ring-offset-surface-deep"
              >
                Inspect work <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link
                href={LINKS.contact}
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-terminal-green/30 bg-surface-deep px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-terminal-green transition-colors hover:border-terminal-green/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/60"
              >
                Start a conversation <Mail size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="self-end border border-terminal-green/15 bg-surface-raised p-6 font-mono text-xs leading-relaxed lg:col-span-5">
            <div className="flex items-center justify-between border-b border-terminal-green/15 pb-4">
              <span className="text-slate-600 dark:text-slate-400">
                Operational status
              </span>
              <span className="inline-flex items-center gap-2 text-terminal-green">
                <span className="h-2 w-2 rounded-full bg-terminal-green" />
                ACTIVE
              </span>
            </div>
            <dl className="mt-4 space-y-4">
              {[
                ["CURRENT_ROLE", PROFILE.role],
                ["CURRENT_CONTEXT", PROFILE.context],
                ["FOCUS_AREA", PROFILE.focus],
                ["PUBLIC_RECORD", PROFILE.research],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4"
                >
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-slate-800 dark:text-slate-200 sm:text-right">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <section
          aria-labelledby="evolution-heading"
          className="border-t border-terminal-green/15 py-24"
        >
          <div className="grid gap-10 md:grid-cols-[15rem_1fr] md:gap-16">
            <div>
              <p className={labelClass}>$ history --three-shifts</p>
              <h2
                id="evolution-heading"
                className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl"
              >
                From building interfaces to operating secure systems.
              </h2>
            </div>
            <div className="border-t border-terminal-green/15">
              {EVOLUTION.map((stage) => (
                <article
                  key={stage.id}
                  className="grid gap-4 border-b border-terminal-green/15 py-8 sm:grid-cols-[10rem_1fr] sm:gap-8"
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-terminal-green">
                      {stage.label}
                    </p>
                    <h3 className="mt-2 text-base font-medium text-slate-900 dark:text-slate-100">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base">
                    {stage.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="capabilities-heading"
          className="border-t border-terminal-green/15 py-24"
        >
          <div className="max-w-2xl">
            <p className={labelClass}>$ pipeline --capabilities</p>
            <h2
              id="capabilities-heading"
              className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl"
            >
              One problem, four connected disciplines.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
              I can follow a problem from product intent through implementation,
              security review, production operations, and safe automation.
            </p>
          </div>

          <div className="mt-12 border-y border-terminal-green/15">
            {CAPABILITY_PIPELINES.map((pipeline) => {
              const Icon = PIPELINE_ICONS[pipeline.id];
              return (
                <article
                  key={pipeline.id}
                  className="grid border-b border-terminal-green/15 last:border-b-0 md:grid-cols-12"
                >
                  <div className="flex gap-4 border-b border-terminal-green/15 p-6 md:col-span-3 md:border-b-0 md:border-r">
                    <Icon
                      size={20}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-terminal-green"
                    />
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.18em] text-terminal-green">
                        {pipeline.command}
                      </p>
                      <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-900 dark:text-slate-100">
                        {pipeline.title}
                      </h3>
                    </div>
                  </div>
                  <p className="border-b border-terminal-green/15 p-6 text-sm leading-7 text-slate-700 dark:text-slate-300 md:col-span-6 md:border-b-0 md:border-r">
                    {pipeline.summary}
                  </p>
                  <div className="bg-surface-raised p-6 md:col-span-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      Output
                    </p>
                    <p className="mt-2 text-xs leading-6 text-slate-700 dark:text-slate-300">
                      {pipeline.output}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-t border-terminal-green/15 py-24">
          <div className="grid gap-16 lg:grid-cols-2">
            <div aria-labelledby="evidence-heading">
              <p className={labelClass}>$ verify --public</p>
              <h2
                id="evidence-heading"
                className="mt-4 text-3xl font-medium tracking-tight"
              >
                Inspectable evidence.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-700 dark:text-slate-300">
                The strongest claims on this page point to public work or a
                record you can open directly.
              </p>
              <div className="mt-8 space-y-3">
                {EVIDENCE.map((item) => (
                  <EvidenceLink key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div
              aria-labelledby="principles-heading"
              className="border border-terminal-green/15 bg-surface-raised p-7 sm:p-9"
            >
              <p className={labelClass}>$ policy --safe-by-default</p>
              <h2
                id="principles-heading"
                className="mt-4 text-3xl font-medium tracking-tight"
              >
                Operating principles.
              </h2>
              <ol className="mt-9 space-y-7">
                {OPERATING_PRINCIPLES.map((principle, index) => (
                  <li key={principle.title} className="flex gap-4">
                    <span className="font-mono text-xs text-terminal-green">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {principle.title}
                      </h3>
                      <p className="mt-1 text-xs leading-6 text-slate-700 dark:text-slate-300">
                        {principle.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="contact-heading"
          className="border-t border-terminal-green/15 py-24 text-center"
        >
          <p className={labelClass}>$ next --real-work</p>
          <h2
            id="contact-heading"
            className="mx-auto mt-4 max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl"
          >
            Bring the real problem. We can map the safest useful next step.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-700 dark:text-slate-300">
            Start with the work itself, the tools involved, and what a correct
            result looks like.
          </p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href={LINKS.security}
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-terminal-green/20 px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-slate-800 transition-colors hover:border-terminal-green/60 hover:text-terminal-green focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/60 dark:text-slate-200"
            >
              <Search size={15} aria-hidden="true" /> Security research
            </Link>
            <a
              href={LINKS.aiflowiz}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-terminal-green/20 px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-slate-800 transition-colors hover:border-terminal-green/60 hover:text-terminal-green focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/60 dark:text-slate-200"
            >
              <Bot size={15} aria-hidden="true" /> AIFlowiz
            </a>
            <Link
              href={LINKS.contact}
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-terminal-green px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-surface-deep transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green focus-visible:ring-offset-2 focus-visible:ring-offset-surface-deep"
            >
              <Mail size={15} aria-hidden="true" /> Contact
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
