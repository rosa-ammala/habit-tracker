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
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => dispatch(setSelectedDate(previousDate))}
        aria-label="Previous period"
        title="Previous"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 border-transparent bg-white text-stone-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50"
      >
        <img
          src="/ui-icons/arrow-left.svg"
          alt=""
          aria-hidden="true"
          className="h-3.5 w-3.5"
        />
      </button>

      <span className="whitespace-nowrap text-sm font-medium text-stone-800">
        {formatRangeLabel(selectedDate, selectedView)}
      </span>

      <button
        type="button"
        disabled={isNextDisabled}
        onClick={() => dispatch(setSelectedDate(nextDate))}
        aria-label="Next period"
        title="Next"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 border-transparent bg-white text-stone-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <img
          src="/ui-icons/arrow-right.svg"
          alt=""
          aria-hidden="true"
          className="h-3.5 w-3.5"
        />
      </button>
    </div>
  );
}
