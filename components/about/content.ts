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
    "Security, infrastructure, and AI automation that stays inspectable under production pressure.",
  introduction:
    "I am Easin Arafat, an Application Security Engineer at Startise working on xCloud. I build and harden the systems around a product, from the application boundary and release path to controlled AI workflows that keep important decisions visible.",
  role: "Application Security Engineer at Startise",
  context: "xCloud at Startise",
  focus: "Security, platform reliability, and controlled AI workflows",
  research: "9 Patchstack records and an Elsevier Q1 paper",
} as const;

export const OPERATING_AREAS: OperatingArea[] = [
  {
    id: "security",
    title: "Security research & testing",
    description: "Attack paths, authorization boundaries, and reproducible verification.",
    proof: "9 Patchstack records",
  },
  {
    id: "platform",
    title: "Cloud & platform operations",
    description: "Release paths, server symptoms, reliability, and recovery context.",
    proof: "xCloud at Startise",
  },
  {
    id: "automation",
    title: "Controlled AI automation",
    description: "Bounded research, developer, QA, and documentation workflows.",
    proof: "AIFlowiz and agent tools",
  },
];

export const WORK_TRACKS: WorkTrack[] = [
  {
    id: "secure",
    command: "[SECURE THE BOUNDARY]",
    title: "Find the assumption before it becomes an incident.",
    input: "Application behavior, identities, permissions, and exposed attack surface.",
    action:
      "Threat modeling, authorization review, vulnerability research, and reproducible security verification.",
    outcome:
      "Clear risk context, remediation paths, and public research across access control and sensitive-data failures.",
  },
  {
    id: "operate",
    command: "[OPERATE THE PLATFORM]",
    title: "Keep the release path explainable when production gets noisy.",
    input: "Infrastructure changes, deployment procedures, server symptoms, and operational handoffs.",
    action:
      "Build deployment and recovery paths with logs, health checks, visible failure modes, and practical documentation.",
    outcome:
      "Repeatable operations that make diagnosis and recovery less dependent on one person remembering the steps.",
  },
  {
    id: "automate",
    command: "[AUTOMATE WITH CONTROL]",
    title: "Turn repeated engineering work into bounded, reviewable systems.",
    input: "Repeated development, QA, research, documentation, and terminal workflows.",
    action:
      "Harness approved AI tools with constrained inputs, evidence capture, test checks, and explicit approval points.",
    outcome:
      "Faster technical work without pretending that the human decision-maker has disappeared.",
  },
];

export const PROOF: ProofItem[] = [
  {
    id: "security",
    label: "Security research record",
    description:
      "9 Patchstack vulnerability records spanning access control, IDOR, and sensitive-data exposure.",
    href: "/security-research",
    isExternal: false,
  },
  {
    id: "research",
    label: "Peer-reviewed research",
    description:
      "Co-author of an Array paper on machine-learning-driven adaptive interfaces for mobile banking.",
    href: "https://doi.org/10.1016/j.array.2026.100901",
    isExternal: true,
  },
  {
    id: "systems",
    label: "Agentic systems and developer tools",
    description:
      "Public experiments in agent harnessing, AI-assisted terminal work, and technical automation.",
    href: "https://github.com/mrx-arafat",
    isExternal: true,
  },
  {
    id: "aiflowiz",
    label: "AIFlowiz",
    description:
      "A review-gated automation practice for repeated technical work: research, QA, documentation, and operations.",
    href: "https://aiflowiz.com/",
    isExternal: true,
  },
];

export const OPERATING_PRINCIPLES: OperatingPrinciple[] = [
  {
    title: "Start bounded",
    body:
      "Establish one useful outcome, its failure modes, and the evidence needed to trust it before expanding scope.",
  },
  {
    title: "Least privilege",
    body:
      "Give people, services, and AI workflows only the access that the current task actually requires.",
  },
  {
    title: "Approval before impact",
    body:
      "External, destructive, or difficult-to-reverse actions stay behind an explicit human decision.",
  },
  {
    title: "Evidence at delivery",
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
