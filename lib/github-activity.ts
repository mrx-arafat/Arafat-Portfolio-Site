/**
 * Public GitHub activity for the home page's live status card.
 * Only public events exist in this feed, so private work never appears.
 * GitHub documents the feed as delayed by 30 seconds to 6 hours, so "live" means recent, not real time.
 */

const GITHUB_USER = "mrx-arafat";
const EVENTS_URL = `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=50`;
/** How long one events response is reused; the card polls the API route on the same rhythm. */
export const ACTIVITY_REVALIDATE_SECONDS = 120;
const MAX_ITEMS = 6;
const MAX_TEXT = 90;

export interface ActivityItem {
  id: string;
  verb: string;
  /** Own repositories drop the owner prefix; contributions elsewhere keep it. */
  repo: string;
  text: string;
  href: string;
  /** ISO 8601 timestamp. */
  at: string;
}

interface GithubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    head?: string;
    number?: number;
    pull_request?: { title?: string; html_url?: string; merged?: boolean };
    issue?: { number?: number; title?: string; html_url?: string };
    comment?: { html_url?: string };
    review?: { html_url?: string };
    release?: { tag_name?: string; name?: string | null; html_url?: string };
    description?: string | null;
  };
}

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_ACTIVITY_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "arafatops.com",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/** Only ever link to GitHub itself; anything else in the payload is ignored. */
function githubUrl(url: string | undefined, fallback: string): string {
  return url?.startsWith("https://github.com/") ? url : fallback;
}

function shortRepo(name: string): string {
  return name.startsWith(`${GITHUB_USER}/`) ? name.slice(GITHUB_USER.length + 1) : name;
}

function clip(text: string): string {
  const line = text.split("\n")[0].trim();
  return line.length > MAX_TEXT ? `${line.slice(0, MAX_TEXT - 3).trimEnd()}...` : line;
}

/** First line of a pushed commit's message. Commits never change, so the lookup is cached for a day. */
async function commitMessage(repo: string, sha: string): Promise<string | undefined> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}`, {
      headers: githubHeaders(),
      next: { revalidate: 86_400 },
    });
    if (!response.ok) return undefined;
    const commit = (await response.json()) as { commit?: { message?: string } };
    return commit.commit?.message;
  } catch {
    return undefined;
  }
}

/** Pull request events in the public feed carry only the number, so the title is looked up (cached for a day). */
async function pullTitle(repo: string, number: number): Promise<string | undefined> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/pulls/${number}`, {
      headers: githubHeaders(),
      next: { revalidate: 86_400 },
    });
    if (!response.ok) return undefined;
    return ((await response.json()) as { title?: string }).title;
  } catch {
    return undefined;
  }
}

/** Map one event to a card line, or null for event types the card does not show (stars, forks, deletes). */
function toItem(event: GithubEvent): Omit<ActivityItem, "text"> & { text?: string; sha?: string; pull?: number } | null {
  const repoUrl = `https://github.com/${event.repo.name}`;
  const base = { id: event.id, repo: shortRepo(event.repo.name), at: event.created_at };
  const { payload } = event;
  switch (event.type) {
    case "PushEvent":
      if (!payload.head) return null;
      return { ...base, verb: "pushed", sha: payload.head, href: `${repoUrl}/commit/${payload.head}`, text: payload.ref?.replace("refs/heads/", "to ") };
    case "PullRequestEvent": {
      const pr = payload.pull_request;
      // The feed now reports merges as their own "merged" action; older events used "closed" plus a merged flag.
      const merged = payload.action === "merged" || (payload.action === "closed" && pr?.merged === true);
      const verb = payload.action === "opened" ? "opened PR" : merged ? "merged PR" : null;
      if (!verb || !payload.number) return null;
      return { ...base, verb, pull: payload.number, text: pr?.title, href: githubUrl(pr?.html_url, `${repoUrl}/pull/${payload.number}`) };
    }
    case "PullRequestReviewEvent":
      return payload.pull_request?.title ? { ...base, verb: "reviewed PR", text: payload.pull_request.title, href: githubUrl(payload.review?.html_url, repoUrl) } : null;
    case "IssuesEvent":
      return payload.action === "opened" && payload.issue?.title ? { ...base, verb: "opened issue", text: `#${payload.issue.number} ${payload.issue.title}`, href: githubUrl(payload.issue.html_url, repoUrl) } : null;
    case "IssueCommentEvent":
      return payload.issue?.title ? { ...base, verb: "commented", text: `#${payload.issue.number} ${payload.issue.title}`, href: githubUrl(payload.comment?.html_url, repoUrl) } : null;
    case "ReleaseEvent":
      return payload.release?.tag_name ? { ...base, verb: "released", text: payload.release.name || payload.release.tag_name, href: githubUrl(payload.release.html_url, repoUrl) } : null;
    case "CreateEvent":
      return payload.ref_type === "repository" ? { ...base, verb: "created repo", text: payload.description ?? "", href: repoUrl } : null;
    default:
      return null;
  }
}

export interface ContributionDay {
  date: string;
  count: number;
}

/** Every number on the card covers the same window, so they can sit side by side. */
export const STATS_WINDOW_DAYS = 30;

export interface GithubStats {
  /** All contributions in the window (commits, PRs, issues, reviews); private ones count, but only as numbers. */
  contributions: number;
  /** Pull requests opened in the window. */
  pullRequests: number;
  /** Days in the window with at least one contribution. */
  activeDays: number;
  /** One entry per day of the window, oldest first. */
  days: ContributionDay[];
  /** Public repositories he owns, forks excluded. */
  publicRepos: number;
}

interface StatsResponse {
  data?: {
    user?: {
      contributionsCollection: {
        totalPullRequestContributions: number;
        contributionCalendar: { weeks: { contributionDays: { date: string; contributionCount: number }[] }[] };
      };
      repositories: { totalCount: number };
    };
  };
}

/** Whole UTC days, so the query (and therefore its cache entry) only changes once a day. */
function windowBounds(): { from: string; to: string; firstDay: string } {
  const today = new Date().toISOString().slice(0, 10);
  const first = new Date(Date.parse(`${today}T00:00:00Z`) - (STATS_WINDOW_DAYS - 1) * 86_400_000).toISOString().slice(0, 10);
  return { from: `${first}T00:00:00Z`, to: `${today}T23:59:59Z`, firstDay: first };
}

/**
 * Last-30-day totals for the card's numbers. GitHub's GraphQL API always needs a token, so without
 * one this returns null and the card shows only the numbers it can stand behind. The totals are
 * counts only; no private repository name or content is ever read.
 */
export async function getGithubStats(): Promise<GithubStats | null> {
  if (!process.env.GITHUB_ACTIVITY_TOKEN) return null;
  const { from, to, firstDay } = windowBounds();
  const query = `{ user(login: "${GITHUB_USER}") {
    contributionsCollection(from: "${from}", to: "${to}") {
      totalPullRequestContributions
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
    }
    repositories(privacy: PUBLIC, isFork: false, ownerAffiliations: OWNER) { totalCount }
  } }`;
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: githubHeaders(),
      body: JSON.stringify({ query }),
      next: { revalidate: 600 },
    });
    if (!response.ok) {
      console.error(`[github-activity] stats request failed: ${response.status}`);
      return null;
    }
    const user = ((await response.json()) as StatsResponse).data?.user;
    if (!user) return null;
    const days = user.contributionsCollection.contributionCalendar.weeks
      .flatMap((week) => week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })))
      .filter((day) => day.date >= firstDay && day.date <= to.slice(0, 10));
    return {
      contributions: days.reduce((sum, day) => sum + day.count, 0),
      pullRequests: user.contributionsCollection.totalPullRequestContributions,
      activeDays: days.filter((day) => day.count > 0).length,
      days,
      publicRepos: user.repositories.totalCount,
    };
  } catch (error) {
    console.error("[github-activity] stats unavailable", error);
    return null;
  }
}

/**
 * Newest public activity, newest first. Repeated pushes to one repository and repeated comments on one
 * thread collapse to their newest entry. Any failure returns an empty list: the card then shows only its
 * static lines, never an error.
 */
export async function getGithubActivity(): Promise<ActivityItem[]> {
  try {
    const response = await fetch(EVENTS_URL, { headers: githubHeaders(), next: { revalidate: ACTIVITY_REVALIDATE_SECONDS } });
    if (!response.ok) {
      console.error(`[github-activity] events request failed: ${response.status}`);
      return [];
    }
    const events = ((await response.json()) as GithubEvent[]).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    const seen = new Set<string>();
    const picked: (NonNullable<ReturnType<typeof toItem>> & { fullRepo: string })[] = [];
    for (const event of events) {
      const item = toItem(event);
      if (!item) continue;
      // Pushes, comments and merges repeat in bursts, so each keeps only its newest line per repository.
      const bursty = item.verb === "pushed" || item.verb === "commented" || item.verb === "merged PR";
      const key = bursty ? `${item.verb}:${event.repo.name}` : `${item.verb}:${event.repo.name}:${item.pull ?? item.text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      picked.push({ ...item, fullRepo: event.repo.name });
      if (picked.length === MAX_ITEMS) break;
    }
    return await Promise.all(
      picked.map(async ({ sha, pull, fullRepo, text, ...item }) => {
        if (pull !== undefined) {
          const title = text ?? (await pullTitle(fullRepo, pull));
          return { ...item, text: clip(title ? `#${pull} ${title}` : `#${pull}`) };
        }
        const message = sha ? await commitMessage(fullRepo, sha) : undefined;
        // A merge commit says nothing about the work, so the branch name reads better.
        const useful = message && !/^Merge (branch|pull request|remote-tracking)/.test(message) ? message : undefined;
        return { ...item, text: clip(useful ?? text ?? "") };
      }),
    );
  } catch (error) {
    console.error("[github-activity] events unavailable", error);
    return [];
  }
}
