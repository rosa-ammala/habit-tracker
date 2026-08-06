import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Habit } from "../../types/habit";
import { CompletionSummary } from "../CompletionSummary";

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

describe("CompletionSummary", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows completion totals and percentage for day view", () => {
    render(
      <CompletionSummary
        habits={[makeHabit(1, ["2026-06-10"]), makeHabit(2, [])]}
        selectedDate="2026-06-10"
        selectedView="day"
      />
    );

    expect(screen.getByText("1 of 2 habit-days completed")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("shows completion totals and percentage for week view", () => {
    render(
      <CompletionSummary
        habits={[
          makeHabit(1, ["2026-06-08", "2026-06-09", "2026-06-10"]),
          makeHabit(2, ["2026-06-10"]),
        ]}
        selectedDate="2026-06-08"
        selectedView="week"
      />
    );

    expect(screen.getByText("4 of 6 habit-days completed")).toBeInTheDocument();
    expect(screen.getByText("67%")).toBeInTheDocument();
  });

  it("excludes future dates from month totals", () => {
    render(
      <CompletionSummary
        habits={[
          makeHabit(1, ["2026-06-10", "2026-06-11"]),
          makeHabit(2, ["2026-06-11"]),
        ]}
        selectedDate="2026-06-01"
        selectedView="month"
      />
    );

    expect(screen.getByText("1 of 20 habit-days completed")).toBeInTheDocument();
    expect(screen.getByText("5%")).toBeInTheDocument();
  });

  it("shows zero completion when there are no habits", () => {
    render(
      <CompletionSummary
        habits={[]}
        selectedDate="2026-06-10"
        selectedView="day"
      />
    );

    expect(screen.getByText("0 of 0 habit-days completed")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
