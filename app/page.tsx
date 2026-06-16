import DarkModeToggle from "./components/DarkModeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Todo List</h1>
        <DarkModeToggle />
      </div>
      <p className="text-muted">No features implemented yet.</p>
    </main>
  );
}
