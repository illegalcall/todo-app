// #104 — TodoItem component (with #108 deletion support and #64 duplication)
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onDuplicate,
}: TodoItemProps) {
  const labelId = `todo-label-${todo.id}`;

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
      <button
        type="button"
        onClick={() => onDuplicate(todo.id)}
        aria-label={`Duplicate "${todo.title}"`}
        className="shrink-0 rounded p-1 text-gray-400 transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:text-blue-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.121a1.5 1.5 0 0 1 .439 1.061V12.5A1.5 1.5 0 0 1 15.5 14h-1v-1h1a.5.5 0 0 0 .5-.5V6.621a.5.5 0 0 0-.146-.353l-3.122-3.122A.5.5 0 0 0 12.379 3H8.5a.5.5 0 0 0-.5.5v.5H7v-.5Z" />
          <path d="M4.5 5A1.5 1.5 0 0 0 3 6.5v8A1.5 1.5 0 0 0 4.5 16h6a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 10.5 5h-6Z" />
        </svg>
      </button>
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
