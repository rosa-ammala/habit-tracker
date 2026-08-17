import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useUpdateHabitMutation } from "../../features/habits/habitsApi";
import { closeModal } from "../../features/ui/uiSlice";
import type { Category } from "../../types/category";
import type { Habit } from "../../types/habit";
import { getApiErrorMessage } from "../../utils/apiError";
import { HabitFormModal } from "./HabitFormModal";

type Props = {
  habit: Habit;
  categories: Category[];
};

export function EditHabitModal({ habit, categories }: Props) {
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [updateHabit, { isLoading }] = useUpdateHabitMutation();

  function handleClose() {
    dispatch(closeModal());
  }

  async function handleSubmit(data: { title: string; categoryId: number }) {
    try {
      setErrorMessage(null);
      await updateHabit({
        habitId: habit.id,
        title: data.title,
        categoryId: data.categoryId,
      }).unwrap();

      dispatch(closeModal());
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Could not update habit."));
    }
  }

  return (
    <HabitFormModal
      title="Edit habit"
      submitLabel="Save"
      categories={categories}
      initialTitle={habit.title}
      initialCategoryId={habit.categoryId}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onClose={handleClose}
      onFormChange={() => setErrorMessage(null)}
      onSubmit={handleSubmit}
    />
  );
}
