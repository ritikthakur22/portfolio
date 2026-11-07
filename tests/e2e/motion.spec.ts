import { expect, test } from "@playwright/test";

const samples = ["#hero h1", "#about p", "#experience article", "#work h3", "#more ul", "#skills h3", "#contact h2"];

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("every sample stays fully visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(800);
    for (const id of samples) {
      const opacity = await page.locator(id).first().evaluate((el) => getComputedStyle(el).opacity);
      expect(opacity, id).toBe("1");
    }
    await expect(page.locator("canvas")).toHaveCount(0);
  });
});

test("touch devices get no pinning and no dot grid", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  await page.waitForTimeout(800);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("desktop pins the horizontal section and draws the dot grid", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await page.goto("/");
  await page.waitForTimeout(800);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await expect(page.locator("canvas")).toHaveCount(1);
});
