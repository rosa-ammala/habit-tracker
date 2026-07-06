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
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={[
        "flex items-center justify-center rounded-md text-xs font-medium ring-1",
        size === "sm" ? "h-7 w-7" : "h-9 w-9",
        visualChecked
          ? "bg-green-700 text-white ring-green-700"
          : "bg-white text-gray-800 ring-gray-200",
        isToday && !visualChecked ? "ring-2 ring-gray-900" : "",
        isDimmed ? "opacity-35" : "",
        isFuture ? "cursor-not-allowed opacity-25" : "",
        isPending || isLocalPending ? "cursor-wait opacity-80" : "",
        !isFuture && !isPending && !isLocalPending ? "hover:bg-gray-100" : "",
      ].join(" ")}
    >
      {showNumber ? getCellLabel(date) : visualChecked ? "✓" : ""}
    </button>
  );
}

function getCellLabel(date: string) {
  return Number(date.slice(-2));
}
