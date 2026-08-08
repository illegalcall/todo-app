"use client";

import { useState, type FormEvent } from "react";

type AddTodoProps = {
  onAdd: (title: string) => void;
};

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  };

  const isDisabled = title.trim().length === 0;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="add-todo-input" className="sr-only">
        New todo
      </label>
      <input
        id="add-todo-input"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={isDisabled}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Add
      </button>
    </form>
  );
}
