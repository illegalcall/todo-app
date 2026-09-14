"use client";

import { useSyncExternalStore } from "react";
import { localDateKey, serverDateSnapshot, subscribeDate } from "@/lib/dates";

interface DueDateBadgeProps {
  dueDate: string;
  completed: boolean;
}

import { getDueDateStatus } from "@/lib/due-date-status";

export default function DueDateBadge({ dueDate, completed }: DueDateBadgeProps) {
  const today = useSyncExternalStore(subscribeDate, localDateKey, serverDateSnapshot);
  const { label, className } = getDueDateStatus(dueDate, completed, today);
  return (
    <span className={`text-xs ${className}`}>
      {label}
    </span>
  );
}
