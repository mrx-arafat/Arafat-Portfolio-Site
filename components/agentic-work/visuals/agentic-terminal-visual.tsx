import { TerminalFrame } from "./terminal-frame";
import styles from "./visuals.module.css";

/** Make a folder-scoped session's inputs, actions and approvals visible. */
export function AgenticTerminalVisual(): React.ReactElement {
  return (
    <TerminalFrame title="Agentic Terminal / session" caption="Hosted models / local Ollama / Claude Code CLI">
      <div className={styles.sessionScope}><span className={styles.bracket}>[ folder-scoped ]</span><strong>I keep the receipts inline.</strong></div>
      <div className={styles.sessionInput}><span className={styles.inputMark}>&gt;_</span><div><span>Shell commands</span><span>Natural-language requests</span></div><span className={styles.inputLabel}>One input</span></div>
      <div className={styles.executionLedger}>
        <div><span className={styles.ledgerMark}>/</span><span>Tool calls</span><span>visible</span></div>
        <div><span className={styles.ledgerMark}>/</span><span>File changes</span><span>visible</span></div>
        <div><span className={styles.ledgerMark}>/</span><span>Approval steps</span><span className={styles.warningText}>visible</span></div>
      </div>
    </TerminalFrame>
  );
}
