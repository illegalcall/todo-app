"use client";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2">
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 cursor-pointer accent-blue-600"
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={`flex-1 cursor-pointer text-sm ${
          todo.completed ? "text-gray-400 line-through" : "text-gray-900"
        }`}
      >
        {todo.title}
      </label>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete ${todo.title}`}
        className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
      >
        Delete
      </button>
    </li>
  );
}

export default TodoItem;
