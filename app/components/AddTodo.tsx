"use client";

import { useState, type FormEvent } from "react";

type AddTodoProps = {
  onAdd: (text: string) => void;
};

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Add a new todo..."
        aria-label="New todo"
        className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        Add
      </button>
    </form>
  );
}
