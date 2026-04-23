import checkIcon from "../assets/check.svg";

type Props = {
  isChecked: boolean;
  isToday: boolean;
  isDimmed: boolean;
  isDisabled: boolean;
  showNumber: boolean;
  dayNumber: number;
  onClick: (e: React.MouseEvent) => void;
};

export function DayCell({
  isChecked,
  isToday,
  isDimmed,
  isDisabled,
  showNumber,
  dayNumber,
  onClick,
}: Props) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      
        if (!isDisabled) {
          onClick(e);
        }
      }}
      className={`flex items-center justify-center w-8 h-8 min-w-[32px] min-h-[32px] active:scale-90
        ${isDisabled ? "cursor-default" : "cursor-pointer"}
      `}
    >
      {isChecked ? (
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ease-out
            ${!isDimmed && !isDisabled ? "hover:bg-indigo-100" : ""}
            ${isToday ? "border-2 border-indigo-400" : ""}
            ${isDimmed ? "opacity-30" : ""}
            ${isDisabled ? "pointer-events-none" : ""}
          `}
        >
          <img
            src={checkIcon}
            className={`w-8 h-8 transition-all duration-200 ease-out
              ${isChecked ? "scale-100 opacity-100" : "scale-75 opacity-0"}
            `}
          />
        </div>
      ) : (
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition
            ${
              isDimmed
                ? "border-gray-200 opacity-30"
                : isToday
                ? "border-indigo-400"
                : "border-gray-300"
            }
            ${!isDimmed && !isDisabled ? "hover:bg-indigo-100" : ""}
            ${isDisabled ? "pointer-events-none" : ""}
          `}
        >
          {showNumber ? dayNumber : ""}
        </div>
      )}
    </div>
  );
}