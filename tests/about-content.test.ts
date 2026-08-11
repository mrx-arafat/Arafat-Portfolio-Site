import { describe, expect, it } from "vitest";

import {
  LINKS,
  OPERATING_AREAS,
  PROOF,
  PROFILE,
  WORK_TRACKS,
} from "@/components/about/content";

describe("About operational dossier content", () => {
  it("describes the current operating areas and work tracks", () => {
    expect(OPERATING_AREAS.map((area) => area.id)).toEqual([
      "security",
      "platform",
      "automation",
    ]);
    expect(WORK_TRACKS.map((track) => track.id)).toEqual([
      "secure",
      "operate",
      "automate",
    ]);
  });

  it("keeps the current role and verified public evidence", () => {
    expect(PROFILE.role).toContain("Startise");
    expect(PROFILE.context).toContain("xCloud");
    expect(PROOF.map((item) => item.id)).toEqual([
      "security",
      "research",
      "systems",
      "aiflowiz",
    ]);
    expect(PROOF.find((item) => item.id === "research")?.href).toBe(
      "https://doi.org/10.1016/j.array.2026.100901",
    );
  });

  it("contains no em dashes in About-page content", () => {
    const content = JSON.stringify({
      LINKS,
      OPERATING_AREAS,
      PROOF,
      PROFILE,
      WORK_TRACKS,
    });

    expect(content).not.toContain("—");
  });

  it("keeps the primary navigation destinations", () => {
    expect(LINKS.projects).toBe("/projects");
    expect(LINKS.security).toBe("/security-research");
    expect(LINKS.contact).toBe("/contact");
    expect(LINKS.aiflowiz).toBe("https://aiflowiz.com/");
  });
});
