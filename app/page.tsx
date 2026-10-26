// #107 — Main page wiring with state management
// #108 — Todo deletion  |  #109 — Todo count summary
// #274/#264 — localStorage persistence (hydrate in useEffect to avoid SSR mismatch)
// #273/#263 — All / Active / Completed filter tabs
// #275/#265 — optional due date on new todos
"use client";

import { useEffect, useState } from "react";
import type { Todo } from "@/types/todo";
import { sampleTodos } from "@/types/todo";
import { loadTodos, saveTodos } from "@/types/storage";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";

type Filter = "all" | "active" | "completed";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const [filter, setFilter] = useState<Filter>("all");
  const [hydrated, setHydrated] = useState(false);

  // Load persisted todos after mount to avoid SSR/hydration mismatch.
  // Deliberate one-time sync from localStorage, so the effect lint rule is
  // disabled here rather than restructuring state around an external store.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodos(loadTodos());
    setHydrated(true);
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (hydrated) saveTodos(todos);
  }, [todos, hydrated]);

  function handleAdd(title: string, dueDate?: string) {
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, completed: false, dueDate },
    ]);
  }

  function handleToggle(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  // #109 — count summary
  const activeCount = todos.filter((todo) => !todo.completed).length;

  // #273 — filter the visible list
  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Daybook
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Keep track of what needs doing today.
        </p>
      </header>

      <div className="mb-6">
        <AddTodo onAdd={handleAdd} />
      </div>

      {/* #273 — filter tabs */}
      <div
        role="tablist"
        aria-label="Filter todos"
        className="mb-4 flex gap-1 rounded-md bg-gray-100 p-1 dark:bg-gray-800"
      >
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={filter === value}
            onClick={() => setFilter(value)}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              filter === value
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <TodoList
        todos={visibleTodos}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />

      <p
        className="mt-6 text-sm text-gray-500 dark:text-gray-400"
        aria-live="polite"
      >
        {activeCount} active
        {todos.length > 0 && (
          <span className="text-gray-400 dark:text-gray-500">
            {" "}
            &middot; {todos.length} total
          </span>
        )}
      </p>
    </main>
  );
}
