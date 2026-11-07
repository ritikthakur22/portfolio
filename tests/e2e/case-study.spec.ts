import { expect, test } from "@playwright/test";

test("case study page renders", async ({ page }) => {
  const res = await page.goto("/projects/eskool");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("eSkool");
  await expect(page.getByRole("link", { name: "Back to work" })).toHaveAttribute("href", "/#work");
});

test("unknown project is a 404", async ({ page }) => {
  const res = await page.goto("/projects/nope");
  expect(res?.status()).toBe(404);
});

test("opening a project navigates straight there with no curtain", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("#work a", { hasText: "FastShare" });
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await expect(page).toHaveURL(/\/projects\/fastshare$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("FastShare");
  await expect(page.locator("[data-curtain]")).toHaveCount(0);
});

test("project screenshots are served, including non-featured projects", async ({ request }) => {
  for (const path of ["/projects/todo/1.webp", "/projects/guptrix/1.webp", "/projects/eskool/1.webp"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});

test("opening a project from far down the page starts at the top", async ({ page, isMobile }) => {
  test.skip(isMobile, "smooth scrolling and pinning run on desktop");
  await page.goto("/");
  await page.waitForTimeout(1500); // let idle-started smooth scrolling and pinning kick in
  await page.evaluate(() => document.getElementById("work")!.scrollIntoView());
  await page.waitForTimeout(400);
  // scroll fast and click while smooth scrolling is still gliding, like a real visitor
  await page.mouse.move(600, 440);
  for (let i = 0; i < 22; i++) {
    await page.mouse.wheel(0, 110);
    await page.waitForTimeout(40);
  }
  await page.mouse.click(600, 440);
  await expect(page).toHaveURL(/\/projects\//);
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(50);
});
