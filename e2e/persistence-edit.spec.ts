import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (Reflect.get(window, "denyWrites")) throw new Error("storage blocked");
      setItem.call(this, key, value);
    };
  });
  await page.goto("/");
});

test("a failed rename survives another editor's cancellation and a filter change", async ({ page }) => {
  await page.getByRole("tab", { name: /^Active/ }).click();
  await page.getByRole("button", { name: 'Edit "Review the day\'s priorities"' }).click();
  const first = page.getByRole("textbox", { name: 'Edit "Review the day\'s priorities"' });
  await first.fill("Unsaved first draft");
  await page.evaluate(() => Reflect.set(window, "denyWrites", true));
  await page.getByRole("button", { name: 'Edit "Take a 20 minute walk"' }).click();
  const second = page.getByRole("listitem").filter({ has: page.getByRole("textbox", { name: 'Edit "Take a 20 minute walk"' }) });
  await second.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("tab", { name: /^Completed/ }).click();
  await expect(page.getByRole("tab", { name: /^Active/ })).toHaveAttribute("aria-selected", "true");
  await expect(first).toHaveValue("Unsaved first draft");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("tab", { name: /^Completed/ }).click();
  await expect(page.getByRole("tab", { name: /^Completed/ })).toHaveAttribute("aria-selected", "true");
});

test("clearing a completed task releases its failed editor guard", async ({ page }) => {
  await page.getByRole("button", { name: 'Edit "Write the morning journal entry"' }).click();
  await page.getByRole("textbox", { name: 'Edit "Write the morning journal entry"' }).fill("Unsaved completed draft");
  await page.evaluate(() => Reflect.set(window, "denyWrites", true));
  await page.getByRole("heading", { name: "Daybook" }).click();
  await expect(page.getByText("Could not save your changes.", { exact: false })).toBeVisible();
  await page.evaluate(() => Reflect.set(window, "denyWrites", false));
  await page.getByRole("button", { name: "Clear completed" }).click();
  await expect(page.getByRole("textbox", { name: 'Edit "Write the morning journal entry"' })).toHaveCount(0);
  await page.getByRole("tab", { name: /^Active/ }).click();
  await expect(page.getByRole("tab", { name: /^Active/ })).toHaveAttribute("aria-selected", "true");
});

test("empty persistence and the active title survive a reload", async ({ page }) => {
  await expect(page).toHaveTitle("(2) Todos");
  while (await page.getByRole("listitem").count()) {
    await page.getByRole("listitem").first().getByRole("button", { name: /^Delete/ }).click();
  }
  await expect(page).toHaveTitle("(0) Todos");
  await page.reload();
  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page).toHaveTitle("(0) Todos");
});


for (const change of ["delete", "complete"] as const) {
  test(`another tab can ${change} a failed editor without blocking filters`, async ({ page, context }) => {
    await page.getByRole("tab", { name: /^Active/ }).click();
    await page.getByRole("button", { name: 'Edit "Take a 20 minute walk"' }).click();
    const editor = page.getByRole("textbox", { name: 'Edit "Take a 20 minute walk"' });
    await editor.fill("Unsaved other-tab draft");
    await page.evaluate(() => Reflect.set(window, "denyWrites", true));
    await page.getByRole("heading", { name: "Daybook" }).click();
    await expect(page.getByText("Could not save your changes.", { exact: false })).toBeVisible();
    const other = await context.newPage();
    await other.goto("/");
    const row = other.getByRole("listitem").filter({ hasText: "Take a 20 minute walk" });
    if (change === "delete") await row.getByRole("button", { name: /^Delete/ }).click();
    else await row.getByRole("checkbox").check();
    await expect(editor).toHaveCount(0);
    await page.getByRole("tab", { name: /^Completed/ }).click();
    await expect(page.getByRole("tab", { name: /^Completed/ })).toHaveAttribute("aria-selected", "true");
    await other.close();
  });
}
