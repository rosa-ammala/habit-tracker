import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  useAddHabitLogMutation,
  useDeleteHabitLogMutation,
} from "../features/habits/habitsApi";
import {
  openDeleteHabitModal,
  openEditHabitModal,
} from "../features/ui/uiSlice";
import type { Habit } from "../types/habit";
import {
  getDatesForView,
  getTodayDateOnly,
  isDateInFuture,
  isSameMonth,
} from "../utils/date";
import { getApiErrorMessage } from "../utils/apiError";
import { DayCell } from "./DayCell";

type Props = {
  habits: Habit[];
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitList({ habits }: Props) {
  const dispatch = useAppDispatch();
  const today = getTodayDateOnly();
  const selectedView = useAppSelector((state) => state.ui.selectedView);
  const selectedDate = useAppSelector((state) => state.ui.selectedDate);
  const [logErrorMessage, setLogErrorMessage] = useState<string | null>(null);

  const { dates, month, year } = getDatesForView(selectedDate, selectedView);

  const [addHabitLog] = useAddHabitLogMutation();
  const [deleteHabitLog] = useDeleteHabitLogMutation();

  async function handleToggleDate(
    habit: Habit,
    date: string,
    nextChecked: boolean
  ) {
    if (isDateInFuture(date)) {
      return;
    }

    try {
      setLogErrorMessage(null);

      if (nextChecked) {
        await addHabitLog({
          habitId: habit.id,
          date,
        }).unwrap();

        return;
      }

      await deleteHabitLog({
        habitId: habit.id,
        date,
      }).unwrap();
    } catch (error) {
      setLogErrorMessage(
        getApiErrorMessage(error, "Could not update habit log.")
      );
      throw error;
    }
  }

  if (habits.length === 0) {
    return <p className="text-sm text-gray-500">No habits yet.</p>;
  }

  return (
    <>
      {logErrorMessage && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {logErrorMessage}
        </p>
      )}

      <ul className="space-y-3">
        {habits.map((habit) => {
          return (
            <li
              key={habit.id}
              className="rounded-md border border-gray-200 bg-gray-50 p-3"
            >
              <div className="grid gap-4 lg:grid-cols-[220px_1fr_auto]">
                <div>
                  <Link
                    to={`/habits/${habit.id}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {habit.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {habit.category.name}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    Current: {habit.currentStreak} / Best: {habit.bestStreak}
                  </p>
                </div>

                <div>
                  {(selectedView === "week" || selectedView === "month") && (
                    <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs text-gray-500">
                      {weekDays.map((day) => (
                        <div key={day}>{day}</div>
                      ))}
                    </div>
                  )}

                  <div
                    className={
                      selectedView === "day"
                        ? "flex"
                        : "grid grid-cols-7 gap-2"
                    }
                  >
                    {dates.map((date) => {
                      const isChecked = habit.logs.some(
                        (log) => log.date === date
                      );

                      const isToday = date === today;
                      const isFuture = isDateInFuture(date);
                      const isDimmed =
                        selectedView === "month" &&
                        !isSameMonth(date, month, year);

                      return (
                        <DayCell
                          key={date}
                          date={date}
                          isChecked={isChecked}
                          isToday={isToday}
                          isFuture={isFuture}
                          isDimmed={isDimmed}
                          showNumber={selectedView !== "day"}
                          onClick={(nextChecked) =>
                            handleToggleDate(habit, date, nextChecked)
                          }
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 lg:flex-col">
                  <button
                    type="button"
                    onClick={() => dispatch(openEditHabitModal(habit.id))}
                    className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-300"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => dispatch(openDeleteHabitModal(habit.id))}
                    className="rounded-md bg-red-700 px-3 py-2 text-sm font-medium text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
