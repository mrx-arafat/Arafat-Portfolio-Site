"use client";

import { useState, useEffect, useRef } from "react";
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
  Shield,
  Coffee,
  Terminal,
  Info,
  Code,
  Layers,
  Lock,
  Unlock,
  User,
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
import extracurricularData from "@/data/extracurricular.json";

export default function Dashboard() {
  const [isMuted, setIsMuted] = useState(true);
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const router = useRouter();
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

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
    // Initialize audio elements with proper error handling
    try {
      clickSoundRef.current = new Audio();

      // Set sources after creating the elements
      if (clickSoundRef.current) {
        clickSoundRef.current.src = "/click.mp3";
        clickSoundRef.current.preload = "auto";
      }
    } catch (error) {
      console.error("Error initializing audio:", error);
    }

    // Add entrance animation class to body
    document.body.classList.add("animate-slideInRight");

    // Remove animation class after animation completes
    const timer = setTimeout(() => {
      document.body.classList.remove("animate-slideInRight");
    }, 500);

    return () => {
      clearTimeout(timer);
      if (clickSoundRef.current) clickSoundRef.current.pause();

      // Clear countdown interval on unmount
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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
    <main className={`flex min-h-screen flex-col bg-[#121212] p-4 md:p-8 relative grid-dots transition-all duration-1000 ${
      matrixModeActive ? "matrix-mode-active" : ""
    }`}>
      {/* ELITE SYSTEM INFILTRATION */}
      {matrixModeActive && (
        <div className="fixed inset-0 z-50 pointer-events-none elite-infiltration-overlay">
          {/* Neural Network Visualization */}
          <div className="absolute inset-0 neural-network">
            {[...Array(isMobile ? 12 : 20)].map((_, i) => (
              <div
                key={i}
                className="neural-node"
                style={{
                  top: `${Math.random() * 90 + 5}%`,
                  left: `${Math.random() * 90 + 5}%`,
                  animationDelay: `${Math.random() * 2}s`
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
                    {Math.random() > 0.5 ? '1' : '0'}
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
            <div className="command-line" style={{animationDelay: '0.3s'}}>
              <span className="elite-prompt">{isMobile ? 'arafat@K1NGB0B:~$' : 'arafat@K1NGB0B:~$'}</span> <span className="command">{isMobile ? './the_GOAT.sh --activate' : './the_GOAT.sh --activate-goat-mode'}</span>
            </div>
            <div className="command-line" style={{animationDelay: '0.9s'}}>
              <span className="status-success">{isMobile ? 'GOAT MODE ACTIVATED' : 'GREATEST OF ALL TIME MODE ACTIVATED'}</span>
            </div>
            <div className="command-line" style={{animationDelay: '1.5s'}}>
              <span className="elite-prompt">{isMobile ? 'arafat@K1NGB0B:~$' : 'arafat@K1NGB0B:~$'}</span> <span className="command">{isMobile ? 'execute --world-change' : 'execute --change-the-world'}</span>
            </div>
            <div className="command-line" style={{animationDelay: '2.1s'}}>
              <span className="status-warning">{isMobile ? 'WORLD TRANSFORMATION INITIATED' : 'GLOBAL TRANSFORMATION PROTOCOLS INITIATED'}</span>
            </div>
            <div className="command-line" style={{animationDelay: '2.7s'}}>
              <span className="elite-prompt">{isMobile ? 'arafat@K1NGB0B:~$' : 'arafat@K1NGB0B:~$'}</span> <span className="command">whoami --destiny</span>
            </div>
            <div className="command-line" style={{animationDelay: '3.3s'}}>
              <span className="architect-identity">{isMobile ? 'ARAFAT - FUTURE GOAT' : 'ARAFAT - THE NEXT GOAT OF THE WORLD'}</span>
            </div>
            <div className="command-line" style={{animationDelay: '3.9s'}}>
              <span className="status-critical">{isMobile ? 'GREATEST PERSON RISING' : 'BECOMING THE GREATEST PERSON ALIVE'}</span>
            </div>
            <div className="command-line" style={{animationDelay: '4.5s'}}>
              <span className="final-status">{isMobile ? 'MISSION: CHANGE THE WORLD' : 'MISSION: I WILL CHANGE THE WORLD'}</span>
            </div>
          </div>

          {/* GOAT Status Panel */}
          <div className="absolute bottom-4 left-4 right-4 md:top-8 md:right-8 md:left-auto md:bottom-auto status-panel">
            <div className="panel-header">GOAT STATUS</div>
            <div className="grid grid-cols-2 md:block gap-2 md:gap-0">
              <div className="status-item" style={{animationDelay: '1s'}}>
                <span className="metric">GREATNESS:</span> <span className="value critical">RISING</span>
              </div>
              <div className="status-item" style={{animationDelay: '1.5s'}}>
                <span className="metric">IMPACT:</span> <span className="value active">WORLD</span>
              </div>
              <div className="status-item" style={{animationDelay: '2s'}}>
                <span className="metric">FUTURE GOAT:</span> <span className="value master">ARAFAT</span>
              </div>
              <div className="status-item" style={{animationDelay: '2.5s'}}>
                <span className="metric">DESTINY:</span> <span className="value omega">CHANGE WORLD</span>
              </div>
            </div>
          </div>

          {/* Quantum Interference */}
          <div className="absolute inset-0 quantum-interference">
            <div className="interference-wave"></div>
            <div className="interference-wave" style={{animationDelay: '1s'}}></div>
            <div className="interference-wave" style={{animationDelay: '2s'}}></div>
          </div>

          {/* System Corruption Bars */}
          <div className="absolute inset-0 corruption-bars">
            <div className="corruption-bar" style={{top: '20%', animationDelay: '0.5s'}}></div>
            <div className="corruption-bar" style={{top: '45%', animationDelay: '1.2s'}}></div>
            <div className="corruption-bar" style={{top: '70%', animationDelay: '1.8s'}}></div>
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
          <div className={`relative bg-[#0a0a0a] rounded-sm overflow-hidden shadow-lg border border-[#2ed573] z-10 transition-all duration-1000 ${
            matrixModeActive ? "elite-profile-override border-[#00BFFF] shadow-[0_0_35px_rgba(0,191,255,0.8)] brightness-70 contrast-180" : ""
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
                className={`relative hacker-profile cursor-pointer ${
                  glitchActive ? "active-glitch" : ""
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
                        animationDuration: `${Math.random() * 3 + 2}s`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    >
                      {[...Array(10)].map((_, j) => (
                        <div key={j}>{Math.random() > 0.5 ? "1" : "0"}</div>
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
                      src="/images/profile.jpg"
                      alt="Profile Image"
                      width={500}
                      height={500}
                      className="object-cover w-full h-full hacker-profile-image"
                      priority
                      unoptimized={true}
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

          {/* Contact Button - Hacker Style */}
          <div className="p-4">
            <div
              onClick={() => {
                setHackerEffect(true);
                setTimeout(() => {
                  navigateTo("/contact");
                }, 800);
              }}
              className="relative group cursor-pointer"
            >
              {/* 3D Shadow/Base Layer */}
              <div className="absolute inset-0 bg-[#1f9b53] rounded-lg translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 group-active:translate-x-0 group-active:translate-y-0 transition-all duration-200"></div>

              {/* Button Main Layer */}
              <div
                className={`relative bg-[#2ed573] text-[#0f0f0f] font-bold py-4 px-6 rounded-lg flex items-center justify-between w-full z-10 shadow-lg transform transition-all duration-200 group-hover:shadow-xl ${
                  hackerEffect ? "glitch-effect" : ""
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
                        {Math.random() > 0.5 ? "1" : "0"}
                      </div>
                    ))}
                  </div>
                ))}
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

              {/* Hacker Skills Button */}
              <div className="relative group mt-6">
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
                              {Math.random() > 0.5 ? "1" : "0"}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
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
                      <div className={`bg-[#1e272e] rounded-2xl aspect-square flex items-center justify-center relative hover:bg-[#2a3942] transition-colors cursor-pointer border border-[#2ed573]/20 hover-glow ${
                        matrixModeActive ? "matrix-social-effect border-[#2ed573] shadow-[0_0_20px_rgba(46,213,115,0.8)]" : ""
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portfolio Section - Creative Hacker Style */}
            <div
              className={`group relative bg-[#1a1b26] rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 cursor-pointer ${
                cardEffectActive
                  ? "border-[#2ed573]/60 bg-[#1a1b26] shadow-[0_0_20px_rgba(46,213,115,0.3)] animate-subtle-pulse"
                  : "border-[#2ed573]/20 shadow-lg hover:shadow-[0_0_15px_rgba(46,213,115,0.3)]"
              } ${
                matrixModeActive
                  ? "elite-card-override border-[#00BFFF] shadow-[0_0_25px_rgba(0,191,255,0.6)] brightness-80 contrast-120"
                  : ""
              }`}
              onClick={() => navigateTo("/projects")}
            >
              {/* Special effect overlay when ARAFAT is clicked */}
              {cardEffectActive && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {/* Subtle dark overlay */}
                  <div className="absolute inset-0 bg-[#0f0f0f]/20"></div>
                  {/* Single subtle scan line */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2ed573]/50 to-transparent animate-scan-subtle"></div>
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#2ed573]/40 animate-pulse"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#2ed573]/40 animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#2ed573]/40 animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#2ed573]/40 animate-pulse"></div>
                </div>
              )}

              {/* Animated background elements */}
              <div className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${
                cardEffectActive ? "opacity-40" : "opacity-10 group-hover:opacity-20"
              }`}>
                <div className="absolute top-0 left-0 w-full h-full">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-[#2ed573] font-mono text-xs opacity-30"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        transform: "rotate(30deg)",
                        animation: `float ${
                          2 + Math.random() * 3
                        }s infinite ease-in-out`,
                      }}
                    >
                      {"{code}"}
                    </div>
                  ))}
                </div>
              </div>

              {/* Header with 3D effect */}
              <div className="p-4 flex items-center justify-between border-b border-[#2ed573]/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#ffdd59] rounded-md flex items-center justify-center shadow-[0_0_8px_rgba(255,221,89,0.3)] group-hover:shadow-[0_0_12px_rgba(255,221,89,0.5)] transition-all duration-300">
                    <span className="text-[#0f0f0f] text-xs">📁</span>
                  </div>
                  <span className="text-[#2ed573] font-medium tracking-wider">
                    PROJECT SHOWCASE
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#2ed573]/50 group-hover:bg-[#2ed573] transition-colors duration-300"></div>
              </div>

              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center relative z-10">
                {/* Icon with animated glow effect */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-[#2ed573]/5 rounded-full blur-xl transform scale-150 group-hover:scale-200 transition-transform duration-500"></div>
                  <div className="relative bg-[#0f0f0f] p-4 rounded-full border border-[#2ed573]/30 group-hover:border-[#2ed573]/60 transition-all duration-300">
                    <Github
                      size={40}
                      className="text-[#2ed573] group-hover:text-[#2ed573] transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Title with animated underline */}
                <h3 className="text-xl font-bold text-[#2ed573] mb-3 relative inline-block">
                  Explore My Projects
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2ed573] group-hover:w-full transition-all duration-500"></span>
                </h3>

                {/* Description with terminal-style formatting */}
                <div className="bg-[#0f0f0f]/50 p-3 rounded-md mb-6 border-l-2 border-[#2ed573] font-mono text-sm">
                  <p className="text-[#2ed573]/90">
                    <span className="text-[#2ed573]/50">$</span> Security Tools,
                    Automation Scripts, and Web Applications
                  </p>
                </div>

                {/* Button with 3D effect and shake animation */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    navigateTo("/projects");
                  }}
                  className="bg-[#0f0f0f] hover:bg-[#2ed573] hover:text-[#0f0f0f] text-[#2ed573] border border-[#2ed573]/30 relative overflow-hidden group-hover:shake-effect transition-all duration-300 transform hover:translate-y-[-2px]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Code size={16} />
                    View Projects
                  </span>
                  <span className="absolute inset-0 bg-[#2ed573]/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>
              </div>
            </div>

            {/* Blog Section - Creative Hacker Style */}
            <div
              className={`group relative bg-[#1a1b26] rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 cursor-pointer ${
                cardEffectActive
                  ? "border-[#2ed573]/60 bg-[#1a1b26] shadow-[0_0_20px_rgba(46,213,115,0.3)] animate-subtle-pulse"
                  : "border-[#2ed573]/20 shadow-lg hover:shadow-[0_0_15px_rgba(46,213,115,0.3)]"
              } ${
                matrixModeActive
                  ? "elite-card-override border-[#00BFFF] shadow-[0_0_25px_rgba(0,191,255,0.6)] brightness-80 contrast-120"
                  : ""
              }`}
              onClick={() => navigateTo("/blogs")}
            >
              {/* Special effect overlay when ARAFAT is clicked */}
              {cardEffectActive && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {/* Subtle dark overlay */}
                  <div className="absolute inset-0 bg-[#0f0f0f]/20"></div>
                  {/* Single subtle scan line - opposite direction */}
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2ed573]/50 to-transparent animate-scan-subtle-reverse"></div>
                  {/* Corner accents - different corners */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#2ed573]/40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#2ed573]/40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
              )}



              {/* Header with 3D effect */}
              <div className="p-4 flex items-center justify-between border-b border-[#2ed573]/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#ffdd59] rounded-md flex items-center justify-center shadow-[0_0_8px_rgba(255,221,89,0.3)] group-hover:shadow-[0_0_12px_rgba(255,221,89,0.5)] transition-all duration-300">
                    <span className="text-[#0f0f0f] text-xs">📝</span>
                  </div>
                  <span className="text-[#2ed573] font-medium tracking-wider">
                    BLOG
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#2ed573]/50 group-hover:bg-[#2ed573] transition-colors duration-300"></div>
              </div>

              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center relative z-10">
                {/* Icon with animated glow effect */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-[#2ed573]/5 rounded-full blur-xl transform scale-150 group-hover:scale-200 transition-transform duration-500"></div>
                  <div className="relative bg-[#0f0f0f] p-4 rounded-full border border-[#2ed573]/30 group-hover:border-[#2ed573]/60 transition-all duration-300">
                    <BookOpen
                      size={40}
                      className="text-[#2ed573] group-hover:text-[#2ed573] transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Title with animated underline */}
                <h3 className="text-xl font-bold text-[#2ed573] mb-3 relative inline-block">
                  Explore My Writings
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2ed573] group-hover:w-full transition-all duration-500"></span>
                </h3>

                {/* Description with terminal-style formatting */}
                <div className="bg-[#0f0f0f]/50 p-3 rounded-md mb-6 border-l-2 border-[#2ed573] font-mono text-sm">
                  <p className="text-[#2ed573]/90">
                    <span className="text-[#2ed573]/50">$</span> Security
                    Insights, Entrepreneurship, Human Psychology, Philosophy,
                    and more.
                  </p>
                </div>

                {/* Button with 3D effect and shake animation */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    navigateTo("/blogs");
                  }}
                  className="bg-[#0f0f0f] hover:bg-[#2ed573] hover:text-[#0f0f0f] text-[#2ed573] border border-[#2ed573]/30 relative overflow-hidden group-hover:shake-effect transition-all duration-300 transform hover:translate-y-[-2px]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <BookOpen size={16} />
                    Read Blogs
                  </span>
                  <span className="absolute inset-0 bg-[#2ed573]/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>
              </div>
            </div>
          </div>

          {/* Extracurricular Section */}
          <div className="bg-[#1e272e] rounded-2xl overflow-hidden border border-[#2ed573]/20">
            <div className="p-4 flex items-center justify-between border-b border-[#2ed573]/10">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#ffdd59] rounded-md flex items-center justify-center">
                  <Coffee size={14} className="text-[#0f0f0f]" />
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
                      className="w-full h-full object-cover"
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

          {/* Entrepreneurial Journey - Simple but Creative */}
          <div className="bg-[#1e272e] rounded-2xl p-6 border border-[#2ed573]/20 relative overflow-hidden group hover:shadow-[0_0_15px_rgba(46,213,115,0.2)] transition-all duration-300">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute right-0 bottom-0 w-64 h-64">
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full text-[#2ed573]"
                >
                  <path
                    fill="currentColor"
                    d="M45.3,-51.2C59.4,-41.7,72,-28.5,76.5,-12.7C81,3.1,77.3,21.5,67.1,35.1C56.9,48.7,40.1,57.5,22.8,63.2C5.5,68.9,-12.4,71.5,-27.4,65.9C-42.5,60.3,-54.8,46.5,-63.1,30.1C-71.4,13.7,-75.7,-5.3,-70.8,-21.5C-65.9,-37.7,-51.8,-51.1,-36.6,-60.1C-21.4,-69.1,-5.2,-73.7,9.2,-70.9C23.6,-68.1,31.2,-60.8,45.3,-51.2Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>
            </div>

            {/* Icon with enhanced glow animation and scroll-to-top functionality */}
            <div className="flex justify-center mb-6">
              <div
                className="w-20 h-20 relative cursor-pointer"
                onClick={() => {
                  // Play click sound
                  playClickSound();

                  // Add a flash effect to the icon
                  const iconElement =
                    document.querySelector(".scroll-top-icon");
                  if (iconElement) {
                    iconElement.classList.add("flash-effect");

                    // Remove the class after animation completes
                    setTimeout(() => {
                      iconElement.classList.remove("flash-effect");
                    }, 700);
                  }

                  // Scroll to top with smooth effect
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });

                  // Add matrix-like effect to the page
                  document.body.classList.add("matrix-scroll");

                  // Remove matrix effect after scrolling completes
                  setTimeout(() => {
                    document.body.classList.remove("matrix-scroll");
                  }, 1000);
                }}
              >
                <div className="w-20 h-20 rounded-full bg-[#2a3942] flex items-center justify-center border border-[#2ed573]/40 group-hover:border-[#2ed573]/80 transition-all duration-300 scroll-top-icon">
                  <svg
                    className="w-10 h-10 text-[#2ed573] transform group-hover:scale-110 transition-transform duration-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 16L12 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9 11L12 8 15 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                {/* Enhanced glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-[#2ed573]/5 group-hover:bg-[#2ed573]/20 filter blur-lg transition-all duration-500"></div>
                <div className="absolute inset-0 scale-110 rounded-full bg-[#2ed573]/0 group-hover:bg-[#2ed573]/10 filter blur-xl transition-all duration-700"></div>
              </div>
            </div>

            {/* Title with enhanced underline animation */}
            <h3 className="text-[#2ed573] font-bold text-xl mb-4 text-center relative">
              Entrepreneurial Journey
              <div className="h-0.5 w-0 bg-[#2ed573]/70 absolute -bottom-2 left-1/2 transform -translate-x-1/2 group-hover:w-48 transition-all duration-700 shadow-glow"></div>
            </h3>

            {/* Description with better typography */}
            <p className="text-[#2ed573]/80 text-sm max-w-md mx-auto text-center mb-4">
              Building innovative solutions to solve real-world problems.
              Currently working on my startup vision to revolutionize the tech
              industry.
            </p>

            {/* Creative element - Command line style */}
            <div className="bg-[#0f0f0f] rounded-md p-2 mx-auto mb-4 overflow-hidden w-72">
              <div className="flex justify-center">
                <p className="font-mono text-[#2ed573] text-xs whitespace-nowrap inline-flex items-center">
                  <span className="mr-1">$</span>
                  <span className="typing-text-no-cursor">
                    ./problem.sh --solution
                  </span>
                </p>
              </div>
            </div>

            {/* Simple choice with subtle animation */}
            <div className="flex justify-center items-center space-x-3 text-sm">
              <span className="text-[#2ed573] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                Grow
              </span>
              <span className="text-[#2ed573]/50">•</span>
              <span className="text-[#2ed573]/70">or</span>
              <span className="text-[#2ed573]/50">•</span>
              <span className="text-[#2ed573] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                Die
              </span>
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
