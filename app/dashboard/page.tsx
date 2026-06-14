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

// Pre-computed stable values
const NEURAL_NODE_POSITIONS = generateStableRandoms(40, 42);
const DATA_STREAM_DELAYS = generateStableRandoms(12, 17);
const CODE_RAIN_DURATIONS = generateStableRandoms(20, 23);
const MATRIX_RAIN_VALUES = generateStableRandoms(100, 31);
const FLOATING_CODE_POSITIONS = generateStableRandoms(10, 55);

export default function Dashboard() {
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
    <main className={`flex min-h-screen flex-col bg-[#121212] p-4 md:p-8 relative grid-dots transition-all duration-1000 ${matrixModeActive ? "matrix-mode-active" : ""
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
        className="absolute top-4 right-4 text-[#2ed573]/50 hover:text-[#2ed573] transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 max-w-7xl mx-auto w-full">
        {/* Left Panel - Profile Card with 3D Effect */}
        <div className="relative">
          {/* 3D Shadow Layer */}
          <div className="absolute inset-0 bg-[#0f0f0f] rounded-2xl translate-x-3 translate-y-3"></div>

          {/* Main Card - Dark Hacker Theme */}
          <div className={`relative bg-[#0a0a0a] rounded-sm overflow-hidden shadow-lg border border-[#2ed573] z-10 transition-all duration-1000 ${matrixModeActive ? "elite-profile-override border-[#00BFFF] shadow-[0_0_35px_rgba(0,191,255,0.8)] brightness-70 contrast-180" : ""
            }`}>
            {/* Header with name - Hacker Theme */}
            <div className="p-4 flex items-center gap-3 border-b border-[#2ed573]/10 bg-[#0a0a0a]">
              <div
                className="w-8 h-8 flex justify-center items-center relative cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();

                  // Play deeper, more sophisticated sound
                  const eliteAudio = new Audio("/click.mp3");
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
                <div className="absolute inset-[2px] bg-[#2ed573]/10 rounded-sm animate-pulse group-hover:bg-[#2ed573]/20 transition-colors duration-200"></div>
                <div className="w-6 h-6 grid grid-cols-2 gap-[1px] place-items-center">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-[9px] h-[9px] bg-[#2ed573] rounded-none group-hover:shadow-[0_0_4px_#2ed573] transition-all duration-200"
                    ></div>
                  ))}
                </div>
              </div>
              <h2
                className="text-[#2ed573] font-mono tracking-wide text-lg hacker-text cursor-pointer hover:text-[#2ed573]/80 transition-colors duration-200"
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
              <div className="ml-auto flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#2ed573]/80 animate-pulse"></div>
              </div>
            </div>

            {/* Profile Image - Hacker Theme */}
            <div className="p-4 bg-[#0a0a0a]">
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
                    const audio = new Audio("/click.mp3");
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
                <div className="relative bg-[#0f0f0f] rounded-none aspect-square flex items-center justify-center border border-[#2ed573] overflow-hidden cursor-crosshair">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2ed573]/5 to-transparent mix-blend-overlay pointer-events-none"></div>
                  <div className="w-full h-full bg-transparent flex items-center justify-center border border-[#2ed573] overflow-hidden">
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
                          <div className="w-full bg-[#0a0a0a] h-2 mb-4 border border-[#2ed573]/30">
                            <div
                              className="bg-[#2ed573] h-full"
                              style={{ width: `${(countdown / 11) * 100}%` }}
                            ></div>
                          </div>
                          <div className="font-mono text-[#2ed573] text-xs text-left max-w-[200px] mx-auto">
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
                          <div className="font-mono text-[#2ed573] text-xs">
                            <p>$ hack_me.sh</p>

                            <p className="mt-1">$ chmod +x hack_me.sh </p>
                            <p className="mt-1">$ ./hack_me.sh</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#2ed573]"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#2ed573]"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#2ed573]"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#2ed573]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* What Do I Do Button - Hacker Style */}
          <div className="p-4 pb-0">
            <div
              onClick={() => {
                playClickSound();
                navigateTo("/about-me");
              }}
              className="relative group cursor-pointer"
            >
              {/* 3D Shadow/Base Layer */}
              <div className="absolute inset-0 bg-[#2ed573]/30 rounded-lg translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 group-active:translate-x-0 group-active:translate-y-0 transition-all duration-200"></div>

              {/* Button Main Layer */}
              <div className="relative bg-[#0f0f0f] text-[#2ed573] font-bold py-4 px-6 rounded-lg flex items-center justify-between w-full z-10 shadow-lg border border-[#2ed573]/50 transform transition-all duration-200 group-hover:shadow-xl group-hover:border-[#2ed573]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2ed573]/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#2ed573]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg tracking-wide">WHAT DO I DO?</span>
                    <span className="text-[#2ed573]/70 text-xs font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                      $ ./about_me.sh --role
                    </span>
                  </div>
                </div>

                <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                  <div className="text-[#2ed573] font-bold text-xl">&gt;</div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-2 h-8 bg-[#2ed573]/30 rounded-l-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-2 bg-[#2ed573]/30 rounded-b-lg"></div>
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
                className="skills-btn relative bg-[#2ed573] text-[#0f0f0f] font-bold py-4 px-5 rounded-lg flex items-center justify-between w-full z-10 shadow-lg transform transition-all duration-200 group-hover:shadow-xl cursor-pointer overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0f0f0f]/10 flex items-center justify-center">
                    <Code size={20} className="text-[#0f0f0f]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg tracking-wide">MY SKILLS</span>
                    <span className="text-[#0f0f0f]/70 text-xs font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                      $ ./skills.sh --view
                    </span>
                  </div>
                </div>

                <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                  <div className="text-[#0f0f0f] font-bold text-xl">&gt;</div>
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
                  <div className="text-[#0f0f0f]/10 font-mono text-xs tracking-widest">
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
            <div className="flex items-center gap-2 text-[#2ed573]/70 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#0f0f0f] flex items-center justify-center">
                <Settings size={16} className="text-[#2ed573]" />
              </div>
              <span className="text-sm font-medium">Skills Explorer</span>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#2ed573]/20 rounded-lg translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-200"></div>
                <div className="relative bg-[#0f0f0f] p-3 rounded-lg flex items-center justify-between border border-[#2ed573]/20 z-10">
                  <span className="text-[#2ed573] font-medium">
                    SECURITY ENGINEER
                  </span>
                  <Switch
                    checked={skills.security}
                    onCheckedChange={() => toggleSkill("security")}
                    className="data-[state=checked]:bg-[#2ed573]"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-[#2ed573]/20 rounded-lg translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-200"></div>
                <div className="relative bg-[#0f0f0f] p-3 rounded-lg flex items-center justify-between border border-[#2ed573]/20 z-10">
                  <span className="text-[#2ed573] font-medium">
                    ASPIRING ENTREPRENEUR
                  </span>
                  <Switch
                    checked={skills.business}
                    onCheckedChange={() => toggleSkill("business")}
                    className="data-[state=checked]:bg-[#2ed573]"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-[#2ed573]/20 rounded-lg translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-200"></div>
                <div className="relative bg-[#0f0f0f] p-3 rounded-lg flex items-center justify-between border border-[#2ed573]/20 z-10">
                  <span className="text-[#2ed573] font-medium">
                    FINANCIAL INTELLIGENCE
                  </span>
                  <Switch
                    checked={skills.business}
                    onCheckedChange={() => toggleSkill("business")}
                    className="data-[state=checked]:bg-[#2ed573]"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-[#2ed573]/20 rounded-lg translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-200"></div>
                <div className="relative bg-[#0f0f0f] p-3 rounded-lg flex items-center justify-between border border-[#2ed573]/20 z-10">
                  <span className="text-[#2ed573] font-medium">
                    WEB DEVELOPER
                  </span>
                  <Switch
                    checked={skills.webdev}
                    onCheckedChange={() => toggleSkill("webdev")}
                    className="data-[state=checked]:bg-[#2ed573]"
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
                  className={`relative bg-[#2ed573] text-[#0f0f0f] font-bold py-4 px-6 rounded-lg flex items-center justify-between w-full z-10 shadow-lg transform transition-all duration-200 group-hover:shadow-xl ${hackerEffect ? "glitch-effect" : ""
                    }`}
                  data-text="ACCESS GRANTED"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0f0f0f]/10 flex items-center justify-center">
                      {hackerEffect ? (
                        <Unlock className="w-5 h-5 text-[#0f0f0f]" />
                      ) : (
                        <Lock className="w-5 h-5 text-[#0f0f0f]" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg tracking-wide">CONTACT ME</span>
                      <span className="text-[#0f0f0f]/70 text-xs font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                        {hackerEffect
                          ? "ACCESS GRANTED..."
                          : "$ ./connect.sh --secure"}
                      </span>
                    </div>
                  </div>

                  <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                    <div className="text-[#0f0f0f] font-bold text-xl">&gt;</div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-2 h-8 bg-[#1f9b53] rounded-l-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-2 bg-[#1f9b53] rounded-b-lg"></div>

                {/* Matrix-like code rain effect (visible on hover) */}
                <div className="absolute inset-0 bg-[#0f0f0f]/0 group-hover:bg-[#0f0f0f]/5 rounded-lg z-20 overflow-hidden pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-[#2ed573]/20 text-xs font-mono"
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
                  icon: <Github size={24} className="text-[#2ed573]" />,
                  tooltip: "GitHub Projects",
                  url: "https://github.com/mrx-arafat",
                },
                {
                  name: "linkedin",
                  icon: <Linkedin size={24} className="text-[#2ed573]" />,
                  tooltip: "LinkedIn Profile",
                  url: "https://www.linkedin.com/in/e4rafat",
                },
                {
                  name: "facebook",
                  icon: <Facebook size={24} className="text-[#2ed573]" />,
                  tooltip: "Facebook",
                  url: "https://www.facebook.com/e4rafat",
                },
                {
                  name: "instagram",
                  icon: <Instagram size={24} className="text-[#2ed573]" />,
                  tooltip: "Instagram",
                  url: "https://www.instagram.com/e4rafat/",
                },
                {
                  name: "medium",
                  icon: <BookOpen size={24} className="text-[#2ed573]" />,
                  tooltip: "Medium Blog",
                  url: "https://medium.com/@easinxarafat",
                },
                {
                  name: "tryhackme",
                  icon: <Shield size={24} className="text-[#2ed573]" />,
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
                      className="block"
                      onClick={(e) => {
                        e.preventDefault();
                        playClickSound();
                        window.open(platform.url, "_blank");
                      }}
                    >
                      <div className={`bg-[#1e272e] rounded-2xl aspect-square flex items-center justify-center relative hover:bg-[#2a3942] transition-colors cursor-pointer border border-[#2ed573]/20 hover-glow ${matrixModeActive ? "matrix-social-effect border-[#2ed573] shadow-[0_0_20px_rgba(46,213,115,0.8)]" : ""
                        }`}>
                        <div className="w-12 h-12 rounded-full bg-[#0f0f0f] flex items-center justify-center">
                          {platform.icon}
                        </div>
                        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                      </div>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#0f0f0f] text-[#2ed573] border border-[#2ed573]/30">
                    {platform.tooltip}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          {/* Main Content Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[minmax(11rem,1fr)]">
            {/* HERO — Featured */}
            <div
              className={`group relative bg-gradient-to-br from-[#1e272e] to-[#1a2230] rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 cursor-pointer hover-glow md:col-span-2 md:row-span-2 order-first md:order-1 ${cardEffectActive
                ? "border-[#2ed573]/60 shadow-[0_0_28px_rgba(46,213,115,0.35)] animate-subtle-pulse"
                : "border-[#2ed573]/30 shadow-[0_0_20px_rgba(46,213,115,0.12)]"
                } ${matrixModeActive
                  ? "elite-card-override border-[#00BFFF] shadow-[0_0_25px_rgba(0,191,255,0.6)] brightness-80 contrast-120"
                  : ""
                }`}
              onClick={() => navigateTo("/featured")}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2ed573]/60 to-transparent"></div>

              {/* Header */}
              <div className="p-5 flex items-center justify-between border-b border-[#2ed573]/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#2ed573]/10 rounded-lg flex items-center justify-center border border-[#2ed573]/20 group-hover:bg-[#2ed573]/20 group-hover:border-[#2ed573]/40 transition-all duration-300">
                    <FeaturedIcon className="w-4 h-4 text-[#2ed573]" />
                  </div>
                  <span className="text-[#2ed573] font-semibold tracking-wide">FEATURED</span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#2ed573]/10 text-[#2ed573] border border-[#2ed573]/20">
                  ★ Most Notable
                </span>
              </div>

              {/* Body */}
              <div className="flex-1 p-5 flex flex-col relative z-10">
                <div className="mb-4">
                  <div className="text-[#2ed573]/70 text-xs font-mono mb-1">peer-reviewed · published 2026</div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#e6edf3] mb-2 leading-tight">
                    Adaptive UI for Mobile Banking — Enhancing UX through Machine Learning
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-1 rounded bg-[#2ed573]/10 text-[#2ed573] border border-[#2ed573]/20">Q1 Journal</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-1 rounded bg-[#2ed573]/10 text-[#2ed573] border border-[#2ed573]/20">Impact Factor 4.5</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-1 rounded bg-[#2ed573]/10 text-[#2ed573] border border-[#2ed573]/20">Open Access</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-1 rounded bg-[#7bed9f]/10 text-[#7bed9f] border border-[#7bed9f]/20">Array · Elsevier</span>
                  </div>
                  <p className="text-[#8b949e] text-sm leading-relaxed">
                    Co-authored research, a <span className="text-[#2ed573]">Daily Star</span> feature, and national recognition — the proof beyond the projects.
                  </p>
                </div>

                {/* Highlight rows */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2a3942] transition-all duration-200 group/row" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.1s both' }}>
                    <div className="w-1 self-stretch rounded-full bg-[#2ed573] flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[#2ed573] text-sm font-medium">Published Research</div>
                      <div className="text-[#8b949e] text-xs">Elsevier Array (Q1) — DOI 10.1016/j.array.2026.100901</div>
                    </div>
                    <ArrowRight size={14} className="text-[#2ed573]/0 group-hover/row:text-[#2ed573]/50 transition-all duration-200 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2a3942] transition-all duration-200 group/row" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.2s both' }}>
                    <div className="w-1 self-stretch rounded-full bg-[#2ed573] flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[#2ed573] text-sm font-medium">Press &amp; Media</div>
                      <div className="text-[#8b949e] text-xs">Featured in The Daily Star</div>
                    </div>
                    <ArrowRight size={14} className="text-[#2ed573]/0 group-hover/row:text-[#2ed573]/40 transition-all duration-200 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2a3942] transition-all duration-200 group/row" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.3s both' }}>
                    <div className="w-1 self-stretch rounded-full bg-[#7bed9f] flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[#2ed573] text-sm font-medium">Recognition</div>
                      <div className="text-[#8b949e] text-xs">URC 2021 Global Champion · Top 1% TryHackMe</div>
                    </div>
                    <ArrowRight size={14} className="text-[#2ed573]/0 group-hover/row:text-[#7bed9f]/50 transition-all duration-200 flex-shrink-0" />
                  </div>
                </div>

                <div className="flex-1"></div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    navigateTo("/featured");
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#2ed573] hover:bg-[#2ed573]/90 text-[#0f0f0f] border border-[#2ed573] font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_16px_rgba(46,213,115,0.4)] relative overflow-hidden group/btn"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#2ed573]/0 via-white/20 to-[#2ed573]/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
                  <FeaturedIcon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Read the Research</span>
                  <ArrowRight size={16} className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* COMPACT — Security Research */}
            <div
              className={`group relative bg-[#1e272e] rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 cursor-pointer hover-glow md:order-2 hover:border-[#2ed573]/50 hover:shadow-[0_0_18px_rgba(46,213,115,0.2)] ${cardEffectActive
                ? "border-[#2ed573]/40"
                : "border-[#2ed573]/20 shadow-lg"
                } ${matrixModeActive
                  ? "elite-card-override border-[#00BFFF] shadow-[0_0_25px_rgba(0,191,255,0.6)] brightness-80 contrast-120"
                  : ""
                }`}
              onClick={() => navigateTo("/security-research")}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2ed573]/50 to-transparent"></div>
              <div className="p-5 flex flex-col h-full relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-[#2ed573]/10 rounded-lg flex items-center justify-center border border-[#2ed573]/20 group-hover:bg-[#2ed573]/20 transition-all duration-300">
                    <CveIcon className="w-4 h-4 text-[#2ed573]" />
                  </div>
                  <span className="text-[#2ed573]/50 text-[11px] font-mono">SECURITY</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-[#2ed573] leading-none">{cveData.items.length}</span>
                  <span className="text-[#2ed573] text-sm font-medium mb-1">CVEs disclosed</span>
                </div>
                <p className="text-[#8b949e] text-xs mt-2 leading-relaxed">
                  Broken Access Control, IDOR &amp; data exposure in WordPress plugins — responsibly disclosed via Patchstack.
                </p>
                <div className="flex-1"></div>
                <div className="flex items-center gap-1.5 text-[#2ed573]/70 text-xs font-mono mt-3 group-hover:text-[#2ed573] transition-colors">
                  <span>cd security-research</span>
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* COMPACT — Projects */}
            <div
              className={`group relative bg-[#1e272e] rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 cursor-pointer hover-glow md:order-3 hover:border-[#2ed573]/50 hover:shadow-[0_0_18px_rgba(46,213,115,0.2)] ${cardEffectActive
                ? "border-[#2ed573]/40"
                : "border-[#2ed573]/20 shadow-lg"
                } ${matrixModeActive
                  ? "elite-card-override border-[#00BFFF] shadow-[0_0_25px_rgba(0,191,255,0.6)] brightness-80 contrast-120"
                  : ""
                }`}
              onClick={() => navigateTo("/projects")}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2ed573]/50 to-transparent"></div>
              <div className="p-5 flex flex-col h-full relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-[#2ed573]/10 rounded-lg flex items-center justify-center border border-[#2ed573]/20 group-hover:bg-[#2ed573]/20 transition-all duration-300">
                    <ProjectIcon className="w-4 h-4 text-[#2ed573]" />
                  </div>
                  <span className="text-[#2ed573]/50 text-[11px] font-mono">BUILD</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-[#2ed573] leading-none">25+</span>
                  <span className="text-[#2ed573] text-sm font-medium mb-1">projects shipped</span>
                </div>
                <p className="text-[#8b949e] text-xs mt-2 leading-relaxed">
                  Security tools, DevSecOps automation &amp; real-world web apps — from research to production.
                </p>
                <div className="flex-1"></div>
                <div className="flex items-center gap-1.5 text-[#2ed573]/70 text-xs font-mono mt-3 group-hover:text-[#2ed573] transition-colors">
                  <span>cd projects</span>
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* WIDE — Articles strip */}
            <div
              className={`group relative bg-[#1e272e] rounded-2xl overflow-hidden flex border transition-all duration-300 cursor-pointer hover-glow md:col-span-3 md:order-4 hover:border-[#2ed573]/50 hover:shadow-[0_0_18px_rgba(46,213,115,0.2)] ${cardEffectActive
                ? "border-[#2ed573]/40"
                : "border-[#2ed573]/20 shadow-lg"
                } ${matrixModeActive
                  ? "elite-card-override border-[#00BFFF] shadow-[0_0_25px_rgba(0,191,255,0.6)] brightness-80 contrast-120"
                  : ""
                }`}
              onClick={() => navigateTo("/articles")}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2ed573]/50 to-transparent"></div>
              <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 w-full relative z-10">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-10 h-10 bg-[#2ed573]/10 rounded-lg flex items-center justify-center border border-[#2ed573]/20 group-hover:bg-[#2ed573]/20 transition-all duration-300">
                    <ArticleIcon className="w-[18px] h-[18px] text-[#2ed573]" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-[#2ed573] leading-none">{articlesData.length}</span>
                    <span className="text-[#2ed573] text-sm font-medium mb-1">articles</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#e6edf3] font-semibold text-sm">What I Write About</h3>
                  <p className="text-[#8b949e] text-xs leading-relaxed">
                    Security, building businesses, psychology, and how the world works.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[#2ed573]/70 text-xs font-mono flex-shrink-0 group-hover:text-[#2ed573] transition-colors">
                  <span>cd articles</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Extracurricular Section */}
          <div className="bg-[#1e272e] rounded-2xl overflow-hidden border border-[#2ed573]/20">
            <div className="p-4 flex items-center justify-between border-b border-[#2ed573]/10">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#2ed573]/20 rounded-md flex items-center justify-center border border-[#2ed573]/30">
                  <Zap size={14} className="text-[#2ed573]" />
                </div>
                <span className="text-[#2ed573] font-medium">
                  EXTRACURRICULAR
                </span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-[#2ed573]/50 hover:text-[#2ed573]">
                      <Info size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#0f0f0f] text-[#2ed573] border border-[#2ed573]/30 max-w-xs">
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
                  className="bg-[#0f0f0f] rounded-2xl aspect-square flex items-center justify-center relative hover:bg-[#2a3942] transition-colors cursor-pointer border border-[#2ed573]/20 hover-glow group"
                  onClick={playClickSound}
                >
                  <div className="w-16 h-16 rounded-full bg-[#1e272e] flex items-center justify-center overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      className={`w-full h-full ${item.id === 'urc-2021' ? 'object-contain p-1 bg-white' : 'object-cover'}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {/* Corner dots for decoration */}
                  <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>

                  {/* Hover tooltip with details */}
                  <div className="absolute inset-0 bg-[#0f0f0f]/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    <h4 className="text-[#2ed573] font-bold mb-2">
                      {item.title}
                    </h4>
                    <p className="text-[#2ed573]/80 text-xs">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Entrepreneurial Journey - Startup Launch Terminal */}
          <div className="bg-[#0a0a0a] rounded-2xl border border-[#2ed573]/30 relative overflow-hidden group hover:border-[#2ed573]/60 hover:shadow-[0_0_30px_rgba(46,213,115,0.15)] transition-all duration-500">

            {/* Scan line overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(46,213,115,0.1) 2px, rgba(46,213,115,0.1) 4px)',
              }}
            ></div>

            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#2ed573]/30 group-hover:border-[#2ed573]/60 transition-colors duration-300 z-10"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#2ed573]/30 group-hover:border-[#2ed573]/60 transition-colors duration-300 z-10"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#2ed573]/30 group-hover:border-[#2ed573]/60 transition-colors duration-300 z-10"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#2ed573]/30 group-hover:border-[#2ed573]/60 transition-colors duration-300 z-10"></div>

            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#2ed573]/15 bg-[#0f0f0f]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80"></div>
              </div>
              <span className="text-[#2ed573]/50 text-[10px] font-mono ml-2 tracking-wider">~/ventures/launch.sh</span>
              <div className="flex-1"></div>
              <span className="text-[#2ed573]/20 text-[10px] font-mono">pid: 1337</span>
            </div>

            {/* Terminal body */}
            <div className="p-5 md:p-6">
              {/* Init command */}
              <div className="font-mono text-[11px] text-[#2ed573]/40 mb-5">
                <span className="text-[#2ed573]/60">$</span> ./launch.sh --init --mode=entrepreneur
              </div>

              {/* ASCII Rocket - clickable scroll-to-top */}
              <div className="flex justify-center mb-5">
                <div
                  className="cursor-pointer relative group/rocket"
                  onClick={() => {
                    playClickSound();
                    const rocketEl = document.querySelector(".rocket-ascii");
                    if (rocketEl) {
                      rocketEl.classList.add("rocket-launch-effect");
                      setTimeout(() => rocketEl.classList.remove("rocket-launch-effect"), 800);
                    }
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    document.body.classList.add("matrix-scroll");
                    setTimeout(() => document.body.classList.remove("matrix-scroll"), 1000);
                  }}
                  title="Launch to top"
                >
                  <div className="relative group/rocket transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_25px_rgba(46,213,115,0.5)]">
                    <svg
                      width="140"
                      height="240"
                      viewBox="0 -40 200 390"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="rocket-ascii rocket-launch-effect drop-shadow-2xl overflow-visible"
                    >
                      <defs>
                        {/* Photorealistic Metal Gradient */}
                        <linearGradient id="bodyMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#87939b" />
                          <stop offset="15%" stopColor="#ffffff" />
                          <stop offset="35%" stopColor="#b0bcc4" />
                          <stop offset="70%" stopColor="#54626b" />
                          <stop offset="100%" stopColor="#2c363d" />
                        </linearGradient>

                        {/* Dark Metal for Fins and Engines */}
                        <linearGradient id="darkMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#454b51" />
                          <stop offset="25%" stopColor="#67737c" />
                          <stop offset="75%" stopColor="#1a1e21" />
                          <stop offset="100%" stopColor="#0d0f11" />
                        </linearGradient>

                        {/* Glowing Neon Accent */}
                        <linearGradient id="neonGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2ed573" />
                          <stop offset="100%" stopColor="#27c93f" />
                        </linearGradient>

                        {/* Intense Flame Gradients */}
                        <linearGradient id="coreFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="20%" stopColor="#fff200" />
                          <stop offset="50%" stopColor="#ff7b00" />
                          <stop offset="90%" stopColor="#c21807" />
                          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                        </linearGradient>

                        <linearGradient id="sideFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="30%" stopColor="#ff9f00" />
                          <stop offset="80%" stopColor="#9e0c03" />
                          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                        </linearGradient>

                        {/* Glow Filters */}
                        <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="6" result="blur1" />
                          <feGaussianBlur stdDeviation="15" result="blur2" />
                          <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur1" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>

                        <filter id="engineGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="3" result="blur1" />
                          <feGaussianBlur stdDeviation="8" result="blur2" />
                          <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur1" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Background Thruster Glow Matrix */}
                      <circle cx="100" cy="270" r="45" fill="#ff7b00" filter="url(#flameGlow)" opacity="0.3" />

                      {/* Ambient Light from Exhaust */}
                      <polygon points="40,350 160,350 100,250" fill="url(#coreFlame)" filter="url(#flameGlow)" opacity="0.15" />

                      {/* Left Fin */}
                      <path d="M 75 180 L 35 245 C 35 250 40 255 45 255 L 75 235 Z" fill="url(#darkMetal)" stroke="#2ed573" strokeWidth="1" strokeOpacity="0.4" />
                      {/* Right Fin */}
                      <path d="M 125 180 L 165 245 C 165 250 160 255 155 255 L 125 235 Z" fill="url(#darkMetal)" stroke="#2ed573" strokeWidth="1" strokeOpacity="0.4" />
                      {/* Center Tail Fin */}
                      <path d="M 100 160 L 105 245 L 95 245 Z" fill="url(#darkMetal)" />

                      {/* Main Fuselage */}
                      <path d="M 100 20 C 80 55 70 110 70 230 C 85 235 115 235 130 230 C 130 110 120 55 100 20 Z" fill="url(#bodyMetal)" />

                      {/* Cockpit / Orbital Module Window */}
                      <ellipse cx="100" cy="90" rx="14" ry="20" fill="#111" stroke="#2c363d" strokeWidth="2.5" />
                      {/* Realistic Glass Reflections */}
                      <path d="M 90 85 Q 100 70 110 85 Q 100 100 90 85 Z" fill="#81d4fa" opacity="0.4" />
                      <circle cx="104" cy="84" r="3" fill="#ffffff" opacity="0.7" />

                      {/* Fuselage Paneling & Decals */}
                      <path d="M 72 130 Q 100 136 128 130 L 129 133 Q 100 139 71 133 Z" fill="#3b444b" />
                      <path d="M 70 170 Q 100 176 130 170 L 130 173 Q 100 179 70 173 Z" fill="#3b444b" />

                      <line x1="85" y1="133" x2="82" y2="173" stroke="#54626b" strokeWidth="1" />
                      <line x1="115" y1="133" x2="118" y2="173" stroke="#54626b" strokeWidth="1" />

                      <circle cx="100" cy="153" r="16" fill="url(#darkMetal)" stroke="#54626b" strokeWidth="1" />
                      <circle cx="100" cy="153" r="12" fill="#111" />
                      {/* Launch/Grow Icon */}
                      <path d="M 94 156 L 100 145 L 106 156 Z" fill="url(#neonGreen)" />

                      {/* Text Branding */}
                      <g transform="translate(100, -15)" filter="url(#engineGlow)">
                        <text x="0" y="0" fill="url(#neonGreen)" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="5">DISRUPT</text>
                      </g>

                      {/* Engine Block / Thrust Structure */}
                      <path d="M 70 230 C 85 235 115 235 130 230 L 125 245 C 110 250 90 250 75 245 Z" fill="url(#darkMetal)" />

                      {/* Three Main Thruster Nozzles */}
                      <path d="M 78 245 L 72 265 C 78 268 90 268 94 265 L 90 245 Z" fill="url(#darkMetal)" />
                      <path d="M 122 245 L 128 265 C 122 268 110 268 106 265 L 110 245 Z" fill="url(#darkMetal)" />
                      {/* Center Nozzle (Slightly larger) */}
                      <path d="M 92 247 L 88 270 C 94 274 106 274 112 270 L 108 247 Z" fill="url(#bodyMetal)" />

                      {/* Plume Flames */}
                      <g filter="url(#flameGlow)">
                        {/* Center large plume */}
                        <path d="M 88 270 Q 100 280 112 270 Q 120 340 100 350 Q 80 340 88 270 Z" fill="url(#coreFlame)">
                          <animate attributeName="d" values="M 88 270 Q 100 280 112 270 Q 120 340 100 350 Q 80 340 88 270 Z; M 88 270 Q 100 280 112 270 Q 125 330 100 365 Q 75 330 88 270 Z; M 88 270 Q 100 280 112 270 Q 120 340 100 350 Q 80 340 88 270 Z" dur="0.08s" repeatCount="indefinite" />
                        </path>

                        {/* Left plume */}
                        <path d="M 72 265 Q 83 275 94 265 Q 98 310 83 330 Q 68 310 72 265 Z" fill="url(#sideFlame)">
                          <animate attributeName="d" values="M 72 265 Q 83 275 94 265 Q 98 310 83 330 Q 68 310 72 265 Z; M 72 265 Q 83 275 94 265 Q 102 305 83 340 Q 64 305 72 265 Z; M 72 265 Q 83 275 94 265 Q 98 310 83 330 Q 68 310 72 265 Z" dur="0.10s" repeatCount="indefinite" />
                        </path>

                        {/* Right plume */}
                        <path d="M 128 265 Q 117 275 106 265 Q 102 310 117 330 Q 132 310 128 265 Z" fill="url(#sideFlame)">
                          <animate attributeName="d" values="M 128 265 Q 117 275 106 265 Q 102 310 117 330 Q 132 310 128 265 Z; M 128 265 Q 117 275 106 265 Q 98 305 117 340 Q 136 305 128 265 Z; M 128 265 Q 117 275 106 265 Q 102 310 117 330 Q 132 310 128 265 Z" dur="0.12s" repeatCount="indefinite" />
                        </path>
                      </g>
                    </svg>
                  </div>
                  {/* Glow under rocket */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#2ed573]/10 rounded-full blur-md group-hover/rocket:bg-[#2ed573]/25 transition-all duration-300"></div>
                </div>
              </div>

              {/* Mission status log */}
              <div className="space-y-2 font-mono text-[11px] mb-5 max-w-sm mx-auto">
                <div className="flex items-center gap-2" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.1s both' }}>
                  <span className="text-[#27c93f]">[✓]</span>
                  <span className="text-[#2ed573]/70 flex-1">Vision.init()</span>
                  <span className="text-[#27c93f] text-[10px]">DONE</span>
                </div>
                <div className="flex items-center gap-2" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.25s both' }}>
                  <span className="text-[#27c93f]">[✓]</span>
                  <span className="text-[#2ed573]/70 flex-1">Problem.identify()</span>
                  <span className="text-[#27c93f] text-[10px]">DONE</span>
                </div>
                <div className="flex items-center gap-2" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.4s both' }}>
                  <span className="text-[#27c93f]">[✓]</span>
                  <span className="text-[#2ed573]/70 flex-1">Solution.build()</span>
                  <span className="text-[#27c93f] text-[10px]">DONE</span>
                </div>
                <div className="flex items-center gap-2" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.55s both' }}>
                  <span className="text-[#ffbd2e] animate-pulse">[▸]</span>
                  <span className="text-[#ffbd2e]/80 flex-1">Industry.disrupt()</span>
                  <span className="text-[#ffbd2e] text-[10px] animate-pulse">RUNNING</span>
                </div>
                <div className="flex items-center gap-2" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.7s both' }}>
                  <span className="text-[#2ed573]/25">[ ]</span>
                  <span className="text-[#2ed573]/25 flex-1">World.change()</span>
                  <span className="text-[#2ed573]/25 text-[10px]">QUEUED</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="max-w-sm mx-auto mb-5" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.85s both' }}>
                <div className="flex justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-[#2ed573]/40">mission_progress</span>
                  <span className="text-[#2ed573]/70">75%</span>
                </div>
                <div className="h-1 bg-[#1e272e] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full relative"
                    style={{
                      width: '75%',
                      background: 'linear-gradient(90deg, #2ed573, #27c93f, #2ed573)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer-bar 2s linear infinite',
                    }}
                  >
                    <div className="absolute right-0 top-0 w-1 h-full bg-white/40 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-[#2ed573]/10 my-4"></div>

              {/* GROW or DIE motto */}
              <div className="text-center" style={{ animation: 'fadeSlideIn 0.5s ease-out 1s both' }}>
                <div className="inline-flex items-center gap-3 font-mono">
                  <span className="text-[#2ed573] text-lg md:text-xl font-bold tracking-[0.3em] transition-all duration-300 motto-grow">GROW</span>
                  <span className="text-[#2ed573]/20 text-xs">///</span>
                  <span className="text-[#ff5f56]/70 text-lg md:text-xl font-bold tracking-[0.3em] group-hover:text-[#ff5f56] transition-all duration-300 motto-die">DIE</span>
                </div>
                <div className="mt-2 font-mono text-[10px] text-[#2ed573]/30 tracking-widest">
                  THERE IS NO THIRD OPTION
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-[#2ed573]/30 text-xs tracking-widest mt-8 text-center w-full max-w-7xl mx-auto px-4">
        <div className="border-t border-[#2ed573]/10 pt-4">
          ARAFAT © {new Date().getFullYear()} - ALL RIGHTS RESERVED
        </div>
      </div>
    </main>
  );
}
