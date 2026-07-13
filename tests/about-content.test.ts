import { describe, expect, it } from "vitest";

import { SECTIONS, LINKS } from "@/components/about/content";

describe("SECTIONS", () => {
  it("has exactly six sections with the expected labels", () => {
    expect(SECTIONS).toHaveLength(6);
    expect(SECTIONS.map((s) => s.label)).toEqual([
      "01 · WHO I AM",
      "02 · BACKGROUND",
      "03 · SECURITY",
      "04 · WHAT I DO",
      "05 · HOW I WORK",
      "06 · CONTACT",
    ]);
  });

  it("fills every contract field", () => {
    for (const s of SECTIONS) {
      expect(s.id).toBeTruthy();
      expect(s.label).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.paragraphs.length).toBeGreaterThan(0);
      for (const p of s.paragraphs) {
        expect(p.trim()).not.toBe("");
      }
      expect(["center", "left"]).toContain(s.align);
    }
  });

  it("section 4 carries the four discipline cards", () => {
    expect(SECTIONS[3].cards?.map((c) => c.id)).toEqual([
      "appsec",
      "devops",
      "ai",
      "product",
    ]);
  });

  it("section 5 carries the method beats and three principles", () => {
    expect(SECTIONS[4].beats?.map((b) => b.label)).toEqual([
      "PLAN",
      "BUILD",
      "SECURE",
      "AUTOMATE",
    ]);
    expect(SECTIONS[4].quotes?.map((q) => q.note)).toEqual([
      "SYSTEMS THINKING",
      "GROWTH MINDSET",
      "THE LONG GAME",
    ]);
  });

  it("names the current role at Startise and xCloud in section 1", () => {
    const text = SECTIONS[0].paragraphs.join(" ");
    expect(text).toContain("Startise");
    expect(text).toContain("xCloud");
  });

  it("keeps contact links", () => {
    expect(LINKS.github).toBe("https://github.com/mrx-arafat");
    expect(LINKS.linkedin).toBe("https://www.linkedin.com/in/e4rafat");
    expect(LINKS.contact).toBe("/contact");
  });
});
