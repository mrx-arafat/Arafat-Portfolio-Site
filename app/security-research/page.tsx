import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import cveData from "@/data/cve.json";
import { CveExplorer, type CveItem } from "./cve-explorer";

const items = cveData.items as CveItem[];

export default function SecurityResearch() {
  const published = items.filter((i) => i.status === "published").length;
  const highest = Math.max(...items.map((i) => i.cvss));

  return (
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots overflow-hidden">
      {/* Terminal-style header */}
      <div className="mb-8 bg-surface-raised border border-terminal-green/30 rounded-lg p-3 shadow-[0_0_15px_rgba(46,213,115,0.2)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-2 text-terminal-green/70 text-xs">~/security-research</div>
        </div>
        <div className="flex items-center">
          <span className="text-terminal-green mr-2">$</span>
          <span className="text-terminal-green">./list_cves.sh --researcher=n0_arafat_n0</span>
          <span className="animate-blink ml-1">|</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Title row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-terminal-green hover:text-terminal-green/80 mr-4 bg-surface-night px-3 py-2 rounded-md border border-terminal-green/20 hover:border-terminal-green/40 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span className="text-sm">cd ..</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-terminal-green to-terminal-soft">
              <span className="text-terminal-green/70">[</span>
              CVE_DISCLOSURES
              <span className="text-terminal-green/70">]</span>
            </h1>
          </div>

          <a
            href={cveData.researcher.profile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-surface-raised text-sm bg-terminal-green px-3 py-2 rounded-md transform transition-all hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(46,213,115,0.4)] border border-terminal-green"
          >
            <ShieldAlert size={16} />
            <span>Patchstack Profile</span>
          </a>
        </div>

        {/* Intro + stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-1 bg-surface-night rounded-lg p-4 border border-terminal-green/10 shadow-[0_0_15px_rgba(46,213,115,0.1)] flex flex-col justify-center">
            <div className="text-4xl font-bold text-terminal-green">{items.length}</div>
            <div className="text-terminal-green/60 text-xs font-mono mt-1">
              Total Vulnerabilities
            </div>
          </div>
          <div className="bg-surface-night rounded-lg p-4 border border-terminal-green/10 flex flex-col justify-center">
            <div className="text-4xl font-bold text-terminal-green">{published}</div>
            <div className="text-terminal-green/60 text-xs font-mono mt-1">Published CVEs</div>
          </div>
          <div className="bg-surface-night rounded-lg p-4 border border-terminal-green/10 flex flex-col justify-center">
            <div className="text-4xl font-bold text-terminal-red">{highest}</div>
            <div className="text-terminal-green/60 text-xs font-mono mt-1">Highest CVSS</div>
          </div>
          <div className="bg-surface-night rounded-lg p-4 border border-terminal-green/10 flex flex-col justify-center">
            <div className="text-sm text-terminal-green font-mono">@n0_arafat_n0</div>
            <div className="text-terminal-green/60 text-xs font-mono mt-1">
              Responsible Disclosure · Patchstack VDP
            </div>
          </div>
        </div>

        <CveExplorer items={items} />

        {/* SEO: server-rendered content for crawlers */}
        <div className="sr-only">
          <h2>CVEs Discovered by Easin Arafat (n0_arafat_n0)</h2>
          <p>
            Easin Arafat, Application Security Engineer at Startise, is a security
            researcher credited on the Patchstack Vulnerability Disclosure Program
            under the handle n0_arafat_n0. He has responsibly disclosed 9 security
            vulnerabilities in WordPress plugins, spanning Broken Access Control,
            Insecure Direct Object Reference (IDOR), and Sensitive Data Exposure.
          </p>
          <ul>
            {items.map((c) => (
              <li key={c.id}>
                {c.cve !== "Reserved" ? `${c.cve}: ` : ""}
                {c.software} {c.affected} — {c.type} (CVSS {c.cvss}, {c.severity})
                reported by Easin Arafat (n0_arafat_n0) via Patchstack.
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
