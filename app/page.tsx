// #107 — Main page wiring with state management
// #108 — Todo deletion  |  #109 — Todo count summary
"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { Todo } from "@/types/todo";
import {
  loadTodos,
  parseTodos,
  readTodosSnapshot,
  saveTodos,
  serverTodosSnapshot,
  subscribeTodos,
} from "@/lib/storage";
import {
  isOverdue,
  localDateKey,
  serverDateSnapshot,
  subscribeDate,
} from "@/lib/dates";
import TodoFilters, { filterTabId } from "@/components/TodoFilters";
import type { TodoFilter } from "@/types/todo";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";

/** Render the persisted todo list and its date-aware summary. */
export default function Home() {
  const snapshot = useSyncExternalStore(
    subscribeTodos,
    readTodosSnapshot,
    serverTodosSnapshot,
  );
  const todos = useMemo(() => parseTodos(snapshot), [snapshot]);
  const today = useSyncExternalStore(
    subscribeDate,
    localDateKey,
    serverDateSnapshot,
  );
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [saveError, setSaveError] = useState(false);

  function updateTodos(update: (previous: Todo[]) => Todo[]): boolean {
    const saved = saveTodos(update(loadTodos()));
    setSaveError(!saved);
    return saved;
  }

  function handleAdd(title: string, dueDate?: string): boolean {
    return updateTodos((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        ...(dueDate ? { dueDate } : {}),
      },
    ]);
  }

  function handleToggle(id: string) {
    const saved = updateTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    if (saved && filter !== "all") document.getElementById(filterTabId(filter))?.focus();
  }

  function handleDelete(id: string) {
    updateTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function handleUpdateDueDate(id: string, dueDate?: string): boolean {
    return updateTodos(previous => previous.map(todo => todo.id === id ? { ...todo, dueDate } : todo));
  }

  // #109 — count summary
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const overdue = todos.filter((todo) => isOverdue(todo, today)).length;

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

      {saveError && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          Could not save your changes. Check browser storage and try again.
        </p>
      )}

      <div className="mb-4">
        <TodoFilters filter={filter} onFilterChange={setFilter} panelId="todo-panel"
          counts={{ all: todos.length, active: activeCount, completed: todos.length - activeCount }} />
      </div>
      <div id="todo-panel" role="tabpanel" aria-labelledby={filterTabId(filter)} tabIndex={0}>
        <TodoList todos={todos.filter(todo => filter === "all" || (filter === "completed" ? todo.completed : !todo.completed))}
          onToggle={handleToggle} onDelete={handleDelete} onUpdateDueDate={handleUpdateDueDate} />
      </div>

      <p
        className="mt-6 text-sm text-gray-500 dark:text-gray-400"
        aria-live="polite"
      >
        {activeCount} active &middot; {overdue} overdue
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
