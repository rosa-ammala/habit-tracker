import { useAppDispatch } from "../app/hooks";
import { useDeleteHabitMutation } from "../features/habits/habitsApi";
import { closeDeleteHabitModal } from "../features/ui/uiSlice";
import type { Habit } from "../types/habit";
import { Modal } from "./Modal";

type Props = {
  habit: Habit;
  onDeleted?: () => void;
};

export function DeleteHabitModal({ habit, onDeleted }: Props) {
  const dispatch = useAppDispatch();
  const [deleteHabit, { isLoading, isError }] = useDeleteHabitMutation();

  function handleClose() {
    if (isLoading) {
      return;
    }

    dispatch(closeDeleteHabitModal());
  }

  async function handleConfirm() {
    await deleteHabit({ habitId: habit.id }).unwrap();
    dispatch(closeDeleteHabitModal());
    onDeleted?.();
  }

  return (
    <Modal
      title="Delete habit"
      isCloseDisabled={isLoading}
      onClose={handleClose}
    >
      <p className="mb-4 text-sm text-gray-600">
        Delete "{habit.title}"? This also removes its log history.
      </p>

      {isError && (
        <p className="mb-4 text-sm text-red-600">
          Could not delete habit.
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
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
