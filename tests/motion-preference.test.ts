import { runInNewContext } from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { resolveMotionPreference } from "@/components/open-circuit/motion-preference";

const preference = vi.hoisted(() => ({ motion: "off", isMotionEnabled: false }));
const launchControl = vi.hoisted(() => ({ activate: undefined as (() => void) | undefined, push: vi.fn(), prefetch: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: launchControl.push, prefetch: launchControl.prefetch }) }));
// Capture the native button's public activation handler without starting a browser or adding a DOM dependency.
vi.mock("react/jsx-runtime", async importOriginal => {
  const actual = await importOriginal<typeof import("react/jsx-runtime")>();
  const capture = (render: typeof actual.jsx): typeof actual.jsx => (...args) => {
    const props = args[1] as { "aria-label"?: string; onClick?: () => void };
    if (args[0] === "button" && props["aria-label"]?.startsWith("CLICK ANYWHERE TO LAUNCH")) launchControl.activate = props.onClick;
    return render(...args);
  };
  return { ...actual, jsx: capture(actual.jsx), jsxs: capture(actual.jsxs) };
});
vi.mock("react/jsx-dev-runtime", async importOriginal => {
  const actual = await importOriginal<typeof import("react/jsx-dev-runtime")>();
  return { ...actual, jsxDEV: (...args: Parameters<typeof actual.jsxDEV>) => {
    const props = args[1] as { "aria-label"?: string; onClick?: () => void };
    if (args[0] === "button" && props["aria-label"]?.startsWith("CLICK ANYWHERE TO LAUNCH")) launchControl.activate = props.onClick;
    return actual.jsxDEV(...args);
  } };
});
vi.mock("@/components/open-circuit/motion-provider", () => ({
  useMotion: () => preference,
  MotionToggle: () => createElement("button", { type: "button" }, "Motion"),
}));

import HomeClient from "@/app/components/HomeClient";
import HomeShell from "@/app/components/HomeShell";
import { BOOT_SESSION_SCRIPT } from "@/app/components/boot-session";
import { getFleetFrame } from "@/app/components/fleet-timeline";
import { MissionControl } from "@/components/dashboard/mission-control";

afterEach(() => { vi.useRealTimers(); launchControl.push.mockClear(); launchControl.prefetch.mockClear(); launchControl.activate = undefined; });

it("honors a saved pause while always respecting reduced motion", () => {
  expect(resolveMotionPreference(null, false)).toBe("on");
  expect(resolveMotionPreference("off", false)).toBe("off");
  expect(resolveMotionPreference("on", true)).toBe("reduced");
});

it.each(["off", "reduced"])("shows the complete terminal boot immediately with motion %s", (motion) => {
  preference.motion = motion;
  preference.isMotionEnabled = false;
  const html = renderToStaticMarkup(createElement(HomeClient));
  expect(html).toContain('data-boot-state="ready"');
  expect(html).toContain('data-motion="off"');
  expect(html).toContain("fleet up 6 2 claude,codex");
  expect(html).toContain("Engage superintelligence mode");
  expect(html.match(/data-pane-state="merged"/g)).toHaveLength(6);
  expect(html).toContain('data-merged="true"');
  expect(html).toContain('aria-describedby="boot-description"');
  expect(html).toContain('class="oc-fleet-panes" aria-hidden="true"');
  const screen = html.match(/<div class="oc-boot-screen"[^>]*>/)?.[0];
  expect(screen).toContain('tabindex="0"');
  expect(screen).toContain('role="region"');
  expect(screen).toContain('aria-label="Parallel work replay"');
  const summary = html.match(/<p id="boot-description"[^>]*>([\s\S]*?)<\/p>/)?.[1];
  expect(summary).toContain("six separate terminal panes");
  expect(summary).toContain("its own task and git worktree");
  expect(summary).toContain("build waits until review verifies");
  expect(html).not.toContain("[  OK  ]");
  expect(html).not.toContain("oc-boot-banner");
});

it("starts the optional boot at zero when motion is enabled", () => {
  preference.motion = "on";
  preference.isMotionEnabled = true;
  const html = renderToStaticMarkup(createElement(HomeClient));
  expect(html).toContain('data-boot-state="booting"');
  expect(html).toContain('data-merged="false"');
  expect(html).toContain("Engage superintelligence mode");
  expect(html).toContain("Enter the site");
  expect(html).toContain("Click the button to enter now");
  expect(html).toContain("Skip intro");
});

it("covers the dashboard with an open intro in the server-rendered first paint", () => {
  preference.motion = "on";
  preference.isMotionEnabled = true;
  const html = renderToStaticMarkup(createElement(HomeShell, null, createElement("h1", {}, "Dashboard")));
  expect(html.match(/<dialog[^>]*>/)?.[0]).toContain('open=""');
  expect(html.indexOf("<dialog")).toBeLessThan(html.indexOf("<h1"));
});

it.each([
  { path: "/", search: "", saved: null, blocked: false, expected: "data-boot-pending" },
  { path: "/", search: "", saved: "1", blocked: false, expected: "data-booted" },
  { path: "/", search: "?boot=1", saved: null, blocked: false, expected: "data-booted" },
  { path: "/", search: "", saved: null, blocked: true, expected: "data-boot-pending" },
  { path: "/skills", search: "", saved: null, blocked: false, expected: null },
  { path: "/skills", search: "", saved: "1", blocked: false, expected: "data-booted" },
])("sets the first-paint cover before body parsing for $path, saved=$saved, blocked=$blocked", ({ path, search, saved, blocked, expected }) => {
  const attributes: string[] = [];
  runInNewContext(BOOT_SESSION_SCRIPT, {
    document: { documentElement: { setAttribute: (name: string) => attributes.push(name) } },
    location: { pathname: path, search },
    sessionStorage: { getItem: () => { if (blocked) throw new Error("Storage blocked"); return saved; } },
    URLSearchParams,
  });
  expect(attributes).toEqual(expected ? [expected] : []);
});

it("holds the build until review verifies before merging all six branches", () => {
  const held = getFleetFrame(2500);
  expect(held.panes.find(pane => pane.id === "build")?.state).toBe("held");
  expect(held.panes.find(pane => pane.id === "build")?.commits).toBe(2);
  expect(getFleetFrame(3100).panes.find(pane => pane.id === "review")?.state).toBe("verified");
  expect(getFleetFrame(3100).panes.find(pane => pane.id === "build")?.state).toBe("held");
  expect(getFleetFrame(3250).panes.find(pane => pane.id === "build")?.commits).toBe(3);
  expect([2200, 2500, 2800].map(time => getFleetFrame(time).panes.find(pane => pane.id === "review")?.checks)).toEqual([1, 2, 3]);
  const stalled = [2150, 2900].map(time => getFleetFrame(time).panes.find(pane => pane.id === "build"));
  expect(stalled[0]?.progress).toBe(stalled[1]?.progress);
  expect(stalled[0]?.added).toBe(stalled[1]?.added);
  expect(stalled[0]?.scroll).toBe(stalled[1]?.scroll);
  const final = getFleetFrame(4200);
  expect(final.panes).toHaveLength(6);
  expect(final.panes.every(pane => pane.state === "merged")).toBe(true);
  expect(final.merge).toBe(1);
  expect(final.panes.every(pane => pane.lines.length >= 10 && pane.progress === 1)).toBe(true);
  expect(getFleetFrame(3740).mainPulse).toBeGreaterThan(0);
  expect(getFleetFrame(3740).borderFlash).toBeGreaterThan(0);
});

it("streams dense histories at different speeds before the review hold", () => {
  const early = getFleetFrame(1400).panes;
  const later = getFleetFrame(1900).panes;
  expect(later.every((pane, index) => pane.scroll > early[index].scroll)).toBe(true);
  expect(new Set(later.map(pane => pane.scroll)).size).toBeGreaterThan(1);
  expect(later.every(pane => pane.added > 0 && pane.removed > 0)).toBe(true);
});

it.each(["off", "reduced"])("navigates directly to the Skill Universe with motion %s", (motion) => {
  preference.motion = motion;
  preference.isMotionEnabled = false;
  const html = renderToStaticMarkup(createElement(MissionControl));
  expect(html).toContain('href="/skills"');
  expect(html).toContain("cd skills -&gt;");
  expect(html).toContain('role="status" aria-live="polite"');
  expect(html).not.toContain("<animate");
  expect(launchControl.activate).toBeTypeOf("function");
  launchControl.activate?.();
  expect(launchControl.prefetch).toHaveBeenCalledWith("/skills");
  expect(launchControl.push).toHaveBeenCalledExactlyOnceWith("/skills");
});

it("navigates once after the original countdown, ignition and liftoff", () => {
  vi.useFakeTimers();
  preference.motion = "on";
  preference.isMotionEnabled = true;
  renderToStaticMarkup(createElement(MissionControl));
  expect(launchControl.activate).toBeTypeOf("function");
  launchControl.activate?.();
  launchControl.activate?.();
  expect(launchControl.prefetch).toHaveBeenCalledExactlyOnceWith("/skills");
  vi.advanceTimersByTime(4349);
  expect(launchControl.push).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(launchControl.push).toHaveBeenCalledExactlyOnceWith("/skills");
});
