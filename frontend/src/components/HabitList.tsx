import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { useToggleHabitLog } from "../features/habits/useToggleHabitLog";
import type { Habit } from "../types/habit";
import {
  getDatesForView,
  getTodayDateOnly,
  isDateInFuture,
  isSameMonth,
} from "../utils/date";
import { DayCell } from "./DayCell";

type Props = {
  habits: Habit[];
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitList({ habits }: Props) {
  const today = getTodayDateOnly();
  const selectedView = useAppSelector((state) => state.ui.selectedView);
  const selectedDate = useAppSelector((state) => state.ui.selectedDate);
  const { logErrorMessage, toggleHabitLog } = useToggleHabitLog();

  const { dates, month, year } = getDatesForView(selectedDate, selectedView);

  if (habits.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50/80 px-4 py-8 text-center">
        <p className="text-sm font-medium text-stone-700">No habits yet.</p>
        <p className="mt-1 text-sm text-stone-500">
          Add your first habit to start tracking.
        </p>
      </div>
    );
  }

  return (
    <>
      {logErrorMessage && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {logErrorMessage}
        </p>
      )}

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {habits.map((habit) => {
          return (
            <li
              key={habit.id}
              className="rounded-xl border-2 border-transparent bg-white p-3 shadow transition hover:border-gray-300 sm:p-4"
            >
              <div className="flex h-full flex-col gap-4">
                <div className="min-w-0">
                  <Link
                    to={`/habits/${habit.id}`}
                    className="block truncate text-base font-semibold text-stone-950 hover:text-indigo-500"
                  >
                    {habit.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                    <img
                      src={`/category-icons/${habit.category.icon}`}
                      alt=""
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0"
                    />
                    <span className="truncate">{habit.category.name}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-stone-700">
                    <img
                      src="/ui-icons/fire.svg"
                      alt=""
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0"
                    />
                    <span>
                      current:{" "}
                      <span className="text-indigo-500">
                        {habit.currentStreak}
                      </span>
                    </span>
                    <span>
                      best:{" "}
                      <span className="text-indigo-500">
                        {habit.bestStreak}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="min-w-0 pb-1">
                  {(selectedView === "week" || selectedView === "month") && (
                    <div className="mb-2 grid grid-cols-7 justify-items-center gap-2 text-center text-xs font-medium text-stone-400">
                      {weekDays.map((day) => (
                        <div key={day}>{day}</div>
                      ))}
                    </div>
                  )}

                  <div
                    className={
                      selectedView === "day"
                        ? "flex justify-center"
                        : "grid grid-cols-7 justify-items-center gap-2"
                    }
                  >
                    {dates.map((date) => {
                      const isChecked = habit.logs.some(
                        (log) => log.date === date
                      );

                      const isToday = date === today;
                      const isFuture = isDateInFuture(date);
                      const isOutsideMonth =
                        selectedView === "month" &&
                        !isSameMonth(date, month, year);

                      if (isOutsideMonth) {
                        return (
                          <div
                            key={date}
                            aria-hidden="true"
                            className="h-8 w-8 min-h-[32px] min-w-[32px]"
                          />
                        );
                      }

                      return (
                        <DayCell
                          key={date}
                          date={date}
                          isChecked={isChecked}
                          isToday={isToday}
                          isFuture={isFuture}
                          isDimmed={false}
                          showNumber={selectedView !== "day"}
                          onClick={(nextChecked) =>
                            toggleHabitLog({
                              habitId: habit.id,
                              date,
                              nextChecked,
                            })
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
