"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactElement, type ReactNode } from "react";
import { resolveMotionPreference, type MotionPreference } from "./motion-preference";

const STORAGE_KEY = "open-circuit-motion";
const CHANGE_EVENT = "open-circuit-motion-change";
let fallbackPreference: string | null = null;
interface MotionContextValue { motion: MotionPreference; isMotionEnabled: boolean; toggleMotion: () => void }
const MotionContext = createContext<MotionContextValue | null>(null);

function snapshot(): MotionPreference {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (fallbackPreference !== null) return resolveMotionPreference(fallbackPreference, reduced);
  try { return resolveMotionPreference(localStorage.getItem(STORAGE_KEY), reduced); }
  catch { return resolveMotionPreference(fallbackPreference, reduced); }
}
function subscribe(notify: () => void): () => void {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.addEventListener("storage", notify);
  window.addEventListener(CHANGE_EVENT, notify);
  query.addEventListener("change", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(CHANGE_EVENT, notify);
    query.removeEventListener("change", notify);
  };
}
const serverSnapshot = (): MotionPreference => "on";

/** Persist the animation preference and mirror its effective state to the document. */
export function MotionProvider({ children }: { children: ReactNode }): ReactElement {
  const motion = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  useEffect(() => { document.documentElement.dataset.motion = motion === "on" ? "on" : "off"; }, [motion]);
  const toggleMotion = useCallback(() => {
    if (snapshot() === "reduced") return;
    const next = snapshot() === "on" ? "off" : "on";
    try { localStorage.setItem(STORAGE_KEY, next); fallbackPreference = null; } catch { fallbackPreference = next; }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);
  const value = useMemo(() => ({ motion, isMotionEnabled: motion === "on", toggleMotion }), [motion, toggleMotion]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

/** Read the motion preference inside the sitewide MotionProvider. */
export function useMotion(): MotionContextValue {
  const value = useContext(MotionContext);
  if (!value) throw new Error("useMotion requires MotionProvider");
  return value;
}

/** Pause all animation without overriding the operating system's reduced-motion setting. */
export function MotionToggle(): ReactElement {
  const { motion, toggleMotion } = useMotion();
  const label = motion === "on" ? "Motion: on" : motion === "off" ? "Motion: paused" : "Motion: reduced";
  return <button type="button" className="oc-control oc-motion-control" aria-pressed={motion !== "on"} disabled={motion === "reduced"} onClick={toggleMotion} aria-label={`${label}, ${motion === "reduced" ? "operating system preference" : motion === "on" ? "click to pause" : "click to resume"}`}><span className="oc-motion-symbol" aria-hidden="true" /><span className="oc-motion-label">{label}</span></button>;
}
