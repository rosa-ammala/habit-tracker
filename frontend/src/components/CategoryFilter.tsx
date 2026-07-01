import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSelectedCategory } from "../features/ui/uiSlice";
import type { Category } from "../types/category";

type Props = {
  categories: Category[];
};

export function CategoryFilter({ categories }: Props) {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector(
    (state) => state.ui.selectedCategory
  );

  return (
    <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-medium text-gray-700">
        Categories
      </h2>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => dispatch(setSelectedCategory("All"))}
          className={
            selectedCategory === "All"
              ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
              : "rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800"
          }
        >
          All
        </button>

        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => dispatch(setSelectedCategory(category.name))}
              className={
                isSelected
                  ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  : "rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800"
              }
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}