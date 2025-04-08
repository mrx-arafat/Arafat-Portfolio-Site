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

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentPost, setCurrentPost] = useState(0);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  // Sample blog posts with more details
  const samplePosts = [
    {
      id: "1",
      title:
        "A Pound of Flesh: The Hidden Math Behind History's Most Infamous Loan",
      description:
        "Exploring the mathematical and historical aspects of one of history's most famous loans.",
      publishDate: "2024",
      readTime: "3 min read",
      url: "https://medium.com/@easinxarafat/a-pound-of-flesh-the-hidden-math-behind-historys-most-infamous-loan-6b1292cdd0be",
      imageUrl:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/0*2FoFS4Ls8oDXc0BW.jpg",
      tags: ["Finance", "Money", "Loan", "Lending", "Shakespeare"],
    },
    {
      id: "2",
      title:
        "CVE-2024-4358 Critical Flaw Found in Progress Telerik Report Server",
      description:
        "Analysis of a critical security vulnerability discovered in Progress Telerik Report Server.",
      publishDate: "2024",
      readTime: "2 min read",
      url: "https://medium.com/@easinxarafat/cve-2024-4358-critical-flaw-found-in-progress-telerik-report-server-0f379f844819",
      imageUrl:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*VcVd55_omagFT7jqxnaK9Q.png",
      tags: ["Cybersecurity", "CVE"],
    },
    {
      id: "3",
      title: "Understanding Dopamine: Your Brain's Motivation Engine",
      description:
        "Exploring the role of dopamine in motivation and how understanding it can improve productivity and life quality.",
      publishDate: "2024",
      readTime: "4 min read",
      url: "https://medium.com/@easinxarafat/understanding-dopamine-your-brains-motivation-engine-50b4d6d140a3",
      imageUrl:
        "https://miro.medium.com/v2/resize:fit:4800/format:webp/0*7pRQ1jIgUvyv-eO4.jpg",
      tags: ["Self Improvement", "Dopamine Detox", "Productivity", "Life"],
    },

    {
      id: "4",
      title: "How I Learned to Turn Dreams into Action",
      description:
        "Personal insights on transforming aspirations into concrete achievements.",
      publishDate: "2024",
      readTime: "2 min read",
      url: "https://medium.com/@easinxarafat/how-i-learned-to-turn-dreams-into-action-c6b1b2977bdc",
      imageUrl: "https://miro.medium.com/v2/format:webp/0*8soO8Po_PYnyok1D.jpg",
      tags: ["Self Development", "Mindset"],
    },
    {
      id: "5",
      title:
        "The Psychology Behind Social Media Posts: What We're Really Saying When We Post",
      description:
        "Analyzing the deeper psychological motivations behind social media behavior.",
      publishDate: "2024",
      readTime: "3 min read",
      url: "https://medium.com/@easinxarafat/the-psychology-behind-social-media-posts-what-were-really-saying-when-we-post-57855ba14667",
      imageUrl:
        "https://miro.medium.com/v2/resize:fit:640/format:webp/0*sntwdiLz_d-RsuSv.jpeg",
      tags: ["Psychology", "Social Media", "Life", "Reality", "Facts"],
    },
    {
      id: "6",
      title: "The Weight of Words: When Listening Becomes a One-Way Street",
      description:
        "Exploring the dynamics of communication and the importance of active listening.",
      publishDate: "2024",
      readTime: "7 min read",
      url: "https://medium.com/@easinxarafat/the-weight-of-words-when-listening-becomes-a-one-way-street-24edafb0631b",
      imageUrl:
        "https://miro.medium.com/v2/resize:fit:4800/format:webp/0*o3I_Cj7tFaME2I19.jpg",
      tags: ["Psychology", "Human Behavior"],
    },
    {
      id: "7",
      title: "That One Introspective Girl (My Girl)",
      description: "A personal reflection on love and relationships.",
      publishDate: "2024",
      readTime: "3 min read",
      url: "https://medium.com/@easinxarafat/that-one-introspective-girl-1b25ced83477",
      imageUrl:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/0*N6Ac81f0k8y9wsXS.jpg",
      tags: ["Love", "My Girl"],
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

    // In a real application, you would fetch from Medium API
    // For now, we'll use the sample data
    setTimeout(() => {
      setPosts(samplePosts);
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
          <h1 className="text-3xl font-bold">My Blog Posts</h1>
          <div className="flex items-center gap-4">
            <a
              href="https://medium.com/@easinxarafat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#2ed573] hover:text-[#2ed573]/80"
              onClick={playClickSound}
            >
              <BookOpen size={18} />
              Read All Blogs On Medium
            </a>

            <div className="flex gap-2">
              <Button
                onClick={prevPost}
                disabled={loading || posts.length === 0}
                className="w-10 h-10 p-0 rounded-full bg-[#1e272e] hover:bg-[#2a3942] border border-[#2ed573]/20"
                aria-label="Previous post"
              >
                <ArrowLeft size={18} className="text-[#2ed573]" />
              </Button>
              <Button
                onClick={nextPost}
                disabled={loading || posts.length === 0}
                className="w-10 h-10 p-0 rounded-full bg-[#1e272e] hover:bg-[#2a3942] border border-[#2ed573]/20"
                aria-label="Next post"
              >
                <ArrowRight size={18} className="text-[#2ed573]" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#1e272e] rounded-2xl p-12 flex flex-col items-center justify-center border border-[#2ed573]/20">
            <div className="w-12 h-12 border-4 border-[#2ed573] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#2ed573]/70">Loading blog posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="bg-[#1e272e] rounded-2xl overflow-hidden border border-[#2ed573]/20">
            <div className="p-6 border-b border-[#2ed573]/10">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">
                  {posts[currentPost].title}
                </h2>
                <p className="text-[#2ed573]/80 mb-6">
                  {posts[currentPost].description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {posts[currentPost].tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[#0f0f0f] text-[#2ed573] rounded-full text-xs border border-[#2ed573]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-[#2ed573]/70 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span className="text-sm">
                      {posts[currentPost].publishDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span className="text-sm">
                      {posts[currentPost].readTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => openBlogPost(posts[currentPost].url)}
                  className="inline-flex items-center gap-2 bg-[#2ed573] hover:bg-[#2ed573]/80 text-[#0f0f0f] px-4 py-2 rounded-lg hover-glow"
                >
                  <BookOpen size={16} />
                  Read Full Article
                </Button>

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(posts[currentPost].url);
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
                    const text = `Check out this article: ${posts[currentPost].title} - ${posts[currentPost].url}`;
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
                <ExternalLink size={18} />
                Article Preview
              </h3>
              <div className="aspect-video bg-[#1e272e] rounded-lg flex items-center justify-center border border-[#2ed573]/20 overflow-hidden">
                {posts[currentPost].imageUrl ? (
                  <img
                    src={posts[currentPost].imageUrl || "/placeholder.svg"}
                    alt={`${posts[currentPost].title} preview`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#2ed573]/30">
                    <BookOpen size={64} className="mb-2" />
                    <span>No preview available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1e272e] rounded-2xl p-12 flex flex-col items-center justify-center border border-[#2ed573]/20">
            <BookOpen size={64} className="text-[#2ed573]/20 mb-4" />
            <p className="text-[#2ed573]/70 mb-2">No blog posts found</p>
            <p className="text-[#2ed573]/50 text-sm text-center mb-6">
              We couldn't load your Medium blog posts at this time.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#2ed573] hover:bg-[#2ed573]/80 text-[#0f0f0f] hover-glow"
            >
              Try Again
            </Button>
          </div>
        )}

        {posts.length > 0 && (
          <div className="flex justify-center mt-8">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  playClickSound();
                  setCurrentPost(index);
                }}
                className={`w-3 h-3 rounded-full mx-1 ${
                  currentPost === index ? "bg-[#2ed573]" : "bg-[#1e272e]"
                }`}
                aria-label={`Go to post ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
