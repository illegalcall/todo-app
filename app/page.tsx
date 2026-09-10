// #107 — Main page wiring with state management
// #108 — Todo deletion  |  #109 — Todo count summary  |  #273 — Filter tabs
"use client";

import { useState } from "react";
import type { Todo, TodoFilter } from "@/types/todo";
import { sampleTodos } from "@/types/todo";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import TodoFilters, { filterTabId } from "@/components/TodoFilters";

const PANEL_ID = "todo-filter-panel";

/** Explains an empty list in terms of the filter that emptied it. */
function emptyMessageFor(filter: TodoFilter, total: number) {
  if (total === 0) return "No todos yet. Add one above to get started.";
  if (filter === "active") return "Nothing active. Every todo is completed.";
  if (filter === "completed")
    return "No completed todos yet. Check one off to see it here.";
  return "No todos yet. Add one above to get started.";
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const [filter, setFilter] = useState<TodoFilter>("all");

  function handleAdd(title: string) {
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, completed: false },
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

  // #109 — count summary  |  #273 — per-filter counts
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const counts: Record<TodoFilter, number> = {
    all: todos.length,
    active: activeCount,
    completed: todos.length - activeCount,
  };

  const visibleTodos =
    filter === "all"
      ? todos
      : todos.filter((todo) =>
          filter === "completed" ? todo.completed : !todo.completed,
        );

  // An empty panel holds nothing focusable, so give it its own tab stop and
  // keyboard users can still reach the message explaining why it is empty.
  const panelTabIndex = visibleTodos.length === 0 ? 0 : undefined;

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

      <div className="mb-4">
        <TodoFilters
          filter={filter}
          onFilterChange={setFilter}
          counts={counts}
          panelId={PANEL_ID}
        />
      </div>

      <div
        id={PANEL_ID}
        role="tabpanel"
        aria-labelledby={filterTabId(filter)}
        tabIndex={panelTabIndex}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <TodoList
          todos={visibleTodos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          emptyMessage={emptyMessageFor(filter, todos.length)}
        />
      </div>

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
