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
