import Link from "next/link";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ArrowRight } from "lucide-react";
import { TerminalHeader } from "@/components/blog/terminal-header";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page does not exist on arafatops.com. Head back to the dashboard or browse projects, security research and the blog.",
  robots: { index: false, follow: true },
};

const SECTIONS = [
  { href: "/", command: "cd ~", note: "Dashboard and overview" },
  { href: "/about", command: "cd ~/about", note: "Background and experience" },
  { href: "/projects", command: "cd ~/projects", note: "Selected projects" },
  {
    href: "/security-research",
    command: "cd ~/security-research",
    note: "CVEs and disclosures",
  },
  { href: "/blogs", command: "cd ~/blogs", note: "Essays and daily notes" },
  { href: "/contact", command: "cd ~/contact", note: "Get in touch" },
] as const;

/** Root 404 page, rendered for any URL that matches no route. */
export default function NotFound(): ReactElement {
  return (
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots">
      <div className="max-w-5xl mx-auto">
        <TerminalHeader path="~/404" command="cd ./requested-page" />

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-terminal-green to-terminal-soft uppercase">
            <span aria-hidden="true" className="bracket-open text-terminal-green/70" />
            Page not found
            <span aria-hidden="true" className="bracket-close text-terminal-green/70" />
          </h1>
          <span className="text-terminal-green/40 font-mono text-sm">
            exit 404
          </span>
        </div>

        <div className="mb-8 bg-surface-raised rounded-2xl border border-terminal-green/20 p-5">
          <p className="text-terminal-green/80 font-mono text-sm break-words">
            bash: cd: ./requested-page: No such file or directory
          </p>
          <p className="mt-3 text-terminal-green/60 text-sm leading-relaxed">
            This page was moved, renamed, or never existed. Pick a section
            below to keep going.
          </p>
        </div>

        <nav aria-label="Main sections">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SECTIONS.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="group flex items-center justify-between gap-3 bg-surface-raised rounded-2xl border border-terminal-green/20 hover:border-terminal-green/50 hover:shadow-[0_0_18px_rgba(46,213,115,0.2)] transition-all duration-300 p-5"
                >
                  <span className="min-w-0">
                    <span className="block text-terminal-green font-mono text-sm">
                      {section.command}
                    </span>
                    <span className="mt-1 block text-terminal-green/60 text-xs">
                      {section.note}
                    </span>
                  </span>
                  <ArrowRight
                    size={14}
                    className="flex-shrink-0 text-terminal-green/50 transform group-hover:translate-x-1 group-hover:text-terminal-green transition-all"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
