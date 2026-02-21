"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  playBackgroundMusic,
  pauseBackgroundMusic,
  getMusicMutedPreference,
} from "@/utils/sound";

interface MusicContextValue {
  isMuted: boolean;
  toggleMute: () => void;
}

const MusicContext = createContext<MusicContextValue>({
  isMuted: true,
  toggleMute: () => {},
});

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const hasInteracted = useRef(false);
  const initialized = useRef(false);

  // Read saved preference on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setIsMuted(getMusicMutedPreference());
  }, []);

  // Start music on first user interaction if not muted
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (hasInteracted.current) return;
      hasInteracted.current = true;

      if (!getMusicMutedPreference()) {
        playBackgroundMusic();
      }

      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (newMuted) {
        pauseBackgroundMusic();
      } else {
        playBackgroundMusic();
        hasInteracted.current = true;
      }
      localStorage.setItem("music-muted", newMuted ? "true" : "false");
      return newMuted;
    });
  }, []);

  return (
    <MusicContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  return useContext(MusicContext);
}
