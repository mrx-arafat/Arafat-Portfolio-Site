"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { useRouter } from "next/navigation";

import type { CategoryMeta } from "@/components/skills/types";
import skillsData from "@/data/skills.json";
import { playClickSound } from "@/utils/sound";

type LaunchPhase = "idle" | "count3" | "count2" | "count1" | "ignition" | "liftoff";

const COUNT_STEP_MS = 450;
const IGNITION_MS = 650;
const LIFTOFF_NAV_MS = 2350;

const categories: CategoryMeta[] = [
  ...((skillsData as unknown as { categories?: CategoryMeta[] }).categories ??
    []),
].sort((a, b) => a.order - b.order);

const skillCount = (
  (skillsData as unknown as { skills?: unknown[] }).skills ?? []
).length;

const COUNTDOWN_LABEL: Record<LaunchPhase, string> = {
  idle: "T-00:00:03",
  count3: "T-00:00:03",
  count2: "T-00:00:02",
  count1: "T-00:00:01",
  ignition: "IGNITION",
  liftoff: "LIFTOFF",
};

/**
 * Night launch-pad matte scene. Realism comes from light, not outlines:
 * silhouetted structures, floodlight cones, side-lit vehicle, vapor, wet-pad
 * reflection. Ignition/liftoff visuals are driven by wrapper phase classes.
 */
function PadScene(): ReactElement {
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

      {/* Horizon glow — distant facility lights */}
      <ellipse cx="620" cy="432" rx="560" ry="60" fill="#3d6a99" opacity="0.1" filter="url(#mcxBlurL)" />
      <ellipse cx="620" cy="436" rx="300" ry="36" fill="#ffb35c" opacity="0.08" filter="url(#mcxBlurL)" />

      {/* Distant lightning masts */}
      <path d="M178 432 L186 205 L194 432 Z" fill="#060b12" />
      <path d="M990 432 L997 232 L1004 432 Z" fill="#060b12" />
      <path d="M1106 432 L1111 288 L1116 432 Z" fill="#05090f" />
      <circle cx="186" cy="203" r="2" fill="#ff5f56" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="997" cy="230" r="2" fill="#ff5f56" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.15;0.7" dur="3.1s" repeatCount="indefinite" />
      </circle>

      {/* Floodlight beams (crossed, aimed at vehicle) */}
      <polygon points="330,436 300,436 585,120 640,120" fill="#dce9f5" opacity="0.05" filter="url(#mcxBlurM)" />
      <polygon points="912,436 942,436 655,130 605,130" fill="#dce9f5" opacity="0.05" filter="url(#mcxBlurM)" />
      <circle cx="318" cy="433" r="5" fill="#f4f8ff" opacity="0.95" filter="url(#mcxBlurS)" />
      <circle cx="925" cy="433" r="5" fill="#f4f8ff" opacity="0.95" filter="url(#mcxBlurS)" />

      {/* Service tower — dark lattice silhouette */}
      <g>
        <rect x="655" y="88" width="46" height="348" fill="#0a1017" />
        <rect x="655" y="88" width="46" height="348" fill="url(#mcxLattice)" opacity="0.7" />
        <rect x="652" y="82" width="52" height="10" fill="#0c1219" />
        {/* Service arms reaching the vehicle */}
        <rect x="632" y="150" width="24" height="6" fill="#0c1219" />
        <rect x="632" y="252" width="24" height="6" fill="#0c1219" />
        {/* Aircraft warning light */}
        <circle cx="678" cy="80" r="2.4" fill="#ff5f56">
          <animate attributeName="opacity" values="1;0.15;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* ——— Vehicle (side-lit from left floodlight) ——— */}
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

        {/* Ascent flame — ignites small, stretches at liftoff */}
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

/** Cinematic night-launch panel: click → countdown → ignition → liftoff → /skills. */
export function MissionControl(): ReactElement {
  const router = useRouter();
  const [phase, setPhase] = useState<LaunchPhase>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    router.prefetch("/skills");
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, [router]);

  const launch = useCallback((): void => {
    if (phase !== "idle") return;
    playClickSound();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push("/skills");
      return;
    }

    const at = (ms: number, fn: () => void): void => {
      timers.current.push(window.setTimeout(fn, ms));
    };
    setPhase("count3");
    at(COUNT_STEP_MS, () => setPhase("count2"));
    at(COUNT_STEP_MS * 2, () => setPhase("count1"));
    at(COUNT_STEP_MS * 3, () => setPhase("ignition"));
    at(COUNT_STEP_MS * 3 + IGNITION_MS, () => setPhase("liftoff"));
    at(COUNT_STEP_MS * 3 + IGNITION_MS + LIFTOFF_NAV_MS, () =>
      router.push("/skills")
    );
  }, [phase, router]);

  return (
    <div className="bg-surface-deep rounded-2xl border border-terminal-green/30 relative overflow-hidden group hover:border-terminal-green/60 hover:shadow-[0_0_30px_rgba(46,213,115,0.15)] transition-all duration-500">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-terminal-green/15 bg-surface-raised">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80"></div>
        </div>
        <span className="text-terminal-green/50 text-[10px] font-mono ml-2 tracking-wider">
          ~/missions/skill-universe/launch.sh
        </span>
        <div className="flex-1"></div>
        <span className="text-terminal-green/20 text-[10px] font-mono">
          stream: live
        </span>
      </div>

      {/* Launch cam */}
      <button
        type="button"
        onClick={launch}
        disabled={phase !== "idle"}
        aria-label="Launch to the Skill Universe"
        className={`mcx-stage mcx-${phase} relative block h-[440px] w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/60 md:h-[500px]`}
      >
        <PadScene />

        {/* White-out at the end of liftoff — z-30 so it washes over the OSD text too */}
        <span aria-hidden="true" className="mcx-whiteout absolute inset-0 z-30"></span>

        {/* ——— Camera OSD ——— */}
        {/* Frame corners */}
        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-white/25"></span>
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-white/25"></span>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-white/25"></span>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-white/25"></span>

        {/* Top-left: REC */}
        <span className="pointer-events-none absolute left-6 top-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-[#f2f5f8]/90">
          <span className="h-2 w-2 rounded-full bg-[#ff3b30] animate-pulse"></span>
          REC · LAUNCH_CAM_03
        </span>

        {/* Top-right: pad id */}
        <span className="pointer-events-none absolute right-6 top-5 font-mono text-[10px] tracking-[0.25em] text-white/75">
          PAD 04-ARAFAT · NIGHT OPS
        </span>

        {/* Bottom-left: mission data */}
        <span className="pointer-events-none absolute bottom-6 left-6 flex flex-col gap-1 font-mono text-[10px] leading-relaxed tracking-[0.18em] text-white/85">
          <span className="text-[#ffffff]">MISSION · SKILL-UNIVERSE</span>
          <span>DEST /skills</span>
          <span>
            PAYLOAD {skillCount} modules → {categories.length} planets
          </span>
        </span>

        {/* Bottom-right: countdown */}
        <span className="pointer-events-none absolute bottom-6 right-6 flex flex-col items-end gap-1.5 font-mono">
          <span
            key={phase}
            className={`mcx-count-swap text-xl tracking-[0.2em] md:text-2xl ${
              phase === "ignition"
                ? "text-[#ffbd2e]"
                : phase === "liftoff"
                  ? "text-[#2ed573]"
                  : "text-white/85"
            }`}
          >
            {COUNTDOWN_LABEL[phase]}
          </span>
          {phase === "idle" && (
            <span className="text-[10px] tracking-[0.3em] text-[#2ed573]/80 animate-pulse">
              CLICK ANYWHERE TO LAUNCH
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
