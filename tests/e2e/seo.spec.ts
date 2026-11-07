import { expect, test } from "@playwright/test";

test("home has title, canonical, share image and person data", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Ritik Portfolio");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.ritikthakur.com.np");
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /opengraph-image/);
  expect(await page.locator('script[type="application/ld+json"]').first().textContent()).toContain('"@type":"Person"');
});

test("case study has its own title, canonical and app data", async ({ page }) => {
  await page.goto("/projects/eskool");
  await expect(page).toHaveTitle("eSkool: School and college ERP | Ritik Portfolio");
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

test("tab icon is Ritik's photo", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(href).toContain("/icon.png");
  const res = await request.get(href!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});
