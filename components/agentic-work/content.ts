export type AgenticWorkProjectId =
  | "yoke"
  | "herdr-setup"
  | "deepread"
  | "app-harness"
  | "multi-agent-orchestration"
  | "agentic-terminal"
  | "wt-cli"
  | "day-to-day-skills";

export interface AgenticWorkProject {
  id: AgenticWorkProjectId;
  repositoryId: number;
  name: string;
  role: string;
  summary: string;
  repositoryUrl: string;
  productUrl?: string;
  docsUrl: string;
  language: string;
  topics: readonly string[];
  stars: number;
}

/** Public GitHub metadata and README evidence checked on 2026-10-15. */
export const AGENTIC_WORK_PROJECTS: readonly AgenticWorkProject[] = [
  {
    id: "yoke",
    repositoryId: 1416574539,
    name: "Yoke",
    role: "I make \"done\" prove it.",
    summary: "Local policy gates for Claude Code and Codex: human-approved checks, independent review and a console that shows the decision trail. A pre-release tool built around proof of completion.",
    repositoryUrl: "https://github.com/mrx-arafat/yoke",
    docsUrl: "https://github.com/mrx-arafat/yoke/blob/main/README.md",
    language: "Rust",
    topics: [],
    stars: 0,
  },
  {
    id: "herdr-setup",
    repositoryId: 1415371452,
    name: "herdr-setup",
    role: "I gave multitasking a floor plan.",
    summary: "One-command setup for running Claude Code, Codex and Agy side by side in herdr. The fleet command starts workers, gives them tasks and keeps their work visible; an interactive manual lets you plan the layout first.",
    repositoryUrl: "https://github.com/mrx-arafat/herdr-setup",
    productUrl: "https://mrx-arafat.github.io/herdr-setup/",
    docsUrl: "https://github.com/mrx-arafat/herdr-setup/blob/main/README.md",
    language: "Shell",
    topics: ["ai-agents", "claude-code", "codex", "developer-tools", "herdr", "terminal"],
    stars: 1,
  },
  {
    id: "deepread",
    repositoryId: 1399446144,
    name: "DeepRead",
    role: "I gave my books a plus-one.",
    summary: "A private reading library with an AI tutor beside the passage: word meanings, explanations, offline natural voices, precise bookmarks and shared libraries. Readers bring their own Claude Code, Codex or API key.",
    repositoryUrl: "https://github.com/mrx-arafat/DeepRead",
    productUrl: "https://deepread.arafatops.com",
    docsUrl: "https://github.com/mrx-arafat/DeepRead/blob/main/README.md",
    language: "TypeScript",
    topics: ["ai-tutor", "ebook-reader", "pdf-reader", "pdfjs", "react", "reading", "self-hosted", "text-to-speech", "translation", "typescript", "webgpu"],
    stars: 1,
  },
  {
    id: "app-harness",
    repositoryId: 1286368049,
    name: "App Harness",
    role: "I insist on a second opinion.",
    summary: "A Claude Code skill for supervised app-building loops. Isolated planning, generation, deterministic gates and adversarial evaluation exchange evidence through files, so the builder does not grade its own work.",
    repositoryUrl: "https://github.com/mrx-arafat/app-harness",
    docsUrl: "https://github.com/mrx-arafat/app-harness/blob/main/README.md",
    language: "Shell",
    topics: [],
    stars: 0,
  },
  {
    id: "multi-agent-orchestration",
    repositoryId: 1160949733,
    name: "Multi-Agent Orchestration",
    role: "I keep the whole team in view.",
    summary: "A coordination framework for agent teams, Kanban tasks, inter-agent messaging and multi-stage workflows, with shared memory and a signed audit trail. A dashboard keeps team activity and workflow execution in view.",
    repositoryUrl: "https://github.com/mrx-arafat/Multi-Agent-Orchestration",
    docsUrl: "https://github.com/mrx-arafat/Multi-Agent-Orchestration/blob/main/README.md",
    language: "TypeScript",
    topics: [],
    stars: 0,
  },
  {
    id: "agentic-terminal",
    repositoryId: 1215179873,
    name: "Agentic Terminal",
    role: "I can see what ran.",
    summary: "A folder-scoped terminal agent where shell commands and natural-language requests share one prompt. Tool calls, file changes and approval steps stay visible, with hosted models, local Ollama or a Claude Code CLI connection.",
    repositoryUrl: "https://github.com/mrx-arafat/agentic-terminal",
    docsUrl: "https://github.com/mrx-arafat/agentic-terminal/blob/main/README.md",
    language: "TypeScript",
    topics: [],
    stars: 0,
  },
  {
    id: "wt-cli",
    repositoryId: 1332777137,
    name: "wt-cli",
    role: "I gave parallel work its own space.",
    summary: "A shell-native Git worktree manager for listing, creating and moving between workspaces by number or name. It keeps parallel agent work in separate directories without making the operator memorize paths.",
    repositoryUrl: "https://github.com/mrx-arafat/wt-cli",
    docsUrl: "https://github.com/mrx-arafat/wt-cli/blob/main/README.md",
    language: "Shell",
    topics: [],
    stars: 2,
  },
  {
    id: "day-to-day-skills",
    repositoryId: 1197576590,
    name: "Day-to-Day Skills",
    role: "I turned repetition into a skill.",
    summary: "A personal toolkit of reusable Claude Code skills, including article and security-research workflows. Structured instructions and supporting templates turn repeated work into a repeatable process.",
    repositoryUrl: "https://github.com/mrx-arafat/day-to-day-skills",
    docsUrl: "https://github.com/mrx-arafat/day-to-day-skills/blob/main/README.md",
    language: "Shell",
    topics: [],
    stars: 0,
  },
];
