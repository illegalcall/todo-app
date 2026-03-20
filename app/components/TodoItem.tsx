"use client";

import { Todo } from "@/app/types/todo";
import DueDateBadge from "./DueDateBadge";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate: (id: string, dueDate: string | undefined) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdateDueDate }: TodoItemProps) {
  return (
    <li className="flex items-start gap-3 py-3 border-b border-foreground/10 last:border-0 group">
      <button
        onClick={() => onToggle(todo.id)}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-colors cursor-pointer ${
          todo.completed
            ? "bg-foreground border-foreground"
            : "border-foreground/30 hover:border-foreground/60"
        }`}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
      >
        {todo.completed && (
          <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${todo.completed ? "line-through text-foreground/40" : "text-foreground"}`}>
          {todo.text}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {todo.dueDate && <DueDateBadge dueDate={todo.dueDate} completed={todo.completed} />}
          <label className="flex items-center gap-1 cursor-pointer">
            <span className="text-xs text-foreground/40 hover:text-foreground/60 transition-colors">
              {todo.dueDate ? "Change date" : "Add due date"}
            </span>
            <input
              type="date"
              value={todo.dueDate ?? ""}
              onChange={(e) => onUpdateDueDate(todo.id, e.target.value || undefined)}
              className="absolute opacity-0 w-0 h-0"
              aria-label="Set due date"
            />
          </label>
          {todo.dueDate && (
            <button
              onClick={() => onUpdateDueDate(todo.id, undefined)}
              className="text-xs text-foreground/30 hover:text-red-500 transition-colors"
              aria-label="Remove due date"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-foreground/30 hover:text-red-500 transition-all text-sm cursor-pointer"
        aria-label="Delete todo"
      >
        ✕
      </button>
    </li>
  );
}
