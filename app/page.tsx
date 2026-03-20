import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-8 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Todo List
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Click a todo to mark it as complete or incomplete.
      </p>
      <TodoList />
    </main>
  );
}
