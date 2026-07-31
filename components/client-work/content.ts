export interface ClientWorkSlide {
  id: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
}

export interface ClientProject {
  id: string;
  title: string;
  detailPath: string;
  deploymentLabel: string;
  deploymentUrl: string;
  summary: string;
  need: string;
  delivery: readonly string[];
  slides: readonly ClientWorkSlide[];
}

export interface ClientWorkCta {
  eyebrow: string;
  title: string;
  body: string;
  label: string;
  href: string;
}

/** Approved project records rendered by the reusable Client Work archive. */
export const CLIENT_PROJECTS: readonly ClientProject[] = [
  {
    id: "termstream",
    title: "TermStream",
    detailPath: "/projects/client-work/termstream",
    deploymentLabel: "ts.arafatops.com",
    deploymentUrl: "https://ts.arafatops.com",
    summary:
      "A secure browser and mobile control plane for persistent AI coding sessions on infrastructure the user owns.",
    need:
      "Keep long-running engineering work available across devices without losing control of the server, repository, branch, or active session.",
    delivery: [
      "Choose and manage owner-scoped SSH servers.",
      "Attach repositories and select isolated branch workspaces.",
      "Launch Shell, Claude, Antigravity, Codex, or Python sessions.",
      "Return to persistent work and use remote session controls.",
    ],
    slides: [
      {
        id: "overview",
        title: "Control plane overview",
        caption:
          "See the active server, choose a workspace, launch the right tool, and return to running work from one dashboard.",
        image: "/images/client-work/termstream-overview.png",
        alt: "TermStream dashboard showing server selection, workspace controls, and agent launchers",
      },
      {
        id: "servers",
        title: "Connect and verify the server",
        caption:
          "Move from SSH setup to a readiness check before an agent or repository touches the execution host.",
        image: "/images/client-work/termstream-servers.png",
        alt: "Live TermStream server setup progress and tool readiness checks",
      },
      {
        id: "workspace",
        title: "Choose the exact workspace",
        caption:
          "Attach the intended project and branch so each session starts in the right working context.",
        image: "/images/client-work/termstream-workspace.png",
        alt: "Live TermStream project and working branch selection controls",
      },
      {
        id: "launch",
        title: "Launch the operator you need",
        caption:
          "Start Shell, Claude, Antigravity, Codex, or Python with the project context and remote-control options visible.",
        image: "/images/client-work/termstream-launch.png",
        alt: "Live TermStream launch controls for Shell, Claude, Antigravity, Codex, and Python",
      },
      {
        id: "resume",
        title: "Resume persistent work",
        caption:
          "Reattach to a running terminal from the browser instead of rebuilding the session after every disconnect.",
        image: "/images/client-work/termstream-running-session.png",
        alt: "Live TermStream running-session controls with an available Claude session",
      },
    ],
  },
  {
    id: "second-brain-deck",
    title: "Second Brain.Deck",
    detailPath: "/projects/client-work/second-brain-deck",
    deploymentLabel: "obsidian.arafatops.com",
    deploymentUrl: "https://obsidian.arafatops.com",
    summary:
      "A browser control deck for an interconnected Markdown vault, built to keep useful knowledge close to the moment it matters.",
    need:
      "Capture an idea before it disappears, retrieve it when it becomes useful, navigate a growing vault, and see relationships across the whole knowledge base.",
    delivery: [
      "A Deck view for quick capture and daily orientation.",
      "A Tree view for direct folder and note navigation.",
      "A Mind Map that reveals relationships across notes and tags.",
      "A command palette for search, navigation, and common actions.",
    ],
    slides: [
      {
        id: "deck",
        title: "Capture what matters",
        caption:
          "Quick capture puts a thought into the vault before context switching makes it disappear.",
        image: "/images/client-work/second-brain-deck.png",
        alt: "Second Brain.Deck dashboard with quick capture and vault overview",
      },
      {
        id: "tree",
        title: "Navigate the growing vault",
        caption:
          "Tree view keeps folders and notes understandable when the archive becomes too large to hold in memory.",
        image: "/images/client-work/second-brain-tree.png",
        alt: "Second Brain.Deck Tree view showing nested Markdown vault folders",
      },
      {
        id: "mind-map",
        title: "Reveal relationships",
        caption:
          "Mind Map turns links and tags into a navigable view of how ideas connect across the vault.",
        image: "/images/client-work/second-brain-mind-map.png",
        alt: "Second Brain.Deck Mind Map showing connected notes and tags",
      },
      {
        id: "search",
        title: "Bring the right idea back",
        caption:
          "The command palette searches notes, tags, and folders while keeping high-value actions within reach.",
        image: "/images/client-work/second-brain-search.png",
        alt: "Second Brain.Deck command palette with note results and vault actions",
      },
    ],
  },
];

/** Approved conversion block using the site's existing contact destination. */
export const CLIENT_WORK_CTA: ClientWorkCta = {
  eyebrow: "Engineering consultation",
  title: "Have a system you need to ship?",
  body:
    "Bring the workflow, constraints, and ownership requirements. We can map the smallest dependable path from idea to a system your team can operate.",
  label: "Schedule Engineering Review",
  href: "/contact",
};

/** Resolve one dedicated case-study record by its route identifier. */
export function getClientProject(projectId: string): ClientProject | undefined {
  return CLIENT_PROJECTS.find((project) => project.id === projectId);
}

/** Return the next carousel index while wrapping at either edge. */
export function getAdjacentSlideIndex(
  currentIndex: number,
  step: -1 | 1,
  slideCount: number,
): number {
  if (slideCount <= 0) return 0;
  return (currentIndex + step + slideCount) % slideCount;
}

/** Convert a horizontal swipe into carousel movement when it clears the threshold. */
export function getSwipeStep(startX: number, endX: number): -1 | 0 | 1 {
  const distance = endX - startX;
  if (Math.abs(distance) < 48) return 0;
  return distance < 0 ? 1 : -1;
}
