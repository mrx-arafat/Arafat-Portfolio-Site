"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Github, ExternalLink, Eye, Code } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GithubRepo {
  id: number
  name: string
  description: string
  html_url: string
  topics: string[]
  language: string
  stargazers_count: number
  homepage?: string
  preview_image?: string
}

export default function Projects() {
  const [currentProject, setCurrentProject] = useState(0)
  const [projects, setProjects] = useState<GithubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)

  // Real projects with accurate data
  const realProjects = [
    {
      id: 1,
      name: "daily-planner",
      description:
        "A daily planner web application built with Next.js and TypeScript. Features include task management, calendar integration, and responsive design.",
      html_url: "https://github.com/mrx-arafat/daily-planner",
      topics: ["nextjs", "typescript", "planner", "productivity"],
      language: "TypeScript",
      stargazers_count: 8,
      homepage: "https://daily.arafatbytes.live/",
      preview_image:
        "https://sjc.microlink.io/PdufYwMKYI9Svfh6hFro0nagbIaJ6GaDROJC3iCsk2VlfhigvgYuyYfZE_tDQSt652Q51sB8KwB2EfZELJZOfQ.jpeg",
    },
    {
      id: 2,
      name: "KingBOB-WebCrawler",
      description:
        "A web crawler and scraper built for automating data collection from websites. Includes customizable parameters and export options.",
      html_url: "https://github.com/mrx-arafat/KingBOB-WebCrawler",
      topics: ["web-crawler", "scraping", "automation", "python"],
      language: "Python",
      stargazers_count: 5,
      preview_image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      name: "SecureScanner",
      description:
        "An automated vulnerability scanner for web applications with customizable rulesets and detailed reporting.",
      html_url: "https://github.com/mrx-arafat/SecureScanner",
      topics: ["security", "python", "automation"],
      language: "Python",
      stargazers_count: 12,
      homepage: "https://securescanner.dev",
      preview_image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nMMJJ5qd2sfOOA1DzaqKVeFpOHx8QZ.png",
    },
    {
      id: 4,
      name: "AuthShield",
      description:
        "A secure authentication library implementing modern security practices and protection against common attacks.",
      html_url: "https://github.com/mrx-arafat/AuthShield",
      topics: ["authentication", "javascript", "security"],
      language: "JavaScript",
      stargazers_count: 7,
      homepage: "https://authshield.io",
      preview_image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nMMJJ5qd2sfOOA1DzaqKVeFpOHx8QZ.png",
    },
  ]

  useEffect(() => {
    // Initialize audio elements with proper error handling
    try {
      clickSoundRef.current = new Audio()

      // Set sources after creating the elements
      if (clickSoundRef.current) {
        clickSoundRef.current.src = "/click.mp3"
        clickSoundRef.current.preload = "auto"
      }
    } catch (error) {
      console.error("Error initializing audio:", error)
    }

    // Add entrance animation class to body
    document.body.classList.add("animate-slideInRight")

    // Remove animation class after animation completes
    const timer = setTimeout(() => {
      document.body.classList.remove("animate-slideInRight")
    }, 500)

    // Attempt to fetch from GitHub API first
    fetch("https://api.github.com/users/mrx-arafat/repos?sort=updated&per_page=10")
      .then((response) => {
        if (!response.ok) {
          throw new Error("GitHub API rate limit exceeded or user not found")
        }
        return response.json()
      })
      .then((data) => {
        // Filter repos with descriptions and sort by stars
        const filteredRepos = data
          .filter((repo: GithubRepo) => repo.description)
          .sort((a: GithubRepo, b: GithubRepo) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6)

        // If API data exists, use it, otherwise use our predefined projects
        setProjects(filteredRepos.length > 0 ? filteredRepos : realProjects)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Using local project data:", error)
        // Use our predefined projects if GitHub API fails
        setProjects(realProjects)
        setLoading(false)
      })

    return () => {
      clearTimeout(timer)
      if (clickSoundRef.current) clickSoundRef.current.pause()
    }
  }, [])

  const playClickSound = () => {
    if (!isMuted && clickSoundRef.current) {
      try {
        clickSoundRef.current.currentTime = 0
        const playPromise = clickSoundRef.current.play()

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio playback prevented:", error)
            // Auto-play was prevented, we can safely ignore this error
          })
        }
      } catch (error) {
        console.error("Error playing sound:", error)
      }
    }
  }

  const nextProject = () => {
    playClickSound()
    setCurrentProject((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    playClickSound()
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length)
  }

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
    }

    return colors[language] || "#6e7681"
  }

  const openProjectLink = (url: string) => {
    playClickSound()
    window.open(url, "_blank")
  }

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Project Showcase</h1>
          <div className="flex gap-2">
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

        {loading ? (
          <div className="bg-[#1e272e] rounded-2xl p-12 flex flex-col items-center justify-center border border-[#2ed573]/20">
            <div className="w-12 h-12 border-4 border-[#2ed573] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#2ed573]/70">Loading projects...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="bg-[#1e272e] rounded-2xl overflow-hidden border border-[#2ed573]/20">
            <div className="p-6 border-b border-[#2ed573]/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{projects[currentProject].name}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: getLanguageColor(projects[currentProject].language) }}
                    ></div>
                    <span className="text-sm text-[#2ed573]/70">{projects[currentProject].language}</span>
                  </div>
                  <div className="flex items-center">
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
                      className="mr-1 text-[#2ed573]/70"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="text-sm text-[#2ed573]/70">{projects[currentProject].stargazers_count}</span>
                  </div>
                </div>
              </div>
              <p className="text-[#2ed573]/80 mb-6">{projects[currentProject].description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {projects[currentProject].topics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-[#0f0f0f] text-[#2ed573] rounded-full text-xs border border-[#2ed573]/20"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => openProjectLink(projects[currentProject].html_url)}
                  className="inline-flex items-center gap-2 bg-[#2ed573] hover:bg-[#2ed573]/80 text-[#0f0f0f] px-4 py-2 rounded-lg hover-glow"
                >
                  <Github size={16} />
                  View on GitHub
                </Button>

                {projects[currentProject].homepage && (
                  <Button
                    onClick={() => openProjectLink(projects[currentProject].homepage!)}
                    className="inline-flex items-center gap-2 bg-[#0f0f0f] hover:bg-[#2a3942] text-[#2ed573] border border-[#2ed573]/30 px-4 py-2 rounded-lg"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </Button>
                )}

                <Button
                  onClick={() => openProjectLink(`${projects[currentProject].html_url}/archive/refs/heads/main.zip`)}
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
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
                    src={projects[currentProject].preview_image || "/placeholder.svg"}
                    alt={`${projects[currentProject].name} preview`}
                    className="w-full h-full object-contain"
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
                  playClickSound()
                  setCurrentProject(index)
                }}
                className={`w-3 h-3 rounded-full mx-1 ${currentProject === index ? "bg-[#2ed573]" : "bg-[#1e272e]"}`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

