export interface EvolutionStage {
  id: "builder" | "researcher" | "operator";
  label: string;
  title: string;
  body: string;
}

export interface CapabilityPipeline {
  id: "build" | "secure" | "operate" | "automate";
  command: string;
  title: string;
  summary: string;
  output: string;
}

export interface EvidenceItem {
  id: "github" | "security" | "research" | "aiflowiz";
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
  command: "$ whoami --expanded",
  headline:
    "I build, secure, and operate systems where infrastructure, product engineering, and AI meet.",
  introduction:
    "I am an Application Security Engineer at Startise working on xCloud, a managed cloud hosting platform. My work connects offensive security, full-stack engineering, infrastructure, and practical AI automation.",
  role: "Application Security Engineer at Startise",
  context: "Building and securing xCloud",
  focus: "Secure AI automation and developer workflows",
  research: "9 Patchstack records and an Elsevier Q1 paper",
} as const;

export const EVOLUTION: EvolutionStage[] = [
  {
    id: "builder",
    label: "The builder",
    title: "Full-stack foundations",
    body:
      "I started with front-end work, moved into full-stack systems, and learned by shipping real projects. That foundation still shapes how I approach security: understand the complete product before deciding what to protect.",
  },
  {
    id: "researcher",
    label: "The researcher",
    title: "Security, community, and research",
    body:
      "I moved into offensive security through CTFs, cryptography, recon tooling, and vulnerability research. I led the MIST Cyber Security Club, reported vulnerabilities through Patchstack, and co-authored peer-reviewed research on adaptive mobile banking interfaces.",
  },
  {
    id: "operator",
    label: "The operator",
    title: "Production systems and AI workflows",
    body:
      "Today I work across application security, product engineering, infrastructure, and automation. Through AIFlowiz, I turn repeated development, QA, documentation, and server tasks into bounded workflows that teams can inspect and approve.",
  },
];

export const CAPABILITY_PIPELINES: CapabilityPipeline[] = [
  {
    id: "build",
    command: "[BUILD]",
    title: "Secure product engineering",
    summary:
      "Plan and build full-stack features, agentic tools, internal workflows, and technical prototypes with the production environment in mind.",
    output: "Review-ready code, tested features, and clear implementation notes.",
  },
  {
    id: "secure",
    command: "[SECURE]",
    title: "Application security and research",
    summary:
      "Threat modeling, vulnerability research, authorization review, attack-path analysis, and hardening for web applications and developer platforms.",
    output: "Reproducible findings, risk context, remediation, and verification evidence.",
  },
  {
    id: "operate",
    command: "[OPERATE]",
    title: "Platform and DevOps",
    summary:
      "Work across containers, deployments, networks, observability, and server procedures while keeping recovery and failure modes visible.",
    output: "Repeatable operations, useful logs, recovery notes, and fewer manual steps.",
  },
  {
    id: "automate",
    command: "[AUTOMATE]",
    title: "AI workflows and agents",
    summary:
      "Connect approved tools and project context to automate repeated development, QA, documentation, and server work without hiding important decisions.",
    output: "A bounded workflow with test evidence, approval points, and a setup guide.",
  },
];

export const EVIDENCE: EvidenceItem[] = [
  {
    id: "github",
    label: "Public repositories",
    description:
      "Agentic tools, automation systems, security projects, and working product experiments.",
    href: "https://github.com/mrx-arafat",
    isExternal: true,
  },
  {
    id: "security",
    label: "Security research",
    description:
      "9 vulnerability records reported through Patchstack across access control, IDOR, and sensitive data exposure.",
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
    id: "aiflowiz",
    label: "AIFlowiz",
    description:
      "Founder-led AI automation for repeated development, QA, documentation, and server tasks.",
    href: "https://aiflowiz.com/",
    isExternal: true,
  },
];

export const OPERATING_PRINCIPLES: OperatingPrinciple[] = [
  {
    title: "Small first",
    body:
      "Start with one bounded problem and a clear result before expanding the scope.",
  },
  {
    title: "Least privilege",
    body:
      "Give every person, service, and workflow only the access the task requires.",
  },
  {
    title: "Approval before risky actions",
    body:
      "Keep destructive, public, or difficult-to-reverse actions behind an explicit human decision.",
  },
  {
    title: "Evidence at delivery",
    body:
      "Return test results, visible activity, setup instructions, and known limitations with the work.",
  },
];

export const LINKS = {
  projects: "/projects",
  security: "/security-research",
  contact: "/contact",
  aiflowiz: "https://aiflowiz.com/",
} as const;
