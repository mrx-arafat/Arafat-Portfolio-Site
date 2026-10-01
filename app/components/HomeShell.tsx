"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactElement,
  type ReactNode,
} from "react";
import HomeClient from "./HomeClient";
import DashboardClient from "./DashboardClient";

const BOOT_FLAG = "arafat-booted";

/** Whether this tab already booted or the URL asks to skip the show. Always false on the server. */
function readSkipBoot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      new URLSearchParams(window.location.search).get("boot") === "1" ||
      sessionStorage.getItem(BOOT_FLAG) === "1"
    );
  } catch {
    // sessionStorage unavailable (e.g. blocked storage) - keep the show
    return false;
  }
}

/** The skip decision is read once per mount, so there is nothing to listen for. */
const subscribeToNothing = (): (() => void) => () => {};
const serverSkipBoot = (): boolean => false;

/**
 * Root shell: the dashboard is always in the DOM (server-rendered HTML,
 * fully visible to crawlers); the boot overlay sits on top until the
 * 4s auto-boot finishes or the visitor clicks through.
 *
 * The boot sequence plays once per tab: completing it sets a
 * sessionStorage flag, and later visits (or a `?boot=1` URL) skip straight
 * to the dashboard. An inline script in page.tsx hides the overlay
 * pre-hydration so it never flashes; React drops it right after hydration.
 * Reading the query string here, not from server searchParams, keeps the
 * route static and edge-cacheable.
 *
 * `caseStudies` and `latestPosts` are server-rendered panels from page.tsx,
 * passed through as slots so they ship as HTML and add no client JS.
 */
export default function HomeShell({
  caseStudies,
  latestPosts,
}: {
  caseStudies: ReactNode;
  latestPosts: ReactNode;
}): ReactElement {
  // Skip the show if this tab already booted or the URL asks to. The answer
  // is read once per mount and only applied after hydration: the server HTML
  // always contains the overlay, so the hydration render has to as well.
  const [skipBootOnClient] = useState(readSkipBoot);
  const skipBoot = useSyncExternalStore(
    subscribeToNothing,
    () => skipBootOnClient,
    serverSkipBoot
  );
  const [entered, setEntered] = useState(false);
  const booted = entered || skipBoot;

  // Lock page scroll while the boot overlay covers the dashboard.
  useEffect(() => {
    if (booted || document.documentElement.hasAttribute("data-booted")) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [booted]);

  const handleEnter = () => {
    try {
      sessionStorage.setItem(BOOT_FLAG, "1");
    } catch {
      // best effort - the show just replays next time
    }
    setEntered(true);
  };

  return (
    <>
      <DashboardClient caseStudies={caseStudies} latestPosts={latestPosts} />
      {!booted && <HomeClient onEnter={handleEnter} />}
    </>
  );
}
