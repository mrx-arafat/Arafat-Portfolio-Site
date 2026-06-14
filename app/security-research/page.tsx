"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, ExternalLink, Bug, Lock, Eye } from "lucide-react";
import cveData from "@/data/cve.json";

interface CveItem {
  id: number;
  cve: string;
  status: string;
  software: string;
  affected: string;
  patched: string;
  type: string;
  cvss: number;
  severity: string;
  reported: string;
  platform: string;
  url: string;
}

const items = cveData.items as CveItem[];

function severityColor(sev: string): string {
  switch (sev) {
    case "Critical":
      return "#ff4757";
    case "High":
      return "#ff6b6b";
    case "Medium":
      return "#ffa502";
    default:
      return "#2ed573";
  }
}

function typeIcon(type: string) {
  if (type.includes("IDOR") || type.includes("Direct Object"))
    return <Bug size={14} />;
  if (type.includes("Sensitive")) return <Eye size={14} />;
  return <Lock size={14} />;
}

const FILTERS = ["All", "Broken Access Control", "IDOR", "Sensitive Data Exposure"];

export default function SecurityResearch() {
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") return items;
    if (filter === "IDOR")
      return items.filter((i) => i.type.includes("IDOR") || i.type.includes("Direct Object"));
    return items.filter((i) => i.type.includes(filter));
  }, [filter]);

  const published = items.filter((i) => i.status === "published").length;
  const highest = Math.max(...items.map((i) => i.cvss));

  return (
    <main className="min-h-screen bg-[#121212] text-[#2ed573] p-4 md:p-8 grid-dots overflow-hidden">
      {/* Terminal-style header */}
      <div className="mb-8 bg-[#0f0f0f] border border-[#2ed573]/30 rounded-lg p-3 shadow-[0_0_15px_rgba(46,213,115,0.2)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-2 text-[#2ed573]/70 text-xs">~/security-research</div>
        </div>
        <div className="flex items-center">
          <span className="text-[#2ed573] mr-2">$</span>
          <span className="text-[#2ed573]">./list_cves.sh --researcher=n0_arafat_n0</span>
          <span className="animate-blink ml-1">|</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Title row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-[#2ed573] hover:text-[#2ed573]/80 mr-4 bg-[#1a1b26] px-3 py-2 rounded-md border border-[#2ed573]/20 hover:border-[#2ed573]/40 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span className="text-sm">cd ..</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2ed573] to-[#7bed9f]">
              <span className="text-[#2ed573]/70">[</span>
              CVE_DISCLOSURES
              <span className="text-[#2ed573]/70">]</span>
            </h1>
          </div>

          <a
            href={cveData.researcher.profile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#0f0f0f] text-sm bg-[#2ed573] px-3 py-2 rounded-md transform transition-all hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(46,213,115,0.4)] border border-[#2ed573]"
          >
            <ShieldAlert size={16} />
            <span>Patchstack Profile</span>
          </a>
        </div>

        {/* Intro + stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-1 bg-[#1a1b26] rounded-lg p-4 border border-[#2ed573]/10 shadow-[0_0_15px_rgba(46,213,115,0.1)] flex flex-col justify-center">
            <div className="text-4xl font-bold text-[#2ed573]">{items.length}</div>
            <div className="text-[#2ed573]/60 text-xs font-mono mt-1">
              Total Vulnerabilities
            </div>
          </div>
          <div className="bg-[#1a1b26] rounded-lg p-4 border border-[#2ed573]/10 flex flex-col justify-center">
            <div className="text-4xl font-bold text-[#2ed573]">{published}</div>
            <div className="text-[#2ed573]/60 text-xs font-mono mt-1">Published CVEs</div>
          </div>
          <div className="bg-[#1a1b26] rounded-lg p-4 border border-[#2ed573]/10 flex flex-col justify-center">
            <div className="text-4xl font-bold text-[#ff6b6b]">{highest}</div>
            <div className="text-[#2ed573]/60 text-xs font-mono mt-1">Highest CVSS</div>
          </div>
          <div className="bg-[#1a1b26] rounded-lg p-4 border border-[#2ed573]/10 flex flex-col justify-center">
            <div className="text-sm text-[#2ed573] font-mono">@n0_arafat_n0</div>
            <div className="text-[#2ed573]/60 text-xs font-mono mt-1">
              Responsible Disclosure · Patchstack VDP
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
                filter === f
                  ? "bg-[#2ed573] text-[#0f0f0f] border-[#2ed573]"
                  : "bg-[#0f0f0f] text-[#2ed573]/70 border-[#2ed573]/20 hover:border-[#2ed573]/50 hover:text-[#2ed573]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* CVE grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const color = severityColor(c.severity);
            return (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-[#1a1b26] rounded-lg p-5 border border-[#2ed573]/10 hover:border-[#2ed573]/40 transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_8px_20px_rgba(46,213,115,0.15)] flex flex-col"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-lg"
                  style={{ background: color }}
                ></div>

                {/* Header: CVE id + CVSS */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm text-[#2ed573]">
                    {c.cve === "Reserved" ? (
                      <span className="text-[#2ed573]/50">CVE · reserved</span>
                    ) : (
                      c.cve
                    )}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded font-mono"
                    style={{
                      color,
                      backgroundColor: `${color}1a`,
                      border: `1px solid ${color}40`,
                    }}
                  >
                    CVSS {c.cvss}
                  </span>
                </div>

                {/* Software */}
                <h2 className="text-base font-bold text-[#e6edf3] mb-1 leading-snug group-hover:text-[#2ed573] transition-colors">
                  {c.software}
                </h2>
                <div className="text-[#2ed573]/60 text-xs font-mono mb-3">
                  {c.platform} · {c.affected}
                </div>

                {/* Type badge */}
                <div className="flex items-center gap-1.5 text-xs text-[#2ed573]/80 mb-4">
                  {typeIcon(c.type)}
                  <span>{c.type}</span>
                </div>

                <div className="flex-1"></div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#2ed573]/10">
                  <span
                    className="text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-0.5 rounded"
                    style={{ color, backgroundColor: `${color}1a` }}
                  >
                    {c.severity}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#2ed573]/50 text-xs group-hover:text-[#2ed573] transition-colors">
                    Advisory <ExternalLink size={12} />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

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
