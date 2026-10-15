import { TerminalFrame } from "./terminal-frame";
import styles from "./visuals.module.css";

/** Connect team coordination to tasks, messaging, memory and the audit trail. */
export function OrchestrationVisual(): React.ReactElement {
  return (
    <TerminalFrame title="Teamwork / task map" caption="Dashboard / team activity + workflow execution">
      <div className={styles.fleetHub}><span className={styles.operatorGlyph}>@</span><div><span className={styles.label}>I like my work where I can see it.</span><strong>Team coordination</strong></div><svg viewBox="0 0 72 34" fill="none" aria-hidden="true"><path d="M2 17h22M24 17l18-12h26M24 17h44M24 17l18 12h26" stroke="currentColor" strokeWidth="1.5" /><circle cx="68" cy="5" r="3" fill="currentColor" /><circle cx="68" cy="17" r="3" fill="currentColor" /><circle cx="68" cy="29" r="3" fill="currentColor" /></svg></div>
      <div className={styles.fleetBranches}>
        <div><span className={styles.branchPort} /><strong>Kanban tasks</strong><span>Organize the work</span></div>
        <div><span className={styles.branchPort} /><strong>Inter-agent messaging</strong><span>Coordinate the team</span></div>
        <div><span className={styles.branchPort} /><strong>Multi-stage workflows</strong><span>Carry work through stages</span></div>
      </div>
      <div className={styles.memoryBus}><span>Shared memory</span><span>Signed audit trail</span></div>
    </TerminalFrame>
  );
}
