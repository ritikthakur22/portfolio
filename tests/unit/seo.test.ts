import { expect, test } from "vitest";
import sitemap from "@/app/sitemap";
import { featuredProjects, getProject } from "@/content/projects";
import { breadcrumbJsonLd, llmsTxt, personJsonLd, projectJsonLd, SITE_URL } from "@/lib/seo";

test("sitemap lists home and every case study on the canonical origin", () => {
  const urls = sitemap().map((e) => e.url);
  expect(SITE_URL).toBe("https://www.ritikthakur.com.np");
  expect(urls).toEqual([SITE_URL, ...featuredProjects.map((p) => `${SITE_URL}/projects/${p.slug}`)]);
});

test("person structured data", () => {
  const p = personJsonLd() as Record<string, unknown> & { alumniOf: { name: string }; sameAs: string[] };
  expect(p["@type"]).toBe("Person");
  expect(p.jobTitle).toBeTruthy();
  expect(p.alumniOf.name).toContain("Advanced College of Engineering");
  expect(p.sameAs).toEqual(expect.arrayContaining(["https://github.com/ritikthakur22", "https://www.linkedin.com/in/ritikthakur22"]));
  expect(JSON.stringify(p)).not.toContain("telephone");
});

test("project and breadcrumb structured data", () => {
  const eskool = getProject("eskool")!;
  expect(projectJsonLd(eskool)).toMatchObject({ "@type": "SoftwareApplication", installUrl: "https://play.google.com/store/apps/details?id=com.eskool.crdy" });
  expect(JSON.stringify(breadcrumbJsonLd(eskool))).toContain(`${SITE_URL}/projects/eskool`);
});

test("llms.txt covers the featured projects and hides the phone number", () => {
  const t = llmsTxt();
  for (const p of featuredProjects) expect(t).toContain(p.name);
  expect(t).not.toContain("9840239154");
});
