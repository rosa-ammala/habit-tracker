import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSelectedDate } from "../features/ui/uiSlice";
import {
  formatRangeLabel,
  getNextDate,
  getPreviousDate,
  getTodayDateOnly,
  isDateInFuture,
} from "../utils/date";

export function DateNavigation() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector((state) => state.ui.selectedDate);
  const selectedView = useAppSelector((state) => state.ui.selectedView);

  const previousDate = getPreviousDate(selectedDate, selectedView);
  const nextDate = getNextDate(selectedDate, selectedView);
  const isNextDisabled = isDateInFuture(nextDate) || nextDate > getTodayDateOnly();

  return (
    <div className="mb-6 flex items-center gap-3">
      <button
        type="button"
        onClick={() => dispatch(setSelectedDate(previousDate))}
        className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200"
      >
        Previous
      </button>

      <div className="min-w-48 text-center text-sm font-medium text-gray-800">
        {formatRangeLabel(selectedDate, selectedView)}
      </div>

      <button
        type="button"
        disabled={isNextDisabled}
        onClick={() => dispatch(setSelectedDate(nextDate))}
        className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}