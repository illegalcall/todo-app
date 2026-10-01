// #104 — TodoItem component (with #108 deletion support)
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const labelId = `todo-label-${todo.id}`;

  // Compare calendar dates (not timestamps) so "today" is not flagged overdue.
  const today = new Date().toISOString().slice(0, 10);
  const isOverdue =
    !todo.completed && todo.dueDate !== undefined && todo.dueDate < today;
  const isDueToday = !todo.completed && todo.dueDate === today;

  const dueLabel = (() => {
    if (!todo.dueDate) return null;
    const parsed = new Date(`${todo.dueDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return todo.dueDate;
    return parsed.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  })();

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
      {dueLabel && (
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            isOverdue
              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              : isDueToday
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {isOverdue ? "Overdue · " : isDueToday ? "Due today · " : "Due "}
          {dueLabel}
        </span>
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
