import { CLIENT_PROJECTS } from "@/components/client-work/content";
import projectsData from "@/data/projects.json";

export interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  language: string;
  stargazers_count: number;
  homepage?: string;
  preview_image?: string;
  featured?: boolean;
  /** Site path of the dedicated case study, for projects that have one. */
  caseStudyPath?: string;
}

export const FEATURED_PROJECTS: readonly GithubRepo[] = [
  { id: -1, name: "TermStream", description: "A secure browser and mobile control plane for persistent AI coding sessions on infrastructure the user owns. It brings together owner-scoped SSH servers, repository and branch-workspace selection, and long-running Shell, Claude, Codex, Antigravity, or Python sessions so work can be resumed and operated across devices without losing control of the underlying system.", html_url: "https://github.com/mrx-arafat/TermStream", homepage: CLIENT_PROJECTS[0].deploymentUrl, preview_image: "/images/client-work/termstream-overview.png", topics: ["ai-systems", "infrastructure", "terminal", "security"], language: "TypeScript", stargazers_count: 0, featured: true, caseStudyPath: CLIENT_PROJECTS[0].detailPath },
  { id: -2, name: "AIflowiz", description: "An agency delivery system for turning research, qualification, and AI-assisted production work into reviewable internal workflows. It connects evidence collection, scoring, controlled agent runs, structured outputs, and owner approval - keeping external sends manual while making the reasoning and operational trail visible.", html_url: "https://github.com/mrx-arafat/AIflowiz", homepage: "https://aiflowiz.com", preview_image: "/images/aiflowiz-home.png", topics: ["ai-automation", "workflows", "delivery"], language: "TypeScript", stargazers_count: 0, featured: true },
  { id: -3, name: "Agentic Terminal", description: "An open-source, folder-scoped AI terminal built to make agent work observable instead of opaque. Shell commands, file changes, tool calls, and approval steps stay in one visible execution surface, giving developers a practical way to harness AI coding tools while retaining explicit control of what runs and where.", html_url: "https://github.com/mrx-arafat/agentic-terminal", preview_image: "/images/agentic-terminal-thumbnail.png", topics: ["agents", "terminal", "developer-tools"], language: "TypeScript", stargazers_count: 0, featured: true },
  { id: -4, name: "Second Brain.Deck", description: "An Obsidian-compatible knowledge system designed for high-signal capture and retrieval rather than a static notes vault. It combines queryable context, Git-backed guardrails, structured navigation, and controlled agent access so personal or team knowledge can remain useful, auditable, and easy to continue from.", html_url: "https://github.com/mrx-arafat/second-brain", homepage: CLIENT_PROJECTS[1].deploymentUrl, preview_image: "/images/client-work/second-brain-deck.png", topics: ["knowledge-systems", "obsidian", "agents"], language: "TypeScript", stargazers_count: 0, featured: true, caseStudyPath: CLIENT_PROJECTS[1].detailPath },
  { id: -5, name: "Social Blocker", description: "A privacy-first Chrome extension that turns distraction blocking into a deliberate focus practice. Instead of silently collecting behaviour, it creates a pause before distracting sites, tracks streaks and time saved locally, and gives the user simple controls for strict sessions and blocked-site settings.", html_url: "https://github.com/mrx-arafat/social-blocker", preview_image: "/images/social-blocker-dashboard.png", topics: ["chrome-extension", "focus", "privacy"], language: "TypeScript", stargazers_count: 0, featured: true },
  { id: -6, name: "AI Opportunity Map", description: "An interactive AI intelligence dashboard that translates market signals into a usable strategy view. It brings together trend coverage, investment areas, market-size and adoption indicators, methodology notes, and source-backed analysis so a visitor can explore where the opportunity is and why it matters.", html_url: "https://github.com/mrx-arafat/AI-Opportunity-Map", homepage: "https://ai-opportunity-map-2025.streamlit.app/", preview_image: "/images/ai-opportunity-map.png", topics: ["ai", "strategy", "data-visualization"], language: "Python", stargazers_count: 0, featured: true },
];

const FEATURED_REPOSITORIES = new Set(FEATURED_PROJECTS.map((project) => project.html_url));

/** Every project in display order: featured builds first, then the public build log. */
export const ORDERED_PROJECTS: readonly GithubRepo[] = [
  ...FEATURED_PROJECTS,
  ...(projectsData as GithubRepo[]).filter((project) => !FEATURED_REPOSITORIES.has(project.html_url)),
];

const LEAD_PROJECT_COUNT = 4;
const LEAD_PROJECT_NAMES = FEATURED_PROJECTS.slice(0, LEAD_PROJECT_COUNT)
  .map((project) => project.name)
  .join(", ");

/** Page description, shared by the metadata and the structured data so they cannot drift. */
export const PROJECTS_DESCRIPTION = `Projects by Easin Arafat: ${LEAD_PROJECT_NAMES} and ${ORDERED_PROJECTS.length - LEAD_PROJECT_COUNT} more across AI systems, security tools and developer utilities.`;
