import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSelectedView } from "../features/ui/uiSlice";
import type { View } from "../types/view";

const views: View[] = ["day", "week", "month"];

export function ViewSwitch() {
  const dispatch = useAppDispatch();
  const selectedView = useAppSelector((state) => state.ui.selectedView);

  return (
    <div className="mb-6 inline-flex rounded-md bg-white p-1 shadow-sm">
      {views.map((view) => {
        const isSelected = selectedView === view;

        return (
          <button
            key={view}
            type="button"
            onClick={() => dispatch(setSelectedView(view))}
            className={
              isSelected
                ? "rounded px-3 py-1.5 text-sm font-medium bg-gray-900 text-white"
                : "rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            }
          >
            {view}
          </button>
        );
      })}
    </div>
  );
}