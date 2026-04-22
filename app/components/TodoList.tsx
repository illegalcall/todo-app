export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type TodoListProps = {
  todos: Todo[];
};

export default function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="text-gray-500">No todos yet.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center gap-3 px-4 py-3"
        >
          <input
            type="checkbox"
            checked={todo.completed}
            readOnly
            className="h-4 w-4"
          />
          <span
            className={
              todo.completed
                ? "text-gray-400 line-through"
                : "text-gray-900"
            }
          >
            {todo.title}
          </span>
        </li>
      ))}
    </ul>
  );
}
