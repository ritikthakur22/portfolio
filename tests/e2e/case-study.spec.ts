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

test("opening a project plays the curtain then navigates", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("#work a", { hasText: "FastShare" });
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await expect(page.locator('[data-curtain="open"]')).toContainText("FastShare");
  await expect(page).toHaveURL(/\/projects\/fastshare$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("FastShare");
});
