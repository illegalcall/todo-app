export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const sampleTodos: Todo[] = [
  { id: "1", title: "Learn Next.js App Router", completed: true },
  { id: "2", title: "Define the Todo type", completed: true },
  { id: "3", title: "Build the TodoItem component", completed: false },
  { id: "4", title: "Build the TodoList component", completed: false },
];
