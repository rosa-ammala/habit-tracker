import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useDeleteHabitMutation } from "../../features/habits/habitsApi";
import { closeModal } from "../../features/ui/uiSlice";
import type { Habit } from "../../types/habit";
import { getApiErrorMessage } from "../../utils/apiError";
import { ErrorBanner } from "../ErrorBanner";
import { Modal } from "./Modal";

type Props = {
  habit: Habit;
  onDeleted?: () => void;
};

export function DeleteHabitModal({ habit, onDeleted }: Props) {
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteHabit, { isLoading }] = useDeleteHabitMutation();

  function handleClose() {
    if (isLoading) {
      return;
    }

    dispatch(closeModal());
  }

  async function handleConfirm() {
    try {
      setErrorMessage(null);
      await deleteHabit({ habitId: habit.id }).unwrap();
      dispatch(closeModal());
      onDeleted?.();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Could not delete habit."));
    }
  }

  return (
    <Modal
      title="Delete habit"
      isCloseDisabled={isLoading}
      onClose={handleClose}
    >
      <p className="mb-4 text-sm leading-6 text-stone-600">
        Delete "{habit.title}"? This also removes its log history.
      </p>

      {errorMessage && (
        <div className="mb-4">
          <ErrorBanner message={errorMessage} />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleClose}
          disabled={isLoading}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border-2 border-transparent bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border-2 border-transparent bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 disabled:opacity-50"
        >
          {!isLoading && (
            <img
              src="/ui-icons/delete.svg"
              alt=""
              aria-hidden="true"
              className="mr-2 h-4 w-4 shrink-0"
            />
          )}
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
