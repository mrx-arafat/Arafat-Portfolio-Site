"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  VolumeX,
  Settings,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  BookOpen,
  PenLine,
  Shield,
  Zap,
  Terminal,
  Info,
  Code,
  Layers,
  Lock,
  Unlock,
  User,
  ArrowRight,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MissionControl } from "@/components/dashboard/mission-control";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { playClickSound } from "@/utils/sound";
import { useMusicContext } from "@/components/music-provider";
import extracurricularData from "@/data/extracurricular.json";
import cveData from "@/data/cve.json";
import articlesData from "@/data/articles.json";
import {
  FeaturedIcon,
  ProjectIcon,
  CveIcon,
  ArticleIcon,
} from "@/components/card-icons";

// Pre-generate stable random values to avoid hydration mismatches
const generateStableRandoms = (count: number, seed: number = 1) => {
  const randoms: number[] = [];
  for (let i = 0; i < count; i++) {
    // Simple seeded pseudo-random for consistency
    randoms.push(((seed * (i + 1) * 9301 + 49297) % 233280) / 233280);
  }
  return randoms;
};

// Terminal-style zone label separating dashboard content categories
function ZoneHeader({ path, comment }: { path: string; comment: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs select-none">
      <span className="text-terminal-green/80 font-bold tracking-wide">
        <span className="text-terminal-green/40">$ ls </span>
        {path}
      </span>
      <span className="text-terminal-green/35 hidden sm:inline"># {comment}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-terminal-green/25 to-transparent" />
    </div>
  );
}

// Pre-computed stable values
const NEURAL_NODE_POSITIONS = generateStableRandoms(40, 42);
const DATA_STREAM_DELAYS = generateStableRandoms(12, 17);
const CODE_RAIN_DURATIONS = generateStableRandoms(20, 23);
const MATRIX_RAIN_VALUES = generateStableRandoms(100, 31);
const FLOATING_CODE_POSITIONS = generateStableRandoms(10, 55);

export default function DashboardClient() {
  const { isMuted, toggleMute } = useMusicContext();
  const [isMounted, setIsMounted] = useState(false);
  const [skills, setSkills] = useState({
    security: true,
    business: true,
    webdev: true,
  });
  const [hackerEffect, setHackerEffect] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [countdown, setCountdown] = useState(11);
  const [hackerInfo, setHackerInfo] = useState<string[]>([]);
  const [cardEffectActive, setCardEffectActive] = useState(false);
  const [matrixModeActive, setMatrixModeActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  // Mark as mounted to enable client-only rendering
  useEffect(() => {
    setIsMounted(true);
    // Remove entrance animation after it completes
    const enterTimer = setTimeout(() => setIsEntering(false), 500);
    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize binary values to prevent regeneration on each render
  const binaryValues = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => MATRIX_RAIN_VALUES[i % MATRIX_RAIN_VALUES.length] > 0.5 ? "1" : "0"),
    []
  );

  // Array of hacker secret information to display
  const hackerInfoOptions = [
    ["$ whoami", ">_ arafat"],
    [
      "$ ./scan.sh --target=system",
      "SCANNING...",
      "VULNERABILITIES DETECTED: __",
    ],
    ["$ ./access_granted.sh", "SYSTEM COMPROMISED"],
    ["$ ./kaynaat.sh", "Hello! YOU...", "404: Not Found"],

    ["$ ./my_fav.sh --all", ">_ Hacking"],
    ["$ ./secret.sh --decrypt", "DECRYPTING...", "ACCESS DENIED"],
    ["$ ./care_about.sh --all", "Street Dogs", "and HER!"],

    ["$ ./my_league.sh --all", ">_ Intellectual People"],

    ["$ ./secret.sh --decrypt", "DECRYPTING...", "ACCESS DENIED"],
    ["$ ./interested_in.sh --all", ">_ Psychology"],

    ["$ cat /etc/passwd", "Permission denied: Elevated access required"],
  ];

  useEffect(() => {
    return () => {
      // Clear countdown interval on unmount
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const toggleSkill = (skill: keyof typeof skills) => {
    playClickSound();
    setSkills((prev) => ({
      ...prev,
      [skill]: !prev[skill],
    }));
  };

  const navigateTo = (path: string) => {
    playClickSound();
    router.push(path);
  };

  return (
    <main className={`flex min-h-screen flex-col bg-surface-base p-4 md:p-8 relative grid-dots transition-all duration-1000 ${matrixModeActive ? "matrix-mode-active" : ""
      } ${isEntering ? "animate-slideInRight" : ""}`}>
      {/* ELITE SYSTEM INFILTRATION - Only render on client */}
      {isMounted && matrixModeActive && (
        <div className="fixed inset-0 z-50 pointer-events-none elite-infiltration-overlay">
          {/* Neural Network Visualization */}
          <div className="absolute inset-0 neural-network">
            {[...Array(isMobile ? 12 : 20)].map((_, i) => (
              <div
                key={i}
                className="neural-node"
                style={{
                  top: `${NEURAL_NODE_POSITIONS[i * 2] * 90 + 5}%`,
                  left: `${NEURAL_NODE_POSITIONS[i * 2 + 1] * 90 + 5}%`,
                  animationDelay: `${DATA_STREAM_DELAYS[i % 12] * 2}s`
                }}
              >
                <div className="node-core"></div>
                <div className="node-pulse"></div>
              </div>
            ))}
          </div>

          {/* Data Stream Corruption */}
          <div className="absolute inset-0 data-streams">
            {[...Array(isMobile ? 8 : 12)].map((_, i) => (
              <div
                key={i}
                className="data-stream"
                style={{
                  left: `${i * (isMobile ? 12 : 8)}%`,
                  animationDelay: `${i * 0.3}s`
                }}
              >
                {[...Array(isMobile ? 6 : 8)].map((_, j) => (
                  <div key={j} className="data-packet">
                    {binaryValues[(i * 8 + j) % 100]}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Elite Terminal Interface */}
          <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-auto elite-terminal">
            <div className="terminal-header">
              <span className="system-icon">⬢</span>
              <span className="terminal-title">ARAFAT MISSION-30</span>
              <span className="security-level">TARGET: 2030</span>
            </div>
            <div className="command-line" style={{ animationDelay: '0.3s' }}>
              <span className="elite-prompt">{isMobile ? 'arafat@K1NGB0B:~$' : 'arafat@K1NGB0B:~$'}</span> <span className="command">{isMobile ? './the_GOAT.sh --activate' : './the_GOAT.sh --activate-goat-mode'}</span>
            </div>
            <div className="command-line" style={{ animationDelay: '0.9s' }}>
              <span className="status-success">{isMobile ? 'GOAT MODE ACTIVATED' : 'GREATEST OF ALL TIME MODE ACTIVATED'}</span>
            </div>
            <div className="command-line" style={{ animationDelay: '1.5s' }}>
              <span className="elite-prompt">{isMobile ? 'arafat@K1NGB0B:~$' : 'arafat@K1NGB0B:~$'}</span> <span className="command">{isMobile ? 'execute --world-change' : 'execute --change-the-world'}</span>
            </div>
            <div className="command-line" style={{ animationDelay: '2.1s' }}>
              <span className="status-warning">{isMobile ? 'WORLD TRANSFORMATION INITIATED' : 'GLOBAL TRANSFORMATION PROTOCOLS INITIATED'}</span>
            </div>
            <div className="command-line" style={{ animationDelay: '2.7s' }}>
              <span className="elite-prompt">{isMobile ? 'arafat@K1NGB0B:~$' : 'arafat@K1NGB0B:~$'}</span> <span className="command">whoami --destiny</span>
            </div>
            <div className="command-line" style={{ animationDelay: '3.3s' }}>
              <span className="architect-identity">{isMobile ? 'ARAFAT - FUTURE GOAT' : 'ARAFAT - THE NEXT GOAT OF THE WORLD'}</span>
            </div>
            <div className="command-line" style={{ animationDelay: '3.9s' }}>
              <span className="status-critical">{isMobile ? 'GREATEST PERSON RISING' : 'BECOMING THE GREATEST PERSON ALIVE'}</span>
            </div>
            <div className="command-line" style={{ animationDelay: '4.5s' }}>
              <span className="final-status">{isMobile ? 'MISSION: CHANGE THE WORLD' : 'MISSION: I WILL CHANGE THE WORLD'}</span>
            </div>
          </div>

          {/* GOAT Status Panel */}
          <div className="absolute bottom-4 left-4 right-4 md:top-8 md:right-8 md:left-auto md:bottom-auto status-panel">
            <div className="panel-header">GOAT STATUS</div>
            <div className="grid grid-cols-2 md:block gap-2 md:gap-0">
              <div className="status-item" style={{ animationDelay: '1s' }}>
                <span className="metric">GREATNESS:</span> <span className="value critical">RISING</span>
              </div>
              <div className="status-item" style={{ animationDelay: '1.5s' }}>
                <span className="metric">IMPACT:</span> <span className="value active">WORLD</span>
              </div>
              <div className="status-item" style={{ animationDelay: '2s' }}>
                <span className="metric">FUTURE GOAT:</span> <span className="value master">ARAFAT</span>
              </div>
              <div className="status-item" style={{ animationDelay: '2.5s' }}>
                <span className="metric">DESTINY:</span> <span className="value omega">CHANGE WORLD</span>
              </div>
            </div>
          </div>

          {/* Quantum Interference */}
          <div className="absolute inset-0 quantum-interference">
            <div className="interference-wave"></div>
            <div className="interference-wave" style={{ animationDelay: '1s' }}></div>
            <div className="interference-wave" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* System Corruption Bars */}
          <div className="absolute inset-0 corruption-bars">
            <div className="corruption-bar" style={{ top: '20%', animationDelay: '0.5s' }}></div>
            <div className="corruption-bar" style={{ top: '45%', animationDelay: '1.2s' }}></div>
            <div className="corruption-bar" style={{ top: '70%', animationDelay: '1.8s' }}></div>
          </div>

          {/* Deep System Pulse */}
          <div className="absolute inset-0 deep-system-pulse"></div>
        </div>
      )}

      {/* Sound toggle button */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 text-terminal-green/50 hover:text-terminal-green transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 max-w-7xl mx-auto w-full">
        {/* Left Panel - Profile Card with 3D Effect */}
        <div className="relative">
          {/* 3D Shadow Layer */}
          <div className="absolute inset-0 bg-surface-raised rounded-2xl translate-x-3 translate-y-3"></div>

          {/* Main Card - Dark Hacker Theme */}
          <div className={`relative bg-surface-deep rounded-sm overflow-hidden shadow-lg border border-terminal-green z-10 transition-all duration-1000 ${matrixModeActive ? "elite-profile-override border-[#00BFFF] shadow-[0_0_35px_rgba(0,191,255,0.8)] brightness-70 contrast-180" : ""
            }`}>
            {/* Header with name - Hacker Theme */}
            <div className="px-4 py-2.5 flex items-center gap-3 border-b border-terminal-green/10 bg-surface-deep">
              <div
                className="w-8 h-8 flex justify-center items-center relative cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();

                  // Play deeper, more sophisticated sound
                  const eliteAudio = new Audio("/sounds/click.mp3");
                  eliteAudio.volume = 0.7;
                  eliteAudio.playbackRate = 0.6; // Deep, professional tone
                  eliteAudio.play().catch((e) => console.log("Elite audio failed:", e));

                  // Trigger the elite system infiltration
                  setMatrixModeActive(true);

                  // Add body class for quantum override
                  document.body.classList.add("quantum-override");

                  // Reset after 5 seconds - system restoration
                  setTimeout(() => {
                    setMatrixModeActive(false);
                    document.body.classList.remove("quantum-override");
                  }, 5000);
                }}
              >
                <div className="absolute inset-[2px] bg-terminal-green/10 rounded-sm animate-pulse group-hover:bg-terminal-green/20 transition-colors duration-200"></div>
                <div className="w-6 h-6 grid grid-cols-2 gap-[1px] place-items-center">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-[9px] h-[9px] bg-terminal-green rounded-none group-hover:shadow-[0_0_4px_#2ed573] transition-all duration-200"
                    ></div>
                  ))}
                </div>
              </div>
              <h2
                className="text-terminal-green font-mono tracking-wide text-lg hacker-text cursor-pointer hover:text-terminal-green/80 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();

                  // Trigger card effects for 2 seconds
                  setCardEffectActive(true);
                  setTimeout(() => {
                    setCardEffectActive(false);
                  }, 2000);
                }}
              >
                ARAFAT
              </h2>
              <div className="ml-auto flex items-center gap-2">
                <span className="font-mono text-[10px] text-terminal-green/40 tracking-wider">
                  $ whoami
                </span>
                <div className="w-3 h-3 rounded-full bg-terminal-green/80 animate-pulse"></div>
              </div>
            </div>

            {/* Profile Image - Hacker Theme */}
            <div className="px-4 pb-4 pt-2.5 bg-surface-deep">
              <div
                ref={profileRef}
                onClick={() => {
                  playClickSound();

                  // If not in glitch mode, start the glitch sequence
                  if (!glitchActive) {
                    setGlitchActive(true);
                    setCountdown(11);

                    // Start countdown
                    if (countdownRef.current) {
                      clearInterval(countdownRef.current);
                    }

                    countdownRef.current = setInterval(() => {
                      setCountdown((prev) => {
                        if (prev <= 1) {
                          // Reset when countdown reaches 0
                          if (countdownRef.current) {
                            clearInterval(countdownRef.current);
                          }
                          setGlitchActive(false);
                          return 11;
                        }
                        return prev - 1;
                      });
                    }, 1000);
                  }

                  // Always select random hacker info to display on each click
                  const randomIndex = Math.floor(
                    Math.random() * hackerInfoOptions.length
                  );
                  setHackerInfo(hackerInfoOptions[randomIndex]);

                  // Trigger card effects for 2 seconds
                  setCardEffectActive(true);
                  setTimeout(() => {
                    setCardEffectActive(false);
                  }, 2000);

                  // Create glitch effect
                  const element = profileRef.current;
                  if (element) {
                    element.classList.add("animate-glitch");

                    // Play hacker sound effect
                    const audio = new Audio("/sounds/click.mp3");
                    audio.volume = 0.3;
                    audio
                      .play()
                      .catch((e) => console.log("Audio play failed:", e));

                    // Remove animation class after it completes
                    setTimeout(() => {
                      element.classList.remove("animate-glitch");
                    }, 500);
                  }
                }}
                className={`relative hacker-profile cursor-pointer ${glitchActive ? "active-glitch" : ""
                  }`}
              >
                {/* Code Rain Effect */}
                <div className="code-rain">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="code-column"
                      style={{
                        left: `${i * 10}%`,
                        animationDuration: `${CODE_RAIN_DURATIONS[i] * 3 + 2}s`,
                        animationDelay: `${CODE_RAIN_DURATIONS[i + 10] * 2}s`,
                      }}
                    >
                      {[...Array(10)].map((_, j) => (
                        <div key={j}>{binaryValues[(i * 10 + j) % 100]}</div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Subtle Edge Glow Effect - Won't Cover Face */}
                <div className="edge-glow-effect"></div>

                {/* Image Container */}
                <div className="relative bg-surface-raised rounded-none aspect-square flex items-center justify-center border border-terminal-green overflow-hidden cursor-crosshair">
                  <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/5 to-transparent mix-blend-overlay pointer-events-none"></div>
                  <div className="w-full h-full bg-transparent flex items-center justify-center border border-terminal-green overflow-hidden">
                    <Image
                      src="/images/profile.webp"
                      alt="Profile Image"
                      width={500}
                      height={500}
                      className="object-cover w-full h-full hacker-profile-image"
                      priority
                    />
                  </div>

                  {/* Hacker Overlay - Appears on Hover/Click */}
                  <div className="hacker-profile-overlay">
                    <div className="text-center">
                      {glitchActive ? (
                        <>
                          <p className="hacker-text text-lg mb-2">
                            SYSTEM BREACH IN PROGRESS
                          </p>
                          <p className="hacker-text text-xs mb-2">
                            COUNTDOWN:{" "}
                            <span className="text-[#ff3333]">{countdown}</span>
                          </p>
                          <div className="w-full bg-surface-deep h-2 mb-4 border border-terminal-green/30">
                            <div
                              className="bg-terminal-green h-full"
                              style={{ width: `${(countdown / 11) * 100}%` }}
                            ></div>
                          </div>
                          <div className="font-mono text-terminal-green text-xs text-left max-w-[200px] mx-auto">
                            {hackerInfo.map((line, index) => (
                              <p
                                key={index}
                                className={index > 0 ? "mt-1" : ""}
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="hacker-text text-lg mb-2">
                            IDENTITY: CONFIRMED
                          </p>
                          <p className="hacker-text text-xs mb-4">
                            ACCESS LEVEL: root
                          </p>
                          <div className="font-mono text-terminal-green text-xs">
                            <p>$ hack_me.sh</p>

                            <p className="mt-1">$ chmod +x hack_me.sh </p>
                            <p className="mt-1">$ ./hack_me.sh</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-terminal-green"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-terminal-green"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-terminal-green"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-terminal-green"></div>
                </div>
              </div>
            </div>
          </div>

          {/* What Do I Do Button - Hacker Style */}
          <div className="p-4 pb-0">
            <div
              onClick={() => {
                playClickSound();
                navigateTo("/about");
              }}
              className="relative group cursor-pointer"
            >
              {/* 3D Shadow/Base Layer */}
              <div className="absolute inset-0 bg-terminal-green/30 rounded-lg translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 group-active:translate-x-0 group-active:translate-y-0 transition-all duration-200"></div>

              {/* Button Main Layer */}
              <div className="relative bg-surface-raised text-terminal-green font-bold py-4 px-6 rounded-lg flex items-center justify-between w-full z-10 shadow-lg border border-terminal-green/50 transform transition-all duration-200 group-hover:shadow-xl group-hover:border-terminal-green">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-terminal-green/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-terminal-green" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg tracking-wide">WHAT DO I DO?</span>
                    <span className="text-terminal-green/70 text-xs font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                      $ ./about_me.sh --role
                    </span>
                  </div>
                </div>

                <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                  <div className="text-terminal-green font-bold text-xl">&gt;</div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-2 h-8 bg-terminal-green/30 rounded-l-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-2 bg-terminal-green/30 rounded-b-lg"></div>
            </div>
          </div>

          {/* Hacker Skills Button */}
          <div className="p-4">
            <div className="relative group">
              {/* 3D Shadow/Base Layer */}
              <div className="absolute inset-0 bg-[#1f9b53] rounded-lg translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 group-active:translate-x-0 group-active:translate-y-0 transition-all duration-200"></div>

              {/* Button Main Layer */}
              <div
                onClick={() => {
                  // Add terminal typing sound effect
                  playClickSound();

                  // Add multiple hacker effects
                  const btn = document.querySelector(".skills-btn");
                  if (btn) {
                    // 1. Add shake effect
                    btn.classList.add("shake-effect");

                    // 2. Add scan line effect
                    const scanLine = btn.querySelector(".scan-line") as HTMLElement | null;
                    if (scanLine) {
                      scanLine.style.opacity = "0.7";
                    }

                    // 3. Add digital noise effect to text
                    const textElements =
                      btn.querySelectorAll(".text-lg, .text-xs");
                    textElements.forEach((el) => {
                      el.classList.add("digital-noise");
                    });

                    // Remove effects after animation completes
                    setTimeout(() => {
                      btn.classList.remove("shake-effect");
                      if (scanLine) scanLine.style.opacity = "0";
                      textElements.forEach((el) => {
                        el.classList.remove("digital-noise");
                      });

                      // Navigate to skills page
                      navigateTo("/skills");
                    }, 500);
                  } else {
                    navigateTo("/skills");
                  }
                }}
                className="skills-btn relative bg-terminal-green text-surface-raised font-bold py-4 px-5 rounded-lg flex items-center justify-between w-full z-10 shadow-lg transform transition-all duration-200 group-hover:shadow-xl cursor-pointer overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-raised/10 flex items-center justify-center">
                    <Code size={20} className="text-surface-raised" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg tracking-wide">MY SKILLS</span>
                    <span className="text-surface-raised/70 text-xs font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                      $ ./skills.sh --view
                    </span>
                  </div>
                </div>

                <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                  <div className="text-surface-raised font-bold text-xl">&gt;</div>
                </div>

                {/* Scan line effect */}
                <div className="scan-line"></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-2 h-8 bg-[#1f9b53] rounded-l-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-2 bg-[#1f9b53] rounded-b-lg"></div>

              {/* Binary code overlay (visible on hover) */}
              <div className="absolute inset-0 bg-transparent rounded-lg z-20 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-surface-raised/10 font-mono text-xs tracking-widest">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex">
                        {Array.from({ length: 10 }).map((_, j) => (
                          <span key={j} className="mx-px">
                            {binaryValues[(i * 10 + j) % 100]}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Toggles - 3D Style */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-terminal-green/70 mb-4">
              <div className="w-8 h-8 rounded-full bg-surface-raised flex items-center justify-center">
                <Settings size={16} className="text-terminal-green" />
              </div>
              <span className="text-sm font-medium">Skills Explorer</span>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-terminal-green/20 rounded-lg translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-200"></div>
                <div className="relative bg-surface-raised p-3 rounded-lg flex items-center justify-between border border-terminal-green/20 z-10">
                  <span className="text-terminal-green font-medium">
                    SECURITY ENGINEER
                  </span>
                  <Switch
                    aria-label="Toggle Security Engineer"
                    checked={skills.security}
                    onCheckedChange={() => toggleSkill("security")}
                    className="data-[state=checked]:bg-terminal-green"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-terminal-green/20 rounded-lg translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-200"></div>
                <div className="relative bg-surface-raised p-3 rounded-lg flex items-center justify-between border border-terminal-green/20 z-10">
                  <span className="text-terminal-green font-medium">
                    ASPIRING ENTREPRENEUR
                  </span>
                  <Switch
                    aria-label="Toggle Aspiring Entrepreneur"
                    checked={skills.business}
                    onCheckedChange={() => toggleSkill("business")}
                    className="data-[state=checked]:bg-terminal-green"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-terminal-green/20 rounded-lg translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-200"></div>
                <div className="relative bg-surface-raised p-3 rounded-lg flex items-center justify-between border border-terminal-green/20 z-10">
                  <span className="text-terminal-green font-medium">
                    FINANCIAL INTELLIGENCE
                  </span>
                  <Switch
                    aria-label="Toggle Financial Intelligence"
                    checked={skills.business}
                    onCheckedChange={() => toggleSkill("business")}
                    className="data-[state=checked]:bg-terminal-green"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-terminal-green/20 rounded-lg translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-200"></div>
                <div className="relative bg-surface-raised p-3 rounded-lg flex items-center justify-between border border-terminal-green/20 z-10">
                  <span className="text-terminal-green font-medium">
                    WEB DEVELOPER
                  </span>
                  <Switch
                    aria-label="Toggle Web Developer"
                    checked={skills.webdev}
                    onCheckedChange={() => toggleSkill("webdev")}
                    className="data-[state=checked]:bg-terminal-green"
                  />
                </div>
              </div>

              {/* Contact Button - Hacker Style */}
              <div
                onClick={() => {
                  setHackerEffect(true);
                  setTimeout(() => {
                    navigateTo("/contact");
                  }, 800);
                }}
                className="relative group cursor-pointer mt-6"
              >
                {/* 3D Shadow/Base Layer */}
                <div className="absolute inset-0 bg-[#1f9b53] rounded-lg translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 group-active:translate-x-0 group-active:translate-y-0 transition-all duration-200"></div>

                {/* Button Main Layer */}
                <div
                  className={`relative bg-terminal-green text-surface-raised font-bold py-4 px-6 rounded-lg flex items-center justify-between w-full z-10 shadow-lg transform transition-all duration-200 group-hover:shadow-xl ${hackerEffect ? "glitch-effect" : ""
                    }`}
                  data-text="ACCESS GRANTED"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-raised/10 flex items-center justify-center">
                      {hackerEffect ? (
                        <Unlock className="w-5 h-5 text-surface-raised" />
                      ) : (
                        <Lock className="w-5 h-5 text-surface-raised" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg tracking-wide">CONTACT ME</span>
                      <span className="text-surface-raised/70 text-xs font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                        {hackerEffect
                          ? "ACCESS GRANTED..."
                          : "$ ./connect.sh --secure"}
                      </span>
                    </div>
                  </div>

                  <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                    <div className="text-surface-raised font-bold text-xl">&gt;</div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-2 h-8 bg-[#1f9b53] rounded-l-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-2 bg-[#1f9b53] rounded-b-lg"></div>

                {/* Matrix-like code rain effect (visible on hover) */}
                <div className="absolute inset-0 bg-surface-raised/0 group-hover:bg-surface-raised/5 rounded-lg z-20 overflow-hidden pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-terminal-green/20 text-xs font-mono"
                      style={{
                        left: `${i * 10}%`,
                        top: "0",
                        transform: "translateY(-100%)",
                        animation: `fall 2s linear ${i * 0.1}s infinite`,
                      }}
                    >
                      {[...Array(10)].map((_, j) => (
                        <div key={j} style={{ animationDelay: `${j * 0.1}s` }}>
                          {binaryValues[(i * 10 + j) % 100]}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex flex-col gap-6">
          {/* Social Media Row */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <TooltipProvider>
              {[
                {
                  name: "github",
                  icon: <Github size={24} className="text-terminal-green" />,
                  tooltip: "GitHub Projects",
                  url: "https://github.com/mrx-arafat",
                },
                {
                  name: "linkedin",
                  icon: <Linkedin size={24} className="text-terminal-green" />,
                  tooltip: "LinkedIn Profile",
                  url: "https://www.linkedin.com/in/e4rafat",
                },
                {
                  name: "facebook",
                  icon: <Facebook size={24} className="text-terminal-green" />,
                  tooltip: "Facebook",
                  url: "https://www.facebook.com/e4rafat",
                },
                {
                  name: "instagram",
                  icon: <Instagram size={24} className="text-terminal-green" />,
                  tooltip: "Instagram",
                  url: "https://www.instagram.com/e4rafat/",
                },
                {
                  name: "medium",
                  icon: <BookOpen size={24} className="text-terminal-green" />,
                  tooltip: "Medium Blog",
                  url: "https://medium.com/@easinxarafat",
                },
                {
                  name: "tryhackme",
                  icon: <Shield size={24} className="text-terminal-green" />,
                  tooltip: "TryHackMe Profile",
                  url: "https://tryhackme.com/p/KingBOB",
                },
              ].map((platform) => (
                <Tooltip key={platform.name}>
                  <TooltipTrigger asChild>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform.tooltip}
                      className="block"
                      onClick={(e) => {
                        e.preventDefault();
                        playClickSound();
                        window.open(platform.url, "_blank");
                      }}
                    >
                      <div className={`bg-surface-raised rounded-2xl aspect-square flex items-center justify-center relative hover:bg-surface-deep hover:border-terminal-green/50 transition-colors cursor-pointer border border-terminal-green/20 hover-glow ${matrixModeActive ? "matrix-social-effect border-terminal-green shadow-[0_0_20px_rgba(46,213,115,0.8)]" : ""
                        }`}>
                        <div className="w-12 h-12 rounded-full bg-surface-deep flex items-center justify-center">
                          {platform.icon}
                        </div>
                        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-terminal-green/20"></div>
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-terminal-green/20"></div>
                        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-terminal-green/20"></div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-terminal-green/20"></div>
                      </div>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-surface-raised text-terminal-green border border-terminal-green/30">
                    {platform.tooltip}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          {/* ZONE: ~/proof — recognition, research, press */}
          <ZoneHeader path="~/proof" comment="recognition · research · press" />
          <div className="grid grid-cols-1 gap-4">
            {/* HERO — Featured */}
            <div
              className={`group relative bg-gradient-to-br from-surface-raised to-surface-deep rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 cursor-pointer hover-glow ${cardEffectActive
                ? "border-terminal-green/60 shadow-[0_0_28px_rgba(46,213,115,0.35)] animate-subtle-pulse"
                : "border-terminal-green/30 shadow-[0_0_20px_rgba(46,213,115,0.12)]"
                } ${matrixModeActive
                  ? "elite-card-override border-[#00BFFF] shadow-[0_0_25px_rgba(0,191,255,0.6)] brightness-80 contrast-120"
                  : ""
                }`}
              onClick={() => navigateTo("/featured")}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-terminal-green/60 to-transparent"></div>

              {/* Header */}
              <div className="p-5 flex items-center justify-between border-b border-terminal-green/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-terminal-green/10 rounded-lg flex items-center justify-center border border-terminal-green/20 group-hover:bg-terminal-green/20 group-hover:border-terminal-green/40 transition-all duration-300">
                    <FeaturedIcon className="w-4 h-4 text-terminal-green" />
                  </div>
                  <span className="text-terminal-green font-semibold tracking-wide">FEATURED</span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded bg-terminal-green/10 text-terminal-green border border-terminal-green/20">
                  ★ Most Notable
                </span>
              </div>

              {/* Body */}
              <div className="flex-1 p-5 flex flex-col relative z-10">
                <div className="mb-4">
                  <div className="text-terminal-green/70 text-xs font-mono mb-1">peer-reviewed · published 2026</div>
                  <h3 className="text-xl md:text-2xl font-bold text-terminal-green mb-2 leading-tight">
                    Adaptive UI for Mobile Banking — Enhancing UX through Machine Learning
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-1 rounded bg-terminal-green/10 text-terminal-green border border-terminal-green/20">Q1 Journal</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-1 rounded bg-terminal-green/10 text-terminal-green border border-terminal-green/20">Impact Factor 4.5</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-1 rounded bg-terminal-green/10 text-terminal-green border border-terminal-green/20">Open Access</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-1 rounded bg-terminal-soft/10 text-terminal-soft border border-terminal-soft/20">Array · Elsevier</span>
                  </div>
                  <p className="text-terminal-green/60 text-sm leading-relaxed">
                    Co-authored research, a <span className="text-terminal-green">Daily Star</span> feature, and national recognition — the proof beyond the projects.
                  </p>
                </div>

                {/* Highlight rows */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-terminal-green/5 transition-all duration-200 group/row" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.1s both' }}>
                    <div className="w-1 self-stretch rounded-full bg-terminal-green flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-terminal-green text-sm font-medium">Published Research</div>
                      <div className="text-terminal-green/50 text-xs">Elsevier Array (Q1) — DOI 10.1016/j.array.2026.100901</div>
                    </div>
                    <ArrowRight size={14} className="text-terminal-green/0 group-hover/row:text-terminal-green/50 transition-all duration-200 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-terminal-green/5 transition-all duration-200 group/row" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.2s both' }}>
                    <div className="w-1 self-stretch rounded-full bg-terminal-green flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-terminal-green text-sm font-medium">Press &amp; Media</div>
                      <div className="text-terminal-green/50 text-xs">Featured in The Daily Star</div>
                    </div>
                    <ArrowRight size={14} className="text-terminal-green/0 group-hover/row:text-terminal-green/40 transition-all duration-200 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-terminal-green/5 transition-all duration-200 group/row" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.3s both' }}>
                    <div className="w-1 self-stretch rounded-full bg-terminal-soft flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-terminal-green text-sm font-medium">Recognition</div>
                      <div className="text-terminal-green/50 text-xs">URC 2021 Global Champion · Top 1% TryHackMe</div>
                    </div>
                    <ArrowRight size={14} className="text-terminal-green/0 group-hover/row:text-terminal-soft/50 transition-all duration-200 flex-shrink-0" />
                  </div>
                </div>

                <div className="flex-1"></div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    navigateTo("/featured");
                  }}
                  className="w-full py-2.5 rounded-xl bg-terminal-green hover:bg-terminal-green/90 text-surface-raised border border-terminal-green font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_16px_rgba(46,213,115,0.4)] relative overflow-hidden group/btn"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-terminal-green/0 via-white/20 to-terminal-green/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
                  <FeaturedIcon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Read the Research</span>
                  <ArrowRight size={16} className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>

          {/* ZONE: ~/work — built & broken */}
          <ZoneHeader path="~/work" comment="what I build & break" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* COMPACT — Security Research */}
            <div
              className={`group relative bg-surface-raised rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 cursor-pointer hover-glow hover:border-terminal-green/50 hover:shadow-[0_0_18px_rgba(46,213,115,0.2)] ${cardEffectActive
                ? "border-terminal-green/40"
                : "border-terminal-green/20 shadow-lg"
                } ${matrixModeActive
                  ? "elite-card-override border-[#00BFFF] shadow-[0_0_25px_rgba(0,191,255,0.6)] brightness-80 contrast-120"
                  : ""
                }`}
              onClick={() => navigateTo("/security-research")}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-terminal-green/50 to-transparent"></div>
              <div className="p-5 flex flex-col h-full relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-terminal-green/10 rounded-lg flex items-center justify-center border border-terminal-green/20 group-hover:bg-terminal-green/20 transition-all duration-300">
                    <CveIcon className="w-4 h-4 text-terminal-green" />
                  </div>
                  <span className="text-terminal-green/50 text-[11px] font-mono">SECURITY</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-terminal-green leading-none">{cveData.items.length}</span>
                  <span className="text-terminal-green text-sm font-medium mb-1">CVEs disclosed</span>
                </div>
                <p className="text-terminal-green/60 text-xs mt-2 leading-relaxed">
                  Broken Access Control, IDOR &amp; data exposure in WordPress plugins — responsibly disclosed via Patchstack.
                </p>
                <div className="flex-1"></div>
                <div className="flex items-center gap-1.5 text-terminal-green/70 text-xs font-mono mt-3 group-hover:text-terminal-green transition-colors">
                  <span>cd security-research</span>
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* COMPACT — Projects */}
            <div
              className={`group relative bg-surface-raised rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 cursor-pointer hover-glow hover:border-terminal-green/50 hover:shadow-[0_0_18px_rgba(46,213,115,0.2)] ${cardEffectActive
                ? "border-terminal-green/40"
                : "border-terminal-green/20 shadow-lg"
                } ${matrixModeActive
                  ? "elite-card-override border-[#00BFFF] shadow-[0_0_25px_rgba(0,191,255,0.6)] brightness-80 contrast-120"
                  : ""
                }`}
              onClick={() => navigateTo("/projects")}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-terminal-green/50 to-transparent"></div>
              <div className="p-5 flex flex-col h-full relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-terminal-green/10 rounded-lg flex items-center justify-center border border-terminal-green/20 group-hover:bg-terminal-green/20 transition-all duration-300">
                    <ProjectIcon className="w-4 h-4 text-terminal-green" />
                  </div>
                  <span className="text-terminal-green/50 text-[11px] font-mono">BUILD</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-terminal-green leading-none">25+</span>
                  <span className="text-terminal-green text-sm font-medium mb-1">projects shipped</span>
                </div>
                <p className="text-terminal-green/60 text-xs mt-2 leading-relaxed">
                  Security tools, DevSecOps automation &amp; real-world web apps — from research to production.
                </p>
                <div className="flex-1"></div>
                <div className="flex items-center gap-1.5 text-terminal-green/70 text-xs font-mono mt-3 group-hover:text-terminal-green transition-colors">
                  <span>cd projects</span>
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

          </div>

          {/* ZONE: ~/write — articles, blog, notes */}
          <ZoneHeader path="~/write" comment="articles · blog · notes" />
          <div className="grid grid-cols-1 gap-4">
            {/* WIDE — Articles strip */}
            <div
              className={`group relative bg-surface-raised rounded-2xl overflow-hidden flex border transition-all duration-300 cursor-pointer hover-glow hover:border-terminal-green/50 hover:shadow-[0_0_18px_rgba(46,213,115,0.2)] ${cardEffectActive
                ? "border-terminal-green/40"
                : "border-terminal-green/20 shadow-lg"
                } ${matrixModeActive
                  ? "elite-card-override border-[#00BFFF] shadow-[0_0_25px_rgba(0,191,255,0.6)] brightness-80 contrast-120"
                  : ""
                }`}
              onClick={() => navigateTo("/articles")}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-terminal-green/50 to-transparent"></div>
              <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 w-full relative z-10">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-10 h-10 bg-terminal-green/10 rounded-lg flex items-center justify-center border border-terminal-green/20 group-hover:bg-terminal-green/20 transition-all duration-300">
                    <ArticleIcon className="w-[18px] h-[18px] text-terminal-green" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-terminal-green leading-none">{articlesData.length}</span>
                    <span className="text-terminal-green text-sm font-medium mb-1">articles</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-terminal-green font-semibold text-sm">What I Write About</h3>
                  <p className="text-terminal-green/60 text-xs leading-relaxed">
                    Security, building businesses, psychology, and how the world works.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-terminal-green/70 text-xs font-mono flex-shrink-0 group-hover:text-terminal-green transition-colors">
                  <span>cd articles</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* ZONE: ~/etc — extracurricular & misc */}
          <ZoneHeader path="~/etc" comment="beyond the terminal" />
          {/* Extracurricular Section */}
          <div className="bg-surface-raised rounded-2xl overflow-hidden border border-terminal-green/20">
            <div className="p-4 flex items-center justify-between border-b border-terminal-green/10">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-terminal-green/20 rounded-md flex items-center justify-center border border-terminal-green/30">
                  <Zap size={14} className="text-terminal-green" />
                </div>
                <span className="text-terminal-green font-medium">
                  EXTRACURRICULAR
                </span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" aria-label="Extracurricular info" className="text-terminal-green/50 hover:text-terminal-green">
                      <Info size={16} aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-surface-raised text-terminal-green border border-terminal-green/30 max-w-xs">
                    Activities and interests outside of my professional work,
                    including community involvement, hobbies, and personal
                    projects.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {extracurricularData.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-raised rounded-2xl aspect-square flex items-center justify-center relative hover:bg-surface-deep hover:border-terminal-green/50 transition-colors cursor-pointer border border-terminal-green/20 hover-glow group"
                  onClick={playClickSound}
                >
                  <div className="w-16 h-16 rounded-full bg-surface-deep flex items-center justify-center overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      className={`w-full h-full ${item.id === 'urc-2021' ? 'object-contain p-1 bg-white' : 'object-cover'}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {/* Corner dots for decoration */}
                  <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-terminal-green/20"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-terminal-green/20"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-terminal-green/20"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-terminal-green/20"></div>

                  {/* Hover tooltip with details */}
                  <div className="absolute inset-0 bg-surface-raised/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    <h4 className="text-terminal-green font-bold mb-2">
                      {item.title}
                    </h4>
                    <p className="text-terminal-green/80 text-xs">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Entrepreneurial Journey - Mission Control (launches to /skills) */}
          <MissionControl />
        </div>
      </div>

      {/* Footer */}
      <div className="text-terminal-green/30 text-xs tracking-widest mt-8 text-center w-full max-w-7xl mx-auto px-4">
        <div className="border-t border-terminal-green/10 pt-4">
          ARAFAT © {new Date().getFullYear()} - ALL RIGHTS RESERVED
        </div>
      </div>
    </main>
  );
}
