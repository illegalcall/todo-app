// #107 — Main page wiring with state management
// #108 — Todo deletion  |  #109 — Todo count summary
"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { Todo, Priority } from "@/types/todo";
import { loadTodos, parseTodos, readTodosSnapshot, saveTodos, serverTodosSnapshot, subscribeTodos } from "@/lib/storage";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";

export default function Home() {
  const snapshot = useSyncExternalStore(subscribeTodos, readTodosSnapshot, serverTodosSnapshot);
  const todos = useMemo(() => parseTodos(snapshot), [snapshot]);
  const [saveError, setSaveError] = useState(false);

  function updateTodos(update: (previous: Todo[]) => Todo[]): boolean {
    const saved = saveTodos(update(loadTodos()));
    setSaveError(!saved);
    return saved;
  }

  function handleAdd(title: string, priority: Priority): boolean {
    return updateTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, completed: false, priority },
    ]);
  }

  function handleToggle(id: string) {
    updateTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function handleDelete(id: string) {
    updateTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  // #109 — count summary
  const activeCount = todos.filter((todo) => !todo.completed).length;

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

      {saveError && <p role="alert" className="mb-4 text-sm text-red-600">
        Could not save your changes. Check browser storage and try again.
      </p>}

      <TodoList
        todos={todos}
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
