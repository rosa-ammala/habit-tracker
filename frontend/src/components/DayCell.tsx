import { useRef, useState, type PointerEvent } from "react";
import { flushSync } from "react-dom";

type Props = {
  date: string;
  isChecked: boolean;
  isToday: boolean;
  isFuture: boolean;
  isPending?: boolean;
  isDimmed: boolean;
  showNumber: boolean;
  size?: "sm" | "md";
  onClick: (nextChecked: boolean) => Promise<void> | void;
};

export function DayCell({
  date,
  isChecked,
  isToday,
  isFuture,
  isPending = false,
  isDimmed,
  showNumber,
  size = "md",
  onClick,
}: Props) {
  const [optimisticChecked, setOptimisticChecked] = useState<boolean | null>(
    null
  );
  const [isLocalPending, setIsLocalPending] = useState(false);
  const pointerHandledRef = useRef(false);
  const isDisabled = isFuture || isPending || isLocalPending;
  const visualChecked = optimisticChecked ?? isChecked;
  const ariaLabel = getAriaLabel(date, visualChecked, isToday, isFuture);

  function handleActivate() {
    if (isDisabled) {
      return;
    }

    const previousValue = visualChecked;
    const nextValue = !previousValue;

    flushSync(() => {
      setOptimisticChecked(nextValue);
      setIsLocalPending(true);
    });

    window.requestAnimationFrame(() => {
      void Promise.resolve(onClick(nextValue))
        .catch(() => {
          setOptimisticChecked(previousValue);
        })
        .finally(() => {
          setIsLocalPending(false);
          setOptimisticChecked(null);
        });
    });
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (
      event.pointerType === "mouse" ||
      event.pointerType === "touch" ||
      event.pointerType === "pen"
    ) {
      pointerHandledRef.current = true;
      handleActivate();
    }
  }

  function handleClick() {
    if (pointerHandledRef.current) {
      pointerHandledRef.current = false;
      return;
    }

    handleActivate();
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      title={date}
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={[
        "flex shrink-0 items-center justify-center rounded-lg text-xs font-semibold ring-1",
        size === "sm" ? "h-7 w-7" : "h-8 w-8 min-h-[32px] min-w-[32px]",
        visualChecked
          ? "bg-indigo-400 text-white ring-indigo-400 shadow-sm shadow-indigo-500/20"
          : "bg-white text-stone-700 ring-stone-200",
        isToday && !visualChecked ? "ring-2 ring-amber-500" : "",
        isDimmed ? "opacity-35" : "",
        isFuture ? "cursor-not-allowed opacity-25" : "",
        isPending || isLocalPending ? "cursor-wait opacity-80" : "",
        !isFuture && !isPending && !isLocalPending ? "cursor-pointer hover:bg-indigo-50 hover:ring-indigo-200" : "",
      ].join(" ")}
    >
      {showNumber ? getCellLabel(date) : visualChecked ? "✓" : ""}
    </button>
  );
}

function getCellLabel(date: string) {
  return Number(date.slice(-2));
}

function getAriaLabel(
  date: string,
  isChecked: boolean,
  isToday: boolean,
  isFuture: boolean
) {
  const parts = [
    isChecked ? "Completed" : "Not completed",
    date,
  ];

  if (isToday) {
    parts.push("today");
  }

  if (isFuture) {
    parts.push("future date");
  }

  return parts.join(", ");
}
