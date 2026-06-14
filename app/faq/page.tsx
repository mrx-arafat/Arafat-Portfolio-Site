"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, HelpCircle } from "lucide-react";
import faq from "@/data/faq.json";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => setOpen((prev) => (prev === i ? null : i));

  return (
    <main className="min-h-screen bg-[#121212] text-[#2ed573] p-4 md:p-8 grid-dots overflow-hidden">
      {/* Terminal header */}
      <div className="mb-8 bg-[#0f0f0f] border border-[#2ed573]/30 rounded-lg p-3 shadow-[0_0_15px_rgba(46,213,115,0.2)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-2 text-[#2ed573]/70 text-xs">~/faq</div>
        </div>
        <div className="flex items-center">
          <span className="text-[#2ed573] mr-2">$</span>
          <span className="text-[#2ed573]">cat faq.md --about=&quot;Easin Arafat&quot;</span>
          <span className="animate-blink ml-1">|</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Title row */}
        <div className="flex items-center mb-8">
          <Link
            href="/about-me"
            className="inline-flex items-center text-[#2ed573] hover:text-[#2ed573]/80 mr-4 bg-[#1a1b26] px-3 py-2 rounded-md border border-[#2ed573]/20 hover:border-[#2ed573]/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ..</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2ed573] to-[#7bed9f]">
            <span className="text-[#2ed573]/70">[</span>
            FAQ
            <span className="text-[#2ed573]/70">]</span>
          </h1>
        </div>

        <p className="text-[#8b949e] text-sm md:text-base mb-8">
          Frequently asked questions about{" "}
          <span className="text-[#2ed573]">Easin Arafat</span> — Application
          Security Engineer, security researcher, and published author.
        </p>

        {/* Accordion */}
        <div className="space-y-3">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`bg-[#1a1b26] rounded-lg border transition-colors ${
                  isOpen
                    ? "border-[#2ed573]/40 shadow-[0_0_15px_rgba(46,213,115,0.1)]"
                    : "border-[#2ed573]/15 hover:border-[#2ed573]/30"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle
                      size={18}
                      className="text-[#2ed573] flex-shrink-0"
                    />
                    <span className="text-base md:text-lg font-semibold text-[#e6edf3]">
                      {item.q}
                    </span>
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-[#2ed573] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pl-[3.25rem] text-[#8b949e] text-sm md:text-base leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
