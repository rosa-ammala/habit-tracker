import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  useCreateHabitMutation,
  useDeleteHabitMutation,
  useUpdateHabitMutation,
} from "../../features/habits/habitsApi";
import { renderWithProviders } from "../../test/test-utils";
import type { Category } from "../../types/category";
import type { Habit } from "../../types/habit";
import { CreateHabitModal } from "../modals/CreateHabitModal";
import { DeleteHabitModal } from "../modals/DeleteHabitModal";
import { EditHabitModal } from "../modals/EditHabitModal";

vi.mock("../../features/habits/habitsApi", () => ({
  useCreateHabitMutation: vi.fn(),
  useDeleteHabitMutation: vi.fn(),
  useUpdateHabitMutation: vi.fn(),
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

const habit: Habit = {
  id: 1,
  title: "Morning walk",
  categoryId: 1,
  category: categories[0],
  logs: [],
  currentStreak: 0,
  bestStreak: 0,
  createdAt: "2026-06-01T00:00:00.000Z",
};

function mutationError(message: string) {
  return {
    status: 400,
    data: {
      message,
    },
  };
}

function renderModal(ui: ReactElement) {
  return renderWithProviders(ui, {
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

describe("habit mutation modals", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows backend errors when creating a habit fails", async () => {
    const user = userEvent.setup();
    const createHabit = vi.fn(() => ({
      unwrap: vi
        .fn()
        .mockRejectedValue(mutationError("Habit title is already in use.")),
    }));

    vi.mocked(useCreateHabitMutation).mockReturnValue([
      createHabit,
      { isLoading: false },
    ] as unknown as ReturnType<typeof useCreateHabitMutation>);

    renderModal(<CreateHabitModal categories={categories} />);

    await user.type(screen.getByLabelText("Habit title"), "Morning walk");
    await user.click(screen.getByRole("button", { name: "Health" }));
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(createHabit).toHaveBeenCalledWith({
      title: "Morning walk",
      categoryId: 1,
    });
    expect(
      await screen.findByText("Habit title is already in use.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("dialog", { name: "Create habit" })
    ).toBeInTheDocument();
  });

  it("shows backend errors when updating a habit fails", async () => {
    const user = userEvent.setup();
    const updateHabit = vi.fn(() => ({
      unwrap: vi
        .fn()
        .mockRejectedValue(mutationError("Habit title is too long.")),
    }));

    vi.mocked(useUpdateHabitMutation).mockReturnValue([
      updateHabit,
      { isLoading: false },
    ] as unknown as ReturnType<typeof useUpdateHabitMutation>);

    renderModal(<EditHabitModal habit={habit} categories={categories} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(updateHabit).toHaveBeenCalledWith({
      habitId: habit.id,
      title: habit.title,
      categoryId: habit.categoryId,
    });
    expect(
      await screen.findByText("Habit title is too long.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("dialog", { name: "Edit habit" })
    ).toBeInTheDocument();
  });

  it("shows backend errors when deleting a habit fails", async () => {
    const user = userEvent.setup();
    const onDeleted = vi.fn();
    const deleteHabit = vi.fn(() => ({
      unwrap: vi
        .fn()
        .mockRejectedValue(mutationError("Habit could not be deleted.")),
    }));

    vi.mocked(useDeleteHabitMutation).mockReturnValue([
      deleteHabit,
      { isLoading: false },
    ] as unknown as ReturnType<typeof useDeleteHabitMutation>);

    renderModal(<DeleteHabitModal habit={habit} onDeleted={onDeleted} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(deleteHabit).toHaveBeenCalledWith({ habitId: habit.id });
    expect(
      await screen.findByText("Habit could not be deleted.")
    ).toBeInTheDocument();
    expect(onDeleted).not.toHaveBeenCalled();
    expect(
      screen.getByRole("dialog", { name: "Delete habit" })
    ).toBeInTheDocument();
  });

  it("clears create errors when the form changes", async () => {
    const user = userEvent.setup();
    const createHabit = vi.fn(() => ({
      unwrap: vi
        .fn()
        .mockRejectedValue(mutationError("Habit title is already in use.")),
    }));

    vi.mocked(useCreateHabitMutation).mockReturnValue([
      createHabit,
      { isLoading: false },
    ] as unknown as ReturnType<typeof useCreateHabitMutation>);

    renderModal(<CreateHabitModal categories={categories} />);

    const titleInput = screen.getByLabelText("Habit title");

    await user.type(titleInput, "Morning walk");
    await user.click(screen.getByRole("button", { name: "Health" }));
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(
      await screen.findByText("Habit title is already in use.")
    ).toBeInTheDocument();

    await user.type(titleInput, " updated");

    await waitFor(() => {
      expect(
        screen.queryByText("Habit title is already in use.")
      ).not.toBeInTheDocument();
    });
  });
});
