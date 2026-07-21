"use client";

import { useEffect, useState } from "react";
import HomeClient from "./HomeClient";
import DashboardClient from "./DashboardClient";

const BOOT_FLAG = "arafat-booted";

/**
 * Root shell: the dashboard is always in the DOM (server-rendered HTML,
 * fully visible to crawlers); the boot overlay sits on top until the
 * 4s auto-boot finishes or the visitor clicks through.
 *
 * The boot sequence plays once per tab: completing it sets a
 * sessionStorage flag, and later visits skip straight to the dashboard
 * (an inline script in page.tsx hides the overlay pre-hydration so it
 * never flashes).
 */
export default function HomeShell() {
  const [booted, setBooted] = useState(false);

  // Skip the show if this tab already booted.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(BOOT_FLAG) === "1") setBooted(true);
    } catch {
      // sessionStorage unavailable (e.g. blocked storage) - keep the show
    }
  }, []);

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
    setBooted(true);
  };

  return (
    <>
      <DashboardClient />
      {!booted && <HomeClient onEnter={handleEnter} />}
    </>
  );
}
