// #105 — TodoList component
import type { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate: (id: string, dueDate?: string) => boolean;
}

export default function TodoList({ todos, onToggle, onDelete, onUpdateDueDate }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-gray-300 px-3 py-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
        No todos in this view. Add one above or choose another filter.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2" aria-label="Todo list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateDueDate={onUpdateDueDate}
        />
      ))}
    </ul>
  );
}
