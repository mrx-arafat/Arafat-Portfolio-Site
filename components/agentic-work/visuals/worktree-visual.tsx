import { TerminalFrame } from "./terminal-frame";
import styles from "./visuals.module.css";

/** Draw separate workspaces with name-or-number navigation. */
export function WorktreeVisual(): React.ReactElement {
  return (
    <TerminalFrame title="wt-cli / workspace tree" caption="Separate directories for parallel agent work">
      <div className={styles.treeRoot}><span className={styles.folderMark} /><strong>Git repository</strong></div>
      <div className={styles.workspaceTree}>
        <div><svg viewBox="0 0 28 44" fill="none" aria-hidden="true"><path d="M1 0v28h25" stroke="currentColor" strokeWidth="1.5" /></svg><div><span className={styles.folderMark} /><div><strong>Workspace by name</strong><span>Separate working directory</span></div></div></div>
        <div><svg viewBox="0 0 28 44" fill="none" aria-hidden="true"><path d="M1 0v28h25" stroke="currentColor" strokeWidth="1.5" /></svg><div><span className={styles.folderMark} /><div><strong>Workspace by number</strong><span>Separate working directory</span></div></div></div>
      </div>
      <div className={styles.workspaceActions}><span>List</span><span>Create</span><span>Move between</span></div>
      <p className={styles.screenNote}>I have better things to memorize.</p>
    </TerminalFrame>
  );
}
