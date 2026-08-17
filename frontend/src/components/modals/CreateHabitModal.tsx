import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { closeModal } from "../../features/ui/uiSlice";
import { useCreateHabitMutation } from "../../features/habits/habitsApi";
import type { Category } from "../../types/category";
import { getApiErrorMessage } from "../../utils/apiError";
import { HabitFormModal } from "./HabitFormModal";

type Props = {
  categories: Category[];
};

export function CreateHabitModal({ categories }: Props) {
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createHabit, { isLoading }] = useCreateHabitMutation();

  function handleClose() {
    dispatch(closeModal());
  }

  async function handleSubmit(data: { title: string; categoryId: number }) {
    try {
      setErrorMessage(null);
      await createHabit(data).unwrap();
      dispatch(closeModal());
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Could not create habit."));
    }
  }

  return (
    <HabitFormModal
      title="Create habit"
      submitLabel="Create"
      categories={categories}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onClose={handleClose}
      onFormChange={() => setErrorMessage(null)}
      onSubmit={handleSubmit}
    />
  );
}
