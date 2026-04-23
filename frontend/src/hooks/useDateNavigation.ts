import { useMemo } from "react";
import { addDays, addMonths, getWeekDates, getMonthDates, toDateString } from "../utils/date";
import type { View } from "../types/view";

export function useDateNavigation(
  view: View, 
  normalizedSelectedDate: Date, 
  todayStr: string
) {
  const nextDate = useMemo(() => {
    if (view === "day") {
      return addDays(normalizedSelectedDate, 1);
    }

    if (view === "week") {
      return addDays(normalizedSelectedDate, 7);
    }

    return addMonths(normalizedSelectedDate, 1);
  }, [view, normalizedSelectedDate]);

  const prevDate = useMemo(() => {
    if (view === "day") {
      return addDays(normalizedSelectedDate, -1);
    }

    if (view === "week") {
      return addDays(normalizedSelectedDate, -7);
    }

    return addMonths(normalizedSelectedDate, -1);
  }, [view, normalizedSelectedDate]);

  const isNextDisabled = useMemo(() => {
    if (view === "day") {
      return toDateString(nextDate) > todayStr;
    }

    if (view === "week") {
      const nextWeekDates = getWeekDates(nextDate);
      const firstDay = nextWeekDates[0];

      return toDateString(firstDay) > todayStr;
    }

    const nextMonthDates = getMonthDates(nextDate);
    const firstDay = nextMonthDates[0];

    return toDateString(firstDay) > todayStr;
  }, [view, nextDate, todayStr]);

  const goNext = () => nextDate;
  const goPrev = () => prevDate;

  return { nextDate, prevDate, isNextDisabled, goNext, goPrev };
}