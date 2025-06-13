"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Github,
  ExternalLink,
  Eye,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import projectsData from "@/data/projects.json";

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  language: string;
  stargazers_count: number;
  homepage?: string;
  preview_image?: string;
}

export default function Projects() {
  const [currentProject, setCurrentProject] = useState(0);
  const [projects, setProjects] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);



  // Projects data is now imported from JSON file

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

    // Use projects from JSON file
    setTimeout(() => {
      setProjects(projectsData);
      setLoading(false);

      // Initialize image loading states
      const initialImageLoading: { [key: number]: boolean } = {};
      projectsData.forEach((_, index) => {
        initialImageLoading[index] = true;
      });
      setImageLoading(initialImageLoading);
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (clickSoundRef.current) clickSoundRef.current.pause();
    };
  }, []);

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

  const nextProject = () => {
    playClickSound();
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    playClickSound();
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Java: "#b07219",
      "C#": "#178600",
      PHP: "#4F5D95",
      Ruby: "#701516",
      Go: "#00ADD8",
      HTML: "#e34c26",
      CSS: "#563d7c",
    };

    return colors[language] || "#6e7681";
  };

  const openProjectLink = (url: string) => {
    playClickSound();
    window.open(url, "_blank");
  };

  const handleImageLoad = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  // Simple preloading for adjacent images
  useEffect(() => {
    if (projects.length > 0) {
      const preloadImage = (index: number) => {
        if (projects[index]?.preview_image) {
          const img = new window.Image();
          img.src = projects[index].preview_image!;
        }
      };

      // Preload next and previous images
      const nextIndex = (currentProject + 1) % projects.length;
      const prevIndex = (currentProject - 1 + projects.length) % projects.length;

      if (projects.length > 1) {
        preloadImage(nextIndex);
        preloadImage(prevIndex);
      }
    }
  }, [currentProject, projects]);

  return (
    <main className="min-h-screen bg-[#121212] text-[#2ed573] p-4 md:p-8 grid-dots overflow-hidden">

      {/* Terminal-style header */}
      <div className="mb-8 bg-[#0f0f0f] border border-[#2ed573]/30 rounded-lg p-3 shadow-[0_0_15px_rgba(46,213,115,0.2)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-2 text-[#2ed573]/70 text-xs">~/projects</div>
        </div>

        <div className="flex items-center">
          <span className="text-[#2ed573] mr-2">$</span>
          <div className="relative">
            <span className="text-[#2ed573]">
              ./list_projects.sh --sort=latest
            </span>
            <span className="animate-blink ml-1">|</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-[#2ed573] hover:text-[#2ed573]/80 mr-4 bg-[#1a1b26] px-3 py-2 rounded-md border border-[#2ed573]/20 hover:border-[#2ed573]/40 transition-colors"
              onClick={playClickSound}
            >
              <ArrowLeft size={16} className="mr-2" />
              <span className="text-sm">cd ..</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2ed573] to-[#7bed9f]">
              <span className="text-[#2ed573]/70">[</span>
              PROJECT_ARCHIVE
              <span className="text-[#2ed573]/70">]</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/mrx-arafat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#0f0f0f] text-sm bg-[#2ed573] px-3 py-2 rounded-md transform transition-all hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(46,213,115,0.4)] border border-[#2ed573]"
              onClick={() => playClickSound()}
            >
              <Github size={16} />
              <span className="hidden sm:inline">View All On GitHub</span>
              <span className="sm:hidden">All Projects</span>
            </a>

            <div className="flex gap-1">
              <Button
                onClick={prevProject}
                disabled={loading || projects.length === 0}
                className="w-9 h-9 p-0 rounded-md bg-[#1a1b26] hover:bg-[#2a3942] border border-[#2ed573]/20"
                aria-label="Previous project"
              >
                <ArrowLeft size={16} className="text-[#2ed573]" />
              </Button>
              <Button
                onClick={nextProject}
                disabled={loading || projects.length === 0}
                className="w-9 h-9 p-0 rounded-md bg-[#1a1b26] hover:bg-[#2a3942] border border-[#2ed573]/20"
                aria-label="Next project"
              >
                <ArrowRight size={16} className="text-[#2ed573]" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#1a1b26] rounded-lg p-8 flex flex-col items-center justify-center border border-[#2ed573]/20 shadow-[0_0_15px_rgba(46,213,115,0.1)]">
            <div className="flex flex-col items-center">
              <div className="text-[#2ed573] mb-4 font-mono text-sm">
                $ loading_projects.sh
              </div>
              <div className="flex gap-2 items-center mb-4">
                <div className="w-2 h-2 bg-[#2ed573] rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-[#2ed573] rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#2ed573] rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <div className="text-[#2ed573]/70 font-mono text-xs">
                Fetching repositories...
              </div>
            </div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Project image */}
            <div className="md:col-span-1 h-[300px] md:h-[400px] bg-[#1a1b26] rounded-lg overflow-hidden relative group shadow-[0_0_15px_rgba(46,213,115,0.1)] border border-[#2ed573]/10">
              <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f0f]/50 z-10">
                {projects[currentProject].preview_image && !imageErrors[currentProject] ? (
                  <div className="relative w-full h-full">
                    {/* Simple loading indicator */}
                    {imageLoading[currentProject] && (
                      <div className="absolute inset-0 bg-[#1a1b26] flex items-center justify-center z-10">
                        <div className="w-8 h-8 border-2 border-[#2ed573]/30 border-t-[#2ed573] rounded-full animate-spin"></div>
                      </div>
                    )}

                    <Image
                      src={projects[currentProject].preview_image}
                      alt={`${projects[currentProject].name} preview`}
                      fill
                      className={`object-cover group-hover:scale-105 transition-all duration-500 ${
                        imageLoading[currentProject] ? 'opacity-0' : 'opacity-100'
                      }`}
                      onLoad={() => handleImageLoad(currentProject)}
                      onError={() => handleImageError(currentProject)}
                      priority={true}
                      unoptimized={true} // Skip optimization for faster loading
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full bg-[#1a1b26] text-[#2ed573]/30">
                    <Code size={64} className="mb-2" />
                    <span className="text-sm">
                      {imageErrors[currentProject] ? 'Failed to load image' : 'No preview available'}
                    </span>
                  </div>
                )}
              </div>

              {/* Overlay with code-like elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/90 via-[#0f0f0f]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity z-20"></div>

              {/* Language badge */}
              <div className="absolute top-4 left-4 z-30">
                <div className="bg-[#0f0f0f]/70 text-[#2ed573] px-2 py-1 rounded text-xs border border-[#2ed573]/20 flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: getLanguageColor(
                        projects[currentProject].language
                      ),
                    }}
                  ></span>
                  <span>{projects[currentProject].language}</span>
                </div>
              </div>

              {/* Star count */}
              {projects[currentProject].stargazers_count > 0 && (
                <div className="absolute top-4 right-4 z-30">
                  <div className="bg-[#0f0f0f]/70 text-[#2ed573] px-2 py-1 rounded text-xs border border-[#2ed573]/20 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>{projects[currentProject].stargazers_count}</span>
                  </div>
                </div>
              )}

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                <div className="font-mono text-xs text-[#2ed573]/60 mb-1">
                  $ git clone{" "}
                  {projects[currentProject].html_url.split("/").pop()}
                </div>
              </div>
            </div>

            {/* Right column - Project content */}
            <div className="md:col-span-2 bg-[#1a1b26] rounded-lg p-6 border border-[#2ed573]/10 shadow-[0_0_15px_rgba(46,213,115,0.1)] flex flex-col justify-between h-[300px] md:h-[400px]">
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#2ed573]/40"></div>
                  <div className="text-[#2ed573]/60 text-xs font-mono">
                    PROJECT #{currentProject + 1}
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3 text-[#2ed573]">
                  {projects[currentProject].name}
                </h2>
                <p className="text-[#2ed573]/80 mb-4 text-sm md:text-base">
                  {projects[currentProject].description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {projects[currentProject].topics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[#0f0f0f] text-[#2ed573]/80 rounded text-xs border border-[#2ed573]/10 hover:border-[#2ed573]/30 transition-colors"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  onClick={() =>
                    openProjectLink(projects[currentProject].html_url)
                  }
                  className="inline-flex items-center gap-2 bg-[#2ed573] hover:bg-[#2ed573]/90 text-[#0f0f0f] px-4 py-2 rounded-md hover:translate-y-[-2px] transition-all hover:shadow-[0_5px_15px_rgba(46,213,115,0.4)]"
                >
                  <Github size={16} />
                  <span className="font-medium">View on GitHub</span>
                </Button>

                {projects[currentProject].homepage && (
                  <Button
                    onClick={() =>
                      openProjectLink(projects[currentProject].homepage!)
                    }
                    className="inline-flex items-center gap-2 bg-[#0f0f0f] hover:bg-[#1e272e] text-[#2ed573] border border-[#2ed573]/30 px-3 py-2 rounded-md transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span className="text-sm">Live Demo</span>
                  </Button>
                )}

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      projects[currentProject].html_url
                    );
                    playClickSound();
                  }}
                  className="inline-flex items-center gap-2 bg-[#0f0f0f] hover:bg-[#1e272e] text-[#2ed573] border border-[#2ed573]/30 px-3 py-2 rounded-md transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span className="text-sm">Copy Link</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1b26] rounded-lg p-8 flex flex-col items-center justify-center border border-[#2ed573]/20 shadow-[0_0_15px_rgba(46,213,115,0.1)]">
            <div className="font-mono text-[#2ed573]/70 text-sm mb-4">
              $ git fetch origin
            </div>
            <div className="bg-[#0f0f0f] p-4 rounded-md border border-[#2ed573]/10 mb-6 w-full max-w-md">
              <div className="text-[#2ed573]/80 font-mono text-sm mb-2">
                Error: No repositories found
              </div>
              <div className="text-[#2ed573]/50 font-mono text-xs">
                Unable to establish connection with GitHub API
              </div>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#2ed573] hover:bg-[#2ed573]/90 text-[#0f0f0f] px-4 py-2 rounded-md hover:translate-y-[-2px] transition-all hover:shadow-[0_5px_15px_rgba(46,213,115,0.4)] font-medium"
            >
              Retry Connection
            </Button>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mt-8 bg-[#1a1b26] rounded-lg p-4 border border-[#2ed573]/10 shadow-[0_0_15px_rgba(46,213,115,0.1)]">
            {/* Desktop pagination */}
            <div className="hidden md:flex items-center justify-between">
              <div className="text-[#2ed573]/60 text-xs font-mono">
                $ navigate_repos.sh
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      playClickSound();
                      setCurrentProject(index);
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-md mx-0.5 transition-colors ${
                      currentProject === index
                        ? "bg-[#2ed573] text-[#0f0f0f] font-medium"
                        : "bg-[#0f0f0f] text-[#2ed573]/70 hover:bg-[#0f0f0f]/80 hover:text-[#2ed573]"
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="text-[#2ed573]/60 text-xs font-mono">
                {currentProject + 1}/{projects.length}
              </div>
            </div>

            {/* Mobile pagination - simplified */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[#2ed573]/60 text-xs font-mono">
                  $ navigate_repos.sh
                </div>
                <div className="text-[#2ed573]/60 text-xs font-mono">
                  {currentProject + 1}/{projects.length}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  onClick={prevProject}
                  disabled={projects.length <= 1}
                  className="bg-[#0f0f0f] hover:bg-[#1e272e] text-[#2ed573] border border-[#2ed573]/30 px-4 py-2 rounded-md transition-colors flex-1 mr-2"
                >
                  <div className="flex items-center justify-center">
                    <ArrowLeft size={16} className="mr-2" />
                    <span>Previous</span>
                  </div>
                </Button>

                <Button
                  onClick={nextProject}
                  disabled={projects.length <= 1}
                  className="bg-[#0f0f0f] hover:bg-[#1e272e] text-[#2ed573] border border-[#2ed573]/30 px-4 py-2 rounded-md transition-colors flex-1 ml-2"
                >
                  <div className="flex items-center justify-center">
                    <span>Next</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
