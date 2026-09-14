// #106 — AddTodo form component
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getIsMac = () => /Mac|iPhone|iPad|iPod/.test(navigator.platform);
const getServerIsMac = () => false;

interface AddTodoProps {
  onAdd: (title: string) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isMac = useSyncExternalStore(subscribe, getIsMac, getServerIsMac);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!event.isComposing && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="new-todo" className="sr-only">
        Add a new todo
      </label>
      <input
        ref={inputRef}
        id="new-todo"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder={`What needs to be done? (${isMac ? "⌘K" : "Ctrl+K"})`}
        aria-keyshortcuts="Meta+k Control+k"
        autoComplete="off"
        className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      />
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
