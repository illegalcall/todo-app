"use client";

import { useState, type FormEvent } from "react";

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
        aria-label="New todo text"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 disabled:bg-gray-300"
      >
        Add
      </button>
    </form>
  );
}
