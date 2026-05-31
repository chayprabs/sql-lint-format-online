import { test, expect } from "@playwright/test";

test("home loads playground", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner")).toContainText("SQLGuard");
  await expect(page.getByPlaceholder("Paste your SQL here")).toBeVisible();
  await expect(page.getByRole("button", { name: "Lint" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Format" })).toBeVisible();
});

test("lint flags risky UPDATE", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Paste your SQL here").fill("UPDATE users SET active = true;");
  await page.getByRole("button", { name: "Lint" }).click();
  await expect(page.getByText("missing-where-update-delete")).toBeVisible();
});

test("format produces output", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Paste your SQL here").fill("select id from users");
  await page.getByRole("button", { name: "Format" }).click();
  await expect(page.getByText("Output", { exact: true })).toBeVisible();
});

test("seo routes respond", async ({ page }) => {
  for (const path of [
    "/sql-format-online",
    "/sql-lint-online",
    "/sql-pretty-print",
    "/bigquery-formatter",
    "/snowflake-formatter",
  ]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Format" })).toBeVisible();
  }
});

test("legal pages", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: /Terms/ })).toBeVisible();
});

test("external links in header", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTitle("GitHub repository")).toHaveAttribute(
    "href",
    "https://github.com/chayprabs/sql-lint-format-online",
  );
});

test("format options and diff", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Paste your SQL here").fill("select id from users");
  await page.getByRole("button", { name: "Format" }).click();
  await expect(page.getByText("Show diff")).toBeVisible();
});

test("share updates hash", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Paste your SQL here").fill("SELECT 1;");
  await page.getByRole("button", { name: "Copy share link" }).click();
  await expect(page).toHaveURL(/#/);
});

test("404 page", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
