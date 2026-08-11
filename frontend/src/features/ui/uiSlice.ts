import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { View } from "../../types/view";
import {
  getTodayDateOnly,
  normalizeDateForView,
} from "../../utils/date";

type ActiveModal = "create" | "edit" | "delete" | null;

type UiState = {
  selectedView: View;
  selectedDate: string;
  activeModal: ActiveModal;
  selectedHabitId: number | null;
};

const initialView: View = "week";

const initialState: UiState = {
  selectedView: initialView,
  selectedDate: normalizeDateForView(getTodayDateOnly(), initialView),
  activeModal: null,
  selectedHabitId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedView(state, action: PayloadAction<View>) {
      state.selectedView = action.payload;
      state.selectedDate = normalizeDateForView(
        state.selectedDate,
        action.payload
      );
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = normalizeDateForView(
        action.payload,
        state.selectedView
      );
    },
    openCreateHabitModal(state) {
      state.activeModal = "create";
      state.selectedHabitId = null;
    },
    openEditHabitModal(state, action: PayloadAction<number>) {
      state.activeModal = "edit";
      state.selectedHabitId = action.payload;
    },
    openDeleteHabitModal(state, action: PayloadAction<number>) {
      state.activeModal = "delete";
      state.selectedHabitId = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
      state.selectedHabitId = null;
    },
  },
});

export const {
  setSelectedView,
  setSelectedDate,
  openCreateHabitModal,
  openEditHabitModal,
  openDeleteHabitModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
