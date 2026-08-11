import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import {
  useCreateHabitMutation,
  useGetHabitsQuery,
} from "../../features/habits/habitsApi";
import { useToggleHabitLog } from "../../features/habits/useToggleHabitLog";
import { renderWithProviders } from "../../test/test-utils";
import type { Category } from "../../types/category";
import type { Habit } from "../../types/habit";
import { Home } from "../Home";

vi.mock("../../features/categories/categoriesApi", () => ({
  useGetCategoriesQuery: vi.fn(),
}));

vi.mock("../../features/habits/habitsApi", () => ({
  useCreateHabitMutation: vi.fn(),
  useGetHabitsQuery: vi.fn(),
}));

vi.mock("../../features/habits/useToggleHabitLog", () => ({
  useToggleHabitLog: vi.fn(),
}));

const categories: Category[] = [
  {
    id: 1,
    name: "Health",
    icon: "health.svg",
  },
  {
    id: 2,
    name: "Learning",
    icon: "book.svg",
  },
];

const habits: Habit[] = [
  {
    id: 1,
    title: "Morning walk",
    categoryId: 1,
    category: categories[0],
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
  },
];

function renderHome() {
  return renderWithProviders(<Home />, {
    preloadedState: {
      ui: {
        selectedView: "day",
        selectedDate: "2026-06-08",
        activeModal: null,
        selectedHabitId: null,
      },
    },
  });
}

function queryResult<T>(result: {
  data?: T;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
}) {
  return {
    ...result,
    refetch: vi.fn(),
  };
}

describe("Home", () => {
  beforeEach(() => {
    vi.mocked(useGetCategoriesQuery).mockReturnValue(queryResult({
      data: categories,
      isLoading: false,
      isError: false,
      error: undefined,
    }) as unknown as ReturnType<typeof useGetCategoriesQuery>);

    vi.mocked(useGetHabitsQuery).mockReturnValue(queryResult({
      data: habits,
      isLoading: false,
      isError: false,
      error: undefined,
    }) as unknown as ReturnType<typeof useGetHabitsQuery>);

    vi.mocked(useCreateHabitMutation).mockReturnValue([
      vi.fn(),
      {
        isLoading: false,
      },
    ] as unknown as ReturnType<typeof useCreateHabitMutation>);

    vi.mocked(useToggleHabitLog).mockReturnValue({
      logErrorMessage: null,
      toggleHabitLog: vi.fn(),
    });
  });

  it("renders the main dashboard content", () => {
    renderHome();

    expect(
      screen.getByRole("heading", { name: "Habit Tracker" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add habit" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Health" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Morning walk" })
    ).toBeInTheDocument();
    expect(screen.getByText("1 of 1 habit-days completed")).toBeInTheDocument();
  });

  it("filters habits by selected category", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole("button", { name: "Learning" }));

    expect(screen.getByText("No habits yet.")).toBeInTheDocument();
  });

  it("opens the create habit modal", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole("button", { name: "Add habit" }));

    expect(
      screen.getByRole("dialog", { name: "Create habit" })
    ).toBeInTheDocument();
  });

  it("shows loading states", () => {
    vi.mocked(useGetCategoriesQuery).mockReturnValue(queryResult({
      data: undefined,
      isLoading: true,
      isError: false,
      error: undefined,
    }) as unknown as ReturnType<typeof useGetCategoriesQuery>);

    vi.mocked(useGetHabitsQuery).mockReturnValue(queryResult({
      data: undefined,
      isLoading: true,
      isError: false,
      error: undefined,
    }) as unknown as ReturnType<typeof useGetHabitsQuery>);

    renderHome();

    expect(screen.getByText("Loading categories...")).toBeInTheDocument();
    expect(screen.getByText("Loading habits...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add habit" })).toBeDisabled();
  });

  it("shows error states", () => {
    vi.mocked(useGetCategoriesQuery).mockReturnValue(queryResult({
      data: undefined,
      isLoading: false,
      isError: true,
      error: undefined,
    }) as unknown as ReturnType<typeof useGetCategoriesQuery>);

    vi.mocked(useGetHabitsQuery).mockReturnValue(queryResult({
      data: undefined,
      isLoading: false,
      isError: true,
      error: undefined,
    }) as unknown as ReturnType<typeof useGetHabitsQuery>);

    renderHome();

    expect(screen.getByText("Could not load categories.")).toBeInTheDocument();
    expect(screen.getByText("Could not load habits.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add habit" })).toBeDisabled();
  });
});
