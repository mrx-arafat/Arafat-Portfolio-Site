"use client";

import { useRef, useState, useSyncExternalStore, type ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useMusicContext } from "@/components/music-provider";
import { MotionToggle } from "@/components/open-circuit/motion-provider";

const NAV_LINKS = [{ href: "/about", label: "about" }, { href: "/featured", label: "featured" }, { href: "/projects", label: "projects" }, { href: "/security-research", label: "security" }, { href: "/articles", label: "articles" }, { href: "/contact", label: "contact" }] as const;
const subscribeToNothing = (): (() => void) => () => {};
const clientIsHydrated = (): boolean => true;
const serverIsHydrated = (): boolean => false;

/** Keep the operating mode and accessible site controls available on every route. */
export function SiteNav(): ReactElement {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(subscribeToNothing, clientIsHydrated, serverIsHydrated);
  const { resolvedTheme, setTheme } = useTheme();
  const { isMuted, toggleMute } = useMusicContext();
  const light = mounted && resolvedTheme === "light";
  return (
    <header className="site-header oc-site-header" onKeyDown={event => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        menu.current?.focus();
      }
    }}>
      <div className="oc-shell oc-header-inner">
        <Link href="/" className="oc-brand">
          <span className="oc-brand-address">arafat@ops:~<span className="oc-brand-path">/dashboard</span><span className="oc-cursor" aria-hidden="true" /></span>
        </Link>
        <div className="oc-header-controls">
          <MotionToggle />
          <button type="button" className="oc-control oc-icon-control" onClick={toggleMute} aria-label={isMuted ? "Sound: off - enable music" : "Sound: on - mute music"} aria-pressed={!isMuted}>
            {isMuted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          </button>
          <button type="button" className="oc-control oc-icon-control" onClick={() => setTheme(light ? "dark" : "light")} aria-label={light ? "Theme: light - switch to dark" : "Theme: dark - switch to light"} aria-pressed={light}>
            {light ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
        </div>
        <button ref={menu} type="button" className="oc-control oc-menu-control" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>Menu</button>
        <nav id="site-navigation" className={open ? "oc-header-nav oc-is-open" : "oc-header-nav"} aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href || pathname.startsWith(link.href + "/") ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
