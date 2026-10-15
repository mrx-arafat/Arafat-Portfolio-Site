import type { ReactElement, ReactNode } from "react";
import HomeClient from "./HomeClient";

/** Keep the home content server-rendered while a session-scoped modal supplies the boot moment. */
export default function HomeShell({ children }: { children: ReactNode }): ReactElement {
  return <><HomeClient />{children}</>;
}
