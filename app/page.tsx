// #107 — Main page wiring with state management
// #108 — Todo deletion  |  #109 — Todo count summary  |  #64 — Todo duplication
"use client";

import { useState } from "react";
import type { Todo } from "@/types/todo";
import { sampleTodos } from "@/types/todo";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);

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

  function handleDuplicate(id: string) {
    setTodos((prev) => {
      const original = prev.find((todo) => todo.id === id);
      if (!original) return prev;
      const index = prev.indexOf(original);
      const next = [...prev];
      next.splice(index + 1, 0, {
        id: crypto.randomUUID(),
        title: original.title,
        completed: false,
      });
      return next;
    });
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
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

      <TodoList
        todos={todos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
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
