import { IconButton } from "./buttons/IconButton";
import type { View } from "../types/view";
import {
  formatRangeLabel,
  getNextDate,
  getPreviousDate,
  getTodayDateOnly,
  isDateInFuture,
} from "../utils/date";

type Props = {
  selectedDate: string;
  selectedView: View;
  onSelectedDateChange: (date: string) => void;
};

export function DateNavigation({
  selectedDate,
  selectedView,
  onSelectedDateChange,
}: Props) {
  const previousDate = getPreviousDate(selectedDate, selectedView);
  const nextDate = getNextDate(selectedDate, selectedView);
  const isNextDisabled = isDateInFuture(nextDate) || nextDate > getTodayDateOnly();

  return (
    <div className="flex items-center gap-4">
      <IconButton
        icon="/ui-icons/arrow-left.svg"
        title="Previous period"
        onClick={() => onSelectedDateChange(previousDate)}
      />

      <span className="whitespace-nowrap text-sm font-medium text-stone-800">
        {formatRangeLabel(selectedDate, selectedView)}
      </span>

      <IconButton
        icon="/ui-icons/arrow-right.svg"
        title="Next period"
        disabled={isNextDisabled}
        onClick={() => onSelectedDateChange(nextDate)}
      />
    </div>
  );
}
