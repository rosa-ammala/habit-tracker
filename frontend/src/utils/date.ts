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