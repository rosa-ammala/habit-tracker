import { useState } from "react";
import type { Category } from "../types/category";
import { useCreateHabitMutation } from "../features/habits/habitsApi";

type Props = {
  categories: Category[];
};

export function CreateHabitForm({ categories }: Props) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [createHabit, { isLoading, isError }] = useCreateHabitMutation();

  const canSubmit = title.trim().length > 0 && categoryId !== "" && !isLoading;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    await createHabit({
      title: title.trim(),
      categoryId: Number(categoryId),
    }).unwrap();

    setTitle("");
    setCategoryId("");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-medium text-gray-700">
        Create habit
      </h2>

      <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Habit title"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
        />

        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isLoading ? "Saving..." : "Add"}
        </button>
      </div>

      {isError && (
        <p className="mt-3 text-sm text-red-600">
          Could not create habit.
        </p>
      )}
    </form>
  );
}