// #264/#274 — tests for localStorage persistence helpers
import { describe, expect, it, beforeEach, vi } from "vitest";
import { loadTodos, saveTodos } from "@/types/storage";
import { sampleTodos, type Todo } from "@/types/todo";

const key = "daybook.todos.v1";

function setRaw(value: string | null) {
  if (value === null) {
    window.localStorage.removeItem(key);
  } else {
    window.localStorage.setItem(key, value);
  }
}

describe("saveTodos", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists todos as JSON under the versioned key", () => {
    const todos: Todo[] = [{ id: "a", title: "Test", completed: false }];
    saveTodos(todos);
    expect(JSON.parse(window.localStorage.getItem(key)!)).toEqual(todos);
  });

  it("is a no-op when localStorage is unavailable (SSR)", () => {
    vi.stubGlobal("window", undefined);
    expect(() => saveTodos([{ id: "a", title: "x", completed: false }])).not.toThrow();
    vi.unstubAllGlobals();
  });

  it("swallows quota errors", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });
    expect(() =>
      saveTodos([{ id: "a", title: "x", completed: false }]),
    ).not.toThrow();
    setItem.mockRestore();
  });
});

describe("loadTodos", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns sample todos when storage is empty", () => {
    expect(loadTodos()).toEqual(sampleTodos);
  });

  it("returns persisted todos when valid", () => {
    const todos: Todo[] = [
      { id: "a", title: "Kept", completed: true, dueDate: "2026-10-01" },
    ];
    setRaw(JSON.stringify(todos));
    expect(loadTodos()).toEqual(todos);
  });

  it("returns sample todos on corrupted JSON", () => {
    setRaw("{not json!!");
    expect(loadTodos()).toEqual(sampleTodos);
  });

  it("returns sample todos for non-array JSON", () => {
    setRaw(JSON.stringify({ id: "a", title: "x", completed: false }));
    expect(loadTodos()).toEqual(sampleTodos);
  });

  it("drops invalid entries but keeps valid ones", () => {
    setRaw(
      JSON.stringify([
        { id: "a", title: "Valid", completed: false },
        { id: 42, title: "Bad", completed: false },
        { id: "b", title: 7, completed: false },
        { id: "c", title: "Also valid", completed: true },
      ]),
    );
    expect(loadTodos()).toEqual([
      { id: "a", title: "Valid", completed: false },
      { id: "c", title: "Also valid", completed: true },
    ]);
  });

  it("returns sample todos when every entry is invalid", () => {
    setRaw(JSON.stringify([{ nope: true }, "junk"]));
    expect(loadTodos()).toEqual(sampleTodos);
  });

  it("is safe when localStorage access throws (private mode)", () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("SecurityError");
      },
    });
    try {
      expect(loadTodos()).toEqual(sampleTodos);
      expect(() =>
        saveTodos([{ id: "a", title: "x", completed: false }]),
      ).not.toThrow();
    } finally {
      if (original) {
        Object.defineProperty(window, "localStorage", original);
      }
    }
  });
});
