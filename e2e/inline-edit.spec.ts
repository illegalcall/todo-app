import { test, expect } from "@playwright/test";

const title = "Review the day's priorities";

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("Enter saves a trimmed title and restores keyboard focus", async ({ page }) => {
  await page.getByRole("button", { name: `Edit "${title}"`, exact: true }).click();
  const editor = page.getByRole("textbox", { name: `Edit "${title}"` });
  await expect(editor).toBeFocused();
  await expect(editor).toHaveValue(title);
  await editor.fill("  Revised priorities  ");
  await editor.press("Enter");
  await expect(page.getByRole("button", { name: 'Edit "Revised priorities"' })).toBeFocused();
  await expect(page.getByRole("checkbox", { name: "Revised priorities" })).not.toBeChecked();
});

test("double click starts editing without changing completion", async ({ page }) => {
  await page.getByText(title, { exact: true }).dblclick();
  const editor = page.getByRole("textbox", { name: `Edit "${title}"` });
  await editor.press("End");
  await editor.pressSequentially(" today");
  await expect(editor).toHaveValue(`${title} today`);
  await editor.press("Escape");
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: title, exact: true })).not.toBeChecked();
});

test("blur saves, and blank edits preserve the previous title", async ({ page }) => {
  await page.getByRole("button", { name: `Edit "${title}"` }).click();
  await page.getByRole("textbox", { name: `Edit "${title}"` }).fill("Saved on blur");
  await page.getByRole("heading", { name: "Daybook" }).click();
  await expect(page.getByText("Saved on blur", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: 'Edit "Saved on blur"' }).click();
  await page.getByRole("textbox", { name: 'Edit "Saved on blur"' }).fill("   ");
  await page.getByRole("textbox", { name: 'Edit "Saved on blur"' }).press("Enter");
  await expect(page.getByText("Saved on blur", { exact: true })).toBeVisible();
});

for (const keyboard of [false, true]) {
  test(`Cancel preserves the title using ${keyboard ? "keyboard" : "pointer"}`, async ({ page }) => {
    await page.getByRole("button", { name: `Edit "${title}"` }).click();
    const editor = page.getByRole("textbox", { name: `Edit "${title}"` });
    await editor.fill("Discard this");
    if (keyboard) { await editor.press("Tab"); await page.getByRole("button", { name: "Cancel" }).press("Enter"); }
    else await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText(title, { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: `Edit "${title}"` })).toBeFocused();
  });
}

test("add, toggle, delete and counts still work after renaming", async ({ page }) => {
  await page.getByRole("textbox", { name: "Add a new todo" }).fill("New task");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await page.getByRole("button", { name: 'Edit "New task"' }).click();
  const editor = page.getByRole("textbox", { name: 'Edit "New task"' });
  await editor.fill("Renamed task");
  await editor.press("Enter");
  await page.getByRole("checkbox", { name: "Renamed task" }).check();
  await expect(page.getByText("2 active", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: 'Delete "Renamed task"' }).click();
  await expect(page.getByText("Renamed task", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("listitem")).toHaveCount(3);
});

test("leaving Cancel without activating it saves the draft", async ({ page }) => {
  await page.getByRole("button", { name: `Edit "${title}"` }).click();
  const editor = page.getByRole("textbox", { name: `Edit "${title}"` });
  await editor.fill("Saved when leaving editor controls");
  await editor.press("Tab");
  await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused();
  await page.getByRole("button", { name: "Cancel" }).press("Tab");
  await expect(page.getByText("Saved when leaving editor controls", { exact: true })).toBeVisible();
  await expect(page.getByRole("textbox", { name: `Edit "${title}"` })).toHaveCount(0);
});
