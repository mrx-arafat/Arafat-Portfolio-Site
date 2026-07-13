"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/about", label: "about" },
  { href: "/featured", label: "featured" },
  { href: "/projects", label: "projects" },
  { href: "/security-research", label: "security" },
  { href: "/articles", label: "articles" },
  { href: "/contact", label: "contact" },
] as const;

/** Persistent site header. Hidden on the boot screen (/). */
export function SiteNav(): React.ReactElement | null {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Boot screen keeps its immersive intro — no chrome.
  if (pathname === "/") return null;

  const isActive = (href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);

  const activeLabel =
    NAV_LINKS.find((l) => isActive(l.href))?.label ?? "dashboard";

  return (
    <header className="site-header sticky top-0 z-50 border-b border-terminal-green/[0.12] bg-surface-deep/90 font-mono backdrop-blur supports-[backdrop-filter]:bg-surface-deep/70">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4 md:px-8"
      >
        {/* Wordmark — mirrors the current route, the one real terminal cue */}
        <Link
          href="/dashboard"
          aria-label="Go to dashboard"
          className="shrink-0 text-sm tracking-tight text-terminal-green/90 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/50"
        >
          <span className="font-semibold">arafat</span>
          <span className="text-terminal-green/35">@ops</span>
          <span className="hidden text-terminal-green/35 sm:inline">
            :~/{activeLabel}
          </span>
          <span className="ml-0.5 hidden animate-blink text-terminal-green/70 motion-reduce:animate-none sm:inline">
            ▍
          </span>
        </Link>

        {/* Desktop links — restrained, active gets a solid underline */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-[13px] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/50 ${
                  active
                    ? "text-terminal-green"
                    : "text-terminal-green/45 hover:text-terminal-green/90"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-[3px] left-0 h-px w-full origin-left bg-terminal-green transition-transform duration-200 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right: theme toggle + mobile menu */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={mounted ? resolvedTheme === "light" : false}
            aria-label="Toggle light/dark theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="grid h-8 w-8 place-items-center rounded-md text-terminal-green/60 transition-colors hover:bg-terminal-green/10 hover:text-terminal-green focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/50"
          >
            {mounted && resolvedTheme === "light" ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="grid h-8 w-8 place-items-center rounded-md text-terminal-green/70 transition-colors hover:bg-terminal-green/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/50 md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-terminal-green/10 bg-surface-deep/95 px-4 pb-4 pt-2 backdrop-blur md:hidden">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-terminal-green/10 text-terminal-green"
                    : "text-terminal-green/55 hover:text-terminal-green/90"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
