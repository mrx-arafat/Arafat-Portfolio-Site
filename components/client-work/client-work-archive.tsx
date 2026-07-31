import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { CLIENT_PROJECTS } from "./content";

/** Introduce the selected-project archive and route each record to its own page. */
export function ClientWorkArchive(): React.ReactElement {
  return (
    <section
      id="client-work"
      className="mt-10 scroll-mt-6 border-y border-terminal-green/25"
      aria-labelledby="client-work-heading"
    >
      <div className="grid gap-6 py-12 sm:py-16 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
        <p className="font-mono text-sm text-terminal-green/60">
          PROJECT ARCHIVE / SELECTED BUILDS
        </p>
        <div>
          <h2
            id="client-work-heading"
            className="max-w-3xl text-4xl font-bold tracking-tight text-terminal-green sm:text-6xl"
          >
            Systems I&apos;ve designed, built, and shipped.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-terminal-green/70">
            Explore the problem behind each project, the workflow it supports,
            and the working product through real screens.
          </p>
        </div>
      </div>

      <div className="divide-y divide-terminal-green/25 border-t border-terminal-green/25">
        {CLIENT_PROJECTS.map((project, index) => (
          <article
            key={project.id}
            className="grid gap-7 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
            aria-labelledby={`${project.id}-archive-heading`}
          >
            <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
              <p className="font-mono text-xs text-terminal-green/60">
                PROJECT {String(index + 1).padStart(2, "0")} / CASE STUDY
              </p>
              <h3
                id={`${project.id}-archive-heading`}
                className="mt-3 break-words text-3xl font-bold tracking-tight text-terminal-green sm:text-4xl"
              >
                {project.title}
              </h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-terminal-green/75">
                {project.summary}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link
                  href={project.detailPath}
                  className="group inline-flex min-h-11 items-center gap-2 py-2 font-mono text-sm font-semibold text-terminal-green transition-colors hover:text-terminal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green motion-reduce:transition-none"
                >
                  View case study
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </Link>
                <a
                  href={project.deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 py-2 font-mono text-sm text-terminal-green/70 transition-colors hover:text-terminal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green motion-reduce:transition-none"
                >
                  Open live project
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              </div>
            </div>

            <Link
              href={project.detailPath}
              className={`group block border border-terminal-green/25 bg-surface-deep p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green ${
                index % 2 === 1 ? "lg:order-1" : ""
              }`}
              aria-label={`View ${project.title} case study preview`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#10111a]">
                <Image
                  src={project.slides[0].image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transition-none"
                  priority={index === 0}
                />
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
