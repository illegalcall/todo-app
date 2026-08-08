"use client";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type TodoItemProps = {
  todo: Todo;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center gap-3 rounded border border-gray-200 bg-white p-3">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle?.(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
        className="h-4 w-4 cursor-pointer"
      />
      <span
        className={`flex-1 text-gray-900 ${
          todo.completed ? "text-gray-400 line-through" : ""
        }`}
      >
        {todo.title}
      </span>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.title}"`}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      )}
    </li>
  );
}
