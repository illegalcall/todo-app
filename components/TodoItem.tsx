// #104 — TodoItem component (with #108 deletion support)
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const labelId = `todo-label-${todo.id}`;

  return (
    <li className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 shadow-sm">
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-labelledby={labelId}
        className="h-5 w-5 shrink-0 cursor-pointer rounded border-[var(--line-strong)] accent-[var(--accent-strong)] focus:ring-2 focus:ring-[var(--accent)]"
      />
      <label
        id={labelId}
        htmlFor={`todo-${todo.id}`}
        className={`flex-1 cursor-pointer text-sm ${
          todo.completed
            ? "text-[var(--muted)] line-through"
            : "text-[var(--ink)]"
        }`}
      >
        {todo.title}
      </label>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
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
