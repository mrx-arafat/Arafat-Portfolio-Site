"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { playClickSound, playKeyboardSound } from "@/utils/sound";

export default function Home() {
  const [isOn, setIsOn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const screens = [
    "Hi, I'm Arafat.",
    "Application Security Engineer at Startise.",
    "Aspiring Entrepreneur.",
    "Focued on creating impactful solutions.",
    "okay! that's enough :')",
    "Initialize System...",
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
        className={`w-full max-w-2xl h-48 bg-[#1e272e] rounded-lg p-6 font-mono relative overflow-hidden ${
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
            <span className="text-[#2ed573]/30">System is turned off...</span>
          )}
        </div>
      </div>

      {/* Turn on your sound text */}
      <div className="text-[#2ed573]/30 text-xs tracking-widest mt-6 flex items-center gap-2">
        TURN ON YOUR <Volume2 size={16} />
      </div>

      {/* Enter dashboard button */}
      <Button
        onClick={goToDashboard}
        className="mt-8 bg-[#121212] border border-[#2ed573] hover:bg-[#2ed573]/20 text-[#2ed573] flex items-center gap-2 hover-glow px-6 py-3"
      >
        <Terminal size={16} /> Initialize System
      </Button>
    </main>
  );
}
