import type { Habit } from "../types/habit";
import { getTodayString } from "./date";

export function getCompletionStats(habits: Habit[]) {
  const todayStr = getTodayString();

  const completed = habits.filter((habit) =>
    habit.logs.some((log) => log.date === todayStr)
  ).length;

  const percentage =
    habits.length > 0
      ? Math.round((completed / habits.length) * 100)
      : 0;

  return { completed, percentage };
}