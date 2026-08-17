import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import { useGetHabitByIdQuery } from "../../features/habits/habitsApi";
import { useToggleHabitLog } from "../../features/habits/useToggleHabitLog";
import { renderWithProviders } from "../../test/test-utils";
import type { Category } from "../../types/category";
import { HabitDetail } from "../HabitDetail";

vi.mock("../../features/categories/categoriesApi", () => ({
  useGetCategoriesQuery: vi.fn(),
}));

vi.mock("../../features/habits/habitsApi", () => ({
  useGetHabitByIdQuery: vi.fn(),
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
];

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

function renderHabitDetail() {
  return renderWithProviders(
    <Routes>
      <Route path="/habits/:id" element={<HabitDetail />} />
    </Routes>,
    {
      route: "/habits/1",
      preloadedState: {
        ui: {
          selectedView: "day",
          selectedDate: "2026-06-08",
          activeModal: null,
          selectedHabitId: null,
        },
      },
    }
  );
}

describe("HabitDetail", () => {
  beforeEach(() => {
    vi.mocked(useGetCategoriesQuery).mockReturnValue(queryResult({
      data: categories,
      isLoading: false,
      isError: false,
      error: undefined,
    }) as unknown as ReturnType<typeof useGetCategoriesQuery>);

    vi.mocked(useToggleHabitLog).mockReturnValue({
      logErrorMessage: null,
      toggleHabitLog: vi.fn(),
    });
  });

  it("shows habit load errors", () => {
    vi.mocked(useGetHabitByIdQuery).mockReturnValue(queryResult({
      data: undefined,
      isLoading: false,
      isError: true,
      error: undefined,
    }) as unknown as ReturnType<typeof useGetHabitByIdQuery>);

    renderHabitDetail();

    expect(screen.getByText("Could not load habit.")).toBeInTheDocument();
  });
});
