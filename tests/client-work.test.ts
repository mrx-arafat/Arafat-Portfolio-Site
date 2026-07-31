import { describe, expect, it } from "vitest";

import {
  CLIENT_PROJECTS,
  CLIENT_WORK_CTA,
  getAdjacentSlideIndex,
  getClientProject,
  getSwipeStep,
} from "@/components/client-work/content";

describe("Client Work archive", () => {
  it("keeps the approved projects, live destinations, and authentic walkthroughs", () => {
    expect(CLIENT_PROJECTS.map((project) => project.id)).toEqual([
      "termstream",
      "second-brain-deck",
    ]);
    expect(CLIENT_PROJECTS.map((project) => project.deploymentUrl)).toEqual([
      "https://ts.arafatops.com",
      "https://obsidian.arafatops.com",
    ]);
    expect(CLIENT_PROJECTS.map((project) => project.detailPath)).toEqual([
      "/projects/client-work/termstream",
      "/projects/client-work/second-brain-deck",
    ]);
    expect(CLIENT_PROJECTS.map((project) => project.slides.length)).toEqual([
      5, 4,
    ]);
    expect(
      CLIENT_PROJECTS.flatMap((project) =>
        project.slides.map((slide) => slide.image),
      ).every((image) => image.startsWith("/images/client-work/")),
    ).toBe(true);
  });

  it("resolves each dedicated case-study route without mixing records", () => {
    expect(getClientProject("termstream")?.title).toBe("TermStream");
    expect(getClientProject("second-brain-deck")?.title).toBe(
      "Second Brain.Deck",
    );
    expect(getClientProject("unknown-project")).toBeUndefined();
  });

  it("uses the existing contact destination for the engineering review CTA", () => {
    expect(CLIENT_WORK_CTA.href).toBe("/contact");
    expect(CLIENT_WORK_CTA.label).toBe("Schedule Engineering Review");
  });

  it("wraps previous and next carousel navigation", () => {
    expect(getAdjacentSlideIndex(0, -1, 4)).toBe(3);
    expect(getAdjacentSlideIndex(3, 1, 4)).toBe(0);
    expect(getAdjacentSlideIndex(1, 1, 4)).toBe(2);
  });

  it("maps deliberate horizontal swipes without reacting to small movement", () => {
    expect(getSwipeStep(200, 130)).toBe(1);
    expect(getSwipeStep(130, 200)).toBe(-1);
    expect(getSwipeStep(200, 170)).toBe(0);
  });
});
