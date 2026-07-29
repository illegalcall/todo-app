// #107 — Main page wiring with state management
// #108 — Todo deletion  |  #109 — Todo count summary
"use client";

import Link from "next/link";
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

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  // #109 — count summary
  const activeCount = todos.filter((todo) => !todo.completed).length;

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-8 sm:py-16"
    >
      <header className="mb-9 border-b border-[var(--line)] pb-8">
        <p className="text-xs font-bold tracking-[0.18em] text-[var(--accent-strong)] uppercase">
          Your day, at a glance
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-6xl">
          Today&apos;s page
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-[var(--muted)]">
          A quiet list for the things worth carrying forward.
        </p>
      </header>

      <section aria-labelledby="today-list">
        <h2 id="today-list" className="sr-only">
          Today&apos;s todo list
        </h2>
        <div className="mb-6">
          <AddTodo onAdd={handleAdd} />
        </div>

        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />

        <p
          className="mt-6 text-sm text-[var(--muted)]"
          aria-live="polite"
        >
          {activeCount} active
          {todos.length > 0 && (
            <span className="text-[var(--muted)]">
              {" "}
              &middot; {todos.length} total
            </span>
          )}
        </p>
      </section>

      <aside className="mt-12 flex items-start justify-between gap-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-[var(--warm)] uppercase">
            Field notes
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Read practical essays on AI, agents, and better developer tools.
          </p>
        </div>
        <Link
          href="/blog"
          className="mt-1 shrink-0 rounded-sm text-sm font-semibold text-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
        >
          Explore <span aria-hidden="true">→</span>
        </Link>
      </aside>
    </main>
  );
}
