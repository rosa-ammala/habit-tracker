import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HabitFormModal } from "../modals/HabitFormModal";

const categories = [
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

describe("HabitFormModal", () => {
  it("keeps submit disabled until title and category are selected", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <HabitFormModal
        title="Add habit"
        submitLabel="Create"
        categories={categories}
        isLoading={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    const submitButton = screen.getByRole("button", { name: "Create" });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText("Habit title"), "Read");
    expect(submitButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Learning" }));
    expect(submitButton).toBeEnabled();
  });

  it("trims the habit title before submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <HabitFormModal
        title="Add habit"
        submitLabel="Create"
        categories={categories}
        isLoading={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText("Habit title"), "  Read book  ");
    await user.click(screen.getByRole("button", { name: "Learning" }));
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Read book",
      categoryId: 2,
    });
  });

  it("does not close or submit while loading", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <HabitFormModal
        title="Edit habit"
        submitLabel="Save"
        categories={categories}
        initialTitle="Exercise"
        initialCategoryId={1}
        isLoading
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Saving..." }));

    expect(onClose).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows an error message", () => {
    render(
      <HabitFormModal
        title="Add habit"
        submitLabel="Create"
        categories={categories}
        isLoading={false}
        errorMessage="Could not save habit."
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText("Could not save habit.")).toBeInTheDocument();
  });
});
