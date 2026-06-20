export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // ISO date string YYYY-MM-DD
  createdAt: string;
}
