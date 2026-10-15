"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code, Copy, Github, Pause, Play } from "lucide-react";
import { Chip, SectionHeading, StatusTag, useMotion } from "@/components/open-circuit";
import { getAdjacentSlideIndex } from "@/components/client-work/content";
import { AgenticProjectVisual } from "@/components/agentic-work/visuals";

import type { GithubRepo } from "./projects-data";
import styles from "./projects.module.css";

const AUTO_ADVANCE_SECONDS = 10;

interface ProjectsClientProps {
  projects: readonly GithubRepo[];
}

/** Operate the project workbench while the full archive stays server rendered. */
export default function ProjectsClient({ projects }: ProjectsClientProps): React.ReactElement {
  const [currentProject, setCurrentProject] = useState(0);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_ADVANCE_SECONDS);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [copyStatus, setCopyStatus] = useState("");
  const { isMotionEnabled } = useMotion();
  const isInteracting = isHoverPaused || isFocusPaused;
  const project = projects[currentProject];
  const projectKey = String(project?.id ?? "");
  const projectUrl = project?.html_url ?? project?.homepage ?? project?.caseStudyPath;

  useEffect(() => {
    if (!isAutoAdvancing || !isMotionEnabled || isInteracting || projects.length <= 1) return;
    let remaining = AUTO_ADVANCE_SECONDS;
    const timer = setInterval(() => {
      remaining -= 1;
      if (remaining === 0) {
        setCurrentProject((index) => getAdjacentSlideIndex(index, 1, projects.length));
        remaining = AUTO_ADVANCE_SECONDS;
      }
      setCountdown(remaining);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentProject, isAutoAdvancing, isMotionEnabled, isInteracting, projects.length]);

  const selectProject = (index: number): void => {
    setCurrentProject(index);
    setCountdown(AUTO_ADVANCE_SECONDS);
    setCopyStatus("");
  };

  const copyLink = async (): Promise<void> => {
    if (!projectUrl) return;
    try {
      await navigator.clipboard.writeText(new URL(projectUrl, window.location.origin).href);
      setCopyStatus("Project link copied.");
    } catch {
      setCopyStatus("Could not copy. Use the project links to open it.");
    }
  };

  return (
    <section className="oc-zone" aria-labelledby="project-carousel-heading">
      <SectionHeading path="work/workbench" note="my builds / take your pick" title="I made all this." id="project-carousel-heading" />
      {project ? (
        <div
          className={styles.workbench}
          role="group"
          aria-roledescription="carousel"
          aria-label="Project carousel"
          onMouseEnter={() => { setIsHoverPaused(true); setCountdown(AUTO_ADVANCE_SECONDS); }}
          onMouseLeave={() => setIsHoverPaused(false)}
          onFocusCapture={() => { setIsFocusPaused(true); setCountdown(AUTO_ADVANCE_SECONDS); }}
          onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusPaused(false); }}
        >
          <div className={styles.workbenchBar}>
            <StatusTag tone={project.featured ? "ok" : "neutral"}>{project.featured ? "ONE OF MINE" : "MORE OF MINE"}</StatusTag>
            <span className="oc-small oc-muted" aria-live="polite"><span className="oc-sr">{project.name}. </span>{currentProject + 1} / {projects.length}</span>
          </div>
          <div className={styles.workbenchGrid}>
            <figure className={styles.preview}>
              {project.visual_id ? <AgenticProjectVisual projectId={project.visual_id} /> : <div className={styles.previewImage}>
                {project.preview_image && !imageErrors[projectKey] ? (
                  <Image src={project.preview_image} alt="" fill sizes="(min-width: 1120px) 640px, (min-width: 640px) 50vw, 100vw" className="object-contain" priority={currentProject === 0} unoptimized onError={() => setImageErrors((errors) => ({ ...errors, [projectKey]: true }))} />
                ) : (
                  <div className={styles.previewFallback}><Code size={40} aria-hidden="true" /><span>{imageErrors[projectKey] ? "Failed to load image" : "Explore the source and documentation"}</span></div>
                )}
              </div>}
              <figcaption className={styles.previewCaption}>{`${project.visual_id ? "Designed workflow" : project.preview_image ? "Product screenshot" : "Build record"} / ${project.name}`}</figcaption>
            </figure>
            <div className={styles.workbenchCopy}>
              <div className={styles.titleRow}><Chip>{project.language}</Chip>{project.stargazers_count > 0 && <Chip tone="amber">{project.stargazers_count} GitHub stars</Chip>}</div>
              <h3>{project.name}</h3>
              <p className={styles.description}>{project.description}</p>
              <ul className={styles.topics} aria-label="Project topics">{project.topics.map((topic) => <li key={topic}><Chip tone="muted">#{topic}</Chip></li>)}</ul>
              <div className={styles.links}>
                {project.html_url && <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="oc-route"><Github size={16} aria-hidden="true" />View on GitHub</a>}
                {project.docs_url && <a href={project.docs_url} target="_blank" rel="noopener noreferrer" className="oc-route">Read the docs <ArrowUpRight size={16} aria-hidden="true" /></a>}
                {project.caseStudyPath && <Link href={project.caseStudyPath} className="oc-route">Case Study <ArrowUpRight size={16} aria-hidden="true" /></Link>}
                {project.homepage && <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="oc-route">Open project <ArrowUpRight size={16} aria-hidden="true" /></a>}
                {!project.html_url && <span className="oc-small oc-muted">Source not publicly available</span>}
                <button type="button" onClick={copyLink} disabled={!projectUrl} className="oc-control"><Copy size={16} aria-hidden="true" />Copy Link</button>
              </div>
              <p className={styles.copyStatus} role="status">{copyStatus}</p>
            </div>
          </div>
          <div className={styles.carouselControls}>
            <div className={styles.links}>
              <button type="button" className="oc-control" disabled={projects.length <= 1} onClick={() => selectProject(getAdjacentSlideIndex(currentProject, -1, projects.length))}><ArrowLeft size={16} aria-hidden="true" />Previous project</button>
              <button type="button" className="oc-control" disabled={projects.length <= 1} onClick={() => selectProject(getAdjacentSlideIndex(currentProject, 1, projects.length))}>Next project<ArrowRight size={16} aria-hidden="true" /></button>
            </div>
            <button type="button" className="oc-control" disabled={!isMotionEnabled || projects.length <= 1} aria-pressed={isAutoAdvancing && isMotionEnabled} onClick={() => { setIsAutoAdvancing((active) => !active); setCountdown(AUTO_ADVANCE_SECONDS); }}>
              {isAutoAdvancing && isMotionEnabled ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              {!isMotionEnabled ? "Auto: motion paused" : isAutoAdvancing ? `Auto: ${isInteracting ? "paused while reading" : `${countdown}s`}` : "Auto: paused"}
            </button>
          </div>
          <details className={styles.projectPicker}>
            <summary>Jump to a project</summary>
            <div className={styles.pickerOptions}>{projects.map((item, index) => <button type="button" key={item.id} className="oc-control" aria-pressed={index === currentProject} onClick={() => selectProject(index)}>{item.name}</button>)}</div>
          </details>
        </div>
      ) : <p className="oc-muted">No repositories found.</p>}
    </section>
  );
}
