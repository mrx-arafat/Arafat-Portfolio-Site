import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import ProjectsPage from "@/app/projects/page";
import { ORDERED_PROJECTS } from "@/app/projects/projects-data";
import { MotionProvider } from "@/components/open-circuit/motion-provider";

describe("Public project archive", () => {
  it("should include current agent tooling once and preserve the earlier build log", () => {
    expect(ORDERED_PROJECTS.find((project) => project.name === "Yoke")?.html_url).toBe(
      "https://github.com/mrx-arafat/yoke",
    );
    expect(ORDERED_PROJECTS.find((project) => project.name === "DeepRead")?.homepage).toBe(
      "https://deepread.arafatops.com",
    );
    expect(ORDERED_PROJECTS.filter((project) => project.name === "Multi-Agent Orchestration")).toHaveLength(1);
    expect(ORDERED_PROJECTS.some((project) => project.name === "MealMetrics")).toBe(true);
  });

  it("should retain published case studies without advertising inaccessible source", () => {
    const termstream = ORDERED_PROJECTS.find((project) => project.name === "TermStream");
    expect(termstream?.caseStudyPath).toBe("/projects/client-work/termstream");
    expect(termstream?.homepage).toBe("https://ts.arafatops.com");
    expect(termstream?.html_url).toBeUndefined();
    expect(ORDERED_PROJECTS.find((project) => project.name === "GitHub PR Extractor")?.html_url).toBeUndefined();
    expect(ORDERED_PROJECTS.find((project) => project.name === "LinuxBuddy")?.html_url).toBe(
      "https://github.com/mrx-arafat/linux-buddy",
    );
  });

  it("should publish the repository URL when a project has an empty homepage", () => {
    const html = renderToStaticMarkup(createElement(MotionProvider, null, createElement(ProjectsPage)));
    const script = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!script) throw new Error("Project structured data is missing");
    const schema: {
      "@graph": Array<{
        "@type": string;
        itemListElement?: Array<{ item: { name: string; url?: string } }>;
      }>;
    } = JSON.parse(script[1]);
    const entries = schema["@graph"].find((node) => node["@type"] === "ItemList")?.itemListElement;
    expect(entries?.find(({ item }) => item.name === "K1NGB0B Recon Script")?.item.url).toBe(
      "https://github.com/mrx-arafat/K1NGB0B-recon-script",
    );
    expect(entries?.some(({ item }) => item.url === "")).toBe(false);
  });
});
