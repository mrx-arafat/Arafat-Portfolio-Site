import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";

const motion = vi.hoisted(() => ({ motion: "off", isMotionEnabled: false }));

vi.mock("@/components/open-circuit/motion-provider", () => ({
  useMotion: () => motion,
}));

import GalaxyHero from "@/components/skills/galaxy-hero";
import { CategorySection } from "@/components/skills/category-section";

const category = { id: "security", label: "Security", tagline: "Find the risky assumption before it ships", color: "#e5484d", order: 1 };

it("renders the original 3D hero immediately when motion is enabled", () => {
  motion.motion = "on";
  motion.isMotionEnabled = true;
  const html = renderToStaticMarkup(createElement(GalaxyHero, {
    categories: [category], skillCounts: { security: 1 }, onPlanetSelect: vi.fn(),
  }));
  expect(html).toContain("<canvas");
  expect(html).toContain('aria-label="Skill Universe. Choose a category planet or use the orbit index below."');
  expect(html).not.toContain("Launch");
});

it.each(["off", "reduced"])("keeps the original galaxy fallback and skill rows visible with motion %s", (preference) => {
  motion.motion = preference;
  motion.isMotionEnabled = false;
  const html = renderToStaticMarkup(createElement(GalaxyHero, {
    categories: [category],
    skillCounts: { security: 1 },
    onPlanetSelect: vi.fn(),
  }));
  expect(html).toContain('aria-label="Skill categories in the static galaxy"');
  expect(html).toContain("Arafat - core star");
  expect(html).toContain('href="#category-security"');
  expect(html).not.toContain("<canvas");
  const section = renderToStaticMarkup(createElement(CategorySection, {
    category,
    skills: [{ id: "security-review", name: "Security review", description: "Find risky assumptions", icon: "Shield", category: "security" }],
  }));
  expect(section).toContain("Security review");
  expect(section).not.toContain("opacity-0");
});
