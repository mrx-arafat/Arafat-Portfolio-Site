"use client";

import { useEffect, useId, useRef, useState, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useMotion } from "@/components/open-circuit/motion-provider";
import skillsData from "@/data/skills.json";
import Link from "next/link";

const SIGNALS = [
  { key: "security", label: "I FIND THE CRACKS", short: "SECURITY", body: "I find broken access control, IDOR and data exposure. I disclose responsibly through Patchstack.", href: "/security-research", command: "cd security-research" },
  { key: "entrepreneur", label: "I SHIP MY IDEAS", short: "BUILDING", body: "I have shipped 40+ projects. I prefer my ideas running in production.", href: "/projects", command: "cd projects" },
  { key: "finance", label: "I FOLLOW THE MONEY", short: "BUSINESS", body: "I write about business because code is only part of what makes the world work.", href: "/blogs/business", command: "cd business" },
  { key: "web", label: "I BUILD THE THING", short: "WEB", body: "I build security tools, DevSecOps automation and web apps I actually want to use.", href: "/projects", command: "cd projects" },
] as const;
type SignalKey = typeof SIGNALS[number]["key"];

function PadScene({ isMotionEnabled }: { isMotionEnabled: boolean }): ReactElement {
  return (
    <svg
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mcxSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#010308" />
          <stop offset="55%" stopColor="#040a16" />
          <stop offset="88%" stopColor="#0a1626" />
          <stop offset="100%" stopColor="#10203355" />
        </linearGradient>
        <linearGradient id="mcxHull" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e9edf0" />
          <stop offset="30%" stopColor="#b9c2c9" />
          <stop offset="62%" stopColor="#6b767e" />
          <stop offset="100%" stopColor="#2e363c" />
        </linearGradient>
        <linearGradient id="mcxFlame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#ffdf6b" />
          <stop offset="65%" stopColor="#ff8b1f" />
          <stop offset="100%" stopColor="#c22508" stopOpacity="0" />
        </linearGradient>
        <pattern id="mcxLattice" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 0 L14 14 M14 0 L0 14" stroke="#111922" strokeWidth="2.4" />
        </pattern>
        <filter id="mcxBlurS"><feGaussianBlur stdDeviation="2.5" /></filter>
        <filter id="mcxBlurM"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id="mcxBlurL"><feGaussianBlur stdDeviation="16" /></filter>
      </defs>

      {/* Sky */}
      <rect width="1200" height="520" fill="url(#mcxSky)" />

      {/* Stars */}
      {Array.from({ length: 46 }, (_, i) => {
        const rand = (n: number) => ((n * 9301 + 49297) % 233280) / 233280;
        const x = rand(i + 2) * 1200;
        const y = rand(i + 41) * 300;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={rand(i + 9) > 0.8 ? 1.4 : 0.8}
            fill="#cfe3ff"
            opacity={0.25 + rand(i + 23) * 0.5}
          />
        );
      })}

      {/* Horizon glow - distant facility lights */}
      <ellipse cx="620" cy="432" rx="560" ry="60" fill="#3d6a99" opacity="0.1" filter="url(#mcxBlurL)" />
      <ellipse cx="620" cy="436" rx="300" ry="36" fill="#ffb35c" opacity="0.08" filter="url(#mcxBlurL)" />

      {/* Distant lightning masts */}
      <path d="M178 432 L186 205 L194 432 Z" fill="#060b12" />
      <path d="M990 432 L997 232 L1004 432 Z" fill="#060b12" />
      <path d="M1106 432 L1111 288 L1116 432 Z" fill="#05090f" />
      <circle cx="186" cy="203" r="2" fill="#ff5f56" opacity="0.9">
        {isMotionEnabled && <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.4s" repeatCount="indefinite" />}
      </circle>
      <circle cx="997" cy="230" r="2" fill="#ff5f56" opacity="0.7">
        {isMotionEnabled && <animate attributeName="opacity" values="0.7;0.15;0.7" dur="3.1s" repeatCount="indefinite" />}
      </circle>

      {/* Floodlight beams (crossed, aimed at vehicle) */}
      <polygon points="330,436 300,436 585,120 640,120" fill="#dce9f5" opacity="0.05" filter="url(#mcxBlurM)" />
      <polygon points="912,436 942,436 655,130 605,130" fill="#dce9f5" opacity="0.05" filter="url(#mcxBlurM)" />
      <circle cx="318" cy="433" r="5" fill="#f4f8ff" opacity="0.95" filter="url(#mcxBlurS)" />
      <circle cx="925" cy="433" r="5" fill="#f4f8ff" opacity="0.95" filter="url(#mcxBlurS)" />

      {/* Service tower - dark lattice silhouette */}
      <g>
        <rect x="655" y="88" width="46" height="348" fill="#0a1017" />
        <rect x="655" y="88" width="46" height="348" fill="url(#mcxLattice)" opacity="0.7" />
        <rect x="652" y="82" width="52" height="10" fill="#0c1219" />
        {/* Service arms reaching the vehicle */}
        <rect x="632" y="150" width="24" height="6" fill="#0c1219" />
        <rect x="632" y="252" width="24" height="6" fill="#0c1219" />
        {/* Aircraft warning light */}
        <circle cx="678" cy="80" r="2.4" fill="#ff5f56">
          {isMotionEnabled && <animate attributeName="opacity" values="1;0.15;1" dur="1.8s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* --- Vehicle (side-lit from left floodlight) --- */}
      {/* Outer group: ascent translation. Inner group: ignition shake. */}
      <g className="mcx-lift">
      <g className="mcx-vehicle">
        {/* Fairing */}
        <path d="M604 148 C604 118 611 100 620 94 C629 100 636 118 636 148 L636 196 L604 196 Z" fill="url(#mcxHull)" />
        {/* First+second stage body */}
        <rect x="606" y="196" width="28" height="196" fill="url(#mcxHull)" />
        {/* Interstage */}
        <rect x="606" y="284" width="28" height="14" fill="#151b21" />
        {/* Grid fins (stowed) */}
        <rect x="601" y="299" width="6" height="13" rx="1" fill="#1e252c" />
        <rect x="633" y="299" width="6" height="13" rx="1" fill="#12171d" />
        {/* Engine section */}
        <rect x="605" y="392" width="30" height="24" fill="#1a2128" />
        <path d="M605 416 L601 432 L639 432 L635 416 Z" fill="#10151b" />
        {/* Engine bell peeking below skirt */}
        <path d="M612 424 C611 428 610 430 609 432 L631 432 C630 430 629 428 628 424 Z" fill="#20282f" />
        <ellipse cx="620" cy="431" rx="9" ry="2" fill="#ff9b3d" opacity="0.35" filter="url(#mcxBlurS)" />
        {/* Left-edge key light */}
        <path d="M606 150 C606 122 612 103 620 96 L620 100 C613 108 608 124 608 150 L608 414 L606 414 Z" fill="#ffffff" opacity="0.85" filter="url(#mcxBlurS)" />
        {/* Right-edge cool rim light */}
        <rect x="633.4" y="160" width="1.6" height="250" fill="#7fa8c9" opacity="0.4" filter="url(#mcxBlurS)" />
        {/* Panel seams */}
        <line x1="606" y1="238" x2="634" y2="238" stroke="#39434b" strokeWidth="1" opacity="0.6" />
        <line x1="606" y1="340" x2="634" y2="340" stroke="#39434b" strokeWidth="1" opacity="0.6" />
        {/* Tiny green brand band */}
        <rect x="606" y="200" width="28" height="3" fill="#2ed573" opacity="0.5" />
        {/* DISRUPT wordmark down the first stage */}
        <text
          transform="rotate(90 620 344)"
          x="620"
          y="348.5"
          textAnchor="middle"
          fill="#232b32"
          fontSize="13.5"
          fontWeight="700"
          fontFamily="'JetBrains Mono', 'Fira Code', monospace"
          letterSpacing="2.5"
        >
          DISRUPT
        </text>
        {/* Sticker accent tick above the wordmark */}
        <rect x="616" y="302" width="8" height="2" fill="#2ed573" opacity="0.7" transform="rotate(90 620 303)" />

        {/* Ascent flame - ignites small, stretches at liftoff */}
        <g className="mcx-ascent-flame" opacity="0">
          <path d="M604 428 Q620 440 636 428 Q646 500 620 560 Q594 500 604 428 Z" fill="url(#mcxFlame)" filter="url(#mcxBlurM)" />
          <path d="M610 428 Q620 436 630 428 Q634 470 620 500 Q606 470 610 428 Z" fill="#ffffff" opacity="0.85" filter="url(#mcxBlurS)" />
        </g>
      </g>
      </g>

      {/* LOX vapor drifting off the vehicle */}
      <g className="mcx-vapor">
        <ellipse cx="612" cy="212" rx="16" ry="6" fill="#cfe0ee" opacity="0.1" filter="url(#mcxBlurM)" />
        <ellipse cx="606" cy="300" rx="22" ry="8" fill="#cfe0ee" opacity="0.08" filter="url(#mcxBlurM)" />
      </g>

      {/* Ignition flash + pad smoke (phase-driven) */}
      <circle className="mcx-flash" cx="620" cy="430" r="70" fill="#ffce7a" opacity="0" filter="url(#mcxBlurL)" />
      <g className="mcx-padsmoke" opacity="0">
        <ellipse cx="560" cy="430" rx="52" ry="20" fill="#d8dee4" opacity="0.35" filter="url(#mcxBlurM)" />
        <ellipse cx="686" cy="432" rx="58" ry="22" fill="#c8ced4" opacity="0.3" filter="url(#mcxBlurM)" />
        <ellipse cx="620" cy="424" rx="40" ry="16" fill="#eef2f5" opacity="0.4" filter="url(#mcxBlurM)" />
      </g>

      {/* Ground */}
      <rect y="430" width="1200" height="90" fill="#040910" />
      <rect y="430" width="1200" height="2" fill="#12202f" opacity="0.8" />

      {/* Wet-pad reflection */}
      <g transform="translate(0, 864) scale(1, -1)" opacity="0.1" filter="url(#mcxBlurS)">
        <path d="M604 148 C604 118 611 100 620 94 C629 100 636 118 636 148 L636 196 L604 196 Z" fill="#dfe6ea" />
        <rect x="606" y="196" width="28" height="196" fill="#aeb9c2" />
      </g>
      <ellipse cx="318" cy="448" rx="30" ry="5" fill="#dce9f5" opacity="0.12" filter="url(#mcxBlurM)" />
      <ellipse cx="925" cy="448" rx="30" ry="5" fill="#dce9f5" opacity="0.12" filter="url(#mcxBlurM)" />

      {/* Foreground scrub silhouette */}
      <path
        d="M0 520 L0 492 Q60 480 120 490 Q180 500 240 488 Q330 474 420 490 Q520 504 640 492 Q760 480 880 494 Q1000 506 1100 490 L1200 496 L1200 520 Z"
        fill="#010306"
      />
    </svg>
  );
}

type LaunchPhase = "idle" | "count3" | "count2" | "count1" | "ignition" | "liftoff";
const COUNT_STEP_MS = 450;
const IGNITION_MS = 650;
const LIFTOFF_NAV_MS = 2350;
const COUNTDOWN_LABEL: Record<LaunchPhase, string> = {
  idle: "T-00:00:03", count3: "T-00:00:03", count2: "T-00:00:02", count1: "T-00:00:01", ignition: "IGNITION", liftoff: "LIFTOFF",
};
const LAUNCH_STATUS: Record<LaunchPhase, string> = {
  idle: "Launch pad ready.",
  count3: "Launching to the Skill Universe... T-minus 3.",
  count2: "Launching to the Skill Universe... T-minus 2.",
  count1: "Launching to the Skill Universe... T-minus 1.",
  ignition: "Launching to the Skill Universe... Ignition.",
  liftoff: "Launching to the Skill Universe... Liftoff.",
};

/** Launch through the original countdown, ignition and liftoff, then navigate to /skills. */
export function MissionControl(): ReactElement {
  const router = useRouter();
  const { isMotionEnabled } = useMotion();
  const [phase, setPhase] = useState<LaunchPhase>("idle");
  const launching = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [signals, setSignals] = useState<Record<SignalKey, boolean>>({ security: true, entrepreneur: true, finance: true, web: true });
  const id = useId();
  const count = Object.values(signals).filter(Boolean).length;

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(timer => clearTimeout(timer));
  }, []);

  // A pause during countdown finishes the route immediately rather than leaving a frozen pad.
  useEffect(() => {
    if (!isMotionEnabled && launching.current) {
      timers.current.forEach(timer => clearTimeout(timer));
      router.push("/skills");
    }
  }, [isMotionEnabled, router]);

  function launch(): void {
    if (launching.current) return;
    launching.current = true;
    router.prefetch("/skills");
    if (!isMotionEnabled) { router.push("/skills"); return; }
    const at = (ms: number, action: () => void): void => {
      timers.current.push(setTimeout(action, ms));
    };
    setPhase("count3");
    at(COUNT_STEP_MS, () => setPhase("count2"));
    at(COUNT_STEP_MS * 2, () => setPhase("count1"));
    at(COUNT_STEP_MS * 3, () => setPhase("ignition"));
    at(COUNT_STEP_MS * 3 + IGNITION_MS, () => setPhase("liftoff"));
    at(COUNT_STEP_MS * 3 + IGNITION_MS + LIFTOFF_NAV_MS, () => router.push("/skills"));
  }

  return <>
    <div className={"oc-launch-stage mcx-stage mcx-" + phase} data-motion={isMotionEnabled ? "on" : "off"}>
      <PadScene isMotionEnabled={isMotionEnabled} />
      <p className="oc-launch-scene-title" aria-hidden="true">My skills.<br /><em>I gave them<br />a universe.</em></p>
      <div className="oc-hud oc-hud-top" aria-hidden="true"><span className="oc-rec">REC / LAUNCH_CAM_03</span><span>PAD 04-ARAFAT / NIGHT OPS</span></div>
      <div className="oc-hud oc-hud-bottom" aria-hidden="true"><span>MISSION / SKILL-UNIVERSE<br />DEST /skills<br />PAYLOAD {skillsData.skills.length} modules -&gt; {skillsData.categories.length} planets</span><span className="mcx-count-swap" key={phase}>{COUNTDOWN_LABEL[phase]}</span></div>
      <span className="mcx-whiteout absolute inset-0 z-30" aria-hidden="true" />
      <button className="oc-launch-trigger" type="button" onClick={launch} aria-disabled={phase !== "idle"} aria-label="CLICK ANYWHERE TO LAUNCH - Launch to the Skill Universe"><span className="oc-launch-prompt"><span>CLICK ANYWHERE TO LAUNCH</span><b aria-hidden="true">-&gt;</b></span></button>
    </div>
    <div className="oc-launch-route"><p className="oc-status-line" role="status" aria-live="polite" aria-atomic="true">{LAUNCH_STATUS[phase]}</p><Link className="oc-route" href="/skills" prefetch={false}>cd skills -&gt;</Link></div>
    <div className="oc-skills-console"><div><h3 className="oc-console-label">Pick a side of me.</h3><div className="oc-skill-switches">{SIGNALS.map(signal => <button className="oc-skill-switch" key={signal.key} type="button" role="switch" aria-checked={signals[signal.key]} aria-controls={id + "-" + signal.key} onClick={() => setSignals(previous => ({ ...previous, [signal.key]: !previous[signal.key] }))}><span>{signal.label}</span><span className="oc-switch-state"><span>{signals[signal.key] ? "ON" : "OFF"}</span><span className="oc-switch-track" aria-hidden="true" /></span></button>)}</div><p className="oc-status-line" role="status">{count} {count === 1 ? "side of me connected." : "sides of me connected."}</p></div><div><p className="oc-console-label">I have receipts for that.</p><ul className="oc-skill-output">{SIGNALS.map(signal => <li key={signal.key} id={id + "-" + signal.key} hidden={!signals[signal.key]}><strong>{signal.label}</strong><p>{signal.body}</p><Link href={signal.href}>{signal.command} -&gt;</Link></li>)}</ul>{count === 0 && <p className="oc-small oc-muted">I contain multitudes. Pick one above.</p>}</div></div>
  </>;
}
