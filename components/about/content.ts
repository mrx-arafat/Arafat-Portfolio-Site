/** Content for the About page — six sections, straightforward professional copy. */

export interface SectionCard {
  id: string;
  title: string;
  body: string;
  tags: string[];
}

export interface SectionQuote {
  quote: string;
  note: string;
}

export interface SectionBeat {
  label: string;
  text: string;
}

export interface Section {
  id: string;
  /** Mono label, e.g. "01 · WHO I AM". */
  label: string;
  title: string;
  paragraphs: string[];
  /** Section index 3 only — four discipline cards. */
  cards?: SectionCard[];
  /** Section index 4 only — PLAN/BUILD/SECURE/AUTOMATE. */
  beats?: SectionBeat[];
  /** Section index 4 only — three principles. */
  quotes?: SectionQuote[];
  align: "center" | "left";
}

export const SECTIONS: Section[] = [
  {
    id: "who",
    label: "01 · WHO I AM",
    title: "EASIN ARAFAT",
    paragraphs: [
      "I'm an Application Security Engineer at Startise. I work on xCloud, a managed cloud hosting platform, and my job is to keep it and the sites it hosts secure.",
      "Day to day that means security, but I don't stay in one lane. I build features, run infrastructure, work with AI tooling, and automate whatever I end up doing twice.",
    ],
    align: "center",
  },
  {
    id: "background",
    label: "02 · BACKGROUND",
    title: "Background",
    paragraphs: [
      "I'm self-taught. I started with front-end, moved to full-stack, and learned by building actual projects instead of following tutorials. I still learn new tools the same way.",
      "I graduated from MIST (Military Institute of Science and Technology), where I was President of the MIST Cyber Security Club. We ran CTFs and training sessions for anyone on campus who wanted in.",
    ],
    align: "left",
  },
  {
    id: "security",
    label: "03 · SECURITY",
    title: "Security research",
    paragraphs: [
      "I came into security from the offensive side. CTFs, cryptography, recon tooling, and eventually real vulnerability research.",
      "That research led to 9 CVEs reported through Patchstack's disclosure program, and a co-authored paper in Array (Elsevier, Q1). The short version: I look for the bugs an attacker would use, and I get to them first.",
    ],
    align: "left",
  },
  {
    id: "disciplines",
    label: "04 · WHAT I DO",
    title: "Four disciplines",
    paragraphs: [
      "Four areas, one job. Here's where my time actually goes.",
    ],
    cards: [
      {
        id: "appsec",
        title: "Application Security",
        body: "The core of what I do. I test systems the way an attacker would: broken assumptions, isolation that leaks, permissions that quietly grow over time.",
        tags: ["offensive security", "threat modeling", "exploitation", "hardening"],
      },
      {
        id: "devops",
        title: "DevOps & Automation",
        body: "Containers, networks, deployment pipelines. If it sits between the code and the servers, I've probably touched it.",
        tags: ["CI/CD", "infrastructure", "orchestration", "observability"],
      },
      {
        id: "ai",
        title: "AI & Agents",
        body: "I picked up LLMs and agent systems early and use them like any other engineering tool. Most of what I build with them ends up speeding up the rest of my work.",
        tags: ["LLM tooling", "agent orchestration", "AI automation", "R&D"],
      },
      {
        id: "product",
        title: "R&D & Product",
        body: "Sometimes the job is deciding what to build, not just how. I've planned features end to end and carried them from idea to production.",
        tags: ["product thinking", "prototyping", "systems design", "strategy"],
      },
    ],
    align: "left",
  },
  {
    id: "method",
    label: "05 · HOW I WORK",
    title: "How I work",
    paragraphs: [
      "Whether it's a feature, a pipeline, or a security fix, I work through the same four steps.",
    ],
    beats: [
      {
        label: "PLAN",
        text: "I start on paper, not in the editor. What can this break, what does it touch, what's the shortest honest path to something that works.",
      },
      {
        label: "BUILD",
        text: "Then I build whatever the problem actually needs. Could be app code, could be infrastructure, could be a one-off tool. It ships to production, not to a demo.",
      },
      {
        label: "SECURE",
        text: "Before release I put on the attacker hat and try to break what I just built. Anything I find gets fixed before it ships.",
      },
      {
        label: "AUTOMATE",
        text: "If I do something twice, I script it. Manual checklists turn into jobs that run themselves and tell me when something's off.",
      },
    ],
    quotes: [
      {
        quote:
          "Most failures aren't attacks. They're systems doing something in production that they never did in testing. That gap is where I spend my time.",
        note: "SYSTEMS THINKING",
      },
      {
        quote:
          "I don't wait until I'm qualified for a problem. I take it, and I learn whatever's missing on the way.",
        note: "GROWTH MINDSET",
      },
      {
        quote:
          "Code is half the picture. The other half is understanding why people build things, break things, and decide the way they do.",
        note: "THE LONG GAME",
      },
    ],
    align: "center",
  },
  {
    id: "contact",
    label: "06 · CONTACT",
    title: "Get in touch",
    paragraphs: [
      "These days most of my spare energy goes into agents and AI tooling. It's the most interesting ground I've worked on in years.",
      "If you're working on a problem worth solving, I'd like to hear about it.",
    ],
    align: "center",
  },
];

/** Accent per discipline card (section 04). */
export const CARD_COLOR: Record<string, string> = {
  appsec: "#f87171",
  devops: "#38bdf8",
  ai: "#a78bfa",
  product: "#ffd60a",
};

export const LINKS = {
  github: "https://github.com/mrx-arafat",
  linkedin: "https://www.linkedin.com/in/e4rafat",
  contact: "/contact",
} as const;
