"use client";

import { useState } from "react";
import type { Priority } from "@/types/todo";
import { PRIORITY_LABELS } from "@/types/todo";

interface AddTodoProps {
  onAdd: (title: string, priority: Priority, dueTime?: string) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("next");
  const [dueTime, setDueTime] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority, dueTime || undefined);
    setTitle("");
    setDueTime("");
    setPriority("next");
  }

  return (
    <form onSubmit={handleSubmit} className="composer">
      <div className="composer__row">
        <label htmlFor="new-todo" className="sr-only">
          Add a new todo
        </label>
        <input
          id="new-todo"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What deserves your attention?"
          autoComplete="off"
          className="composer__input"
        />
        <button
          type="submit"
          disabled={title.trim().length === 0}
          className="btn btn--primary"
        >
          Add
        </button>
      </div>

      <div className="composer__meta">
        <div className="composer__priorities" role="group" aria-label="Priority">
          {(Object.keys(PRIORITY_LABELS) as Priority[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`chip chip--${key}${priority === key ? " chip--active" : ""}`}
              aria-pressed={priority === key}
              onClick={() => setPriority(key)}
            >
              {PRIORITY_LABELS[key]}
            </button>
          ))}
        </div>
        <label className="composer__time">
          <span className="sr-only">Due time</span>
          <input
            type="time"
            value={dueTime}
            onChange={(event) => setDueTime(event.target.value)}
            className="composer__time-input"
          />
        </label>
      </div>
    </form>
  );
}
