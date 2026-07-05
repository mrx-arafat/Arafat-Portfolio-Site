"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

/** Interactive accordion island — the rest of the FAQ page renders on the server. */
export function FaqAccordion({ items }: { items: FaqItem[] }): React.ReactElement {
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number): void => setOpen((prev) => (prev === i ? null : i));

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`bg-surface-night rounded-lg border transition-colors ${
              isOpen
                ? "border-terminal-green/40 shadow-[0_0_15px_rgba(46,213,115,0.1)]"
                : "border-terminal-green/15 hover:border-terminal-green/30"
            }`}
          >
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
            >
              <span className="flex items-center gap-3">
                <HelpCircle size={18} className="text-terminal-green flex-shrink-0" />
                <span className="text-base md:text-lg font-semibold text-[#e6edf3]">
                  {item.q}
                </span>
              </span>
              <ChevronDown
                size={20}
                className={`text-terminal-green flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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
  );
}
