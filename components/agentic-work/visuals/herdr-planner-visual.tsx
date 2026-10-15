import { SignalArrow, TerminalFrame } from "./terminal-frame";
import styles from "./visuals.module.css";

/** Show the layout-first fleet planner and its supported agent tools. */
export function HerdrPlannerVisual(): React.ReactElement {
  return (
    <TerminalFrame title="herdr / layout planner" caption="Interactive manual / plan the layout first">
      <div className={styles.operator}><span className={styles.operatorGlyph}>@</span><div><span className={styles.label}>I made room.</span><strong>My tabs have a seating plan.</strong></div></div>
      <div className={styles.plannerSteps}><span>Plan layout</span><SignalArrow /><span>Start workers</span><SignalArrow /><span>Give tasks</span></div>
      <div className={styles.plannerBoard}>
        {["Claude Code", "Codex", "Agy"].map((agent) => <div key={agent} className={styles.plannerPane}><span className={styles.paneHandle} /><strong>{agent}</strong><span className={styles.workerLine}>worker + task</span><span className={styles.terminalLines}><i /><i /></span></div>)}
      </div>
      <p className={styles.screenNote}>Side by side in herdr. The work stays visible.</p>
    </TerminalFrame>
  );
}
