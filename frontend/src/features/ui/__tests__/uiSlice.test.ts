import { describe, expect, it } from "vitest";
import uiReducer, {
  closeModal,
  openCreateHabitModal,
  openDeleteHabitModal,
  openEditHabitModal,
  setSelectedDate,
  setSelectedView,
} from "../uiSlice";

describe("uiSlice", () => {
  it("normalizes selected date when the view changes", () => {
    const state = uiReducer(
      {
        selectedView: "day",
        selectedDate: "2026-06-10",
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
