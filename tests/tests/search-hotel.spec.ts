import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("baslilokma04@gmail.com");
  await page.locator("[name=password]").fill("aaaaaaaa");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Homepage")).toBeVisible();
});

test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Algiers");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in Algiers")).toBeVisible();
  await expect(page.getByText("Hyatt Regency")).toBeVisible();
});

test("should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Algiers");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Ibis Hotel").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});
