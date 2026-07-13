/** Shared contracts for the Skill Universe page. */

export interface CategoryMeta {
  id: string;
  label: string;
  tagline: string;
  /** Hex color, e.g. "#e5484d" */
  color: string;
  /** Ascending display/orbit order, 1-based */
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  /** Flagship skills render larger with glow treatment */
  flagship?: boolean;
}

export interface GalaxyHeroProps {
  categories: CategoryMeta[];
  /** categoryId -> number of skills (drives planet size) */
  skillCounts: Record<string, number>;
  /** Fired after the camera dip animation when a planet is clicked/tapped */
  onPlanetSelect: (categoryId: string) => void;
}

export interface CategorySectionProps {
  category: CategoryMeta;
  skills: Skill[];
}

export interface SkillCardProps {
  skill: Skill;
  /** Category hex color for accents */
  color: string;
}

/** DOM id for a category section anchor. */
export function categorySectionId(categoryId: string): string {
  return `category-${categoryId}`;
}
