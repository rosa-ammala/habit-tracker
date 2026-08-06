import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DayCell } from "../DayCell";

describe("DayCell", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls onClick with the next checked value", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <DayCell
        date="2026-06-10"
        isChecked={false}
        isToday={false}
        isFuture={false}
        isDimmed={false}
        showNumber={false}
        onClick={onClick}
      />
    );

    await user.click(screen.getByRole("button", {
      name: "Not completed, 2026-06-10",
    }));

    await waitFor(() => {
      expect(onClick).toHaveBeenCalledWith(true);
    });
  });

  it("does not call onClick for future dates", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <DayCell
        date="2026-06-11"
        isChecked={false}
        isToday={false}
        isFuture
        isDimmed={false}
        showNumber
        onClick={onClick}
      />
    );

    const button = screen.getByRole("button", {
      name: "Not completed, 2026-06-11, future date",
    });

    expect(button).toBeDisabled();
    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("rolls the visual checked state back when onClick fails", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn().mockRejectedValue(new Error("Request failed"));

    render(
      <DayCell
        date="2026-06-10"
        isChecked={false}
        isToday={false}
        isFuture={false}
        isDimmed={false}
        showNumber={false}
        onClick={onClick}
      />
    );

    await user.click(screen.getByRole("button", {
      name: "Not completed, 2026-06-10",
    }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Not completed, 2026-06-10",
        })
      ).toBeEnabled();
    });
  });
});
