"use client";
import { useRef } from "react";
import DueDateBadge from "./DueDateBadge";
// #104 — TodoItem component (with #108 deletion support)
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate: (id: string, dueDate?: string) => boolean;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdateDueDate }: TodoItemProps) {
  const dateInput = useRef<HTMLInputElement>(null);
  const labelId = `todo-label-${todo.id}`;

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-labelledby={labelId}
        className="h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
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
      <div className="flex w-full flex-wrap items-center gap-2 pl-8 text-xs">
        {todo.dueDate && <DueDateBadge dueDate={todo.dueDate} completed={todo.completed} />}
        <label className="flex items-center gap-2">
          Due date<span className="sr-only"> for {todo.title}</span>
          <input ref={dateInput} type="date" max="9999-12-31" value={todo.dueDate ?? ""}
            onChange={event => onUpdateDueDate(todo.id, event.target.value || undefined)}
            className="min-w-0 rounded border border-gray-300 bg-white p-1.5 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
        </label>
        {todo.dueDate && <button type="button" onClick={() => {
          if (onUpdateDueDate(todo.id, undefined)) dateInput.current?.focus();
        }} aria-label={`Remove due date for ${todo.title}`} className="rounded px-2 py-1 text-gray-600 focus-visible:outline-2 dark:text-gray-300">Remove date</button>}
      </div>
    </li>
  );
}
