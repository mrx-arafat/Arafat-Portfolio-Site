import { useCallback } from "react";

export const useClickSound = () => {
  const playClickSound = useCallback(() => {
    const audio = new Audio("/sounds/click.mp3");
    audio.volume = 0.5;
    audio.play().catch(console.error);
  }, []);

  return { playClickSound };
};
