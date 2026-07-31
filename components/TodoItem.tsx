"use client";

import { useState } from "react";
import type { Priority, Todo } from "@/types/todo";
import { PRIORITY_LABELS } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    patch: Partial<Pick<Todo, "title" | "priority" | "dueTime">>,
  ) => void;
  onFocus: (id: string) => void;
  isFocused: boolean;
  enterDelay?: number;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  onFocus,
  isFocused,
  enterDelay = 0,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const labelId = `todo-label-${todo.id}`;

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.title) {
      onUpdate(todo.id, { title: trimmed });
    } else {
      setDraft(todo.title);
    }
    setEditing(false);
  }

  return (
    <li
      className={`todo-item todo-list__enter todo-item--${todo.priority}${todo.completed ? " todo-item--done" : ""}${isFocused ? " todo-item--focused" : ""}`}
      style={{ animationDelay: `${enterDelay}ms` }}
    >
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-labelledby={labelId}
        className="todo-item__check"
      />

      <div className="todo-item__body">
        {editing ? (
          <input
            className="todo-item__edit"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitEdit}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitEdit();
              if (event.key === "Escape") {
                setDraft(todo.title);
                setEditing(false);
              }
            }}
            autoFocus
            aria-label="Edit todo title"
          />
        ) : (
          <label
            id={labelId}
            htmlFor={`todo-${todo.id}`}
            className="todo-item__title"
            onDoubleClick={() => {
              setDraft(todo.title);
              setEditing(true);
            }}
          >
            {todo.title}
          </label>
        )}

        <div className="todo-item__meta">
          <span className={`todo-item__priority todo-item__priority--${todo.priority}`}>
            {PRIORITY_LABELS[todo.priority]}
          </span>
          {todo.dueTime && <span className="todo-item__due">{todo.dueTime}</span>}
        </div>
      </div>

      <div className="todo-item__actions">
        {!todo.completed && (
          <button
            type="button"
            className="icon-btn"
            onClick={() => onFocus(todo.id)}
            aria-label={`Focus on "${todo.title}"`}
            title="Focus"
          >
            <FocusIcon />
          </button>
        )}
        <label className="sr-only" htmlFor={`priority-${todo.id}`}>
          Priority for {todo.title}
        </label>
        <select
          id={`priority-${todo.id}`}
          className="todo-item__select"
          value={todo.priority}
          onChange={(event) =>
            onUpdate(todo.id, { priority: event.target.value as Priority })
          }
          aria-label={`Set priority for ${todo.title}`}
        >
          {(Object.keys(PRIORITY_LABELS) as Priority[]).map((key) => (
            <option key={key} value={key}>
              {PRIORITY_LABELS[key]}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.title}"`}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}

function FocusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M10 2a.75.75 0 0 1 .75.75V4.5a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 10 2ZM10 15.5a.75.75 0 0 1 .75.75v1.75a.75.75 0 0 1-1.5 0V16.25a.75.75 0 0 1 .75-.75ZM2.75 10a.75.75 0 0 1 .75-.75H5.5a.75.75 0 0 1 0 1.5H3.5a.75.75 0 0 1-.75-.75ZM14.5 10a.75.75 0 0 1 .75-.75h1.75a.75.75 0 0 1 0 1.5H15.25A.75.75 0 0 1 14.5 10ZM10 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.75 1a1 1 0 0 0-.96.73L7.42 3H4a1 1 0 0 0 0 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a1 1 0 1 0 0-2h-3.42l-.37-1.27A1 1 0 0 0 11.25 1h-2.5ZM8 7a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
