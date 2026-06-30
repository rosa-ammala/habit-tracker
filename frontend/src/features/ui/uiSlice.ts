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
};

const initialView: View = "week";

const initialState: UiState = {
  selectedView: initialView,
  selectedDate: normalizeDateForView(getTodayDateOnly(), initialView),
  selectedCategory: "All",
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
  },
});

export const {
  setSelectedView,
  setSelectedDate,
  setSelectedCategory,
} = uiSlice.actions;

export default uiSlice.reducer;