// #264/#274 — hydration + save behavior of the main page
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { sampleTodos } from "@/types/todo";

const key = "daybook.todos.v1";

describe("Home page persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders sample todos before hydration, then hydrates from storage", async () => {
    window.localStorage.setItem(
      key,
      JSON.stringify([{ id: "p1", title: "Persisted todo", completed: false }]),
    );
    render(<Home />);

    // After mount (effects flush synchronously under RTL), the persisted todo
    // replaces the initial sample data.
    await waitFor(() => {
      expect(screen.getByText("Persisted todo")).toBeInTheDocument();
    });
    expect(
      screen.queryByText("Write the morning journal entry"),
    ).not.toBeInTheDocument();
  });

  it("saves todos to localStorage when a todo is added", async () => {
    render(<Home />);
    await waitFor(() =>
      expect(JSON.parse(window.localStorage.getItem(key)!)).toEqual(sampleTodos),
    );

    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "Fresh task" } });
    fireEvent.submit(input.closest("form")!);

    expect(screen.getByText("Fresh task")).toBeInTheDocument();
    const stored: { title: string }[] = JSON.parse(
      window.localStorage.getItem(key)!,
    );
    expect(stored.some((t) => t.title === "Fresh task")).toBe(true);
  });

  it("shows sample todos when stored data is corrupted", async () => {
    window.localStorage.setItem(key, "CORRUPTED{{{");
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText("Write the morning journal entry")).toBeInTheDocument();
    });
  });
});
