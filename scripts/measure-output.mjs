#!/usr/bin/env node
// Measures the last 30 days of output that only this machine can see and records it in
// data/output-stats.json for the home page's live card:
// - AI agent runs: Claude Code sessions and sub-agents plus Codex sessions on this machine.
//   Claude Code keeps about 30 days of transcripts, so 30 days is the window every count can cover.
// - Pull requests and daily contributions: the public site's token only sees public work, so these
//   come from the logged-in gh CLI, which also counts private work. Only numbers are recorded, never a name.
// Run: node scripts/measure-output.mjs
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DAYS = 30;
const GITHUB_USER = "mrx-arafat";
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

/**
 * Pull requests and daily contributions in the same whole-UTC-day window the card uses, counting private
 * work, or null if gh is unavailable or logged in as someone else.
 */
function githubOutput() {
  const today = new Date().toISOString().slice(0, 10);
  const first = new Date(Date.parse(`${today}T00:00:00Z`) - (DAYS - 1) * 86_400_000).toISOString().slice(0, 10);
  const query = `{ viewer { login contributionsCollection(from: "${first}T00:00:00Z", to: "${today}T23:59:59Z") {
    totalPullRequestContributions
    contributionCalendar { weeks { contributionDays { date contributionCount } } }
  } } }`;
  try {
    const out = execFileSync("gh", ["api", "graphql", "-f", `query=${query}`], { encoding: "utf8" });
    const viewer = JSON.parse(out).data?.viewer;
    if (viewer?.login !== GITHUB_USER) return null;
    const collection = viewer.contributionsCollection;
    const contributionDays = collection.contributionCalendar.weeks
      .flatMap((week) => week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })))
      .filter((day) => day.date >= first && day.date <= today);
    return { pullRequests: collection.totalPullRequestContributions, contributionDays };
  } catch {
    return null;
  }
}

const claudeRoot = join(homedir(), ".claude", "projects");
const claude = recent(claudeRoot, (name) => name.endsWith(".jsonl"));
// A session transcript sits directly in its project folder; anything deeper is a sub-agent.
const claudeSessions = claude.filter((path) => path.split("/").length === claudeRoot.split("/").length + 2).length;
const codexSessions = recent(join(homedir(), ".codex", "sessions"), (name) => name.startsWith("rollout-") && name.endsWith(".jsonl")).length;
const sessions = claudeSessions + codexSessions;
const subagents = claude.length - claudeSessions;
const github = githubOutput();

const record = {
  days: DAYS,
  measuredOn: new Date().toISOString().slice(0, 10),
  agentRuns: sessions + subagents,
  agentSessions: sessions,
  subagents,
  ...github,
};

writeFileSync(new URL("../data/output-stats.json", import.meta.url), `${JSON.stringify(record, null, 2)}\n`);
console.log(record);
