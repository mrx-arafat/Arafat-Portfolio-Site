"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { playClickSound, playKeyboardSound } from "@/utils/sound";

export default function Home() {
  const [isOn, setIsOn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const screens = [
    "Hi, I'm Arafat",
    "Application Security Engineer at Startise",
    "Aspiring Entrepreneur",
    "Focued on creating impactful solutions",
    "okay! that's enough :')",
    "Let's Initialize the Dashboard...",
  ];

  useEffect(() => {
    if (isOn) {
      playKeyboardSound();
      const timer = setTimeout(() => {
        if (currentScreen < screens.length - 1) {
          setIsAnimating(true);
          setTimeout(() => {
            setCurrentScreen(currentScreen + 1);
            setIsAnimating(false);
          }, 500);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOn, currentScreen, screens.length]);

  const handleToggle = () => {
    playClickSound();
    if (!isOn) {
      setIsOn(true);
      setCurrentScreen(0);
    } else {
      setIsOn(false);
    }
  };

  const goToDashboard = () => {
    playClickSound();
    setIsRedirecting(true);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#1a1b26] text-white flex flex-col items-center justify-center p-8 relative">
      {/* Power button */}
      <button
        onClick={handleToggle}
        className={`w-16 h-16 rounded-full border-4 ${
          isOn ? "border-[#2ed573]" : "border-[#2ed573]/30"
        } flex items-center justify-center mb-8 transition-colors duration-300 hover:border-[#2ed573]`}
      >
        <div
          className={`w-8 h-8 rounded-full ${
            isOn ? "bg-[#2ed573]" : "bg-[#2ed573]/30"
          } transition-colors duration-300`}
        />
      </button>

      {/* Terminal screen */}
      <div
        className={`w-full max-w-2xl h-48 bg-[#1e272e] rounded-lg p-6 font-mono relative overflow-hidden border border-[#2ed573]/10 shadow-[0_0_30px_rgba(46,213,115,0.08)] ${
          isAnimating ? "animate-glitch" : ""
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-[#2ed573] text-lg">
          {isOn ? (
            <>
              <span className="text-[#2ed573]/50">{">"}</span>{" "}
              {screens[currentScreen]}
              <span className="animate-blink">_</span>
            </>
          ) : (
            <span className="text-[#2ed573]/30">Turn on the terminal...</span>
          )}
        </div>
      </div>

      {/* Turn on your sound text */}
      <div className="text-[#2ed573]/30 text-xs tracking-widest mt-6 flex items-center gap-2">
        TURN ON YOUR <Volume2 size={16} />
      </div>

      {/* Enter dashboard button with enhanced visual cues */}
      <div className="relative mt-8 mb-4">
        {/* Pulsing glow background */}
        <div className="absolute inset-0 bg-[#2ed573]/10 blur-xl rounded-lg animate-pulse" />

        {/* Animated pointer arrows */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 animate-bounce">
          <span className="text-[#2ed573] text-2xl font-mono">→</span>
          <span className="text-[#2ed573] text-2xl font-mono">→</span>
        </div>
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 animate-bounce">
          <span className="text-[#2ed573] text-2xl font-mono">←</span>
          <span className="text-[#2ed573] text-2xl font-mono">←</span>
        </div>

        <Button
          onClick={goToDashboard}
          className="relative bg-[#151620] border-2 border-[#2ed573]/50 hover:border-[#2ed573] hover:bg-[#2ed573]/10 text-[#2ed573] flex items-center gap-3 px-8 py-4 font-mono tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(46,213,115,0.2)] hover:shadow-[0_0_25px_rgba(46,213,115,0.4)] hover:scale-105 group overflow-hidden"
        >
          {/* Animated border glow effect */}
          <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2ed573]/20 to-transparent animate-shimmer" />
          </div>

          <span className="relative z-10 text-[#2ed573] text-lg group-hover:animate-pulse">{'>_'}</span>
          <span className="relative z-10 text-base">Initialize Dashboard</span>

          {/* Blinking cursor indicator */}
          <span className="relative z-10 animate-blink text-lg">|</span>
        </Button>
      </div>

      {/* Enhanced instruction text - classy terminal style */}
      <div className="text-center space-y-3 mt-2">
        <div className="text-[#2ed573] text-base font-mono tracking-wide flex items-center justify-center gap-3">
          <span className="text-[#2ed573]/60">[</span>
          <span className="font-bold">CLICK TO ENTER</span>
          <span className="text-[#2ed573]/60">]</span>
        </div>
        <div className="text-[#2ed573]/70 text-sm font-mono animate-slow-blink">
          <span className="text-[#2ed573]/50">&gt;</span> Welcome to My Portfolio
        </div>
      </div>

      {/* Prefetch dashboard for faster navigation */}
      <Link href="/dashboard" prefetch={true} className="hidden" aria-hidden="true" />
    </main>
  );
}
