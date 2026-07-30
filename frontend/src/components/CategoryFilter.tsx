import type { Category } from "../types/category";
import { CategoryButton } from "./CategoryButton";

type Props = {
  categories: Category[];
  selectedCategory: string;
  onSelectedCategoryChange: (category: string) => void;
};

export function CategoryFilter({
  categories,
  selectedCategory,
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
          onClick={() => onSelectedCategoryChange("All")}
          className={
            selectedCategory === "All"
              ? "rounded-lg border-2 border-indigo-400 bg-white px-3 py-2 text-sm font-semibold text-stone-950 shadow-sm"
              : "rounded-lg border-2 border-transparent bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50"
          }
        >
          All
        </button>

        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;

          return (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={isSelected}
              onClick={() => onSelectedCategoryChange(category.name)}
            />
          );
        })}
      </div>
    </section>
  );
}
