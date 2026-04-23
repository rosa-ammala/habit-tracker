import { useState } from "react";
import type { Habit } from "../types/habit";
import type { Category } from "../types/category";
import { Categories } from "./Categories";
import { updateHabit } from "../api/habits";

type Props = {
  habit: Habit;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
};

export function EditHabitModal({ 
  habit, 
  categories,
  onClose, 
  onSuccess 
}: Props) {
  const [title, setTitle] = useState(habit.title);
  const [categoryId, setCategoryId] = useState<number>(habit.categoryId);

  const handleSubmit = async () => {
    if (!title || !categoryId) return;

    try {
      await updateHabit(habit.id, {
        title,
        categoryId,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-5">
        <h2 className="text-lg font-semibold">Edit Habit</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">
            Name for the habit
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600">
            Category
          </label>

          <Categories
            categories={categories}
            selectedValue={categoryId}
            onSelect={(value) => setCategoryId(Number(value))}
            mode="select"
          />
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-indigo-400 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}