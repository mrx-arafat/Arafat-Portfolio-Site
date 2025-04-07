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

export default function Dashboard() {
  const [isMuted, setIsMuted] = useState(true);
  const [skills, setSkills] = useState({
    security: true,
    business: true,
    webdev: true,
  });
  const router = useRouter();
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

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
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSkill = (skill: keyof typeof skills) => {
    // Play click sound if not muted
    if (!isMuted && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current
        .play()
        .catch((e) => console.error("Error playing sound:", e));
    }

    setSkills((prev) => ({
      ...prev,
      [skill]: !prev[skill],
    }));
  };

  const playClickSound = () => {
    if (!isMuted && clickSoundRef.current) {
      try {
        clickSoundRef.current.currentTime = 0;
        const playPromise = clickSoundRef.current.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio playback prevented:", error);
            // Auto-play was prevented, we can safely ignore this error
          });
        }
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };

  const navigateTo = (path: string) => {
    playClickSound();
    router.push(path);
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#121212] p-4 md:p-8 relative grid-dots">
      {/* Sound toggle button */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 text-[#2ed573]/50 hover:text-[#2ed573] transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 max-w-7xl mx-auto w-full">
        {/* Left Panel - Profile Card */}
        <div className="bg-[#1e272e] rounded-2xl overflow-hidden shadow-lg border border-[#2ed573]/20">
          {/* Header with name */}
          <div className="p-4 flex items-center gap-3 border-b border-[#2ed573]/10">
            <div className="w-6 h-6 flex flex-col gap-[2px]">
              <div className="flex gap-[2px]">
                <div className="w-[6px] h-[6px] bg-[#2ed573] rounded-sm"></div>
                <div className="w-[6px] h-[6px] bg-[#2ed573] rounded-sm"></div>
              </div>
              <div className="flex gap-[2px]">
                <div className="w-[6px] h-[6px] bg-[#2ed573] rounded-sm"></div>
                <div className="w-[6px] h-[6px] bg-[#2ed573] rounded-sm"></div>
              </div>
            </div>
            <h2 className="text-[#2ed573] font-medium tracking-wide">ARAFAT</h2>
            <div className="ml-auto flex gap-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-[6px] h-[6px] bg-[#2ed573]/50 rounded-full"
                ></div>
              ))}
            </div>
          </div>

          {/* Profile Image */}
          <div className="p-4">
            <div className="bg-[#0f0f0f] rounded-lg aspect-square flex items-center justify-center border border-[#2ed573]/20">
              <div className="w-full h-full bg-[#2a3942] flex items-center justify-center border-2 border-[#2ed573]/30 overflow-hidden">
                <Image
                  src="/images/profile.jpg"
                  alt="Arafat's Profile"
                  width={500}
                  height={500}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Contact Button */}
          <div className="p-4">
            <Button
              onClick={() => navigateTo("/contact")}
              className="bg-[#2ed573] text-[#0f0f0f] font-medium py-6 px-4 rounded-lg flex items-center justify-between w-full hover:bg-[#2ed573]/80 hover-glow"
            >
              <span>CONTACT ME</span>
              <div className="flex items-center">
                <div className="w-5 h-5 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="h-[2px] w-full bg-[#0f0f0f]"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-end">
                    <div className="h-[2px] w-1/2 bg-[#0f0f0f] rotate-45 origin-right"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-end">
                    <div className="h-[2px] w-1/2 bg-[#0f0f0f] -rotate-45 origin-right"></div>
                  </div>
                </div>
              </div>
            </Button>
          </div>

          {/* Skills Toggles */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-[#2ed573]/70 mb-2">
              <Settings size={16} />
              <span className="text-sm">Skills customizer</span>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0f0f0f] p-3 rounded-lg flex items-center justify-between border border-[#2ed573]/20">
                <span className="text-[#2ed573] font-medium">
                  SECURITY ENGINEER
                </span>
                <Switch
                  checked={skills.security}
                  onCheckedChange={() => toggleSkill("security")}
                  className="data-[state=checked]:bg-[#2ed573]"
                />
              </div>

              <div className="bg-[#0f0f0f] p-3 rounded-lg flex items-center justify-between border border-[#2ed573]/20">
                <span className="text-[#2ed573] font-medium">
                  BUSINESS MINDSET
                </span>
                <Switch
                  checked={skills.business}
                  onCheckedChange={() => toggleSkill("business")}
                  className="data-[state=checked]:bg-[#2ed573]"
                />
              </div>

              <div className="bg-[#0f0f0f] p-3 rounded-lg flex items-center justify-between border border-[#2ed573]/20">
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
                      <div className="bg-[#1e272e] rounded-2xl aspect-square flex items-center justify-center relative hover:bg-[#2a3942] transition-colors cursor-pointer border border-[#2ed573]/20 hover-glow">
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
            {/* Portfolio Section */}
            <div className="bg-[#1e272e] rounded-2xl overflow-hidden flex flex-col border border-[#2ed573]/20">
              <div className="p-4 flex items-center justify-between border-b border-[#2ed573]/10">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#ffdd59] rounded-md flex items-center justify-center">
                    <span className="text-[#0f0f0f] text-xs">📁</span>
                  </div>
                  <span className="text-[#2ed573] font-medium">
                    PROJECT SHOWCASE
                  </span>
                </div>
              </div>

              <div
                className="flex-1 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover-scale"
                onClick={() => navigateTo("/projects")}
              >
                <div className="mb-4">
                  <Github size={48} className="text-[#2ed573]/50 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-[#2ed573] mb-2">
                  Explore My Projects
                </h3>
                <p className="text-[#2ed573]/70 mb-6">
                  Security tools, automation scripts, and web applications
                </p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo("/projects");
                  }}
                  className="bg-[#0f0f0f] hover:bg-[#2a3942] text-[#2ed573] border border-[#2ed573]/30"
                >
                  View Projects
                </Button>
              </div>
            </div>

            {/* Blog Section */}
            <div className="bg-[#1e272e] rounded-2xl overflow-hidden flex flex-col border border-[#2ed573]/20">
              <div className="p-4 flex items-center justify-between border-b border-[#2ed573]/10">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#ffdd59] rounded-md flex items-center justify-center">
                    <span className="text-[#0f0f0f] text-xs">📝</span>
                  </div>
                  <span className="text-[#2ed573] font-medium">BLOG</span>
                </div>
              </div>

              <div
                className="flex-1 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover-scale"
                onClick={() => navigateTo("/blog")}
              >
                <div className="mb-4">
                  <BookOpen size={48} className="text-[#2ed573]/50 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-[#2ed573] mb-2">
                  Read My Articles
                </h3>
                <p className="text-[#2ed573]/70 mb-6">
                  Security insights, tech tutorials, and business perspectives
                </p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo("/blog");
                  }}
                  className="bg-[#0f0f0f] hover:bg-[#2a3942] text-[#2ed573] border border-[#2ed573]/30"
                >
                  Read Blog
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
              <div
                className="bg-[#0f0f0f] rounded-2xl aspect-square flex items-center justify-center relative hover:bg-[#2a3942] transition-colors cursor-pointer border border-[#2ed573]/20 hover-glow group"
                onClick={playClickSound}
              >
                <div className="w-16 h-16 rounded-full bg-[#1e272e] flex items-center justify-center overflow-hidden">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gam6wQbnATFAs00SJs9bNkTid4xxlr.png"
                    alt="Extracurricular"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>

                {/* Extended tooltip that appears on hover */}
                <div className="absolute inset-0 bg-[#0f0f0f]/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <h4 className="text-[#2ed573] font-bold mb-2">
                    Mountain Climbing
                  </h4>
                  <p className="text-[#2ed573]/80 text-xs">
                    Exploring heights and pushing physical limits. Conquered 3
                    major peaks in the last year.
                  </p>
                </div>
              </div>

              <div
                className="bg-[#0f0f0f] rounded-2xl aspect-square flex items-center justify-center relative hover:bg-[#2a3942] transition-colors cursor-pointer border border-[#2ed573]/20 hover-glow group"
                onClick={playClickSound}
              >
                <div className="w-16 h-16 rounded-full bg-[#1e272e] flex items-center justify-center">
                  <Terminal size={24} className="text-[#2ed573]" />
                </div>
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>

                {/* Extended tooltip that appears on hover */}
                <div className="absolute inset-0 bg-[#0f0f0f]/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <h4 className="text-[#2ed573] font-bold mb-2">
                    CTF Competitions
                  </h4>
                  <p className="text-[#2ed573]/80 text-xs">
                    Participating in cybersecurity challenges. Ranked in top 10%
                    in recent HackTheBox competition.
                  </p>
                </div>
              </div>

              <div
                className="bg-[#0f0f0f] rounded-2xl aspect-square flex items-center justify-center relative hover:bg-[#2a3942] transition-colors cursor-pointer border border-[#2ed573]/20 hover-glow group"
                onClick={playClickSound}
              >
                <div className="w-16 h-16 rounded-full bg-[#1e272e] flex items-center justify-center">
                  <span className="text-[#ff4757] text-xl font-bold">VS</span>
                </div>
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>

                {/* Extended tooltip that appears on hover */}
                <div className="absolute inset-0 bg-[#0f0f0f]/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <h4 className="text-[#2ed573] font-bold mb-2">
                    Competitive Gaming
                  </h4>
                  <p className="text-[#2ed573]/80 text-xs">
                    Strategic thinking and team coordination. Compete in weekend
                    tournaments with friends.
                  </p>
                </div>
              </div>

              <div
                className="bg-[#0f0f0f] rounded-2xl aspect-square flex items-center justify-center relative hover:bg-[#2a3942] transition-colors cursor-pointer border border-[#2ed573]/20 hover-glow group"
                onClick={playClickSound}
              >
                <div className="w-16 h-16 rounded-full bg-[#1e272e] flex items-center justify-center">
                  <Coffee size={24} className="text-[#2ed573]" />
                </div>
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#2ed573]/20"></div>

                {/* Extended tooltip that appears on hover */}
                <div className="absolute inset-0 bg-[#0f0f0f]/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <h4 className="text-[#2ed573] font-bold mb-2">
                    Coffee Brewing
                  </h4>
                  <p className="text-[#2ed573]/80 text-xs">
                    Exploring different brewing methods and beans. Amateur
                    barista with home setup.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Counter */}
          <div className="bg-[#1e272e] rounded-2xl p-6 flex items-center justify-center border border-[#2ed573]/20">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#2ed573] flex items-center justify-center mb-2">
                <span className="text-[#0f0f0f] font-bold text-2xl">2</span>
              </div>
              <div className="text-[#2ed573] text-center">
                <div className="text-xs">YEARS OF</div>
                <div className="font-medium">EXPERIENCE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-[#2ed573]/30 text-xs tracking-widest mt-8 text-center">
        ARAFAT © {new Date().getFullYear()} - ALL RIGHTS RESERVED
      </div>
    </main>
  );
}
