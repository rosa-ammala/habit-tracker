import { useState } from "react";
import type { Category } from "../types/category";
import { Categories } from "./Categories";
import { createHabit } from "../api/habits";

type Props = {
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
};

export function HabitModal({ categories, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!title || !categoryId) return;

    try {
      await createHabit({
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
        <h2 className="text-lg font-semibold">Add a New Habit</h2>

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
            selectedValue={categoryId ?? ""}
            onSelect={(value) => setCategoryId(value as number)}
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