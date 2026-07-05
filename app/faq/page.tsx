import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import faq from "@/data/faq.json";
import { FaqAccordion } from "./faq-accordion";

export default function Faq() {
  return (
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots overflow-hidden">
      {/* Terminal header */}
      <div className="mb-8 bg-surface-raised border border-terminal-green/30 rounded-lg p-3 shadow-[0_0_15px_rgba(46,213,115,0.2)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-2 text-terminal-green/70 text-xs">~/faq</div>
        </div>
        <div className="flex items-center">
          <span className="text-terminal-green mr-2">$</span>
          <span className="text-terminal-green">cat faq.md --about=&quot;Easin Arafat&quot;</span>
          <span className="animate-blink ml-1">|</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Title row */}
        <div className="flex items-center mb-8">
          <Link
            href="/about"
            className="inline-flex items-center text-terminal-green hover:text-terminal-green/80 mr-4 bg-surface-night px-3 py-2 rounded-md border border-terminal-green/20 hover:border-terminal-green/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ..</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-terminal-green to-terminal-soft">
            <span className="text-terminal-green/70">[</span>
            FAQ
            <span className="text-terminal-green/70">]</span>
          </h1>
        </div>

        <p className="text-[#8b949e] text-sm md:text-base mb-8">
          Frequently asked questions about{" "}
          <span className="text-terminal-green">Easin Arafat</span> — Application
          Security Engineer, security researcher, and published author.
        </p>

        <FaqAccordion items={faq} />
      </div>
    </main>
  );
}
