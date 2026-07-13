import type { CSSProperties, ReactElement } from "react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SkillCardProps } from "@/components/skills/types";

/** Resolve a lucide icon component by name, falling back to CircleDot. */
function resolveIcon(name: string): LucideIcon {
  const candidate = LucideIcons[name as keyof typeof LucideIcons];
  if (
    candidate &&
    (typeof candidate === "function" || typeof candidate === "object")
  ) {
    return candidate as LucideIcon;
  }
  return LucideIcons.CircleDot;
}

/**
 * Instrument-panel row for one skill: colored tick, icon, name, description.
 * Flagship skills render as a highlighted band with a NOTABLE tag.
 */
export function SkillCard({ skill, color }: SkillCardProps): ReactElement {
  const Icon = resolveIcon(skill.icon);
  const isFlagship = skill.flagship === true;

  const accentVars = {
    "--accent": color,
    "--accent-wash": `${color}0d`,
  } as CSSProperties;

  if (isFlagship) {
    return (
      <article
        style={{
          ...accentVars,
          borderColor: `${color}59`,
          background: `linear-gradient(105deg, ${color}14, transparent 55%)`,
        }}
        className="relative my-3 border-l-2 px-5 py-5 md:px-6"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span aria-hidden="true" style={{ color }}>
            <Icon size={20} strokeWidth={1.75} />
          </span>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            {skill.name}
          </h3>
          <span
            className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.3em]"
            style={{ color }}
          >
            <span aria-hidden="true">★</span>
            Notable
          </span>
        </div>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
          {skill.description}
        </p>
      </article>
    );
  }

  return (
    <article
      style={accentVars}
      className="group relative flex flex-col gap-1.5 border-l-2 border-transparent px-5 py-4 transition-colors duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent-wash)] md:flex-row md:items-baseline md:gap-6 md:px-6"
    >
      <div className="flex w-64 shrink-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="text-neutral-500 transition-colors duration-200 group-hover:text-[var(--accent)]"
        >
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <h3 className="text-[15px] font-medium text-neutral-800 dark:text-neutral-200">
          {skill.name}
        </h3>
      </div>
      <p className="pl-7 text-sm leading-relaxed text-neutral-500 transition-colors duration-200 group-hover:text-neutral-700 dark:group-hover:text-neutral-400 md:pl-0">
        {skill.description}
      </p>
    </article>
  );
}
