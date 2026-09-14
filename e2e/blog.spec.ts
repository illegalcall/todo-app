import { test, expect } from "@playwright/test";

test("todo additions, completion and deletion survive blog navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Add a new todo" }).fill("Keep across articles");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await page.getByRole("checkbox", { name: "Keep across articles", exact: true }).check();
  await page.getByRole("button", { name: 'Delete "Take a 20 minute walk"' }).click();

  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await navigation.getByRole("link", { name: "Field notes", exact: true }).click();
  await page.waitForURL("**/blog");
  await page.getByRole("link", { name: /How Large Language Models Work/ }).first().click();
  await page.waitForURL("**/blog/how-large-language-models-work");
  await navigation.getByRole("link", { name: "Today", exact: true }).click();
  await page.waitForURL("http://127.0.0.1:5215/");
  await expect(page.getByRole("checkbox", { name: "Keep across articles", exact: true })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Take a 20 minute walk", exact: true })).toHaveCount(0);
  await expect(page.getByRole("list", { name: "Todo list" }).getByRole("listitem")).toHaveCount(3);

  await navigation.getByRole("link", { name: "Field notes", exact: true }).click();
  await page.waitForURL("**/blog");
  await page.goBack();
  await page.waitForURL("http://127.0.0.1:5215/");
  await expect(page.getByRole("checkbox", { name: "Keep across articles", exact: true })).toBeChecked();
});

for (const slug of ["how-large-language-models-work", "ai-agents-and-orchestration", "practical-future-ai-developer-tooling"]) {
  test(`article ${slug} renders directly`, async ({ page }) => {
    const response = await page.goto(`/blog/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
}

test("unknown articles return a 404", async ({ page }) => {
  const response = await page.goto("/blog/missing-article");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
