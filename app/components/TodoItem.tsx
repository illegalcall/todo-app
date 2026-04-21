"use client";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const { id, title, completed } = todo;

  return (
    <li className="flex items-center gap-3 px-3 py-2 border-b border-gray-200">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        className="h-4 w-4 cursor-pointer"
        aria-label={`Mark "${title}" as ${completed ? "incomplete" : "complete"}`}
      />
      <span
        className={`flex-1 ${
          completed ? "line-through text-gray-400" : "text-gray-900"
        }`}
      >
        {title}
      </span>
      <button
        type="button"
        onClick={() => onDelete(id)}
        className="text-sm text-red-600 hover:text-red-800 px-2 py-1 rounded"
        aria-label={`Delete "${title}"`}
      >
        Delete
      </button>
    </li>
  );
}
