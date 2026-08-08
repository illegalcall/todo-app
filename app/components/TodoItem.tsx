"use client";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type TodoItemProps = {
  todo: Todo;
  onToggle?: (id: string) => void;
};

export default function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 last:border-b-0">
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle?.(todo.id)}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={
          todo.completed
            ? "flex-1 text-gray-400 line-through cursor-pointer"
            : "flex-1 text-gray-900 cursor-pointer"
        }
      >
        {todo.text}
      </label>
    </li>
  );
}
