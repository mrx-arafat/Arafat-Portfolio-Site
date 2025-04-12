import { useEffect, useRef } from "react";
import { playKeyboardSound } from "@/utils/sound";

export function useKeyboardSound() {
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleKeyDown = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      if (
        keyboardEvent.key.length === 1 || // Printable characters
        keyboardEvent.key === "Backspace" ||
        keyboardEvent.key === "Enter" ||
        keyboardEvent.key === " "
      ) {
        playKeyboardSound();
      }
    };

    element.addEventListener("keydown", handleKeyDown);
    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return ref;
}
