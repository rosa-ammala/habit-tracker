import { describe, expect, it, vi } from "vitest";
import uiReducer, {
  closeModal,
  openCreateHabitModal,
  openDeleteHabitModal,
  openEditHabitModal,
  setSelectedDate,
  setSelectedView,
} from "../uiSlice";
import * as dateUtils from "../../../utils/date";

vi.mock("../../../utils/date", async () => {
  const actual = await vi.importActual<typeof dateUtils>("../../../utils/date");

  return {
    ...actual,
    getTodayDateOnly: vi.fn(() => "2026-06-10"),
  };
});

describe("uiSlice", () => {
  it("returns to the current date when the view changes", () => {
    const state = uiReducer(
      {
        selectedView: "day",
        selectedDate: "2026-05-20",
        activeModal: null,
        selectedHabitId: null,
      },
      setSelectedView("week")
    );

    expect(state.selectedView).toBe("week");
    expect(state.selectedDate).toBe("2026-06-08");
  });

  it("normalizes selected date using the current view", () => {
    const state = uiReducer(
      {
        selectedView: "month",
        selectedDate: "2026-05-01",
        activeModal: null,
        selectedHabitId: null,
      },
      setSelectedDate("2026-06-10")
    );

    expect(state.selectedDate).toBe("2026-06-01");
  });

  it("opens and closes the create habit modal", () => {
    const openState = uiReducer(undefined, openCreateHabitModal());

    expect(openState.activeModal).toBe("create");
    expect(openState.selectedHabitId).toBeNull();

    const closedState = uiReducer(openState, closeModal());

    expect(closedState.activeModal).toBeNull();
    expect(closedState.selectedHabitId).toBeNull();
  });

  it("opens habit-specific modals", () => {
    const editState = uiReducer(undefined, openEditHabitModal(4));

    expect(editState.activeModal).toBe("edit");
    expect(editState.selectedHabitId).toBe(4);

    const deleteState = uiReducer(editState, openDeleteHabitModal(7));

    expect(deleteState.activeModal).toBe("delete");
    expect(deleteState.selectedHabitId).toBe(7);
  });
});
