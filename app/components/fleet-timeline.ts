import cveData from "@/data/cve.json";

export const FLEET_COMMAND = "fleet up 6 2 claude,codex";
export const FLEET_READY_AT = 4200;
export const FLEET_EXIT_AT = 4500;

type PaneId = "research" | "build" | "review" | "security" | "memory" | "docs";
type PaneState = "waiting" | "working" | "held" | "verified" | "merged";
interface PaneDefinition {
  id: PaneId;
  engine: "claude" | "codex";
  task: string;
  file: string;
  result: string;
  compact: string;
  pace: number;
  diff: readonly [number, number];
  steps: readonly [string, string, string];
}

// Filenames, changes and checks illustrate the workflow, rather than reporting live execution.
const PANES: readonly PaneDefinition[] = [
  { id: "research", engine: "claude", task: "map scope", file: "scope.md", result: "context linked", compact: "scope linked", pace: 184, diff: [24, 6], steps: ["read scope.md", "trace caller -> boundary", "link evidence -> scope"] },
  { id: "build", engine: "codex", task: "build change", file: "change.tsx", result: "commit released", compact: "build released", pace: 160, diff: [48, 12], steps: ["patch change.tsx", "write checks.spec.ts", "stage reviewed diff"] },
  { id: "review", engine: "claude", task: "verify diff", file: "checks.spec.ts", result: "3/3 verified", compact: "3/3 verified", pace: 200, diff: [18, 4], steps: ["verify boundary", "verify keyboard path", "verify motion pause"] },
  { id: "security", engine: "codex", task: "check boundaries", file: "threat.md", result: `${cveData.items.length} CVEs disclosed`, compact: `${cveData.items.length} CVEs disclosed`, pace: 168, diff: [32, 7], steps: ["inspect input boundary", "trace access policy", "check disclosed CVEs"] },
  { id: "memory", engine: "claude", task: "connect context", file: "context.md", result: "second-brain mounted", compact: "memory linked", pace: 208, diff: [28, 5], steps: ["read context.md", "link related decisions", "mount second-brain"] },
  { id: "docs", engine: "codex", task: "record decisions", file: "README.md", result: "handoff ready", compact: "handoff ready", pace: 176, diff: [36, 9], steps: ["read README.md", "write decision record", "prepare handoff"] },
];

interface PaneLine { full: string; compact: string }
export interface FleetPaneFrame extends PaneDefinition {
  state: PaneState;
  spawn: number;
  commits: number;
  spinner: string;
  progress: number;
  added: number;
  removed: number;
  checks: number;
  scroll: number;
  lines: readonly PaneLine[];
}
interface FleetFrame {
  command: string;
  panes: readonly FleetPaneFrame[];
  merge: number;
  mainPulse: number;
  borderFlash: number;
  handoff: number;
  flash: number;
  pulse: number;
  gate: "waiting" | "holding" | "verified" | "released";
}

function progress(time: number, start: number, end: number): number {
  return Math.max(0, Math.min(1, (time - start) / (end - start)));
}

/** Derive every log row, diff, check, commit and merge from one deterministic clock. */
export function getFleetFrame(time: number): FleetFrame {
  const merge = progress(time, 3300, 3700);
  const borderFlash = Math.max(0, 1 - Math.abs(time - 3740) / 120);
  const panes = PANES.map((pane, index): FleetPaneFrame => {
    const start = 480 + index * 55;
    const held = pane.id === "build" && time >= 2050 && time < 3200;
    const verifiedAt = pane.id === "review" ? 3000 : pane.id === "build" ? 3200 : Math.max(2350 + index * 60, start + pane.pace * 10);
    const state: PaneState = time < start ? "waiting" : held ? "held" : time >= 3700 ? "merged" : time >= verifiedAt ? "verified" : "working";
    const completed = state === "verified" || state === "merged";
    const amount = pane.id === "build" ? time < 3200 ? progress(time, start, 2050) * .74 : .74 + progress(time, 3200, 3300) * .26 : progress(time, start, verifiedAt);
    const checks = pane.id === "review" ? time < 2200 ? 0 : time < 2500 ? 1 : time < 2800 ? 2 : 3 : Math.floor(amount * 3);
    const added = Math.floor(amount * pane.diff[0]);
    const removed = Math.floor(amount * pane.diff[1]);
    const verdict = held ? "[HOLD] review gate - build paused" : pane.id === "review" && !completed ? `verifying checks.spec.ts / ${checks}/3` : pane.result;
    const compact = held ? "! review: HOLD" : pane.id === "review" && !completed ? `verify: ${checks}/3` : pane.compact;
    const line = (full: string, small = full): PaneLine => ({ full, compact: small });
    return {
      ...pane, state,
      spawn: progress(time, start, start + 100),
      commits: Math.min(pane.id === "build" && time < 3200 ? 2 : 3, Math.max(0, Math.floor((time - start - 500) / (360 + index * 25)) + 1)),
      spinner: state === "working" ? ["|", "/", "-", "\\"][Math.floor(time / (80 + index * 13)) % 4] : held ? "!" : state === "waiting" ? "." : "+",
      progress: amount, added, removed, checks,
      scroll: held || completed ? 10 : Math.min(10, Math.max(0, (time - start) / pane.pace)),
      lines: [
        line(`git worktree add .worktrees/${pane.id}`, `wt /${pane.id}`),
        line(`branch: work/${pane.id} <- main`, `branch /${pane.id}`),
        line(`cd .worktrees/${pane.id}`, "cwd: isolated"),
        line(`fleet send ${pane.id} '${pane.task}'`, "task: assigned"),
        line(`read ${pane.file}`, pane.file),
        line("context loaded / task scoped", "scope: loaded"),
        line(pane.steps[0], "read -> trace"),
        line(pane.steps[1], "trace -> check"),
        line(`diff ${pane.file} +${added} -${removed}`, `diff +${added} -${removed}`),
        line("inspect boundary / trace dependency", "boundary: check"),
        line(pane.steps[2], "write -> verify"),
        line(`checks.spec.ts / ${checks}/3 checks`, `checks: ${checks}/3`),
        line(`git diff --stat / +${added} -${removed}`, `stat +${added} -${removed}`),
        line(held ? "commit queued / awaiting review" : `commit: ${pane.task}`, held ? "commit: HELD" : "commit: ready"),
        line(`work/${pane.id} -> main / ${completed ? "verified" : "pending"}`, completed ? "main: verified" : "main: pending"),
        line(verdict, compact),
      ],
    };
  });
  return {
    command: FLEET_COMMAND.slice(0, Math.max(0, Math.floor(time / 15))), panes, merge,
    mainPulse: time >= 3700 && time < 4050 ? progress(time, 3700, 4050) : -1,
    borderFlash,
    handoff: progress(time, FLEET_READY_AT, FLEET_EXIT_AT),
    flash: borderFlash * .08,
    pulse: time >= 3800 && time <= FLEET_READY_AT ? Math.sin(progress(time, 3800, FLEET_READY_AT) * Math.PI) ** 2 : 0,
    gate: time < 2050 ? "waiting" : time < 3000 ? "holding" : time < 3200 ? "verified" : "released",
  };
}
