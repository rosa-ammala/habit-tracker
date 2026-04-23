import { useToggleHabitLogApi } from "./useToggleHabitLogApi";
import { getTodayString } from "../utils/date";
import type { Habit } from "../types/habit";

export function useToggleHabitLog(
  habit: Habit,
  onLogsChange: (habitId: number, updatedLogs: string[]) => void
) {
  const { logs, toggleLog } = useToggleHabitLogApi(habit);
  const todayStr = getTodayString();

  const handleToggle = async (date: string) => {
    if (date > todayStr) return;

    const isChecked = logs.includes(date);

    const updatedLogs = isChecked
      ? logs.filter((loggedDate) => loggedDate !== date)
      : [...logs, date];

    await toggleLog(date);
    onLogsChange(habit.id, updatedLogs);
  };

  return {
    logs,
    handleToggle,
  };
}