import type { ReactNode } from "react";

import styles from "./visuals.module.css";

interface TerminalFrameProps {
  title: string;
  caption: string;
  children: ReactNode;
}

/** Frame a decorative concept diagram; its card supplies the real description. */
export function TerminalFrame({ title, caption, children }: TerminalFrameProps): React.ReactElement {
  return (
    <div className={styles.frame} aria-hidden="true">
      <div className={styles.chrome}>
        <span className={styles.windowMarks}><i /><i /><i /></span>
        <span>{title}</span>
        <span className={styles.chromeKind}>Schematic</span>
      </div>
      <div className={styles.screen}>{children}</div>
      <div className={styles.caption}><span className={styles.traceMark} />{caption}</div>
    </div>
  );
}

/** Draw a small connection without baking the diagram into an image. */
export function SignalArrow(): React.ReactElement {
  return <svg className={styles.arrow} viewBox="0 0 32 16" fill="none" aria-hidden="true"><path d="M1 8h28m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

/** Draw a document symbol for a native skills or evidence record. */
export function FileMark(): React.ReactElement {
  return <svg className={styles.fileMark} viewBox="0 0 24 28" fill="none" aria-hidden="true"><path d="M3 1h11l7 7v19H3zM14 1v8h7M7 14h10M7 19h8" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
