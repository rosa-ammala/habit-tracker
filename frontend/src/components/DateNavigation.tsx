import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSelectedDate } from "../features/ui/uiSlice";
import { IconButton } from "./IconButton";
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
      <IconButton
        icon="/ui-icons/arrow-left.svg"
        title="Previous period"
        onClick={() => dispatch(setSelectedDate(previousDate))}
      />

      <span className="whitespace-nowrap text-sm font-medium text-stone-800">
        {formatRangeLabel(selectedDate, selectedView)}
      </span>

      <IconButton
        icon="/ui-icons/arrow-right.svg"
        title="Next period"
        disabled={isNextDisabled}
        onClick={() => dispatch(setSelectedDate(nextDate))}
      />
    </div>
  );
}
