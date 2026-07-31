import type { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    patch: Partial<Pick<Todo, "title" | "priority" | "dueTime">>,
  ) => void;
  onFocus: (id: string) => void;
  focusedId: string | null;
}

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onUpdate,
  onFocus,
  focusedId,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="empty-state">
        Your orbit is clear. Add something that matters.
      </p>
    );
  }

  return (
    <ul className="todo-list" aria-label="Todo list">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onFocus={onFocus}
          isFocused={focusedId === todo.id}
          enterDelay={index * 40}
        />
      ))}
    </ul>
  );
}
