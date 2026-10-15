import { FileMark, TerminalFrame } from "./terminal-frame";
import styles from "./visuals.module.css";

/** Index the documented reusable skills and their supporting templates. */
export function SkillsVisual(): React.ReactElement {
  return (
    <TerminalFrame title="Day-to-Day Skills / index" caption="Personal toolkit / reusable Claude Code skills">
      <div className={styles.skillsTitle}><span className={styles.bracket}>[ reusable instructions ]</span><strong>I reuse my good ideas.</strong></div>
      <div className={styles.skillIndex}>
        <div><FileMark /><div><strong>Article workflows</strong><span>Structured instructions</span></div><span className={styles.skillType}>skill</span></div>
        <div><FileMark /><div><strong>Security research</strong><span>Structured instructions</span></div><span className={styles.skillType}>skill</span></div>
        <div><FileMark /><div><strong>Supporting templates</strong><span>Reusable resources</span></div><span className={styles.skillType}>template</span></div>
      </div>
      <div className={styles.skillResult}>I already wrote the instructions.</div>
    </TerminalFrame>
  );
}
