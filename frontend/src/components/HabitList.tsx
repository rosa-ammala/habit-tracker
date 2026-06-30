import { useState } from "react";
import {
  useAddHabitLogMutation,
  useDeleteHabitLogMutation,
  useDeleteHabitMutation,
  useUpdateHabitMutation,
} from "../features/habits/habitsApi";
import type { Category } from "../types/category";
import type { Habit } from "../types/habit";
import { getTodayDateOnly } from "../utils/date";

type Props = {
  habits: Habit[];
  categories: Category[];
};

export function HabitList({ habits, categories }: Props) {
  const today = getTodayDateOnly();

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

  async function handleToggleToday(habit: Habit) {
    const isCompletedToday = habit.logs.some((log) => log.date === today);

    if (isCompletedToday) {
      await deleteHabitLog({
        habitId: habit.id,
        date: today,
      }).unwrap();

      return;
    }

    await addHabitLog({
      habitId: habit.id,
      date: today,
    }).unwrap();
  }

  if (habits.length === 0) {
    return <p className="text-sm text-gray-500">No habits yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {habits.map((habit) => {
        const isCompletedToday = habit.logs.some((log) => log.date === today);
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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {habit.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {habit.category.name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-sm text-gray-700">
                    <p>Current: {habit.currentStreak}</p>
                    <p>Best: {habit.bestStreak}</p>
                  </div>

                  <button
                    type="button"
                    disabled={isUpdatingLog}
                    onClick={() => handleToggleToday(habit)}
                    className={
                      isCompletedToday
                        ? "rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                        : "rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-300 disabled:opacity-50"
                    }
                  >
                    {isCompletedToday ? "Done" : "Mark done"}
                  </button>

                  <button
                    type="button"
                    onClick={() => startEditing(habit)}
                    className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-300"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={isDeletingHabit}
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