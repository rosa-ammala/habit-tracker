import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DateNavigation } from "../DateNavigation";

describe("DateNavigation", () => {
  it("moves to the previous period", async () => {
    const user = userEvent.setup();
    const onSelectedDateChange = vi.fn();

    render(
      <DateNavigation
        selectedDate="2026-06-10"
        selectedView="day"
        onSelectedDateChange={onSelectedDateChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Previous period" }));

    expect(onSelectedDateChange).toHaveBeenCalledWith("2026-06-09");
  });

  it("moves to the next period when it is not in the future", async () => {
    const user = userEvent.setup();
    const onSelectedDateChange = vi.fn();

    render(
      <DateNavigation
        selectedDate="2026-06-09"
        selectedView="day"
        onSelectedDateChange={onSelectedDateChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Next period" }));

    expect(onSelectedDateChange).toHaveBeenCalledWith("2026-06-10");
  });

  it("disables next period navigation into the future", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T12:00:00Z"));

    render(
      <DateNavigation
        selectedDate="2026-06-10"
        selectedView="day"
        onSelectedDateChange={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Next period" })).toBeDisabled();

    vi.useRealTimers();
  });
});
