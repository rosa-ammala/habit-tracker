import { useState } from "react";
import type { Category } from "../types/category";
import { Modal } from "./Modal";

type Props = {
  title: string;
  submitLabel: string;
  categories: Category[];
  initialTitle?: string;
  initialCategoryId?: number;
  isLoading: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (data: { title: string; categoryId: number }) => Promise<void>;
};

export function HabitFormModal({
  title,
  submitLabel,
  categories,
  initialTitle = "",
  initialCategoryId,
  isLoading,
  errorMessage,
  onClose,
  onSubmit,
}: Props) {
  const [habitTitle, setHabitTitle] = useState(initialTitle);
  const [categoryId, setCategoryId] = useState(
    initialCategoryId ? String(initialCategoryId) : ""
  );

  const canSubmit =
    habitTitle.trim().length > 0 && categoryId !== "" && !isLoading;

  function handleClose() {
    if (isLoading) {
      return;
    }

    onClose();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    await onSubmit({
      title: habitTitle.trim(),
      categoryId: Number(categoryId),
    });
  }

  return (
    <Modal title={title} isCloseDisabled={isLoading} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Habit title
          </label>
          <input
            value={habitTitle}
            onChange={(event) => setHabitTitle(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isLoading ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
