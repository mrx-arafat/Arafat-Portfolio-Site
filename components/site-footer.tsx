"use client";

import Link from "next/link";
import { Github, Linkedin, BookOpen } from "lucide-react";

const EXPLORE_LINKS = [
  { href: "/", label: "dashboard" },
  { href: "/about", label: "about" },
  { href: "/featured", label: "featured" },
  { href: "/projects", label: "projects" },
  { href: "/security-research", label: "security-research" },
] as const;

const WRITING_LINKS = [
  { href: "/articles", label: "articles" },
  { href: "/blogs", label: "blog" },
  { href: "/notes", label: "notes" },
] as const;

const MORE_LINKS = [
  { href: "/skills", label: "skills" },
  { href: "/faq", label: "faq" },
  { href: "/contact", label: "contact" },
] as const;

const SOCIALS = [
  { href: "https://github.com/mrx-arafat", label: "GitHub", Icon: Github },
  { href: "https://www.linkedin.com/in/e4rafat", label: "LinkedIn", Icon: Linkedin },
  { href: "https://medium.com/@easinxarafat", label: "Medium", Icon: BookOpen },
] as const;

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}): React.ReactElement {
  return (
    <div>
      <div className="mb-3 text-xs font-bold tracking-widest text-terminal-green/40">
        $ ls ~/{title}
      </div>
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs text-terminal-green/60 transition-colors hover:text-terminal-green"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Sitewide footer with secondary links and socials. The boot overlay on / covers it until boot completes. */
export function SiteFooter(): React.ReactElement | null {
  return (
    <footer className="border-t border-terminal-green/10 bg-surface-raised font-mono">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4 md:px-8">
        <LinkColumn title="explore" links={EXPLORE_LINKS} />
        <LinkColumn title="writing" links={WRITING_LINKS} />
        <LinkColumn title="more" links={MORE_LINKS} />
        <div>
          <div className="mb-3 text-xs font-bold tracking-widest text-terminal-green/40">
            $ whoami --social
          </div>
          <div className="flex gap-3">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-md border border-terminal-green/20 p-2 text-terminal-green/60 transition-colors hover:border-terminal-green/50 hover:text-terminal-green"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-terminal-green/10 px-4 py-4 text-center text-[11px] text-terminal-green/40">
        <span className="text-terminal-green/30">&gt;</span> © {new Date().getFullYear()} Easin
        Arafat — systems that survive production
      </div>
    </footer>
  );
}
