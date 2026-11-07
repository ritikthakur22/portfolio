import { expect, test } from "@playwright/test";

test("custom 404 page with eye, links and chat shortcut", async ({ page }) => {
  const res = await page.goto("/some/missing/page");
  expect(res?.status()).toBe(404);
  await expect(page).toHaveTitle(/Page not found/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("404");
  await expect(page.getByTestId("lost-eye")).toBeVisible();
  await expect(page.getByRole("link", { name: "Go to the home page" })).toHaveAttribute("href", "/");
  await expect(page.getByRole("link", { name: "eSkool" })).toHaveAttribute("href", "/projects/eskool");
  await page.getByRole("button", { name: "Ask the AI where to go" }).click();
  await expect(page.getByRole("dialog", { name: "Chat about Ritik" })).toBeVisible();
});
