import { useMemo } from "react";
import { getStartOfWeek, getStartOfMonth, getWeekDates, getMonthDates, toDateString } from "../utils/date";
import type { View } from "../types/view";

export function useSelectedDates(view: View, selectedDate: Date) {
  const normalizedSelectedDate = useMemo(() => {
    if (view === "week") {
      return getStartOfWeek(selectedDate);
    }

    if (view === "month") {
      return getStartOfMonth(selectedDate);
    }

    return selectedDate;
  }, [view, selectedDate]);

  const selectedDates = useMemo(() => {
    if (view === "day") {
      return [toDateString(normalizedSelectedDate)];
    }

    if (view === "week") {
      return getWeekDates(normalizedSelectedDate).map((date) =>
        toDateString(date)
      );
    }

    return getMonthDates(normalizedSelectedDate).map((date) =>
      toDateString(date)
    );
  }, [view, normalizedSelectedDate]);

  return { normalizedSelectedDate, selectedDates };
}