import { useId, useState } from "react";
import type { Category } from "../../types/category";
import { CategoryButton } from "../buttons/CategoryButton";
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
  const titleInputId = useId();
  const [habitTitle, setHabitTitle] = useState(initialTitle);
  const [categoryId, setCategoryId] = useState<number | null>(
    initialCategoryId ?? null
  );

  const canSubmit =
    habitTitle.trim().length > 0 && categoryId !== null && !isLoading;

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
      categoryId,
    });
  }

  return (
    <Modal title={title} isCloseDisabled={isLoading} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor={titleInputId}
            className="mb-1.5 block text-sm font-semibold text-stone-700"
          >
            Habit title
          </label>
          <input
            id={titleInputId}
            value={habitTitle}
            onChange={(event) => setHabitTitle(event.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-950 outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isSelected={categoryId === category.id}
                onClick={() => setCategoryId(category.id)}
              />
            ))}
          </div>
        </div>

        {errorMessage && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border-2 border-transparent bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border-2 border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {isLoading ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
