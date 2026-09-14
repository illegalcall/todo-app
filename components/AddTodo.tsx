// #106 — AddTodo form component
"use client";

import { useState } from "react";

interface AddTodoProps {
  onAdd: (title: string, dueDate?: string) => boolean;
}

/** Add a task with an optional local-calendar due date. */
export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState("");

  const [dueDate, setDueDate] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    if (onAdd(trimmed, dueDate || undefined)) {
      setTitle("");
      setDueDate("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <label htmlFor="new-todo" className="sr-only">
        Add a new todo
      </label>
      <input
        id="new-todo"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
        autoComplete="off"
        className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      />
      <label className="flex items-center gap-2 text-sm">
        Due date
        <input
          type="date" max="9999-12-31"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="rounded-md border border-gray-300 px-2 py-2 dark:border-gray-600 dark:bg-gray-800"
        />
      </label>
      <button
        type="submit"
        disabled={title.trim().length === 0}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
      >
        Add
      </button>
    </form>
  );
}
