"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

const TODO_TITLE_MAX_LENGTH = 160;

export type AddTodoProps = {
  onAddTodo: (title: string) => void | Promise<void>;
};

export function AddTodo({ onAddTodo }: AddTodoProps) {
  const inputId = useId();
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trimmedTitle = title.trim();
  const isSubmitDisabled = isSubmitting || trimmedTitle.length === 0;
  const helperTextId = `${inputId}-helper`;
  const errorTextId = `${inputId}-error`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onAddTodo(trimmedTitle);
      setTitle("");
    } catch {
      setErrorMessage("Unable to add the todo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      aria-label="Add todo"
      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
      onSubmit={handleSubmit}
    >
      <label
        className="block text-sm font-medium text-gray-900"
        htmlFor={inputId}
      >
        New todo
      </label>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          aria-describedby={errorMessage === null ? helperTextId : errorTextId}
          className="min-h-11 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          disabled={isSubmitting}
          id={inputId}
          maxLength={TODO_TITLE_MAX_LENGTH}
          name="title"
          required
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          placeholder="What needs to be done?"
          type="text"
          value={title}
          aria-invalid={errorMessage !== null}
        />

        <button
          className="min-h-11 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
          disabled={isSubmitDisabled}
          type="submit"
        >
          {isSubmitting ? "Adding..." : "Add todo"}
        </button>
      </div>

      {errorMessage === null ? (
        <p className="mt-2 text-xs text-gray-500" id={helperTextId}>
          Enter a short title, then press Enter or choose Add todo.
        </p>
      ) : (
        <p
          className="mt-2 text-xs font-medium text-red-600"
          id={errorTextId}
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </form>
  );
}

export default AddTodo;
