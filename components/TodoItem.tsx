// #104 — TodoItem component (with #108 deletion support)
"use client";

import { useCallback, useRef, useState } from "react";
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onRename }: TodoItemProps) {
  const labelId = `todo-label-${todo.id}`;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const finished = useRef(false);
  const editButton = useRef<HTMLButtonElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const editor = useRef<HTMLInputElement | null>(null);
  const focusEditor = useCallback((input: HTMLInputElement | null) => {
    editor.current = input;
    input?.focus();
    input?.select();
  }, []);

  function startEdit() {
    finished.current = false;
    setDraft(todo.title);
    setEditing(true);
  }

  function finishEdit(save: boolean, restoreFocus = false) {
    if (finished.current) return;
    finished.current = true;
    if (save && draft.trim()) onRename(todo.id, draft.trim());
    setEditing(false);
    if (restoreFocus) requestAnimationFrame(() => editButton.current?.focus());
  }

  return (
    <li className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={editing ? todo.title : undefined}
        aria-labelledby={editing ? undefined : labelId}
        className="h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
      {editing ? (
        <input
          ref={focusEditor}
          aria-label={`Edit "${todo.title}"`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "Enter" || event.key === "Escape") {
              event.preventDefault();
              finishEdit(event.key === "Enter", true);
            }
          }}
          onBlur={(event) => {
            if (event.relatedTarget !== cancelButton.current) finishEdit(true);
          }}
          className="min-w-0 flex-1 rounded border border-blue-500 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
        />
      ) : <span
        id={labelId}
        onDoubleClick={startEdit}
        title="Double-click to edit"
        className={`flex-1 cursor-pointer text-sm ${
          todo.completed
            ? "text-gray-400 line-through dark:text-gray-500"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {todo.title}
      </span>}
      {editing ? (
        <button
          ref={cancelButton}
          type="button"
          onClick={() => finishEdit(false, true)}
          onBlur={(event) => {
            if (event.relatedTarget !== editor.current) finishEdit(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") finishEdit(false, true);
          }}
          className="shrink-0 rounded p-1 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400"
        >
          Cancel
        </button>
      ) : (
        <button
          ref={editButton}
          type="button"
          onClick={startEdit}
          aria-label={`Edit "${todo.title}"`}
          className="shrink-0 rounded p-1 text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-blue-400"
        >
          Edit
        </button>
      )}
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
