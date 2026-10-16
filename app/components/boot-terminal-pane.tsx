import { Fira_Code, IBM_Plex_Mono, JetBrains_Mono, Source_Code_Pro, Space_Mono, Ubuntu_Mono } from "next/font/google";
import { memo, type CSSProperties, type ReactElement, type ReactNode } from "react";
import type { FleetPaneFrame } from "./fleet-timeline";

// No font preloads compete with the first paint. Fixed terminal cells contain the swap.
const researchFont = JetBrains_Mono({ subsets: ["latin"], weight: "400", display: "swap", preload: false, fallback: ["ui-monospace", "monospace"] });
const buildFont = Fira_Code({ subsets: ["latin"], weight: "400", display: "swap", preload: false, fallback: ["ui-monospace", "monospace"] });
const reviewFont = Source_Code_Pro({ subsets: ["latin"], weight: "400", display: "swap", preload: false, fallback: ["ui-monospace", "monospace"] });
const securityFont = Space_Mono({ subsets: ["latin"], weight: "400", display: "swap", preload: false, fallback: ["ui-monospace", "monospace"] });
const memoryFont = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", display: "swap", preload: false, fallback: ["ui-monospace", "monospace"] });
const docsFont = Ubuntu_Mono({ subsets: ["latin"], weight: "400", display: "swap", preload: false, fallback: ["ui-monospace", "monospace"] });

/** Intro-only terminal identities, also used to color their graph branches. */
export const BOOT_TERMINALS = {
  research: { theme: "dracula", label: "Dracula", font: researchFont.className, prompt: "❯", cursor: "block", spinner: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧"] },
  build: { theme: "monokai", label: "Monokai", font: buildFont.className, prompt: "λ", cursor: "underline", spinner: ["▱", "▰", "▱", "▰"] },
  review: { theme: "nord", label: "Nord", font: reviewFont.className, prompt: "»", cursor: "bar", spinner: ["·", "∙", "●", "∙"] },
  security: { theme: "tokyo-night", label: "Tokyo Night", font: securityFont.className, prompt: "$", cursor: "hollow", spinner: ["⌜", "⌝", "⌟", "⌞"] },
  memory: { theme: "one-dark", label: "One Dark", font: memoryFont.className, prompt: "➜", cursor: "double", spinner: ["⠁", "⠃", "⠇", "⠧", "⠷", "⠿"] },
  docs: { theme: "catppuccin", label: "Catppuccin", font: docsFont.className, prompt: "❱", cursor: "beam", spinner: ["⋅", "∙", "•", "∙"] },
} as const;

// Real repository history supplies the illustrative replay's short commit hashes.
const SAMPLE_COMMITS = ["c59b465", "2367182", "52247ca"];
const TYPING_BEATS = [0, .08, .12, .35, .38, .62, .84, .88, 1];
const COMMAND = /^(?:git|worktree|add|cd|fleet|send|read|patch|write|stage|trace|link|verify|inspect|check|mount|prepare|diff)$/;
const TOKENS = /(\.worktrees\/[\w/-]+|work\/[\w/-]+|\bmaster\b|\b[\w-]+\.(?:md|tsx?|spec\.ts)\b|\b[0-9a-f]{7}\b|[+-]\d+|\b\d+(?:\/\d+)?%?|\b(?:WARN|HOLD|HELD)\b|\b(?:git|worktree|add|cd|fleet|send|read|patch|write|stage|trace|link|verify|inspect|check|mount|prepare|diff)\b|->|<-)/g;

function highlight(text: string): ReactNode[] {
  return text.replace(/\bmain\b/g, "master").split(TOKENS).map((token, index) => {
    const kind = token.startsWith(".worktrees/") ? "path"
      : token.startsWith("work/") || token === "master" ? "branch"
      : /\.(md|tsx?)$/.test(token) ? "file"
      : /^[0-9a-f]{7}$/.test(token) ? "hash"
      : /^\+\d/.test(token) ? "added"
      : /^-\d/.test(token) ? "removed"
      : /^\d/.test(token) ? "counter"
      : /^(WARN|HOLD|HELD)$/.test(token) ? "warn"
      : COMMAND.test(token) ? "command"
      : token === "->" || token === "<-" ? "edge" : "text";
    return <span key={index} className={`oc-fleet-syntax-${kind}`}>{token}</span>;
  });
}

// Unchanged rows retain their parsed syntax while the replay clock and cursors advance.
const BootLogLine = memo(function BootLogLine({ full, compact, prompt, typing, held }: { full: string; compact: string; prompt: string; typing: boolean; held: boolean }): ReactElement {
  const command = COMMAND.test(full.split(" ")[0]);
  return <p data-typing={typing} className={held ? "oc-fleet-held" : undefined}>
    {command && <span className="oc-fleet-prompt">{prompt} </span>}
    <span className="oc-fleet-line-text"><span className="oc-fleet-line-full">{highlight(full)}</span><span className="oc-fleet-line-small">{highlight(compact)}</span></span>
  </p>;
});

/** Render a themed pane without introducing another timer or animation clock. */
export const BootTerminalPane = memo(function BootTerminalPane({ pane }: { pane: FleetPaneFrame }): ReactElement {
  const terminal = BOOT_TERMINALS[pane.id];
  const active = pane.state === "working";
  const fraction = pane.scroll % 1;
  const typed = active ? TYPING_BEATS[Math.min(8, Math.floor(fraction * 9))] : 1;
  const currentLine = Math.min(pane.lines.length - 1, 5 + Math.floor(pane.scroll));
  const spinner = active ? terminal.spinner[(Math.max(0, "|/-\\".indexOf(pane.spinner)) + pane.checks * 4) % terminal.spinner.length] : pane.spinner;
  return <div data-fleet-pane={pane.id} data-pane-theme={terminal.theme} data-pane-state={pane.state} data-cursor={terminal.cursor} className={`oc-fleet-pane ${terminal.font}`} style={{ "--spawn": pane.spawn, "--log-pending": 10 - pane.scroll, "--typed": typed } as CSSProperties}>
    <div className="oc-fleet-pane-title"><span><i>{spinner}</i> {terminal.prompt} {pane.id}</span><span>{terminal.label}<em> / {pane.engine}</em></span></div>
    <div className="oc-fleet-output"><div className="oc-fleet-log-track">{pane.lines.map((line, index) => <BootLogLine key={index}
      full={index === 13 && pane.commits > 0 ? `commit ${SAMPLE_COMMITS[pane.commits - 1]} / ${pane.state === "held" ? "HELD for review" : pane.task}` : pane.state === "held" && index === 15 ? `WARN ${line.full}` : line.full}
      compact={index === 13 && pane.commits > 0 ? `${SAMPLE_COMMITS[pane.commits - 1]} ${pane.state === "held" ? "HELD" : "ready"}` : line.compact}
      prompt={terminal.prompt} typing={active && pane.scroll < 10 && index === currentLine} held={pane.state === "held" && index >= 13}
    />)}</div><i className="oc-fleet-caret" /></div>
    <div className="oc-fleet-pane-stats"><span className="oc-fleet-added">+{pane.added}</span><span className="oc-fleet-removed">-{pane.removed}</span><span>{pane.checks}/3</span><span>{Math.round(pane.progress * 100)}%</span></div>
    <div className="oc-fleet-progress"><span style={{ transform: `scaleX(${pane.progress})` }} /></div>
  </div>;
});
