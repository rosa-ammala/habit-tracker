import type { Habit } from "../types/habit";
import { isDateInFuture } from "./date";

export function getCompletionStats(habits: Habit[], dates: string[]) {
  const eligibleDates = dates.filter((date) => !isDateInFuture(date));

  const completed = habits.reduce((totalCompleted, habit) => {
    const logDates = new Set(habit.logs.map((log) => log.date));
    const completedDates = eligibleDates.filter((date) => logDates.has(date));

    return totalCompleted + completedDates.length;
  }, 0);

  const total = habits.length * eligibleDates.length;

  const percentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    total,
    percentage,
  };
}
