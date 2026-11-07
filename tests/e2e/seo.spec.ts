import { expect, test } from "@playwright/test";

test("home has title, canonical, share image and person data", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Ritik Thakur | Software Developer, Web & Mobile Apps");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.ritikthakur.com.np");
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /opengraph-image/);
  expect(await page.locator('script[type="application/ld+json"]').first().textContent()).toContain('"@type":"Person"');
});

test("case study has its own title, canonical and app data", async ({ page }) => {
  await page.goto("/projects/eskool");
  await expect(page).toHaveTitle("eSkool: School and college ERP | Ritik Thakur");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.ritikthakur.com.np/projects/eskool");
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("");
  expect(ld).toContain("SoftwareApplication");
  expect(ld).toContain("BreadcrumbList");
});

test("crawler files and share images are served", async ({ request }) => {
  for (const [path, type] of [["/sitemap.xml", "xml"], ["/robots.txt", "text"], ["/llms.txt", "text"], ["/manifest.webmanifest", "json"], ["/opengraph-image", "image/png"], ["/projects/fastshare/opengraph-image", "image/png"]]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"], path).toContain(type);
  }
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap: https://www.ritikthakur.com.np/sitemap.xml");
});
