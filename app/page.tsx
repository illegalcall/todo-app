import TodoList, { type Todo } from "./components/TodoList";

const sampleTodos: Todo[] = [
  { id: "1", title: "Learn Next.js App Router", completed: true },
  { id: "2", title: "Build a todo list", completed: false },
  { id: "3", title: "Ship it", completed: false },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo List</h1>
      <TodoList todos={sampleTodos} />
    </main>
  );
}
