export function calculateStreaks(dates: string[]) {
  if (dates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const sorted = [...dates].sort((a, b) => b.localeCompare(a));

  // CURRENT STREAK
  let currentStreak = 0;

  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Europe/Helsinki',
  });

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  const yesterday = yesterdayDate.toLocaleDateString('en-CA', {
    timeZone: 'Europe/Helsinki',
  });

  // streak voi alkaa tänään TAI eilisestä
  if (sorted[0] === today || sorted[0] === yesterday) {
    currentStreak = 1;

    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);

      prev.setDate(prev.getDate() - 1);

      const prevStr = prev.toLocaleDateString('en-CA');
      const currStr = curr.toLocaleDateString('en-CA');

      if (prevStr === currStr) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // BEST STREAK
  let bestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);

      prev.setDate(prev.getDate() - 1);

      const prevStr = prev.toLocaleDateString('en-CA');
      const currStr = curr.toLocaleDateString('en-CA');

      if (prevStr === currStr) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }

    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
  }

  return { currentStreak, bestStreak };
}