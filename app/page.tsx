// #107 — Main page wiring with state management
// #108 — Todo deletion  |  #109 — Todo count summary
"use client";

import { useRef, useState } from "react";
import type { Todo } from "@/types/todo";
import { sampleTodos } from "@/types/todo";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const [tagFilter, setTagFilter] = useState("");
  const filterSelect = useRef<HTMLSelectElement>(null);
  const tags = [...new Map(todos.flatMap((todo) =>
    (todo.tags ?? []).map((tag) => [tag.toLowerCase(), tag] as const),
  )).entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const visibleTodos = tagFilter
    ? todos.filter((todo) => todo.tags?.some((tag) => tag.toLowerCase() === tagFilter))
    : todos;

  function handleTagsChange(id: string, tags: string[]) {
    const unique = new Map<string, string>();
    for (const tag of tags) {
      const trimmed = tag.trim();
      if (trimmed && !unique.has(trimmed.toLowerCase())) unique.set(trimmed.toLowerCase(), trimmed);
    }
    setTodos((prev) => prev.map((todo) => todo.id === id ? { ...todo, tags: [...unique.values()] } : todo));
    if (tagFilter && !unique.has(tagFilter)) {
      requestAnimationFrame(() => filterSelect.current?.focus());
    }
  }

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

      <label className="mb-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        Filter by tag
        <select ref={filterSelect} value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} className="min-w-0 rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
          <option value="">All tags</option>
          {tagFilter && !tags.some(([key]) => key === tagFilter) && <option value={tagFilter}>{tagFilter} (no todos)</option>}
          {tags.map(([key, tag]) => <option key={key} value={key}>{tag}</option>)}
        </select>
      </label>

      <TodoList
        todos={visibleTodos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onTagsChange={handleTagsChange}
        emptyMessage={tagFilter ? "No todos with this tag. Choose All tags to see the full list." : undefined}
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
