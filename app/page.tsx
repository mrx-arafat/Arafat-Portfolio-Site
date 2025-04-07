"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isOn, setIsOn] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const typingSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements with proper error handling
    try {
      clickSoundRef.current = new Audio();
      typingSoundRef.current = new Audio();

      // Set sources after creating the elements
      if (clickSoundRef.current) {
        clickSoundRef.current.src = "/click.mp3";
        clickSoundRef.current.preload = "auto";
      }

      if (typingSoundRef.current) {
        typingSoundRef.current.src = "/typing.mp3";
        typingSoundRef.current.preload = "auto";
      }
    } catch (error) {
      console.error("Error initializing audio:", error);
    }

    return () => {
      // Clean up audio elements
      if (clickSoundRef.current) clickSoundRef.current.pause();
      if (typingSoundRef.current) typingSoundRef.current.pause();
    };
  }, []);

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
      // Play typing sound if not muted
      if (!isMuted && typingSoundRef.current) {
        try {
          typingSoundRef.current.currentTime = 0;
          const playPromise = typingSoundRef.current.play();

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
  }, [isOn, currentScreen, screens.length, isMuted]);

  const handleToggle = () => {
    // Play click sound if not muted
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

    if (!isOn) {
      setIsOn(true);
      setCurrentScreen(0);
    } else {
      setIsOn(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const goToDashboard = () => {
    // Play click sound if not muted
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

    setIsRedirecting(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center bg-[#121212] relative overflow-hidden grid-dots ${
        isRedirecting ? "animate-glitch" : ""
      }`}
    >
      {/* Sound toggle button */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 text-[#2ed573]/50 hover:text-[#2ed573] transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Hanging wire */}
      <div className="w-[2px] h-[120px] bg-[#2ed573] relative">
        <div className="absolute w-[2px] h-[40px] bg-[#2ed573] top-[80px] left-0">
          <div className="absolute w-[10px] h-[2px] bg-[#2ed573] top-[8px] left-[-4px]"></div>
          <div className="absolute w-[10px] h-[2px] bg-[#2ed573] top-[16px] left-[-4px]"></div>
          <div className="absolute w-[10px] h-[2px] bg-[#2ed573] top-[24px] left-[-4px]"></div>
          <div className="absolute w-[10px] h-[2px] bg-[#2ed573] top-[32px] left-[-4px]"></div>
        </div>
        <div className="absolute w-[6px] h-[6px] rounded-full bg-[#ffdd59] bottom-[-3px] left-[-2px]"></div>
      </div>

      {/* Device */}
      <div className="w-[280px] h-[320px] bg-[#1e272e] rounded-[20px] relative flex flex-col items-center p-4 shadow-lg border border-[#2ed573]/30">
        {/* Top dots */}
        <div className="flex justify-between w-full px-2">
          <div className="w-[8px] h-[8px] rounded-full bg-[#2ed573]/50"></div>
          <div className="w-[8px] h-[8px] rounded-full bg-[#2ed573]/50"></div>
        </div>

        {/* Screen */}
        <div className="w-[220px] h-[120px] bg-[#0f0f0f] mt-6 rounded-[10px] flex items-center justify-center overflow-hidden border border-[#2ed573]/20">
          <div
            className={`text-[#2ed573] text-center px-4 transition-opacity duration-500 ${
              isOn ? "opacity-100 terminal-text" : "opacity-0"
            } ${isAnimating ? "opacity-0" : "opacity-100"}`}
          >
            {isOn ? screens[currentScreen] : ""}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleToggle}
          className={`w-[60px] h-[60px] rounded-full mt-6 flex items-center justify-center transition-all duration-300 ${
            isOn ? "bg-[#ffdd59]" : "bg-[#2f3542]"
          } hover-scale`}
          aria-label="Toggle device"
        >
          <div className="w-[50px] h-[50px] rounded-full bg-[#1e272e] flex items-center justify-center">
            <div
              className={`w-[40px] h-[40px] rounded-full ${
                isOn ? "bg-[#2ed573]" : "bg-[#747d8c]"
              } flex items-center justify-center`}
            >
              <div className="w-[20px] h-[20px] rounded-full bg-[#1e272e]"></div>
            </div>
          </div>
        </button>

        {/* Bottom dots */}
        <div className="flex justify-between w-full px-2 mt-auto">
          <div className="w-[8px] h-[8px] rounded-full bg-[#2ed573]/50"></div>
          <div className="w-[8px] h-[8px] rounded-full bg-[#2ed573]/50"></div>
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
