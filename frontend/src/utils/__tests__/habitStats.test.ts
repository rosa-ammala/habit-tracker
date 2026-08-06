import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Habit } from "../../types/habit";
import { getCompletionStats } from "../habitStats";

const category = {
  id: 1,
  name: "Health",
  icon: "health.svg",
};

function makeHabit(id: number, logDates: string[]): Habit {
  return {
    id,
    title: `Habit ${id}`,
    categoryId: category.id,
    category,
    logs: logDates.map((date, index) => ({
      id: id * 100 + index,
      habitId: id,
      date,
    })),
    currentStreak: 0,
    bestStreak: 0,
    createdAt: "2026-06-01T00:00:00.000Z",
  };
}

describe("getCompletionStats", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts completed habit logs for eligible dates", () => {
    const habits = [
      makeHabit(1, ["2026-06-09", "2026-06-10"]),
      makeHabit(2, ["2026-06-10"]),
    ];

    expect(
      getCompletionStats(habits, ["2026-06-09", "2026-06-10"])
    ).toEqual({
      completed: 3,
      total: 4,
      percentage: 75,
    });
  });

  it("excludes future dates from totals", () => {
    const habits = [
      makeHabit(1, ["2026-06-10", "2026-06-11"]),
      makeHabit(2, ["2026-06-11"]),
    ];

    expect(
      getCompletionStats(habits, ["2026-06-10", "2026-06-11"])
    ).toEqual({
      completed: 1,
      total: 2,
      percentage: 50,
    });
  });

  it("returns zero values when there is nothing eligible to count", () => {
    expect(getCompletionStats([], ["2026-06-10"])).toEqual({
      completed: 0,
      total: 0,
      percentage: 0,
    });

    expect(getCompletionStats([makeHabit(1, [])], ["2026-06-11"])).toEqual({
      completed: 0,
      total: 0,
      percentage: 0,
    });
  });
});
