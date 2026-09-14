import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTodo from "../components/AddTodo";

afterEach(cleanup);

test("empty and whitespace-only submissions are rejected", async () => {
  const onAdd = vi.fn();
  const user = userEvent.setup();
  render(<AddTodo onAdd={onAdd} />);
  const input = screen.getByRole("textbox", { name: "Add a new todo" });
  await user.type(input, "   ");
  fireEvent.submit(input.closest("form")!);
  expect(onAdd).not.toHaveBeenCalled();
});

test("pending additions submit once, retain input, then clear and restore focus", async () => {
  let resolve!: () => void;
  const onAdd = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
  const user = userEvent.setup();
  render(<AddTodo onAdd={onAdd} />);
  const input = screen.getByRole<HTMLInputElement>("textbox", { name: "Add a new todo" });
  await user.type(input, "  Async task  ");
  const form = input.closest("form")!;
  fireEvent.submit(form);
  fireEvent.submit(form);
  expect(onAdd).toHaveBeenCalledExactlyOnceWith("Async task");
  expect(input.disabled).toBe(true);
  expect(input.value).toBe("  Async task  ");
  expect(screen.getByRole<HTMLButtonElement>("button", { name: "Adding..." }).disabled).toBe(true);
  resolve();
  await waitFor(() => expect(input.value).toBe(""));
  await waitFor(() => expect(document.activeElement).toBe(input));
});

test("a rejected addition keeps the draft, announces error, and permits retry", async () => {
  const onAdd = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(undefined);
  const user = userEvent.setup();
  render(<AddTodo onAdd={onAdd} />);
  const input = screen.getByRole<HTMLInputElement>("textbox", { name: "Add a new todo" });
  await user.type(input, "Keep my draft");
  await user.click(screen.getByRole("button", { name: "Add" }));
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(input.value).toBe("Keep my draft");
  expect(input.getAttribute("aria-invalid")).toBe("true");
  await user.click(screen.getByRole("button", { name: "Add" }));
  await waitFor(() => expect(input.value).toBe(""));
  expect(screen.queryByRole("alert")).toBeNull();
  expect(onAdd).toHaveBeenCalledTimes(2);
});

test("synchronous callback failures also retain the input", async () => {
  const user = userEvent.setup();
  render(<AddTodo onAdd={() => { throw new Error("failed"); }} />);
  const input = screen.getByRole<HTMLInputElement>("textbox", { name: "Add a new todo" });
  await user.type(input, "Still here");
  await user.keyboard("{Enter}");
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(input.value).toBe("Still here");
});

test("title entry respects the existing 160 character limit", async () => {
  const onAdd = vi.fn();
  const user = userEvent.setup();
  render(<AddTodo onAdd={onAdd} />);
  const input = screen.getByRole<HTMLInputElement>("textbox", { name: "Add a new todo" });
  await user.type(input, "a".repeat(161));
  await user.keyboard("{Enter}");
  expect(onAdd).toHaveBeenCalledExactlyOnceWith("a".repeat(160));
});

for (const fails of [false, true]) {
  test(`delayed ${fails ? "failure" : "success"} preserves focus moved outside the form`, async () => {
    let complete!: () => void;
    const onAdd = () => new Promise<void>((resolve, reject) => {
      complete = () => fails ? reject(new Error("offline")) : resolve();
    });
    const user = userEvent.setup();
    render(<><AddTodo onAdd={onAdd} /><button>Another todo</button></>);
    const input = screen.getByRole<HTMLInputElement>("textbox", { name: "Add a new todo" });
    await user.type(input, "Delayed task");
    await user.click(screen.getByRole("button", { name: "Add" }));
    const sibling = screen.getByRole("button", { name: "Another todo" });
    await user.click(sibling);
    complete();
    await waitFor(() => expect(input.disabled).toBe(false));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    expect(document.activeElement).toBe(sibling);
  });
}
