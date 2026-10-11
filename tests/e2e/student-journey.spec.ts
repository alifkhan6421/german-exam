import { expect, test, type Page } from "@playwright/test";

async function login(page: Page, email = "student@example.com", password = "student-dev-123") {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL(/\/dashboard|\/onboarding/);
}

test("student takes the free Goethe A1 mock exam end to end", async ({ page }) => {
  await login(page);
  await page.goto("/exams/goethe/a1/1");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Goethe");
  await page.getByRole("button", { name: "Start exam" }).click();
  await page.waitForURL(/\/attempts\/[0-9a-f-]+$/);
  const attemptUrl = page.url();

  // Server-side timer is visible and the answer key is never sent to the browser.
  await expect(page.getByLabel("Time remaining")).toBeVisible();
  const view = await page.request.get(attemptUrl.replace("/attempts/", "/api/attempts/"));
  const body = await view.text();
  expect(body).not.toContain("answerKey");
  expect(body).not.toContain("\"turns\"");

  // Answer question 1 and confirm it survives a reload (autosave + resume).
  const q1 = page.getByRole("radiogroup", { name: "Question 1" });
  const saved = page.waitForResponse((r) => r.url().includes("/answers") && r.request().method() === "PUT" && r.ok());
  await q1.locator("label").first().click();
  await saved;
  await page.reload();
  await expect(page.getByRole("radiogroup", { name: "Question 1" }).locator("input").first()).toBeChecked();

  // Move through the modules and submit.
  for (let i = 0; i < 6; i++) {
    const essay = page.getByLabel(/^Your text for task/);
    if (await essay.isVisible()) {
      const saved = page.waitForResponse((r) => r.url().includes("/answers") && r.request().method() === "PUT" && r.ok());
      await essay.fill("Sehr geehrte Damen und Herren, ich möchte einen Termin am Montag um 10 Uhr. Geht das? Viele Grüße, Elena Rossi");
      await saved;
    }
    const submit = page.getByRole("button", { name: /^Submit exam$/ });
    if (await submit.isVisible()) break;
    await page.getByRole("button", { name: /^Finish .* and continue$/ }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
  await page.getByRole("button", { name: /^Submit exam$/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Submit" }).click();
  await page.waitForURL(/\/results$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Results");
  await expect(page.getByText("This is a practice estimate")).toBeVisible();
  await expect(page.getByText("Awaiting assessment").first()).toBeVisible();

  await page.getByRole("link", { name: "Review answers" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Answer review");
  await expect(page.getByText("Correct:").first()).toBeVisible();
});

test("premium exams stay locked for a free account", async ({ page }) => {
  await login(page);
  await page.goto("/exams/goethe/a1/2");
  await expect(page.getByRole("button", { name: "Start exam" })).toHaveCount(0);
});

test("anonymous visitors are sent to login and cannot call attempt APIs", async ({ page, request }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
  const res = await request.get("/api/attempts/00000000-0000-0000-0000-000000000000");
  expect(res.status()).toBe(401);
});
