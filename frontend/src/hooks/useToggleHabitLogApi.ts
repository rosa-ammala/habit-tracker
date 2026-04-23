import { useEffect, useState } from "react";
import type { Habit } from "../types/habit";
import { toggleHabitLog } from "../api/habits";
import { getTodayString } from "../utils/date";

export function useToggleHabitLogApi(habit: Habit | null) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!habit) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLogs(habit.logs.map((log) => log.date));
  }, [habit]);

  const toggleLog = async (date: string) => {
    const today = getTodayString();

    if (date > today) return;

    const isChecked = logs.includes(date);

    const updatedLogs = isChecked
      ? logs.filter((d) => d !== date)
      : [...logs, date];

    setLogs(updatedLogs);

    try {
      await toggleHabitLog(habit!.id, date, isChecked);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    logs,
    toggleLog,
  };
}