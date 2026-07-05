"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/about", label: "about" },
  { href: "/featured", label: "featured" },
  { href: "/projects", label: "projects" },
  { href: "/security-research", label: "security" },
  { href: "/articles", label: "articles" },
  { href: "/contact", label: "contact" },
] as const;

/** Persistent terminal-window site header. Hidden on the boot screen (/). */
export function SiteNav(): React.ReactElement | null {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Boot screen keeps its immersive intro — no chrome.
  if (pathname === "/") return null;

  const isActive = (href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);

  const activeLabel =
    NAV_LINKS.find((l) => isActive(l.href))?.label ?? "dashboard";

  return (
    <header className="sticky top-0 z-50 font-mono">
      {/* Top scan line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-terminal-green/70 to-transparent" />

      <div className="border-b border-terminal-green/20 bg-surface-deep/95 backdrop-blur supports-[backdrop-filter]:bg-surface-deep/80 shadow-[0_4px_30px_rgba(46,213,115,0.07)]">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-6xl items-stretch justify-between px-4 md:px-8"
        >
          {/* Brand: terminal prompt */}
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 py-3 text-sm"
          >
            {/* Traffic lights */}
            <span className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80 transition-colors group-hover:bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/80 transition-colors group-hover:bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28ca41]/80 transition-colors group-hover:bg-[#28ca41]" />
            </span>
            <span className="text-terminal-green/50 hidden sm:inline">|</span>
            <span className="flex items-baseline gap-0">
              <span className="text-terminal-soft/80">arafat</span>
              <span className="text-terminal-green/40">@</span>
              <span className="text-terminal-green/80">ops</span>
              <span className="text-terminal-green/40">:</span>
              <span className="text-terminal-green/60">~/{activeLabel}</span>
              <span className="ml-1 inline-block w-[7px] animate-blink bg-terminal-green/80 text-transparent">
                _
              </span>
            </span>
          </Link>

          {/* Desktop links — command tabs */}
          <div className="hidden items-stretch md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center px-3.5 text-xs tracking-wider transition-all duration-200 ${
                    active
                      ? "text-terminal-green bg-terminal-green/[0.07]"
                      : "text-terminal-green/50 hover:text-terminal-green hover:bg-terminal-green/[0.04]"
                  }`}
                >
                  <span
                    className={`mr-1 transition-opacity ${
                      active ? "text-terminal-green/60 opacity-100" : "opacity-0"
                    }`}
                  >
                    ./
                  </span>
                  {link.label}
                  {/* Active underline beam */}
                  <span
                    className={`absolute inset-x-2 bottom-0 h-[2px] rounded-full transition-all duration-300 ${
                      active
                        ? "bg-terminal-green shadow-[0_0_8px_rgba(46,213,115,0.8)]"
                        : "bg-transparent"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Status cluster */}
            <div className="ml-4 hidden items-center gap-2 border-l border-terminal-green/15 pl-4 lg:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-green opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-terminal-green" />
              </span>
              <span className="text-[10px] tracking-widest text-terminal-green/50">
                ONLINE
              </span>
              <span
                className="w-[70px] text-[10px] tabular-nums tracking-widest text-terminal-green/35"
                suppressHydrationWarning
              >
                {time}
              </span>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="my-2.5 self-center rounded-md border border-terminal-green/25 bg-terminal-green/5 p-2 text-terminal-green md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-b border-terminal-green/15 bg-surface-deep/95 px-4 pb-4 pt-2 backdrop-blur md:hidden">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2.5 text-sm ${
                  active
                    ? "bg-terminal-green/10 text-terminal-green"
                    : "text-terminal-green/60 hover:text-terminal-green"
                }`}
              >
                <span className="text-terminal-green/40">$ cd </span>
                {link.label}
                {active && <span className="animate-blink ml-1">_</span>}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
