"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Github,
  ExternalLink,
  Eye,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  // Real projects with accurate data
  const realProjects = [
    {
      id: 1,
      name: "KingBOB Web Crawler",
      description:
        "This Python script allows systematic browsing and extraction of links from websites up to a specified depth. It is ideal for SEO analysis, site audit, and exploring web structures.",
      html_url: "https://github.com/mrx-arafat/KingBOB-WebCrawler",
      topics: ["python", "web-crawler", "seo", "automation"],
      language: "Python",
      stargazers_count: 0,
      preview_image:
        "https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_Web_Crawler.jpg",
    },
    {
      id: 2,
      name: "Daily Personal Planner",
      description:
        "Daily planner web application built with Next.js and TypeScript. Features include task management, calendar integration, and responsive design.",
      html_url: "https://github.com/mrx-arafat/daily-planner",
      topics: [
        "nextjs",
        "typescript",
        "tailwindcss",
        "date-fns",
        "html2canvas",
      ],
      language: "TypeScript",
      stargazers_count: 0,
      homepage: "https://daily.arafatbytes.live/",
      preview_image: "https://i.ibb.co.com/dJJ3Wzp9/daily-planner.png",
    },
    {
      id: 3,
      name: "E-commerce Backend",
      description:
        "A robust e-commerce backend built with Node.js and TypeScript, featuring Express.js and Mongoose for database management.",
      html_url: "https://github.com/mrx-arafat/e-commmerce-backend",
      topics: ["nodejs", "typescript", "expressjs", "mongoosejs"],
      language: "TypeScript",
      stargazers_count: 0,
      homepage: "https://e-commmerce-backend.vercel.app/",
      preview_image:
        "https://images.contentstack.io/v3/assets/blt7151619cb9560896/blt4b651817f6dec60f/666848e371203e8537986b38/mern-stack.png",
    },
    {
      id: 4,
      name: "Binary Exploitation Buffer Overflow  Starter Code",
      description:
        "A collection of Python scripts and exercises for practicing binary exploitation and buffer overflow techniques.",
      html_url:
        "https://github.com/mrx-arafat/Binary-Exploitation-Bufferoverflow-Practice",
      topics: ["python", "security", "binary-exploitation", "buffer-overflow"],
      language: "Python",
      stargazers_count: 0,
      preview_image:
        "https://pbs.twimg.com/ext_tw_video_thumb/1709973595038822403/pu/img/jcukjOP0NhuvbIpD.jpg:large",
    },
    {
      id: 5,
      name: "AES Crypto 256 Bits by KingBOB",
      description:
        "Python scripts for encrypting and decrypting text files using the Advanced Encryption Standard (AES) in Cipher Block Chaining (CBC) mode with a 256-bit key.",
      html_url: "https://github.com/mrx-arafat/AES-Crypto-256-Bits-by-KingBOB",
      topics: ["python", "cryptography", "aes", "security"],
      language: "Python",
      stargazers_count: 0,
      preview_image:
        "https://content.nordlayer.com/uploads/How_encryption_works_1400x580_59f8b2cf11.webp",
    },
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

    // Use predefined projects
    setTimeout(() => {
      setProjects(realProjects);
      setLoading(false);
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

  return (
    <main className="min-h-screen bg-[#121212] text-[#2ed573] p-8 grid-dots">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-[#2ed573] hover:text-[#2ed573]/80 mb-12"
        onClick={playClickSound}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">My Projects</h1>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="https://github.com/mrx-arafat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#2ed573] hover:text-[#2ed573]/80 mb-4 sm:mb-0"
              onClick={playClickSound}
            >
              <Github size={18} />
              View All Projects on GitHub
            </a>
            <div className="flex gap-4 sm:gap-2">
              <Button
                onClick={prevProject}
                disabled={loading || projects.length === 0}
                className="w-10 h-10 p-0 rounded-full bg-[#1e272e] hover:bg-[#2a3942] border border-[#2ed573]/20"
                aria-label="Previous project"
              >
                <ArrowLeft size={18} className="text-[#2ed573]" />
              </Button>
              <Button
                onClick={nextProject}
                disabled={loading || projects.length === 0}
                className="w-10 h-10 p-0 rounded-full bg-[#1e272e] hover:bg-[#2a3942] border border-[#2ed573]/20"
                aria-label="Next project"
              >
                <ArrowRight size={18} className="text-[#2ed573]" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#1e272e] rounded-2xl p-12 flex flex-col items-center justify-center border border-[#2ed573]/20">
            <div className="w-12 h-12 border-4 border-[#2ed573] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#2ed573]/70">Loading projects...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="bg-[#1e272e] rounded-2xl overflow-hidden border border-[#2ed573]/20">
            <div className="p-6 border-b border-[#2ed573]/10">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">
                  {projects[currentProject].name}
                </h2>
                <p className="text-[#2ed573]/80 mb-6">
                  {projects[currentProject].description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {projects[currentProject].topics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[#0f0f0f] text-[#2ed573] rounded-full text-xs border border-[#2ed573]/20"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-[#2ed573]/70 mb-6">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">
                      {projects[currentProject].language}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() =>
                    openProjectLink(projects[currentProject].html_url)
                  }
                  className="inline-flex items-center gap-2 bg-[#2ed573] hover:bg-[#2ed573]/80 text-[#0f0f0f] px-4 py-2 rounded-lg hover-glow"
                >
                  <Github size={16} />
                  View on GitHub
                </Button>

                {projects[currentProject].homepage && (
                  <Button
                    onClick={() =>
                      openProjectLink(projects[currentProject].homepage!)
                    }
                    className="inline-flex items-center gap-2 bg-[#0f0f0f] hover:bg-[#2a3942] text-[#2ed573] border border-[#2ed573]/30 px-4 py-2 rounded-lg"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </Button>
                )}

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      projects[currentProject].html_url
                    );
                    playClickSound();
                  }}
                  className="inline-flex items-center gap-2 bg-[#0f0f0f] hover:bg-[#2a3942] text-[#2ed573] border border-[#2ed573]/30 px-4 py-2 rounded-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
                  Copy Link
                </Button>

                <Button
                  onClick={() => {
                    const text = `Check out this project: ${projects[currentProject].name} - ${projects[currentProject].html_url}`;
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        text
                      )}`,
                      "_blank"
                    );
                    playClickSound();
                  }}
                  className="inline-flex items-center gap-2 bg-[#0f0f0f] hover:bg-[#2a3942] text-[#2ed573] border border-[#2ed573]/30 px-4 py-2 rounded-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                  Share
                </Button>
              </div>
            </div>

            <div className="p-6 bg-[#0f0f0f]">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye size={18} />
                Project Preview
              </h3>
              <div className="aspect-video bg-[#1e272e] rounded-lg flex items-center justify-center border border-[#2ed573]/20 overflow-hidden">
                {projects[currentProject].preview_image ? (
                  <img
                    src={
                      projects[currentProject].preview_image ||
                      "/placeholder.svg"
                    }
                    alt={`${projects[currentProject].name} preview`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#2ed573]/30">
                    <Code size={64} className="mb-2" />
                    <span>No preview available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1e272e] rounded-2xl p-12 flex flex-col items-center justify-center border border-[#2ed573]/20">
            <Github size={64} className="text-[#2ed573]/20 mb-4" />
            <p className="text-[#2ed573]/70 mb-2">No projects found</p>
            <p className="text-[#2ed573]/50 text-sm text-center mb-6">
              We couldn't load your GitHub projects at this time.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#2ed573] hover:bg-[#2ed573]/80 text-[#0f0f0f] hover-glow"
            >
              Try Again
            </Button>
          </div>
        )}

        {projects.length > 0 && (
          <div className="flex justify-center mt-8">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  playClickSound();
                  setCurrentProject(index);
                }}
                className={`w-3 h-3 rounded-full mx-1 ${
                  currentProject === index ? "bg-[#2ed573]" : "bg-[#1e272e]"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
