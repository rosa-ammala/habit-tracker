import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSelectedView } from "../features/ui/uiSlice";
import type { View } from "../types/view";

const views: View[] = ["day", "week", "month"];

export function ViewSwitch() {
  const dispatch = useAppDispatch();
  const selectedView = useAppSelector((state) => state.ui.selectedView);

  return (
    <div className="relative flex overflow-hidden rounded-full bg-white">
      <div
        className={`absolute inset-0 w-1/3 rounded-full bg-indigo-400 transition-transform duration-300 ${
          selectedView === "day"
            ? "translate-x-0"
            : selectedView === "week"
              ? "translate-x-full"
              : "translate-x-[200%]"
        }`}
      />

      {views.map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => dispatch(setSelectedView(view))}
          className={
            selectedView === view
              ? "relative z-10 flex w-1/3 items-center justify-center px-5 py-2 text-sm capitalize text-white"
              : "relative z-10 flex w-1/3 items-center justify-center px-5 py-2 text-sm capitalize text-gray-500 hover:text-indigo-500"
          }
        >
          {view}
        </button>
      ))}
    </div>
  );
}
