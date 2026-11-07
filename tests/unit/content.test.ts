import { describe, expect, test } from "vitest";
import { profile } from "@/content/profile";
import { featuredProjects, getProject, moreProjects, projects } from "@/content/projects";

describe("content", () => {
  test("featured projects are the five resume projects in order", () => {
    expect(featuredProjects.map((p) => p.slug)).toEqual(["eskool", "fastshare", "qr-scanner", "powergyan", "calcr-pro"]);
  });

  test("project slugs are unique", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("every link is https or mailto", () => {
    const hrefs = [...profile.socials, ...projects.flatMap((p) => p.links)].map((l) => l.href);
    for (const href of hrefs) expect(href).toMatch(/^(https:\/\/|mailto:)/);
  });

  test("no excluded personal details", () => {
    const all = JSON.stringify({ profile, projects });
    for (const banned of ["9840239154", "t.me", "Telegram", "20%", "DPS", "Battery Gyan", "crdyo", "CRDYO"]) {
      expect(all).not.toContain(banned);
    }
  });

  test("play store ids only on the three published apps", () => {
    const ids = Object.fromEntries(projects.map((p) => [p.slug, p.playStoreId]));
    expect(ids).toMatchObject({ eskool: "com.eskool.crdy", fastshare: "com.crdy.fastshare", "qr-scanner": "com.ritikqrscanner.app" });
    for (const p of projects) {
      if (!["eskool", "fastshare", "qr-scanner"].includes(p.slug)) expect(p.playStoreId).toBeUndefined();
    }
  });

  test("availability text", () => {
    expect(profile.availability).toBe("Open to remote freelance & full-time roles · Nepal & international");
  });

  test("public email", () => {
    expect(profile.email).toBe("contact@ritikthakur.com.np");
  });

  test("getProject returns undefined for unknown slug", () => {
    expect(getProject("nope")).toBeUndefined();
    expect(getProject("eskool")?.name).toBe("eSkool");
  });

  test("featured projects have case-study body, others are not featured", () => {
    for (const p of featuredProjects) expect(p.body.length).toBeGreaterThan(0);
    for (const p of moreProjects) expect(p.featured).toBe(false);
  });
});

test("FastShare carries a small PairDrop credit without a link", () => {
  const fs = getProject("fastshare")!;
  expect(fs.credit).toBe("Built on the open-source PairDrop project (GPL-3.0).");
  expect(JSON.stringify(fs.links)).not.toMatch(/pairdrop/i);
  expect(fs.body.join(" ")).not.toMatch(/pairdrop/i);
});
