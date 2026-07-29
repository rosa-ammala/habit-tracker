import { useAppSelector } from "../app/hooks";
import type { Habit } from "../types/habit";
import { getCompletionDatesForView } from "../utils/date";
import { getCompletionStats } from "../utils/habitStats";

type Props = {
  habits: Habit[];
};

export function CompletionSummary({ habits }: Props) {
  const selectedDate = useAppSelector((state) => state.ui.selectedDate);
  const selectedView = useAppSelector((state) => state.ui.selectedView);

  const dates = getCompletionDatesForView(selectedDate, selectedView);
  const { completed, total, percentage } = getCompletionStats(habits, dates);
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (percentage / 100) * circumference;

  return (
    <section className="rounded-xl border-2 border-transparent bg-white p-4 shadow">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <img
            src="/ui-icons/fire.svg"
            alt=""
            aria-hidden="true"
            className="mt-0.5 h-10 w-10 shrink-0"
          />
          <div className="min-w-0">
            <h2 className="font-semibold text-stone-800">
              Completion
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {completed} of {total} habit-days completed
            </p>
          </div>
        </div>

        <div className="relative h-20 w-20 shrink-0">
          <svg
            className="h-20 w-20 -rotate-90"
            viewBox="0 0 80 80"
            aria-hidden="true"
          >
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              className="text-indigo-100"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              className="text-indigo-400 transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-indigo-500">
            {percentage}%
          </div>
        </div>
      </div>
    </section>
  );
}
