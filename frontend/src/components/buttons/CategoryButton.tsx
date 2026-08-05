import type { Category } from "../../types/category";

type Props = {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
};

export function CategoryButton({ category, isSelected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        isSelected
          ? "inline-flex min-h-10 items-center gap-2 rounded-lg border-2 border-indigo-400 bg-white px-3 py-2 text-sm font-semibold text-stone-950 shadow-sm"
          : "inline-flex min-h-10 items-center gap-2 rounded-lg border-2 border-transparent bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50"
      }
    >
      <img
        src={`/category-icons/${category.icon}`}
        alt=""
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
      />
      <span>{category.name}</span>
    </button>
  );
}
