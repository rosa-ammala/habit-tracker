import type { Category } from "../types/category";
import { CategoryButton } from "./CategoryButton";

type Props = {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectedCategoryChange: (categoryId: number | null) => void;
};

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectedCategoryChange,
}: Props) {
  return (
    <section className="mb-6 w-full max-w-5xl">
      <h2 className="font-semibold text-stone-950 mb-4">
        Categories
      </h2>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelectedCategoryChange(null)}
          className={
            selectedCategoryId === null
              ? "rounded-lg border-2 border-indigo-400 bg-white px-3 py-2 text-sm font-semibold text-stone-950 shadow-sm"
              : "rounded-lg border-2 border-transparent bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50"
          }
        >
          All
        </button>

        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;

          return (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={isSelected}
              onClick={() => onSelectedCategoryChange(category.id)}
            />
          );
        })}
      </div>
    </section>
  );
}
