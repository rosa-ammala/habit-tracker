import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CategoryFilter } from "../CategoryFilter";

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

describe("CategoryFilter", () => {
  it("renders all category options", () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategoryId={null}
        onSelectedCategoryChange={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Health" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Learning" })
    ).toBeInTheDocument();
  });

  it("selects all categories", async () => {
    const user = userEvent.setup();
    const onSelectedCategoryChange = vi.fn();

    render(
      <CategoryFilter
        categories={categories}
        selectedCategoryId={1}
        onSelectedCategoryChange={onSelectedCategoryChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "All" }));

    expect(onSelectedCategoryChange).toHaveBeenCalledWith(null);
  });

  it("selects a category", async () => {
    const user = userEvent.setup();
    const onSelectedCategoryChange = vi.fn();

    render(
      <CategoryFilter
        categories={categories}
        selectedCategoryId={null}
        onSelectedCategoryChange={onSelectedCategoryChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Learning" }));

    expect(onSelectedCategoryChange).toHaveBeenCalledWith(2);
  });
});
