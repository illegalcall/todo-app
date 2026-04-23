import TodoApp from "./todo-app";

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo List</h1>
        <TodoApp />
      </div>
    </main>
  );
}
