import { SignalArrow, TerminalFrame } from "./terminal-frame";
import styles from "./visuals.module.css";

/** Place the AI tutor beside the passage, with the reader's own connection. */
export function DeepReadVisual(): React.ReactElement {
  return (
    <TerminalFrame title="DeepRead / beside the page" caption="Your Claude Code, Codex or API key">
      <div className={styles.readingFlow}>
        <div className={styles.bookPage}><span className={styles.label}>Private reading library</span><span className={styles.readingLines}><i /><i /><i /></span><strong className={styles.selectedPassage}>Selected passage</strong><span className={styles.readingLines}><i /><i /></span><span className={styles.bookmark}>Precise bookmarks</span></div>
        <SignalArrow />
        <div className={styles.tutor}><span className={styles.bracket}>[ AI tutor ]</span><strong>I keep help in the margin.</strong><span>Word meanings</span><span>Explanations</span></div>
      </div>
      <div className={styles.readingTools}><span>Offline natural voices</span><span>Shared libraries</span></div>
    </TerminalFrame>
  );
}
