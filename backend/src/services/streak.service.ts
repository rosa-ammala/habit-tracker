function toDateOnlyString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: string, amount: number) {
  const result = new Date(`${date}T00:00:00.000Z`);
  result.setUTCDate(result.getUTCDate() + amount);
  return toDateOnlyString(result);
}

export function calculateStreaks(
  logDates: Date[],
  today: string
) {
  const uniqueDates = [...new Set(logDates.map(toDateOnlyString))].sort();

  if (uniqueDates.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
    };
  }

  const dateSet = new Set(uniqueDates);

  const yesterday = addDays(today, -1);

  let currentStreak = 0;
  let cursor: string | null = null;

  if (dateSet.has(today)) {
    cursor = today;
  } else if (dateSet.has(yesterday)) {
    cursor = yesterday;
  }

  while (cursor && dateSet.has(cursor)) {
    currentStreak++;
    cursor = addDays(cursor, -1);
  }

  let bestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const previous = uniqueDates[i - 1];
    const current = uniqueDates[i];

    if (current === addDays(previous, 1)) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return {
    currentStreak,
    bestStreak,
  };
}