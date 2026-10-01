import { memo } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

import type { GithubRepo } from "./projects-data";

const LINK_BASE =
  "inline-flex min-h-11 items-center gap-2 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green motion-reduce:transition-none";
const LINK_PRIMARY = `${LINK_BASE} font-semibold text-terminal-green hover:text-terminal-soft`;
const LINK_MUTED = `${LINK_BASE} text-terminal-green/70 hover:text-terminal-green`;

interface ProjectIndexProps {
  projects: readonly GithubRepo[];
}

/**
 * List every project with its description and links, so none of them depends
 * on the carousel to be read. Memoized: the carousel above re-renders every
 * second for its countdown and this list never changes.
 */
export const ProjectIndex = memo(function ProjectIndex({
  projects,
}: ProjectIndexProps): React.ReactElement {
  return (
    <section id="project-index" aria-labelledby="project-index-heading">
      <div className="mb-6 mt-16 border-b border-terminal-green/25 pb-5 sm:mt-20">
        <p className="font-mono text-xs text-terminal-green/60">
          FULL INDEX / {projects.length} PROJECTS
        </p>
        <h2
          id="project-index-heading"
          className="mt-2 text-2xl font-bold text-terminal-green sm:text-3xl"
        >
          All projects
        </h2>
      </div>

      <ol className="divide-y divide-terminal-green/10 rounded-lg border border-terminal-green/10 bg-surface-night shadow-[0_0_15px_rgba(46,213,115,0.1)]">
        {projects.map((project, index) => (
          <li
            key={project.html_url}
            className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 p-4 sm:px-6"
          >
            <span
              aria-hidden="true"
              className="pt-1 font-mono text-xs text-terminal-green/60"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="break-words text-base font-bold text-terminal-green md:text-lg">
                  {project.name}
                </h3>
                <span className="font-mono text-xs text-terminal-green/60">
                  {project.language}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-terminal-green/80">
                {project.description}
              </p>
              <div className="mt-1 flex flex-wrap gap-x-6">
                {project.caseStudyPath && (
                  <Link
                    href={project.caseStudyPath}
                    className={LINK_PRIMARY}
                  >
                    {project.name} case study
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                )}
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.name} source on GitHub`}
                  className={LINK_MUTED}
                >
                  <Github size={14} aria-hidden="true" />
                  Source on GitHub
                </a>
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.name} live demo`}
                    className={LINK_MUTED}
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                    Live demo
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
});
