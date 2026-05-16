import TodoApp from "./components/TodoApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Todo List
        </h1>
        <TodoApp />
      </div>
    </main>
  );
}
