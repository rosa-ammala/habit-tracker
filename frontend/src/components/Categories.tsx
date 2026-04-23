import type { Category } from "../types/category";

type Props = {
  categories: Category[];
  selectedValue: string | number;
  onSelect: (value: string | number) => void;
  mode: "filter" | "select";
  includeAll?: boolean;
};

export function Categories({
  categories,
  selectedValue,
  onSelect,
  mode,
  includeAll = false,
}: Props) {
  const items =
    mode === "filter" && includeAll
      ? [{ id: "all", name: "All", icon: "" }, ...categories]
      : categories;

  return (
    <div className="flex gap-3 flex-wrap">
      {items.map((item) => {
        const value = mode === "filter" ? item.name : item.id;
        const isSelected = selectedValue === value;

        return (
          <button
            key={item.id}
            onClick={() => onSelect(value)}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition
              ${
                isSelected
                  ? "bg-white shadow border-2 border-indigo-400"
                  : "bg-white shadow border-2 border-transparent hover:border-gray-300"
              }
            `}
          >
            {item.name !== "All" && item.icon && (
              <img
                src={`/${item.icon}`}
                alt={item.name}
                className="w-4 h-4"
              />
            )}
            <span>{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}