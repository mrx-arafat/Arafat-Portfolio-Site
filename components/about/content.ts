export interface WorkTrack {
  id: "secure" | "operate" | "automate";
  command: string;
  title: string;
  input: string;
  action: string;
  outcome: string;
}

export interface OperatingArea {
  id: "security" | "platform" | "automation";
  title: string;
  description: string;
  proof: string;
}

export interface ProofItem {
  id: "security" | "research" | "systems" | "aiflowiz";
  label: string;
  description: string;
  href: string;
  isExternal: boolean;
}

export interface OperatingPrinciple {
  title: string;
  body: string;
}

export const PROFILE = {
  command: "$ whoami --production-context",
  headline:
    "Nine disclosed CVEs. An Elsevier Q1 paper. My confidence has references.",
  introduction:
    "I'm Easin Arafat, Application Security Engineer at Startise, working on xCloud. I build AI tooling and turn research, QA, documentation and operations into review-gated automation through AIFlowiz. If it cannot survive production, it does not get to impress me.",
  role: "Application Security Engineer at Startise",
  context: "xCloud at Startise",
  focus: "AI tooling, review-gated automation and systems that survive production",
  research: "9 Patchstack records and an Elsevier Q1 paper",
} as const;

export const OPERATING_AREAS: OperatingArea[] = [
  {
    id: "security",
    title: "I question the permissions.",
    description: "I trace attack paths, test authorization boundaries and make the findings reproducible. A reassuring checkbox is not evidence.",
    proof: "9 Patchstack records",
  },
  {
    id: "platform",
    title: "I stay for production.",
    description: "I work on release paths, reliability and recovery. The launch is the part where the system starts answering back.",
    proof: "xCloud at Startise",
  },
  {
    id: "automation",
    title: "I give AI a job description.",
    description: "I build execution harnesses, policy gates and shared context. Generating an answer is the easy part; I want work I can inspect.",
    proof: "Yoke, Herdr setup and agent tools",
  },
];

export const WORK_TRACKS: WorkTrack[] = [
  {
    id: "secure",
    command: "[SECURITY / I CHECK THE BOUNDARY]",
    title: "I make assumptions uncomfortable.",
    input: "Application behavior, identities, permissions, and exposed attack surface.",
    action:
      "Threat modeling, authorization review, vulnerability research, and reproducible security verification.",
    outcome:
      "Clear risk context, remediation paths, and public research across access control and sensitive-data failures.",
  },
  {
    id: "operate",
    command: "[PLATFORM / I KEEP THE CONTEXT]",
    title: "I expect production to have opinions.",
    input: "Infrastructure changes, deployment procedures, server symptoms, and operational handoffs.",
    action:
      "Build deployment and recovery paths with logs, health checks, visible failure modes, and practical documentation.",
    outcome:
      "Repeatable operations that make diagnosis and recovery less dependent on one person remembering the steps.",
  },
  {
    id: "automate",
    command: "[AI / I CHECK THE WORK]",
    title: "I read the work before the victory speech.",
    input: "Coding agents, engineering workflows, project knowledge and execution boundaries.",
    action:
      "Build harnesses, shared context, policy gates, independent review and resumable execution around coding agents.",
    outcome:
      "Agent work that can be inspected, reviewed and continued, with the human decision-maker in control.",
  },
];

export const PROOF: ProofItem[] = [
  {
    id: "security",
    label: "I have nine disclosures to point to.",
    description:
      "9 Patchstack vulnerability records spanning access control, IDOR, and sensitive-data exposure.",
    href: "/security-research",
    isExternal: false,
  },
  {
    id: "research",
    label: "I made it into the journal, too.",
    description:
      "Co-author of an Array paper on machine-learning-driven adaptive interfaces for mobile banking.",
    href: "https://doi.org/10.1016/j.array.2026.100901",
    isExternal: true,
  },
  {
    id: "systems",
    label: "I leave the code where you can see it.",
    description:
      "Explore the public code behind my agent harnesses, local policy gates, orchestration tools and technical automation.",
    href: "https://github.com/mrx-arafat",
    isExternal: true,
  },
  {
    id: "aiflowiz",
    label: "I put the repetition to work at AIFlowiz.",
    description:
      "A review-gated automation practice for repeated technical work: research, QA, documentation, and operations.",
    href: "https://aiflowiz.com/",
    isExternal: true,
  },
];

export const OPERATING_PRINCIPLES: OperatingPrinciple[] = [
  {
    title: "I start with a boundary",
    body:
      "Establish one useful outcome, its failure modes, and the evidence needed to trust it before expanding scope.",
  },
  {
    title: "I keep access on a short leash",
    body:
      "Give people, services, and AI workflows only the access that the current task actually requires.",
  },
  {
    title: "I approve before it matters",
    body:
      "External, destructive, or difficult-to-reverse actions stay behind an explicit human decision.",
  },
  {
    title: "I bring the evidence",
    body:
      "A result includes test evidence, operational context, and known limits, not only a claim that it works.",
  },
];

export const LINKS = {
  projects: "/projects",
  security: "/security-research",
  contact: "/contact",
  aiflowiz: "https://aiflowiz.com/",
} as const;
