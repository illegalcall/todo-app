// #106 — AddTodo form component
"use client";

import { useRef, useState } from "react";

export interface AddTodoProps {
  onAdd: (title: string) => void | Promise<void>;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const pending = useRef(false);
  const input = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || pending.current) return;
    pending.current = true;
    setIsSubmitting(true);
    setHasError(false);
    try {
      await onAdd(trimmed);
      setTitle("");
    } catch {
      setHasError(true);
    } finally {
      pending.current = false;
      setIsSubmitting(false);
      requestAnimationFrame(() => {
        const field = input.current;
        if (field && (document.activeElement === document.body || field.form?.contains(document.activeElement))) {
          field.focus();
        }
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2" aria-busy={isSubmitting}>
      <label htmlFor="new-todo" className="sr-only">
        Add a new todo
      </label>
      <input
        id="new-todo"
        ref={input}
        disabled={isSubmitting}
        maxLength={160}
        aria-invalid={hasError}
        aria-describedby={hasError ? "add-todo-error" : undefined}
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
        autoComplete="off"
        className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      />
      <button
        type="submit"
        disabled={isSubmitting || title.trim().length === 0}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
      >
        {isSubmitting ? "Adding..." : "Add"}
      </button>
      {hasError && <p id="add-todo-error" role="alert" className="w-full text-sm text-red-600 dark:text-red-400">
        Unable to add the todo. Please try again.
      </p>}
    </form>
  );
}
