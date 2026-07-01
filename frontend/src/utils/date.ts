import type { View } from "../types/view";

export function getTodayDateOnly() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
}

export function parseDateOnly(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toDateOnly(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}

export function addDays(date: string, amount: number) {
  const parsed = parseDateOnly(date);
  parsed.setDate(parsed.getDate() + amount);
  return toDateOnly(parsed);
}

export function addMonths(date: string, amount: number) {
  const parsed = parseDateOnly(date);
  parsed.setMonth(parsed.getMonth() + amount);
  return toDateOnly(parsed);
}

export function getStartOfWeek(date: string) {
  const parsed = parseDateOnly(date);
  const day = parsed.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  parsed.setDate(parsed.getDate() + diff);

  return toDateOnly(parsed);
}

export function getStartOfMonth(date: string) {
  const parsed = parseDateOnly(date);
  return toDateOnly(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
}

export function normalizeDateForView(date: string, view: View) {
  if (view === "week") {
    return getStartOfWeek(date);
  }

  if (view === "month") {
    return getStartOfMonth(date);
  }

  return date;
}

export function getNextDate(date: string, view: View) {
  if (view === "day") {
    return addDays(date, 1);
  }

  if (view === "week") {
    return addDays(date, 7);
  }

  return addMonths(date, 1);
}

export function getPreviousDate(date: string, view: View) {
  if (view === "day") {
    return addDays(date, -1);
  }

  if (view === "week") {
    return addDays(date, -7);
  }

  return addMonths(date, -1);
}

export function isDateInFuture(date: string) {
  return date > getTodayDateOnly();
}

export function formatRangeLabel(date: string, view: View) {
  const parsed = parseDateOnly(date);

  if (view === "day") {
    return parsed.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (view === "week") {
    const start = parseDateOnly(getStartOfWeek(date));
    const end = parseDateOnly(addDays(toDateOnly(start), 6));

    return `${start.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })} - ${end.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }

  return parsed.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export function getWeekDates(date: string) {
  const start = getStartOfWeek(date);
  const dates: string[] = [];

  for (let i = 0; i < 7; i++) {
    dates.push(addDays(start, i));
  }

  return dates;
}

export function getMonthDates(date: string) {
  const monthStart = getStartOfMonth(date);
  const parsedMonthStart = parseDateOnly(monthStart);

  const firstVisibleDate = getStartOfWeek(monthStart);
  const dates: string[] = [];

  for (let i = 0; i < 42; i++) {
    dates.push(addDays(firstVisibleDate, i));
  }

  return {
    dates,
    month: parsedMonthStart.getMonth(),
    year: parsedMonthStart.getFullYear(),
  };
}

export function getMonthOnlyDates(date: string) {
  const monthStart = getStartOfMonth(date);
  const parsedMonthStart = parseDateOnly(monthStart);
  const nextMonthStart = toDateOnly(
    new Date(parsedMonthStart.getFullYear(), parsedMonthStart.getMonth() + 1, 1)
  );

  const dates: string[] = [];
  let cursor = monthStart;

  while (cursor < nextMonthStart) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return dates;
}

export function getDatesForView(date: string, view: View) {
  if (view === "day") {
    return {
      dates: [date],
      month: parseDateOnly(date).getMonth(),
      year: parseDateOnly(date).getFullYear(),
    };
  }

  if (view === "week") {
    const start = getStartOfWeek(date);

    return {
      dates: getWeekDates(start),
      month: parseDateOnly(start).getMonth(),
      year: parseDateOnly(start).getFullYear(),
    };
  }

  return getMonthDates(date);
}

export function getCompletionDatesForView(date: string, view: View) {
  if (view === "day") {
    return [date];
  }

  if (view === "week") {
    return getWeekDates(date);
  }

  return getMonthOnlyDates(date);
}

export function getDayNumber(date: string) {
  return parseDateOnly(date).getDate();
}

export function isSameMonth(date: string, month: number, year: number) {
  const parsed = parseDateOnly(date);

  return parsed.getMonth() === month && parsed.getFullYear() === year;
}
