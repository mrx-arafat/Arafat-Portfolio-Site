import { describe, expect, it } from "vitest";

import {
  CAPABILITY_PIPELINES,
  EVIDENCE,
  EVOLUTION,
  LINKS,
  PROFILE,
} from "@/components/about/content";

describe("About field manual content", () => {
  it("describes the approved evolution and capability pipeline", () => {
    expect(EVOLUTION.map((stage) => stage.id)).toEqual([
      "builder",
      "researcher",
      "operator",
    ]);
    expect(CAPABILITY_PIPELINES.map((pipeline) => pipeline.id)).toEqual([
      "build",
      "secure",
      "operate",
      "automate",
    ]);
  });

  it("keeps the current role and verified public evidence", () => {
    expect(PROFILE.role).toContain("Startise");
    expect(PROFILE.context).toContain("xCloud");
    expect(EVIDENCE.map((item) => item.label)).toEqual([
      "Public repositories",
      "Security research",
      "Peer-reviewed research",
      "AIFlowiz",
    ]);
    expect(EVIDENCE.find((item) => item.id === "research")?.href).toBe(
      "https://doi.org/10.1016/j.array.2026.100901",
    );
  });

  it("contains no em dashes in About-page content", () => {
    const content = JSON.stringify({
      CAPABILITY_PIPELINES,
      EVIDENCE,
      EVOLUTION,
      LINKS,
      PROFILE,
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
