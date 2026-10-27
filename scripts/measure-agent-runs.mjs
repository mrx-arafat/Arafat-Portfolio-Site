#!/usr/bin/env node
// Counts the AI agent runs on this machine in the last 30 days and records them in
// data/agent-runs.json for the home page's live card. Claude Code keeps about 30 days
// of transcripts, so 30 days is the window every count here can honestly cover.
// Run: node scripts/measure-agent-runs.mjs
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DAYS = 30;
const since = Date.now() - DAYS * 86_400_000;

/** Every file under `dir` matching `test`, modified inside the window. A missing folder counts as zero. */
function recent(dir, test) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return recent(path, test);
    return test(entry.name) && statSync(path).mtimeMs >= since ? [path] : [];
  });
}

const claudeRoot = join(homedir(), ".claude", "projects");
const claude = recent(claudeRoot, (name) => name.endsWith(".jsonl"));
// A session transcript sits directly in its project folder; anything deeper is a sub-agent.
const claudeSessions = claude.filter((path) => path.split("/").length === claudeRoot.split("/").length + 2).length;
const codexSessions = recent(join(homedir(), ".codex", "sessions"), (name) => name.startsWith("rollout-") && name.endsWith(".jsonl")).length;

const sessions = claudeSessions + codexSessions;
const subagents = claude.length - claudeSessions;
const record = {
  runs: sessions + subagents,
  sessions,
  subagents,
  days: DAYS,
  measuredOn: new Date().toISOString().slice(0, 10),
};

writeFileSync(new URL("../data/agent-runs.json", import.meta.url), `${JSON.stringify(record, null, 2)}\n`);
console.log(record);
