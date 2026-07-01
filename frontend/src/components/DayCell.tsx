type Props = {
  date: string;
  isChecked: boolean;
  isToday: boolean;
  isFuture: boolean;
  isDimmed: boolean;
  showNumber: boolean;
  onClick: () => void;
};

export function DayCell({
  date,
  isChecked,
  isToday,
  isFuture,
  isDimmed,
  showNumber,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      disabled={isFuture}
      title={date}
      onClick={onClick}
      className={[
        "flex h-9 w-9 items-center justify-center rounded-md text-xs font-medium ring-1 transition",
        isChecked
          ? "bg-green-700 text-white ring-green-700"
          : "bg-white text-gray-800 ring-gray-200",
        isToday && !isChecked ? "ring-2 ring-gray-900" : "",
        isDimmed ? "opacity-35" : "",
        isFuture ? "cursor-not-allowed opacity-25" : "hover:bg-gray-100",
      ].join(" ")}
    >
      {showNumber ? getCellLabel(date) : isChecked ? "✓" : ""}
    </button>
  );
}

function getCellLabel(date: string) {
  return Number(date.slice(-2));
}