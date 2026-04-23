import type { View } from "../types/view";

type Props = {
  value: View;
  onChange: (view: View) => void;
};

export function ViewSwitch({ value, onChange }: Props) {
  return (
    <div className="relative bg-white rounded-full flex mb-4 overflow-hidden">
      <div
        className={`absolute inset-0 w-1/3 bg-indigo-400 rounded-full transition-transform duration-300
          ${
            value === "day"
              ? "translate-x-0"
              : value === "week"
              ? "translate-x-full"
              : "translate-x-[200%]"
          }
        `}
      />

      {(["day", "week", "month"] as const).map((view) => (
        <button
          key={view}
          onClick={() => onChange(view)}
          className={`relative z-10 px-5 py-2 w-1/3 text-sm flex items-center justify-center
            ${
              value === view
                ? "text-white"
                : "text-gray-500 hover:text-indigo-500"
            }
          `}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </button>
      ))}
    </div>
  );
}