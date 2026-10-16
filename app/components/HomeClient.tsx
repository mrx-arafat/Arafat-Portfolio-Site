"use client";

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactElement } from "react";
import { MotionToggle, useMotion } from "@/components/open-circuit/motion-provider";
import { BOOT_TERMINALS, BootTerminalPane } from "./boot-terminal-pane";
import { FLEET_COMMAND, FLEET_EXIT_AT, FLEET_READY_AT, getFleetFrame } from "./fleet-timeline";

const LANES = [12, 24, 36, 60, 72, 84];
const COMPLETE_FRAME = getFleetFrame(FLEET_READY_AT);

const FleetReplay = memo(function FleetReplay({ frame, variant }: { frame: ReturnType<typeof getFleetFrame>; variant: "live" | "static" | "still" }): ReactElement {
  const checks = frame.panes.find(pane => pane.id === "review")?.checks ?? 0;
  const gate = frame.gate === "holding" ? "WARN: review gate: holding build until review verifies" : frame.gate === "verified" ? "Review verified. Build released." : frame.gate === "released" ? "All checks verified. Ready to merge." : "Six tasks / review before merge.";
  return <div className={`oc-fleet-replay oc-fleet-replay-${variant}`} aria-hidden="true">
    <div className="oc-fleet-panes" aria-hidden="true">
      {frame.panes.map(pane => <BootTerminalPane key={pane.id} pane={pane} />)}
    </div>
    <div className="oc-fleet-gate" data-gate={frame.gate}><span className="oc-fleet-line-full">{gate}{frame.gate === "holding" && ` / review ${checks}/3`}</span><span className="oc-fleet-line-small">{frame.gate === "holding" ? `WARN build held / review ${checks}/3` : frame.gate === "verified" ? "Review 3/3. Releasing build." : frame.gate === "released" ? "Checks verified. Ready to merge." : "Review before merge."}</span></div>
    <div className="oc-fleet-graph" data-merged={frame.merge === 1}>
      <span>master</span>
      <svg viewBox="0 0 1000 96" preserveAspectRatio="none">
        <path d="M0 48H1000" className="oc-fleet-mainline" />
        {frame.panes.map((pane, index) => {
          const lane = LANES[index] * (1 - frame.merge) + 48 * frame.merge;
          return <g key={pane.id} data-pane-theme={BOOT_TERMINALS[pane.id].theme}>
            <path d={`M24 48C80 48 90 ${lane} 150 ${lane}H800C900 ${lane} 910 48 976 48`} pathLength={100} strokeDasharray="100" strokeDashoffset={(1 - pane.spawn) * 100} opacity={1 - frame.merge * .65} className={pane.state === "held" ? "oc-fleet-branch oc-fleet-held" : "oc-fleet-branch"} />
            {Array.from({ length: pane.commits }, (_, commit) => <circle key={commit} cx={(290 + commit * 210) * (1 - frame.merge) + 976 * frame.merge} cy={lane} r={pane.state === "held" && commit === 1 ? 5 : 4} className={pane.state === "held" ? "oc-fleet-commit oc-fleet-held" : "oc-fleet-commit"} />)}
          </g>;
        })}
        <path d="M0 48H1000" className="oc-fleet-main-pulse" pathLength={100} strokeDasharray="12 112" strokeDashoffset={12 - frame.mainPulse * 124} opacity={frame.mainPulse < 0 ? 0 : 1} />
        <circle cx="976" cy="48" r={5 + frame.merge * 3} className="oc-fleet-commit" />
      </svg>
      <span>master</span>
    </div>
    <p className="oc-fleet-merge" data-merged={frame.merge === 1}>{frame.merge === 1 ? "[ MERGED ] six branches -> master, approved by me" : "six worktrees / review before merge"}</p>
  </div>;
});

/** Replay a parallel work session, then fold its pane borders into the real home circuit. */
export default function HomeClient(): ReactElement {
  const dialog = useRef<HTMLDialogElement>(null);
  const animation = useRef(0);
  const { isMotionEnabled } = useMotion();
  const [elapsed, setElapsed] = useState(0);
  const [fastForwarded, setFastForwarded] = useState(false);
  const [entering, setEntering] = useState(false);
  const ready = !isMotionEnabled || fastForwarded || elapsed >= FLEET_READY_AT;
  const time = entering ? Math.max(FLEET_READY_AT, elapsed) : ready ? FLEET_READY_AT : elapsed;
  const frame = getFleetFrame(time);

  const closeIntro = useCallback((): void => {
    cancelAnimationFrame(animation.current);
    try { sessionStorage.setItem("arafat-booted", "1"); } catch { /* The document still remembers this visit if storage is blocked. */ }
    document.documentElement.setAttribute("data-booted", "");
    document.documentElement.removeAttribute("data-boot-pending");
    dialog.current?.close();
    document.getElementById("hero-title")?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    let skip = new URLSearchParams(window.location.search).get("boot") === "1";
    try { skip = skip || sessionStorage.getItem("arafat-booted") === "1"; } catch { /* The intro works without storage. */ }
    if (skip || document.documentElement.hasAttribute("data-booted")) { element.close(); document.documentElement.removeAttribute("data-boot-pending"); return; }
    const previousOverflow = document.documentElement.style.overflow;
    const restoreScroll = (): void => { document.documentElement.style.overflow = previousOverflow; };
    // Upgrade the server-rendered open dialog to a modal within the same task, without a paint gap.
    element.removeAttribute("open");
    element.showModal();
    element.addEventListener("close", restoreScroll);
    document.documentElement.style.overflow = "hidden";
    document.documentElement.removeAttribute("data-boot-pending");
    if (!window.matchMedia("(pointer: coarse)").matches) element.querySelector<HTMLButtonElement>(".oc-boot-enter")?.focus({ preventScroll: true });
    return () => { cancelAnimationFrame(animation.current); element.removeEventListener("close", restoreScroll); element.close(); restoreScroll(); };
  }, []);

  useEffect(() => {
    if (!dialog.current?.open) return;
    if (!isMotionEnabled) { if (entering) closeIntro(); return; }
    if (fastForwarded && !entering) return;
    const start = performance.now();
    const from = entering ? FLEET_READY_AT : 0;
    const end = entering ? FLEET_EXIT_AT : FLEET_READY_AT;
    let previous = 0;
    const tick = (now: number): void => {
      const next = Math.min(end, from + now - start);
      if (next - previous >= 32 || next === end) { setElapsed(next); previous = next; }
      if (next < end) animation.current = requestAnimationFrame(tick);
      else if (entering) closeIntro();
    };
    animation.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation.current);
  }, [isMotionEnabled, fastForwarded, entering, closeIntro]);

  function enter(): void {
    if (entering) return;
    if (!isMotionEnabled) { closeIntro(); return; }
    const target = document.querySelector<HTMLElement>("[data-intro-trace]") ?? document.getElementById("hero-title");
    const bounds = target?.getBoundingClientRect();
    if (bounds) {
      const top = Math.max(0, bounds.top);
      const height = Math.max(60, Math.min(window.innerHeight - top, bounds.height));
      dialog.current?.querySelectorAll<HTMLElement>(".oc-fleet-replay-live [data-fleet-pane]").forEach((pane, index) => {
        const box = pane.getBoundingClientRect();
        pane.style.setProperty("--fold-x", (bounds.left - box.left) + "px");
        pane.style.setProperty("--fold-y", (top + height * index / 6 - box.top) + "px");
        pane.style.setProperty("--fold-sx", String(2 / box.width));
        pane.style.setProperty("--fold-sy", String(height / 6 / box.height));
      });
    }
    setFastForwarded(true);
    setEntering(true);
  }

  function handleKey(event: KeyboardEvent<HTMLDialogElement>): void {
    setFastForwarded(true);
    if (event.key === "Enter" && !(event.target instanceof Element && event.target.closest("button"))) { event.preventDefault(); enter(); }
  }

  const style = { "--oc-handoff": frame.handoff, "--oc-merge-flash": frame.flash } as CSSProperties;

  return <dialog ref={dialog} open className="oc-boot" style={style} data-boot-state={entering ? "entering" : ready ? "ready" : "booting"} data-motion={isMotionEnabled ? "on" : "off"} aria-modal="true" aria-labelledby="boot-title" aria-describedby="boot-description" onKeyDownCapture={handleKey} onPointerDownCapture={() => setFastForwarded(true)} onCancel={event => { event.preventDefault(); closeIntro(); }}>
    <h2 id="boot-title" className="oc-sr">Terminal session / Arafat</h2>
    <p id="boot-description" className="oc-sr">I run Claude Code and Codex in six separate terminal panes across two tabs with the command fleet up 6 2 claude,codex. Each has its own task and git worktree. This replay illustrates research, build, review, security, memory and documentation working in parallel. Research links context, review verifies three example checks, security records my nine disclosed CVEs, memory mounts my second brain, and documentation prepares the handoff. The build waits until review verifies the change, then releases its commit and all six branches merge into master, approved by me. The example filenames, commit hashes and test counters explain the workflow. Press Enter or choose Enter the site to open my dashboard. Any other key or tap shows the completed replay. Skip intro and Escape enter immediately.</p>
    <div className="oc-fleet-shell">
      <header className="oc-fleet-chrome"><span>arafat / <b>terminal session</b></span><MotionToggle /></header>
      <div className="oc-fleet-command" aria-hidden="true"><span>$ </span><span className="oc-fleet-command-reserve">{FLEET_COMMAND}</span><span className="oc-fleet-command-typed">{frame.command}<i style={{ opacity: ready || Math.floor(time / 180) % 2 === 0 ? 1 : 0 }} /></span></div>
      <div className="oc-boot-screen" tabIndex={0} role="region" aria-label="Parallel work replay">
        <FleetReplay frame={frame} variant={isMotionEnabled ? "live" : "static"} />
        {isMotionEnabled && <FleetReplay frame={COMPLETE_FRAME} variant="still" />}
      </div>
      <div className="oc-fleet-action"><p className="oc-boot-instruction">{ready ? "Ready. Click the button to enter the site." : "Booting. Click the button to enter now."}</p><form method="dialog" className="oc-boot-form"><button type="submit" className="oc-boot-enter" onClick={event => { event.preventDefault(); enter(); }} aria-busy={entering}><span className="oc-boot-enter-label">Enter the site</span><span className="oc-boot-enter-hint" aria-hidden="true">click or press Enter -&gt;</span></button></form></div>
      <footer className="oc-fleet-status"><span aria-hidden="true">[work]<b> 1 </b><span className="oc-fleet-tab">2</span><span className="oc-fleet-status-detail"> / session replay</span></span><form method="dialog" className="oc-boot-form"><button type="submit" className="oc-boot-skip" onClick={event => { event.preventDefault(); closeIntro(); }}>Skip intro</button></form></footer>
    </div>
  </dialog>;
}
