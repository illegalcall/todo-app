"use client";

interface DueDateBadgeProps {
  dueDate: string;
  completed: boolean;
}

function getDueDateStatus(dueDate: string, completed: boolean) {
  if (completed) return { label: formatDate(dueDate), className: "text-foreground/40 line-through" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `Overdue · ${formatDate(dueDate)}`, className: "text-red-600 dark:text-red-400 font-medium" };
  }
  if (diffDays === 0) {
    return { label: `Due today`, className: "text-amber-600 dark:text-amber-400 font-medium" };
  }
  if (diffDays <= 3) {
    return { label: `Due in ${diffDays}d · ${formatDate(dueDate)}`, className: "text-yellow-600 dark:text-yellow-400" };
  }
  return { label: formatDate(dueDate), className: "text-foreground/50" };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DueDateBadge({ dueDate, completed }: DueDateBadgeProps) {
  const { label, className } = getDueDateStatus(dueDate, completed);
  return (
    <span className={`text-xs ${className}`}>
      {label}
    </span>
  );
}
