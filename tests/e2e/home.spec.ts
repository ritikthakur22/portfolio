import { expect, test } from "@playwright/test";
import { profile } from "../../content/profile";
import { featuredProjects } from "../../content/projects";

test("hero shows title, availability and actions", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toContainText("Software");
  await expect(h1).toContainText("Developer");
  await expect(page.getByText(profile.availability)).toBeVisible();
  await expect(page.getByRole("link", { name: "Download resume" })).toHaveAttribute("href", "/resume.pdf");
  await expect(page.getByRole("link", { name: "View my work" })).toHaveAttribute("href", "#work");
});

test("all five featured projects can be read", async ({ page }) => {
  await page.goto("/");
  for (const p of featuredProjects) {
    const title = page.locator("#work h3", { hasText: p.name });
    await title.scrollIntoViewIfNeeded();
    await expect(title).toBeVisible();
  }
});

test("phone number never appears", async ({ page }) => {
  await page.goto("/");
  expect(await page.content()).not.toContain("9840239154");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("content is still visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#work h3")).toHaveCount(featuredProjects.length);
    for (const h of await page.locator("#work h3").all()) await expect(h).toBeVisible();
    await expect(page.locator("#experience h3").first()).toBeVisible();
  });
});
