import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ViewSwitch } from "../ViewSwitch";

describe("ViewSwitch", () => {
  it("calls onSelectedViewChange with the selected view", async () => {
    const user = userEvent.setup();
    const onSelectedViewChange = vi.fn();

    render(
      <ViewSwitch
        selectedView="week"
        onSelectedViewChange={onSelectedViewChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "month" }));

    expect(onSelectedViewChange).toHaveBeenCalledWith("month");
  });
});
