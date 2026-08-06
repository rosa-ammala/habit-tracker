import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addDays,
  formatRangeLabel,
  getCompletionDatesForView,
  getDatesForView,
  getMonthDates,
  getNextDate,
  getPreviousDate,
  getStartOfMonth,
  getStartOfWeek,
  getTodayDateOnly,
  isDateInFuture,
  normalizeDateForView,
} from "../date";

describe("date utilities", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses Monday as the start of the week", () => {
    expect(getStartOfWeek("2026-06-10")).toBe("2026-06-08");
    expect(getStartOfWeek("2026-06-14")).toBe("2026-06-08");
  });

  it("normalizes dates for week and month views", () => {
    expect(normalizeDateForView("2026-06-10", "day")).toBe("2026-06-10");
    expect(normalizeDateForView("2026-06-10", "week")).toBe("2026-06-08");
    expect(normalizeDateForView("2026-06-10", "month")).toBe("2026-06-01");
  });

  it("returns previous and next dates based on the selected view", () => {
    expect(getPreviousDate("2026-06-10", "day")).toBe("2026-06-09");
    expect(getNextDate("2026-06-10", "day")).toBe("2026-06-11");
    expect(getPreviousDate("2026-06-08", "week")).toBe("2026-06-01");
    expect(getNextDate("2026-06-08", "week")).toBe("2026-06-15");
    expect(getPreviousDate("2026-06-01", "month")).toBe("2026-05-01");
    expect(getNextDate("2026-06-01", "month")).toBe("2026-07-01");
  });

  it("returns a 42-day visible month grid", () => {
    const month = getMonthDates("2026-06-10");

    expect(month.month).toBe(5);
    expect(month.year).toBe(2026);
    expect(month.dates).toHaveLength(42);
    expect(month.dates[0]).toBe("2026-06-01");
    expect(month.dates[41]).toBe("2026-07-12");
  });

  it("returns the correct completion dates for each view", () => {
    expect(getCompletionDatesForView("2026-06-10", "day")).toEqual([
      "2026-06-10",
    ]);
    expect(getCompletionDatesForView("2026-06-08", "week")).toEqual([
      "2026-06-08",
      "2026-06-09",
      "2026-06-10",
      "2026-06-11",
      "2026-06-12",
      "2026-06-13",
      "2026-06-14",
    ]);
    expect(getCompletionDatesForView("2026-06-01", "month")).toHaveLength(30);
  });

  it("detects future dates using today's local date", () => {
    expect(getTodayDateOnly()).toBe("2026-06-10");
    expect(isDateInFuture("2026-06-10")).toBe(false);
    expect(isDateInFuture("2026-06-11")).toBe(true);
  });

  it("formats range labels for day, week, and month views", () => {
    expect(formatRangeLabel("2026-06-10", "day")).toBe("Wed, 10 Jun 2026");
    expect(formatRangeLabel("2026-06-08", "week")).toBe("8 Jun - 14 Jun 2026");
    expect(formatRangeLabel("2026-06-01", "month")).toBe("June 2026");
  });

  it("keeps date-only arithmetic stable across day changes", () => {
    expect(addDays("2026-06-10", 5)).toBe("2026-06-15");
    expect(getStartOfMonth("2026-06-10")).toBe("2026-06-01");
    expect(getDatesForView("2026-06-10", "day").dates).toEqual([
      "2026-06-10",
    ]);
  });
});
