const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateOnlyString(date: string) {
  if (!datePattern.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  return !Number.isNaN(parsedDate.getTime());
}

export function getTodayInTimezone(timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isFutureDateInTimezone(date: string, timezone: string) {
  const today = getTodayInTimezone(timezone);
  return date > today;
}

export function parseDateOnlyAsUtcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}