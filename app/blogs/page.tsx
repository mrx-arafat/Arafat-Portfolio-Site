"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import blogsData from "@/data/blogs.json";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  readTime: string;
  url: string;
  imageUrl: string;
  tags: string[];
}

export default function Blogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentPost, setCurrentPost] = useState(0);
  const [isEntering, setIsEntering] = useState(true);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  // Blog posts data is now imported from JSON file

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

    const enterTimer = setTimeout(() => setIsEntering(false), 500);

    // Load blog posts from JSON data
    setTimeout(() => {
      setPosts(blogsData);
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(enterTimer);
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

  const nextPost = () => {
    playClickSound();
    setCurrentPost((prev) => (prev + 1) % posts.length);
  };

  const prevPost = () => {
    playClickSound();
    setCurrentPost((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const openBlogPost = (url: string) => {
    playClickSound();
    window.open(url, "_blank");
  };

  // Simple preloading for adjacent blog images
  useEffect(() => {
    if (posts.length > 0) {
      const preloadImage = (index: number) => {
        if (posts[index]?.imageUrl) {
          const img = new window.Image();
          img.src = posts[index].imageUrl;
        }
      };

      // Preload next and previous images
      const nextIndex = (currentPost + 1) % posts.length;
      const prevIndex = (currentPost - 1 + posts.length) % posts.length;

      if (posts.length > 1) {
        preloadImage(nextIndex);
        preloadImage(prevIndex);
      }
    }
  }, [currentPost, posts]);

  return (
    <main className={`min-h-screen bg-[#121212] text-[#2ed573] p-4 md:p-8 grid-dots overflow-hidden ${isEntering ? "animate-slideInRight" : ""}`}>
      {/* Terminal-style header */}
      <div className="mb-8 bg-[#0f0f0f] border border-[#2ed573]/30 rounded-lg p-3 shadow-[0_0_15px_rgba(46,213,115,0.2)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-2 text-[#2ed573]/70 text-xs">~/blogs</div>
        </div>

        <div className="flex items-center">
          <span className="text-[#2ed573] mr-2">$</span>
          <div className="relative">
            <span className="text-[#2ed573]">
              ./view_blogs.sh --display=latest
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
              BLOG_ARCHIVE
              <span className="text-[#2ed573]/70">]</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://medium.com/@easinxarafat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#0f0f0f] text-sm bg-[#2ed573] px-3 py-2 rounded-md transform transition-all hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(46,213,115,0.4)] border border-[#2ed573]"
              onClick={() => playClickSound()}
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline">View All On Medium</span>
              <span className="sm:hidden">All Posts</span>
            </a>

            <div className="flex gap-1">
              <Button
                onClick={prevPost}
                disabled={loading || posts.length === 0}
                className="w-9 h-9 p-0 rounded-md bg-[#1a1b26] hover:bg-[#2a3942] border border-[#2ed573]/20"
                aria-label="Previous post"
              >
                <ArrowLeft size={16} className="text-[#2ed573]" />
              </Button>
              <Button
                onClick={nextPost}
                disabled={loading || posts.length === 0}
                className="w-9 h-9 p-0 rounded-md bg-[#1a1b26] hover:bg-[#2a3942] border border-[#2ed573]/20"
                aria-label="Next post"
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
                $ loading_blogs.sh
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
                Decrypting content...
              </div>
            </div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Article image */}
            <div
              className="md:col-span-1 h-[300px] md:h-[400px] bg-[#1a1b26] rounded-lg overflow-hidden cursor-pointer relative group shadow-[0_0_15px_rgba(46,213,115,0.1)] border border-[#2ed573]/10"
              onClick={() => openBlogPost(posts[currentPost].url)}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f0f]/50 z-10">
                {posts[currentPost].imageUrl ? (
                  <img
                    src={posts[currentPost].imageUrl || "/placeholder.svg"}
                    alt={`${posts[currentPost].title} preview`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full bg-[#1a1b26] text-[#2ed573]/30">
                    <BookOpen size={64} className="mb-2" />
                    <span className="text-sm">No preview available</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/90 via-[#0f0f0f]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity z-20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-[#0f0f0f]/70 px-2 py-1 rounded text-xs text-[#2ed573]/80">
                    <Calendar size={12} />
                    <span>{posts[currentPost].publishDate}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#0f0f0f]/70 px-2 py-1 rounded text-xs text-[#2ed573]/80">
                    <Clock size={12} />
                    <span>{posts[currentPost].readTime}</span>
                  </div>
                </div>
                <div className="font-mono text-xs text-[#2ed573]/60 mb-1">
                  $ cat article.md
                </div>
              </div>
              <div className="absolute top-4 right-4 z-30">
                <div className="bg-[#0f0f0f]/70 text-[#2ed573] px-2 py-1 rounded text-xs border border-[#2ed573]/20 flex items-center gap-1">
                  <ExternalLink size={10} />
                  <span>Click to read</span>
                </div>
              </div>
            </div>

            {/* Right column - Article content */}
            <div className="md:col-span-2 bg-[#1a1b26] rounded-lg p-6 border border-[#2ed573]/10 shadow-[0_0_15px_rgba(46,213,115,0.1)] flex flex-col justify-between h-[300px] md:h-[400px]">
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#2ed573]/40"></div>
                  <div className="text-[#2ed573]/60 text-xs font-mono">
                    ARTICLE #{currentPost + 1}
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3 text-[#2ed573]">
                  {posts[currentPost].title}
                </h2>
                <p className="text-[#2ed573]/80 mb-4 text-sm md:text-base">
                  {posts[currentPost].description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {posts[currentPost].tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[#0f0f0f] text-[#2ed573]/80 rounded text-xs border border-[#2ed573]/10 hover:border-[#2ed573]/30 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  onClick={() => openBlogPost(posts[currentPost].url)}
                  className="inline-flex items-center gap-2 bg-[#2ed573] hover:bg-[#2ed573]/90 text-[#0f0f0f] px-4 py-2 rounded-md hover:translate-y-[-2px] transition-all hover:shadow-[0_5px_15px_rgba(46,213,115,0.4)]"
                >
                  <BookOpen size={16} />
                  <span className="font-medium">Read Full Article</span>
                </Button>

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(posts[currentPost].url);
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

                <Button
                  onClick={() => {
                    const text = `Check out this article: ${posts[currentPost].title} - ${posts[currentPost].url}`;
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        text
                      )}`,
                      "_blank"
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
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                  <span className="text-sm">Share</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1b26] rounded-lg p-8 flex flex-col items-center justify-center border border-[#2ed573]/20 shadow-[0_0_15px_rgba(46,213,115,0.1)]">
            <div className="font-mono text-[#2ed573]/70 text-sm mb-4">
              $ cat /dev/blogs
            </div>
            <div className="bg-[#0f0f0f] p-4 rounded-md border border-[#2ed573]/10 mb-6 w-full max-w-md">
              <div className="text-[#2ed573]/80 font-mono text-sm mb-2">
                Error: No blog posts found
              </div>
              <div className="text-[#2ed573]/50 font-mono text-xs">
                Unable to establish connection with Medium API
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

        {posts.length > 0 && (
          <div className="mt-8 bg-[#1a1b26] rounded-lg p-4 border border-[#2ed573]/10 shadow-[0_0_15px_rgba(46,213,115,0.1)]">
            {/* Desktop pagination */}
            <div className="hidden md:flex items-center justify-between">
              <div className="text-[#2ed573]/60 text-xs font-mono">
                $ navigate_posts.sh
              </div>
              <div className="flex items-center gap-1">
                {posts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      playClickSound();
                      setCurrentPost(index);
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-md mx-0.5 transition-colors ${
                      currentPost === index
                        ? "bg-[#2ed573] text-[#0f0f0f] font-medium"
                        : "bg-[#0f0f0f] text-[#2ed573]/70 hover:bg-[#0f0f0f]/80 hover:text-[#2ed573]"
                    }`}
                    aria-label={`Go to post ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="text-[#2ed573]/60 text-xs font-mono">
                {currentPost + 1}/{posts.length}
              </div>
            </div>

            {/* Mobile pagination - simplified */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[#2ed573]/60 text-xs font-mono">
                  $ navigate_posts.sh
                </div>
                <div className="text-[#2ed573]/60 text-xs font-mono">
                  {currentPost + 1}/{posts.length}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  onClick={prevPost}
                  disabled={posts.length <= 1}
                  className="bg-[#0f0f0f] hover:bg-[#1e272e] text-[#2ed573] border border-[#2ed573]/30 px-4 py-2 rounded-md transition-colors flex-1 mr-2"
                >
                  <div className="flex items-center justify-center">
                    <ArrowLeft size={16} className="mr-2" />
                    <span>Previous</span>
                  </div>
                </Button>

                <Button
                  onClick={nextPost}
                  disabled={posts.length <= 1}
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
