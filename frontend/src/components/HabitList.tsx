import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import {
  useAddHabitLogMutation,
  useDeleteHabitLogMutation,
  useDeleteHabitMutation,
  useUpdateHabitMutation,
} from "../features/habits/habitsApi";
import type { Category } from "../types/category";
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
  categories: Category[];
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitList({ habits, categories }: Props) {
  const today = getTodayDateOnly();
  const selectedView = useAppSelector((state) => state.ui.selectedView);
  const selectedDate = useAppSelector((state) => state.ui.selectedDate);

  const { dates, month, year } = getDatesForView(selectedDate, selectedView);

  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");

  const [addHabitLog, { isLoading: isAddingLog }] = useAddHabitLogMutation();
  const [deleteHabitLog, { isLoading: isDeletingLog }] =
    useDeleteHabitLogMutation();
  const [updateHabit, { isLoading: isUpdatingHabit }] =
    useUpdateHabitMutation();
  const [deleteHabit, { isLoading: isDeletingHabit }] =
    useDeleteHabitMutation();

  const isUpdatingLog = isAddingLog || isDeletingLog;

  function startEditing(habit: Habit) {
    setEditingHabitId(habit.id);
    setEditTitle(habit.title);
    setEditCategoryId(String(habit.categoryId));
  }

  function cancelEditing() {
    setEditingHabitId(null);
    setEditTitle("");
    setEditCategoryId("");
  }

  async function handleUpdateHabit(habitId: number) {
    if (!editTitle.trim() || !editCategoryId) {
      return;
    }

    await updateHabit({
      habitId,
      title: editTitle.trim(),
      categoryId: Number(editCategoryId),
    }).unwrap();

    cancelEditing();
  }

  async function handleDeleteHabit(habitId: number) {
    await deleteHabit({ habitId }).unwrap();
  }

  async function handleToggleDate(habit: Habit, date: string) {
    if (isDateInFuture(date)) {
      return;
    }

    const isChecked = habit.logs.some((log) => log.date === date);

    if (isChecked) {
      await deleteHabitLog({
        habitId: habit.id,
        date,
      }).unwrap();

      return;
    }

    await addHabitLog({
      habitId: habit.id,
      date,
    }).unwrap();
  }

  if (habits.length === 0) {
    return <p className="text-sm text-gray-500">No habits yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {habits.map((habit) => {
        const isEditing = editingHabitId === habit.id;

        return (
          <li
            key={habit.id}
            className="rounded-md border border-gray-200 bg-gray-50 p-3"
          >
            {isEditing ? (
              <div className="grid gap-3 md:grid-cols-[1fr_220px_auto_auto]">
                <input
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                />

                <select
                  value={editCategoryId}
                  onChange={(event) => setEditCategoryId(event.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={isUpdatingHabit}
                  onClick={() => handleUpdateHabit(habit.id)}
                  className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[220px_1fr_auto]">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {habit.title}
                  </h3>
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
                          onClick={() => handleToggleDate(habit, date)}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 lg:flex-col">
                  <button
                    type="button"
                    onClick={() => startEditing(habit)}
                    className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-300"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={isDeletingHabit || isUpdatingLog}
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="rounded-md bg-red-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}