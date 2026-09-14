// #104 — TodoItem component (with #108 deletion support)
"use client";

import { useRef, useState } from "react";
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTagsChange: (id: string, tags: string[]) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onTagsChange }: TodoItemProps) {
  const labelId = `todo-label-${todo.id}`;
  const [newTag, setNewTag] = useState("");
  const tagSummary = useRef<HTMLElement>(null);

  return (
    <li className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-labelledby={labelId}
        className="h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
      <div className="min-w-0 flex-1">
        <label
        id={labelId}
        htmlFor={`todo-${todo.id}`}
        className={`flex-1 cursor-pointer text-sm ${
          todo.completed
            ? "text-gray-400 line-through dark:text-gray-500"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {todo.title}
      </label>
        {(todo.tags?.length ?? 0) > 0 && <ul aria-label={`Tags for "${todo.title}"`} className="mt-2 flex flex-wrap gap-1">
          {todo.tags?.map((tag) => <li key={tag.toLowerCase()} className="flex max-w-full items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            <span className="break-all">{tag}</span>
            <button type="button" aria-label={`Remove tag "${tag}" from "${todo.title}"`} onClick={() => {
              onTagsChange(todo.id, todo.tags?.filter((value) => value !== tag) ?? []);
              requestAnimationFrame(() => tagSummary.current?.focus());
            }} className="shrink-0 rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-500">×</button>
          </li>)}
        </ul>}
        <details className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <summary ref={tagSummary} className="cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-blue-500">Edit tags</summary>
          <form className="mt-2 flex gap-2" onSubmit={(event) => {
            event.preventDefault();
            if (!newTag.trim()) return;
            onTagsChange(todo.id, [...(todo.tags ?? []), newTag]);
            setNewTag("");
          }}>
            <input aria-label={`Add tag to "${todo.title}"`} value={newTag} onChange={(event) => setNewTag(event.target.value)} placeholder="Tag name" className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
            <button type="submit" disabled={!newTag.trim()} className="shrink-0 rounded px-2 py-1 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:text-blue-400">Add tag</button>
          </form>
        </details>
      </div>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        className="shrink-0 rounded p-1 text-gray-400 transition-colors hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:hover:text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.75 1a1 1 0 0 0-.96.73L7.42 3H4a1 1 0 0 0 0 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a1 1 0 1 0 0-2h-3.42l-.37-1.27A1 1 0 0 0 11.25 1h-2.5ZM8 7a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  );
}
