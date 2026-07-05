
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Newspaper,
  Mic,
  Award,
  Link2,
} from "lucide-react";
import featured from "@/data/featured.json";

interface Item {
  id: string;
  title: string;
  venue: string;
  badges: string[];
  meta: string;
  summary: string;
  role?: string;
  authors?: string;
  doi?: string;
  url?: string;
}

interface Profile {
  id: string;
  label: string;
  handle: string;
  url: string;
}

const research = featured.research as Item[];
const press = featured.press as Item[];
const speaking = featured.speaking as Item[];
const recognition = featured.recognition as Item[];
const profiles = featured.profiles as Profile[];

function ItemCard({ item }: { item: Item }) {
  const Wrapper = item.url ? "a" : "div";
  const wrapperProps = item.url
    ? { href: item.url, target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Wrapper
      {...wrapperProps}
      className={`group relative bg-surface-night rounded-lg p-5 border border-terminal-green/10 transition-all duration-300 flex flex-col ${
        item.url
          ? "hover:border-terminal-green/40 hover:translate-y-[-3px] hover:shadow-[0_8px_20px_rgba(46,213,115,0.15)]"
          : ""
      }`}
    >
      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.badges.map((b) => (
          <span
            key={b}
            className="text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-terminal-green/10 text-terminal-green border border-terminal-green/20"
          >
            {b}
          </span>
        ))}
      </div>

      <h3 className="text-base font-bold text-[#e6edf3] mb-1 leading-snug group-hover:text-terminal-green transition-colors">
        {item.title}
      </h3>
      <div className="text-terminal-green/70 text-sm font-mono mb-1">{item.venue}</div>
      <div className="text-terminal-green/50 text-xs font-mono mb-3">{item.meta}</div>

      {item.role && (
        <div className="text-terminal-soft text-xs font-mono mb-2">{item.role}</div>
      )}
      {item.authors && (
        <div className="text-[#8b949e] text-xs mb-2 italic">{item.authors}</div>
      )}

      <p className="text-[#8b949e] text-sm leading-relaxed mb-4">{item.summary}</p>

      <div className="flex-1"></div>

      {item.url && (
        <div className="flex items-center justify-between pt-3 border-t border-terminal-green/10">
          {item.doi ? (
            <span className="text-terminal-green/50 text-xs font-mono">
              DOI: {item.doi}
            </span>
          ) : (
            <span></span>
          )}
          <span className="inline-flex items-center gap-1 text-terminal-green/50 text-xs group-hover:text-terminal-green transition-colors">
            {item.doi ? "Read Paper" : "View"} <ExternalLink size={12} />
          </span>
        </div>
      )}
    </Wrapper>
  );
}

function Section({
  icon,
  title,
  command,
  items,
  cols = "lg:grid-cols-3",
}: {
  icon: React.ReactNode;
  title: string;
  command: string;
  items: Item[];
  cols?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-terminal-green/10 rounded-lg flex items-center justify-center border border-terminal-green/20">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-terminal-green">{title}</h2>
        <span className="text-terminal-green/40 text-xs font-mono ml-2 hidden sm:inline">
          $ {command}
        </span>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 ${cols} gap-4`}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function Featured() {
  return (
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots overflow-hidden">
      {/* Terminal header */}
      <div className="mb-8 bg-surface-raised border border-terminal-green/30 rounded-lg p-3 shadow-[0_0_15px_rgba(46,213,115,0.2)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-2 text-terminal-green/70 text-xs">~/featured</div>
        </div>
        <div className="flex items-center">
          <span className="text-terminal-green mr-2">$</span>
          <span className="text-terminal-green">cat research.md press.md recognition.md</span>
          <span className="animate-blink ml-1">|</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Title row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
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
              FEATURED
              <span className="text-terminal-green/70">]</span>
            </h1>
          </div>
        </div>

        <Section
          icon={<FileText size={14} className="text-terminal-green" />}
          title="Published Research"
          command="./list_papers.sh"
          items={research}
          cols="lg:grid-cols-1"
        />
        <Section
          icon={<Newspaper size={14} className="text-terminal-green" />}
          title="Press & Media"
          command="./list_press.sh"
          items={press}
          cols="lg:grid-cols-2"
        />
        <Section
          icon={<Mic size={14} className="text-terminal-green" />}
          title="Speaking & Events"
          command="./list_events.sh"
          items={speaking}
        />
        <Section
          icon={<Award size={14} className="text-terminal-green" />}
          title="Recognition"
          command="./list_awards.sh"
          items={recognition}
        />

        {/* Profiles strip */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-terminal-green/10 rounded-lg flex items-center justify-center border border-terminal-green/20">
              <Link2 size={14} className="text-terminal-green" />
            </div>
            <h2 className="text-xl font-bold text-terminal-green">Find Me Online</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {profiles.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-surface-night border border-terminal-green/20 hover:border-terminal-green/50 hover:bg-[#2a3942] rounded-md px-3 py-2 transition-colors group"
              >
                <span className="text-terminal-green text-sm font-medium">{p.label}</span>
                <span className="text-terminal-green/50 text-xs font-mono">@{p.handle}</span>
                <ExternalLink
                  size={12}
                  className="text-terminal-green/40 group-hover:text-terminal-green transition-colors"
                />
              </a>
            ))}
          </div>
        </section>

        {/* SEO crawler block */}
        <div className="sr-only">
          <h2>Easin Arafat — Research, Press &amp; Recognition</h2>
          <p>
            Sheikh Easin Arafat is a co-author of the peer-reviewed paper
            &quot;Adaptive User Interface for Mobile Banking Apps: Enhancing UX
            through Machine Learning&quot;, published in Array (Elsevier, Q1
            journal, open access), DOI 10.1016/j.array.2026.100901. He was
            featured in The Daily Star for cybersecurity education and the events
            led by the MIST Cyber Security Club. He organized MIST LEETCON 2023,
            Bangladesh&apos;s first international cybersecurity conference with
            3,500+ participants, and was a 2021 University Rover Challenge Global
            Champion with Team MIST Mongol Barota.
          </p>
        </div>
      </div>
    </main>
  );
}
