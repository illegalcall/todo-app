import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo List</h1>
      <TodoList />
    </main>
  );
}
