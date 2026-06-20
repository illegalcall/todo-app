import { TodoList } from "./TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-8 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo List</h1>
        <p className="text-gray-500 mb-6">
          Your todos are saved to localStorage and will persist across
          refreshes.
        </p>
        <TodoList />
      </div>
    </main>
  );
}
