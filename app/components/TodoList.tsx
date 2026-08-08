interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
}

export default function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="text-gray-500 italic" role="status">
        No todos yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2" role="list">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center gap-3 rounded border border-gray-200 bg-white px-4 py-2"
        >
          <span
            className={
              todo.completed
                ? "text-gray-400 line-through"
                : "text-gray-900"
            }
          >
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
