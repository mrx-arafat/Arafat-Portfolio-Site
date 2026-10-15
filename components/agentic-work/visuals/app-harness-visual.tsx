import { FileMark, SignalArrow, TerminalFrame } from "./terminal-frame";
import styles from "./visuals.module.css";

/** Separate app generation from deterministic gates and adversarial evaluation. */
export function AppHarnessVisual(): React.ReactElement {
  return (
    <TerminalFrame title="App Harness / review loop" caption="Supervised app-building / Claude Code skill">
      <p className={styles.largeStatement}>I make the builder<br /><span>take criticism.</span></p>
      <div className={styles.pipeline}>
        <div><span className={styles.label}>Planning</span><strong>Isolated plan</strong></div><SignalArrow />
        <div><span className={styles.label}>Building</span><strong>Generation</strong></div><SignalArrow />
        <div className={styles.reviewGate}><span className={styles.label}>Checking</span><strong>Deterministic gates</strong></div><SignalArrow />
        <div className={styles.reviewGate}><span className={styles.label}>Critique</span><strong>Adversarial evaluation</strong></div>
      </div>
      <div className={styles.evidenceBus}><FileMark /><span>Evidence exchanged through files</span><span className={styles.returnPath}>Build + critique loop</span></div>
    </TerminalFrame>
  );
}
