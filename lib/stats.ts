import type { Todo } from "@/types/todo";

/** Percentage of todos that are completed, rounded to a whole number. */
export function completionRate(todos: Todo[]): number {
  if (todos.length === 0) return 0;
  const done = todos.filter((todo) => todo.completed).length;
  return Math.round((done / todos.length) * 100);
}

/** Todos that still need doing, oldest first. */
export function remaining(todos: Todo[]): Todo[] {
  return todos.filter((todo) => !todo.completed);
}
