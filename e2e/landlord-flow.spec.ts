import { expect, test } from "@playwright/test";

test("a new landlord can sign up, add a property and a room", async ({ page }) => {
  const email = `landlord+${Date.now()}@example.com`;

  // Go straight to the landlord sign-up form
  await page.goto("/login?mode=signup&role=landlord");

  // Sign up
  await page.getByLabel("Full name").fill("Test Landlord");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Test-password-123");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/landlord/);

  // A room needs a property first, and the app sends a new landlord there
  await page.goto("/landlord/rooms/new");
  await expect(page).toHaveURL(/\/landlord\/properties\/new/);
  await page.getByLabel("Property name").fill("12 Mokoena Street");
  await page.getByLabel("Street address").fill("12 Mokoena Street, Soweto");
  await page.getByRole("button", { name: "Save property" }).click();

  // Now the room form
  await expect(page).toHaveURL(/\/landlord\/rooms\/new/);
  await page.getByLabel("Room name").fill("Backroom 1");
  await page.getByLabel("Monthly rent (R)").fill("1200");
  await page.getByLabel("Deposit (R)").fill("1200");
  await page.getByRole("button", { name: "Save room" }).click();

  // The room appears in the list
  await expect(page).toHaveURL(/\/landlord\/rooms$/);
  await expect(page.getByText("Backroom 1")).toBeVisible();
});
