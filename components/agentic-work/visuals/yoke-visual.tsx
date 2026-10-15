import { TerminalFrame } from "./terminal-frame";
import styles from "./visuals.module.css";

/** Explain Yoke's approval, independent review and evidence boundaries. */
export function YokeVisual(): React.ReactElement {
  return (
    <TerminalFrame title="Yoke / policy console" caption="Pre-release / proof of completion">
      <div className={styles.policyHeading}><span className={styles.bracket}>[ policy ]</span><strong>I make &quot;done&quot; prove it.</strong></div>
      <dl className={styles.stateRows}>
        <div><dt>Policy gates</dt><dd>Human-approved checks</dd></div>
        <div><dt>Review</dt><dd>Independent scrutiny</dd></div>
        <div><dt>Console</dt><dd>Visible decision trail</dd></div>
      </dl>
      <div className={styles.guardrail}><span>Approval boundary</span><strong>Completion backed by evidence</strong></div>
      <div className={styles.connectionLabels}><span>Claude Code</span><span>Codex</span></div>
    </TerminalFrame>
  );
}
