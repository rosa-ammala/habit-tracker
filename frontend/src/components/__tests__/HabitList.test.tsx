import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import type { Habit } from "../../types/habit";
import type { View } from "../../types/view";
import { HabitList } from "../HabitList";
import { useToggleHabitLog } from "../../features/habits/useToggleHabitLog";

vi.mock("../../features/habits/useToggleHabitLog", () => ({
  useToggleHabitLog: vi.fn(),
}));

const toggleHabitLog = vi.fn();

const healthCategory = {
  id: 1,
  name: "Health",
  icon: "health.svg",
};

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 1,
    title: "Morning walk",
    categoryId: healthCategory.id,
    category: healthCategory,
    logs: [
      {
        id: 10,
        habitId: 1,
        date: "2026-06-08",
      },
    ],
    currentStreak: 3,
    bestStreak: 8,
    createdAt: "2026-06-01T00:00:00.000Z",
    ...overrides,
  };
}

function renderHabitList(habits: Habit[], selectedView: View = "week") {
  return renderWithProviders(<HabitList habits={habits} />, {
    preloadedState: {
      ui: {
        selectedView,
        selectedDate: "2026-06-08",
        activeModal: null,
        selectedHabitId: null,
      },
    },
  });
}

describe("HabitList", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });

    vi.mocked(useToggleHabitLog).mockReturnValue({
      logErrorMessage: null,
      toggleHabitLog,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("shows an empty state when there are no habits", () => {
    renderHabitList([]);

    expect(screen.getByText("No habits yet.")).toBeInTheDocument();
    expect(
      screen.getByText("Add your first habit to start tracking.")
    ).toBeInTheDocument();
  });

  it("renders habit details", () => {
    renderHabitList([makeHabit()]);

    expect(screen.getByRole("link", { name: "Morning walk" })).toHaveAttribute(
      "href",
      "/habits/1"
    );
    expect(screen.getByText("Health")).toBeInTheDocument();
    expect(screen.getByText(/current:/)).toHaveTextContent("current: 3");
    expect(screen.getByText(/best:/)).toHaveTextContent("best: 8");
  });

  it("renders one week of day cells in week view", () => {
    renderHabitList([makeHabit()]);

    expect(
      screen.getByRole("button", { name: "Completed, 2026-06-08" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Not completed, 2026-06-14" })
    ).toBeInTheDocument();
  });

  it("toggles a habit log for the selected date", async () => {
    const user = userEvent.setup();
    renderHabitList([makeHabit()]);

    await user.click(
      screen.getByRole("button", { name: "Not completed, 2026-06-09" })
    );

    await waitFor(() => {
      expect(toggleHabitLog).toHaveBeenCalledWith({
        habitId: 1,
        date: "2026-06-09",
        nextChecked: true,
      });
    });
  });

  it("shows log update errors", () => {
    vi.mocked(useToggleHabitLog).mockReturnValue({
      logErrorMessage: "Could not update habit log.",
      toggleHabitLog,
    });

    renderHabitList([makeHabit()]);

    expect(screen.getByText("Could not update habit log.")).toBeInTheDocument();
  });
});
