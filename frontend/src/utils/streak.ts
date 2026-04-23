import { toDateString } from "./date";

export function calculateStreak(logDates: string[]): number {
  if (!logDates.length) return 0;

  const logSet = new Set(logDates);

  const today = new Date();
  const todayStr = toDateString(today);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toDateString(yesterday);

  let currentDate: Date;

  if (logSet.has(todayStr)) {
    currentDate = new Date(today);
  } else if (logSet.has(yesterdayStr)) {
    currentDate = new Date(yesterday);
  } else {
    return 0;
  }

  let streak = 0;

  while (true) {
    const dateStr = toDateString(currentDate);

    if (logSet.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateBestStreak(logDates: string[]): number {
  if (!logDates.length) return 0;

  const sortedDates = [...new Set(logDates)].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);

    prev.setDate(prev.getDate() + 1);

    const nextDay = toDateString(prev);

    if (toDateString(curr) === nextDay) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }

  return best;
}