import type { View } from "../types/view";

export function getTodayString() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/Helsinki",
  });
}

export function toDateString(date: Date) {
  return date.toLocaleDateString("en-CA", {
    timeZone: "Europe/Helsinki",
  });
}

export function parseDateString(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday

  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);

  return d;
}

export function formatRangeLabel(
  view: View,
  date: Date
) {
  if (view === "day") {
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  if (view === "week") {
    const start = getWeekDates(date)[0];
    const end = getWeekDates(date)[6];

    const startStr = start.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    const endStr = end.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    return `${startStr} – ${endStr}`;
  }

  // month
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export function addDays(date: Date, amount: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + amount);
  return newDate;
}

export function getWeekDates(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday

  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);

  const week: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const newDate = new Date(monday);
    newDate.setDate(monday.getDate() + i);
    week.push(newDate);
  }

  return week;
}

export function getStartOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthDates(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();

  const startOffset = startDay === 0 ? -6 : 1 - startDay;

  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() + startOffset);

  const days: Date[] = [];

  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    days.push(d);
  }

  return days;
}

export function addMonths(date: Date, amount: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
}