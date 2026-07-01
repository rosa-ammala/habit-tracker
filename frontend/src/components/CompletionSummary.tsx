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

  return (
    <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-gray-700">
            Completion
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {completed} of {total} habit-days completed
          </p>
        </div>

        <div className="text-2xl font-semibold text-gray-900">
          {percentage}%
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-green-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
}
