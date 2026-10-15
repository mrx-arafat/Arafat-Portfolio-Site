import { CLIENT_PROJECTS } from "@/components/client-work/content";
import { AGENTIC_WORK_PROJECTS, type AgenticWorkProjectId } from "@/components/agentic-work/content";
import projectsData from "@/data/projects.json";

export interface GithubRepo {
  id: number | string;
  name: string;
  description: string;
  /** Present only when the repository is publicly accessible. */
  html_url?: string;
  topics: string[];
  language: string;
  stargazers_count: number;
  homepage?: string;
  docs_url?: string;
  preview_image?: string;
  visual_id?: AgenticWorkProjectId;
  featured?: boolean;
  /** Site path of the dedicated case study, for projects that have one. */
  caseStudyPath?: string;
}

export const FEATURED_PROJECTS: readonly GithubRepo[] = [
  ...AGENTIC_WORK_PROJECTS.map((project): GithubRepo => ({
    id: project.repositoryId,
    name: project.name,
    description: project.summary,
    html_url: project.repositoryUrl,
    homepage: project.productUrl,
    docs_url: project.docsUrl,
    visual_id: project.id,
    topics: [...project.topics],
    language: project.language,
    stargazers_count: project.stars,
    featured: true,
  })),
  { id: "termstream", name: "TermStream", description: "A secure browser and mobile control plane for persistent AI coding sessions on infrastructure the user owns. It brings together owner-scoped SSH servers, repository and branch-workspace selection, and long-running Shell, Claude, Codex, Antigravity, or Python sessions so work can be resumed and operated across devices without losing control of the underlying system.", homepage: CLIENT_PROJECTS[0].deploymentUrl, preview_image: "/images/client-work/termstream-overview.png", topics: ["ai-systems", "infrastructure", "terminal", "security"], language: "TypeScript", stargazers_count: 0, featured: true, caseStudyPath: CLIENT_PROJECTS[0].detailPath },
  { id: "aiflowiz", name: "AIflowiz", description: "An agency delivery system for turning research, qualification, and AI-assisted production work into reviewable internal workflows. It connects evidence collection, scoring, controlled agent runs, structured outputs, and owner approval - keeping external sends manual while making the reasoning and operational trail visible.", homepage: "https://aiflowiz.com", preview_image: "/images/aiflowiz-home.png", topics: ["ai-automation", "workflows", "delivery"], language: "TypeScript", stargazers_count: 0, featured: true },
  { id: "second-brain-deck", name: "Second Brain.Deck", description: "An Obsidian-compatible knowledge system designed for high-signal capture and retrieval rather than a static notes vault. It combines queryable context, Git-backed guardrails, structured navigation, and controlled agent access so personal or team knowledge can remain useful, auditable, and easy to continue from.", homepage: CLIENT_PROJECTS[1].deploymentUrl, preview_image: "/images/client-work/second-brain-deck.png", topics: ["knowledge-systems", "obsidian", "agents"], language: "TypeScript", stargazers_count: 0, featured: true, caseStudyPath: CLIENT_PROJECTS[1].detailPath },
  { id: 1264180585, name: "Social Blocker", description: "A privacy-first Chrome extension that turns distraction blocking into a deliberate focus practice. Instead of silently collecting behaviour, it creates a pause before distracting sites, tracks streaks and time saved locally, and gives the user simple controls for strict sessions and blocked-site settings.", html_url: "https://github.com/mrx-arafat/social-blocker", preview_image: "/images/social-blocker-dashboard.png", topics: ["chrome-extension", "focus", "privacy"], language: "JavaScript", stargazers_count: 0, featured: true },
  { id: 992801317, name: "AI Opportunity Map", description: "An interactive AI intelligence dashboard that translates market signals into a usable strategy view. It brings together trend coverage, investment areas, market-size and adoption indicators, methodology notes, and source-backed analysis so a visitor can explore where the opportunity is and why it matters.", html_url: "https://github.com/mrx-arafat/AI-Opportunity-Map", homepage: "https://ai-opportunity-map-2025.streamlit.app/", preview_image: "/images/ai-opportunity-map.png", topics: ["ai", "strategy", "data-visualization"], language: "Python", stargazers_count: 0, featured: true },
];

const FEATURED_REPOSITORIES = new Set(FEATURED_PROJECTS.flatMap((project) => project.html_url ? [project.html_url] : []));
const FEATURED_NAMES = new Set(FEATURED_PROJECTS.map((project) => project.name));

// Local archive IDs whose source URLs returned anonymous 404s on 2026-10-15.
const UNAVAILABLE_SOURCE_IDS = new Set([6, 14, 17, 18, 19, 25, 30, 31]);
const BUILD_LOG: readonly GithubRepo[] = projectsData.map((project) => ({
  ...project,
  html_url: UNAVAILABLE_SOURCE_IDS.has(project.id)
    ? undefined
    : project.id === 3 ? "https://github.com/mrx-arafat/linux-buddy" : project.html_url,
}));

/** Every project in display order: featured builds first, then the public build log. */
export const ORDERED_PROJECTS: readonly GithubRepo[] = [
  ...FEATURED_PROJECTS,
  ...BUILD_LOG.filter((project) => !FEATURED_NAMES.has(project.name) && (!project.html_url || !FEATURED_REPOSITORIES.has(project.html_url))),
];

const LEAD_PROJECT_COUNT = 4;
const LEAD_PROJECT_NAMES = FEATURED_PROJECTS.slice(0, LEAD_PROJECT_COUNT)
  .map((project) => project.name)
  .join(", ");

/** Page description, shared by the metadata and the structured data so they cannot drift. */
export const PROJECTS_DESCRIPTION = `Projects by Easin Arafat: ${LEAD_PROJECT_NAMES} and ${ORDERED_PROJECTS.length - LEAD_PROJECT_COUNT} more across agentic AI systems, security tools and developer utilities.`;
