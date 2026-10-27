import { afterEach, expect, it, vi } from "vitest";

import { getGithubActivity } from "@/lib/github-activity";

const json = (body: unknown, ok = true): Response => ({ ok, status: ok ? 200 : 403, json: async () => body }) as Response;

afterEach(() => vi.unstubAllGlobals());

it("turns public events into one line per push, PR and comment, newest first", async () => {
  const events = [
    { id: "1", type: "PushEvent", created_at: "2026-10-26T17:18:16Z", repo: { name: "mrx-arafat/yoke" }, payload: { ref: "refs/heads/main", head: "abc123" } },
    { id: "2", type: "PushEvent", created_at: "2026-10-26T17:10:00Z", repo: { name: "mrx-arafat/yoke" }, payload: { ref: "refs/heads/main", head: "def456" } },
    { id: "3", type: "WatchEvent", created_at: "2026-10-26T16:00:00Z", repo: { name: "cloudflare/security-audit-skill" }, payload: { action: "started" } },
    // The public feed now sends merged pull requests without a title, so the card looks it up.
    { id: "4", type: "PullRequestEvent", created_at: "2026-10-26T15:00:00Z", repo: { name: "WordPress/hosting-handbook" }, payload: { action: "merged", number: 7, pull_request: { id: 1, number: 7, url: "https://api.github.com/repos/WordPress/hosting-handbook/pulls/7" } } },
    { id: "5", type: "PullRequestEvent", created_at: "2026-10-26T14:00:00Z", repo: { name: "WordPress/hosting-handbook" }, payload: { action: "merged", number: 6, pull_request: { id: 2, number: 6 } } },
  ];
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    if (url.includes("/commits/")) return json({ commit: { message: "Add review gate timeout\n\nBody" } });
    if (url.includes("/pulls/7")) return json({ title: "Document fail-closed backups" });
    return json(events);
  }));

  expect(await getGithubActivity()).toEqual([
    { id: "1", verb: "pushed", repo: "yoke", text: "Add review gate timeout", href: "https://github.com/mrx-arafat/yoke/commit/abc123", at: "2026-10-26T17:18:16Z" },
    { id: "4", verb: "merged PR", repo: "WordPress/hosting-handbook", text: "#7 Document fail-closed backups", href: "https://github.com/WordPress/hosting-handbook/pull/7", at: "2026-10-26T15:00:00Z" },
  ]);
});

it("returns no lines instead of failing when GitHub refuses the request", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => json({ message: "API rate limit exceeded" }, false)));
  vi.spyOn(console, "error").mockImplementation(() => {});

  expect(await getGithubActivity()).toEqual([]);
});
