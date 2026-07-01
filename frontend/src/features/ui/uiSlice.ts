import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { View } from "../../types/view";
import {
  getTodayDateOnly,
  normalizeDateForView,
} from "../../utils/date";

type UiState = {
  selectedView: View;
  selectedDate: string;
  selectedCategory: string;
  isCreateHabitModalOpen: boolean;
  editingHabitId: number | null;
  deletingHabitId: number | null;
};

const initialView: View = "week";

const initialState: UiState = {
  selectedView: initialView,
  selectedDate: normalizeDateForView(getTodayDateOnly(), initialView),
  selectedCategory: "All",
  isCreateHabitModalOpen: false,
  editingHabitId: null,
  deletingHabitId: null,
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
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    openCreateHabitModal(state) {
      state.isCreateHabitModalOpen = true;
    },
    closeCreateHabitModal(state) {
      state.isCreateHabitModalOpen = false;
    },
    openEditHabitModal(state, action: PayloadAction<number>) {
      state.editingHabitId = action.payload;
    },
    closeEditHabitModal(state) {
      state.editingHabitId = null;
    },
    openDeleteHabitModal(state, action: PayloadAction<number>) {
      state.deletingHabitId = action.payload;
    },
    closeDeleteHabitModal(state) {
      state.deletingHabitId = null;
    },
  },
});

export const {
  setSelectedView,
  setSelectedDate,
  setSelectedCategory,
  openCreateHabitModal,
  closeCreateHabitModal,
  openEditHabitModal,
  closeEditHabitModal,
  openDeleteHabitModal,
  closeDeleteHabitModal,
} = uiSlice.actions;

export default uiSlice.reducer;
