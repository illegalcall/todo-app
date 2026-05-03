import TodoList from './components/TodoList'

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Todo List</h1>
        <TodoList />
      </div>
    </main>
  );
}
