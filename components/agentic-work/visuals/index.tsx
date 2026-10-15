import type { AgenticWorkProjectId } from "../content";
import { AgenticTerminalVisual } from "./agentic-terminal-visual";
import { AppHarnessVisual } from "./app-harness-visual";
import { DeepReadVisual } from "./deepread-visual";
import { HerdrPlannerVisual } from "./herdr-planner-visual";
import { OrchestrationVisual } from "./orchestration-visual";
import { SkillsVisual } from "./skills-visual";
import { WorktreeVisual } from "./worktree-visual";
import { YokeVisual } from "./yoke-visual";

export { AgenticTerminalVisual, AppHarnessVisual, DeepReadVisual, HerdrPlannerVisual, OrchestrationVisual, SkillsVisual, WorktreeVisual, YokeVisual };

const VISUALS = {
  yoke: YokeVisual,
  "herdr-setup": HerdrPlannerVisual,
  deepread: DeepReadVisual,
  "app-harness": AppHarnessVisual,
  "multi-agent-orchestration": OrchestrationVisual,
  "agentic-terminal": AgenticTerminalVisual,
  "wt-cli": WorktreeVisual,
  "day-to-day-skills": SkillsVisual,
} satisfies Record<AgenticWorkProjectId, () => React.ReactElement>;

/** Reuse the same decorative project explanation in the archive or workbench. */
export function AgenticProjectVisual({ projectId }: { projectId: AgenticWorkProjectId }): React.ReactElement {
  const Visual = VISUALS[projectId];
  return <Visual />;
}
